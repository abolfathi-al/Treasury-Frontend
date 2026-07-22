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
import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from 'd3';

import { applySvgAccessibility, renderEmptyState } from './d3-chart-accessibility';
import { compactD3ChartLabel, formatD3ChartValue } from './d3-chart-formatters';
import { chartSize, normalizePercent } from './d3-chart-scales';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import { D3ChartConfig, D3ChartDatum } from './d3-chart.types';
import { chartDatumTooltip, tooltipText } from './d3-chart-tooltip';

@Directive({
  selector: '[vlD3BarChart]',
  standalone: true,
})
export class D3BarChartDirective implements AfterViewInit, OnChanges, OnDestroy {
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
    const size = chartSize(host, this.config.height, {
      top: 18,
      right: 44,
      bottom: 36,
      left: 118,
      ...this.config.margin,
    });
    const rows = this.data.map((datum) => ({
      ...datum,
      value: normalizePercent(datum.value),
    }));

    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-bar-chart')
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.config.ariaLabel ?? 'Bar chart');

    if (rows.length === 0) {
      renderEmptyState(svg, size.width, size.height, this.config.emptyLabel ?? 'No chart data', theme);
      return;
    }

    const maxValue = Math.max(this.config.maxValue ?? 100, ...rows.map((datum) => datum.value));
    const xScale = scaleLinear()
      .domain([0, maxValue])
      .range([0, size.innerWidth])
      .nice();
    const yScale = scaleBand<string>()
      .domain(rows.map((datum) => datum.label))
      .range([0, size.innerHeight])
      .padding(0.34);
    const group = svg
      .append('g')
      .attr('transform', `translate(${size.margin.left}, ${size.margin.top})`);

    group
      .selectAll('line.d3-bar-chart__grid')
      .data(xScale.ticks(4))
      .enter()
      .append('line')
      .attr('class', 'd3-bar-chart__grid')
      .attr('x1', (value) => xScale(value))
      .attr('x2', (value) => xScale(value))
      .attr('y1', 0)
      .attr('y2', size.innerHeight)
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1);

    group
      .selectAll('rect.d3-bar-chart__bar')
      .data(rows)
      .enter()
      .append('rect')
      .attr('class', 'd3-bar-chart__bar')
      .attr('x', 0)
      .attr('y', (datum) => yScale(datum.label) ?? 0)
      .attr('width', (datum) => Math.max(4, xScale(datum.value)))
      .attr('height', yScale.bandwidth())
      .attr('rx', 5)
      .attr('fill', (datum, index) => toneColor(theme, datum.tone, index))
      .append('title')
      .text((datum) => tooltipText(chartDatumTooltip(datum, this.config.valueSuffix)));

    group
      .selectAll('text.d3-bar-chart__value')
      .data(rows)
      .enter()
      .append('text')
      .attr('class', 'd3-bar-chart__value')
      .attr('x', (datum) => Math.min(size.innerWidth + 8, xScale(datum.value) + 8))
      .attr('y', (datum) => (yScale(datum.label) ?? 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .text((datum) => formatD3ChartValue(datum.value, datum.displayValue, this.config.valueSuffix));

    const xAxis = group
      .append('g')
      .attr('class', 'd3-bar-chart__axis')
      .attr('transform', `translate(0, ${size.innerHeight})`)
      .call(axisBottom(xScale).ticks(4).tickSize(0));
    const yAxis = group
      .append('g')
      .attr('class', 'd3-bar-chart__axis')
      .call(axisLeft(yScale).tickSize(0).tickFormat((label) => compactD3ChartLabel(label)));

    xAxis.select('.domain').attr('stroke', theme.axis);
    xAxis.selectAll('text').attr('fill', theme.textMuted).attr('font-size', 11);
    yAxis.select('.domain').attr('stroke', 'transparent');
    yAxis.selectAll('text').attr('fill', theme.textSecondary).attr('font-size', 11);
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
