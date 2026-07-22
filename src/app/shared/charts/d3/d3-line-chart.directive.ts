import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { axisBottom, axisLeft, curveMonotoneX, line, scaleLinear, scalePoint, select } from 'd3';

import { applySvgAccessibility, renderEmptyState } from './d3-chart-accessibility';
import { compactD3ChartLabel } from './d3-chart-formatters';
import { chartSize, normalizePercent } from './d3-chart-scales';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import { D3ChartConfig, D3ChartDatum } from './d3-chart.types';
import { chartDatumTooltip, tooltipText } from './d3-chart-tooltip';

@Directive({
  selector: '[vlD3LineChart]',
  standalone: true,
})
export class D3LineChartDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: readonly D3ChartDatum[] = [];
  @Input() config: D3ChartConfig = {};

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private resizeObserver?: ResizeObserver;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.observeSize();
    this.render();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.viewReady) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.clear();
  }

  private render(): void {
    if (!this.isBrowser) {
      return;
    }

    this.clear();

    const host = this.elementRef.nativeElement;
    const theme = resolveD3Theme(host);
    const size = chartSize(host, this.config.height, this.config.margin);
    const rows = this.data.map((datum) => ({
      ...datum,
      value: normalizePercent(datum.value),
    }));
    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-line-chart')
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.config.ariaLabel ?? 'Line chart');

    if (rows.length === 0) {
      renderEmptyState(svg, size.width, size.height, this.config.emptyLabel ?? 'No chart data', theme);
      return;
    }

    const xScale = scalePoint<string>()
      .domain(rows.map((datum) => datum.label))
      .range([0, size.innerWidth])
      .padding(0.4);
    const yScale = scaleLinear()
      .domain([0, Math.max(this.config.maxValue ?? 100, ...rows.map((datum) => datum.value))])
      .range([size.innerHeight, 0])
      .nice();
    const group = svg
      .append('g')
      .attr('transform', `translate(${size.margin.left}, ${size.margin.top})`);
    const path = line<D3ChartDatum>()
      .x((datum) => xScale(datum.label) ?? 0)
      .y((datum) => yScale(datum.value))
      .curve(curveMonotoneX);

    group
      .selectAll('line.d3-line-chart__grid')
      .data(yScale.ticks(4))
      .enter()
      .append('line')
      .attr('class', 'd3-line-chart__grid')
      .attr('x1', 0)
      .attr('x2', size.innerWidth)
      .attr('y1', (value) => yScale(value))
      .attr('y2', (value) => yScale(value))
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1);

    group
      .append('path')
      .datum(rows)
      .attr('class', 'd3-line-chart__line')
      .attr('fill', 'none')
      .attr('stroke', theme.accentPrimary)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);

    group
      .selectAll('circle.d3-line-chart__point')
      .data(rows)
      .enter()
      .append('circle')
      .attr('class', 'd3-line-chart__point')
      .attr('cx', (datum) => xScale(datum.label) ?? 0)
      .attr('cy', (datum) => yScale(datum.value))
      .attr('r', 4.5)
      .attr('fill', (datum, index) => toneColor(theme, datum.tone, index))
      .attr('stroke', theme.surfaceCard)
      .attr('stroke-width', 2)
      .append('title')
      .text((datum) => tooltipText(chartDatumTooltip(datum, this.config.valueSuffix)));

    const xAxis = group
      .append('g')
      .attr('class', 'd3-line-chart__axis')
      .attr('transform', `translate(0, ${size.innerHeight})`)
      .call(axisBottom(xScale).tickSize(0).tickFormat((label) => compactD3ChartLabel(label, 10)));
    const yAxis = group
      .append('g')
      .attr('class', 'd3-line-chart__axis')
      .call(axisLeft(yScale).ticks(4).tickSize(-size.innerWidth).tickFormat((value) => `${value}${this.config.valueSuffix ?? ''}`));

    xAxis.select('.domain').attr('stroke', theme.axis);
    yAxis.select('.domain').attr('stroke', 'transparent');
    yAxis.selectAll('line').attr('stroke', 'transparent');
    xAxis.selectAll('text').attr('fill', theme.textMuted).attr('font-size', 11);
    yAxis.selectAll('text').attr('fill', theme.textMuted).attr('font-size', 11);
  }

  private observeSize(): void {
    if (!this.isBrowser || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  private clear(): void {
    select(this.elementRef.nativeElement).selectAll('*').remove();
  }
}
