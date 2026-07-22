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
import { scalePoint, select } from 'd3';

import { applySvgAccessibility, renderEmptyState } from './d3-chart-accessibility';
import { compactD3ChartLabel } from './d3-chart-formatters';
import { chartSize } from './d3-chart-scales';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import { D3ChartConfig, D3TimelineItem } from './d3-chart.types';

@Directive({
  selector: '[vlD3Timeline]',
  standalone: true,
})
export class D3TimelineDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: readonly D3TimelineItem[] = [];
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
    const size = chartSize(
      host,
      this.config.height ?? 180,
      {
        top: 34,
        right: 28,
        bottom: 56,
        left: 28,
        ...this.config.margin,
      },
      280,
    );
    const items = this.data.map((item, index) => ({
      ...item,
      id: item.id ?? `${index}-${item.label}`,
      point: String(item.value ?? index),
    }));
    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-timeline')
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.config.ariaLabel ?? 'Timeline');

    if (items.length === 0) {
      renderEmptyState(svg, size.width, size.height, this.config.emptyLabel ?? 'No timeline data', theme);
      return;
    }

    const group = svg
      .append('g')
      .attr('transform', `translate(${size.margin.left}, ${size.margin.top})`);
    const y = Math.max(36, size.innerHeight * 0.48);
    const xScale = scalePoint<string>()
      .domain(items.map((item) => item.point))
      .range([0, size.innerWidth])
      .padding(items.length === 1 ? 0.5 : 0.2);

    group
      .append('line')
      .attr('class', 'd3-timeline__rail')
      .attr('x1', xScale(items[0]?.point) ?? 0)
      .attr('x2', xScale(items[items.length - 1]?.point) ?? size.innerWidth)
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', theme.axis)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    const nodes = group
      .selectAll('g.d3-timeline__item')
      .data(items)
      .enter()
      .append('g')
      .attr('class', 'd3-timeline__item')
      .attr('transform', (item) => `translate(${xScale(item.point) ?? 0}, ${y})`);

    nodes
      .append('circle')
      .attr('class', 'd3-timeline__marker')
      .attr('r', this.config.compact ? 5 : 6.5)
      .attr('fill', (item, index) => toneColor(theme, item.tone, index))
      .attr('stroke', theme.surfaceCard)
      .attr('stroke-width', 2);

    nodes
      .append('text')
      .attr('class', 'd3-timeline__label')
      .attr('x', 0)
      .attr('y', (_item, index) => (index % 2 === 0 ? -18 : 28))
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .text((item) => compactD3ChartLabel(item.label, this.config.compact ? 12 : 18));

    nodes
      .filter((item) => Boolean(item.detail ?? item.timestamp))
      .append('text')
      .attr('class', 'd3-timeline__detail')
      .attr('x', 0)
      .attr('y', (_item, index) => (index % 2 === 0 ? -4 : 43))
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .attr('font-size', 10)
      .text((item) => compactD3ChartLabel(item.detail ?? item.timestamp ?? '', this.config.compact ? 12 : 18));

    nodes
      .append('title')
      .text((item) => [item.label, item.detail, item.timestamp].filter(Boolean).join(': '));
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
