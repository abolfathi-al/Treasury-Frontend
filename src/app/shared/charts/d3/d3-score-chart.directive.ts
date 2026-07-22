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
import { lineRadial, select } from 'd3';

import { applySvgAccessibility, renderEmptyState } from './d3-chart-accessibility';
import { compactD3ChartLabel, formatD3ChartValue } from './d3-chart-formatters';
import { chartSize, normalizePercent } from './d3-chart-scales';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import { D3ChartConfig, D3ChartDatum } from './d3-chart.types';
import { chartDatumTooltip, tooltipText } from './d3-chart-tooltip';

@Directive({
  selector: '[vlD3ScoreChart]',
  standalone: true,
})
export class D3ScoreChartDirective implements AfterViewInit, OnChanges, OnDestroy {
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
    const size = chartSize(host, this.config.height ?? 240, {
      top: 22,
      right: 42,
      bottom: 30,
      left: 42,
      ...this.config.margin,
    });
    const rows = this.data.map((datum) => ({
      ...datum,
      value: normalizePercent(datum.value),
    }));
    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-score-chart')
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.config.ariaLabel ?? 'Score chart');

    if (rows.length === 0) {
      renderEmptyState(svg, size.width, size.height, this.config.emptyLabel ?? 'No chart data', theme);
      return;
    }

    const radius = Math.max(40, Math.min(size.innerWidth, size.innerHeight) / 2 - 18);
    const centerX = size.margin.left + size.innerWidth / 2;
    const centerY = size.margin.top + size.innerHeight / 2;
    const angleFor = (index: number): number => (index / rows.length) * Math.PI * 2;
    const pointFor = (datum: D3ChartDatum, index: number, scale = datum.value / 100): [number, number] => {
      const angle = angleFor(index);
      return [
        centerX + Math.sin(angle) * radius * scale,
        centerY - Math.cos(angle) * radius * scale,
      ];
    };
    const radialLine = lineRadial<D3ChartDatum>()
      .angle((_datum, index) => angleFor(index))
      .radius((datum) => radius * (datum.value / 100));
    const gridLine = lineRadial<D3ChartDatum>()
      .angle((_datum, index) => angleFor(index));
    const group = svg.append('g');

    [0.25, 0.5, 0.75, 1].forEach((scale) => {
      group
        .append('path')
        .datum(rows)
        .attr('class', 'd3-score-chart__grid-ring')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('fill', 'none')
        .attr('stroke', theme.grid)
        .attr('stroke-width', 1)
        .attr('d', gridLine.radius(radius * scale));
    });

    rows.forEach((datum, index) => {
      const [axisX, axisY] = pointFor(datum, index, 1);
      const [labelX, labelY] = pointFor(datum, index, 1.22);

      group
        .append('line')
        .attr('class', 'd3-score-chart__axis-line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', axisX)
        .attr('y2', axisY)
        .attr('stroke', theme.grid)
        .attr('stroke-width', 1);

      group
        .append('text')
        .attr('class', 'd3-score-chart__label')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textSecondary)
        .attr('font-size', 11)
        .text(compactD3ChartLabel(datum.label, 12));
    });

    group
      .append('path')
      .datum(rows)
      .attr('class', 'd3-score-chart__shape')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', theme.positive)
      .attr('fill-opacity', 0.16)
      .attr('stroke', theme.positive)
      .attr('stroke-width', 3)
      .attr('d', radialLine);

    group
      .selectAll('circle.d3-score-chart__point')
      .data(rows)
      .enter()
      .append('circle')
      .attr('class', 'd3-score-chart__point')
      .attr('cx', (datum, index) => pointFor(datum, index)[0])
      .attr('cy', (datum, index) => pointFor(datum, index)[1])
      .attr('r', 4)
      .attr('fill', (datum, index) => toneColor(theme, datum.tone, index))
      .attr('stroke', theme.surfaceCard)
      .attr('stroke-width', 2)
      .append('title')
      .text((datum) => tooltipText(chartDatumTooltip(datum, this.config.valueSuffix)));

    const average = rows.reduce((sum, datum) => sum + datum.value, 0) / rows.length;
    group
      .append('text')
      .attr('class', 'd3-score-chart__average')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 18)
      .attr('font-weight', 700)
      .text(formatD3ChartValue(average, undefined, this.config.valueSuffix ?? '%'));
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
