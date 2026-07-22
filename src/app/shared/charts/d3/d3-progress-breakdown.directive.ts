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
import { scaleLinear, select } from 'd3';
import {
  ChartTone,
  getElementDirection,
} from './d3-chart.types';
import { resolveD3Theme, toneColor } from './d3-chart-theme';

@Directive({
  selector: '[vlD3ProgressBreakdown]',
  standalone: true,
})
export class D3ProgressBreakdownDirective
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() percentage = 0;
  @Input() tone: ChartTone = 'primary';
  @Input() compact = false;
  @Input() ariaLabel = 'Progress';

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
    const normalizedPercentage = Math.max(0, Math.min(100, this.percentage));
    const height = this.compact ? 5 : 7;
    const radius = height / 2;
    const chartWidth = Math.max(
      1,
      Math.round(host.clientWidth || host.getBoundingClientRect().width || 100)
    );
    const widthScale = scaleLinear().domain([0, 100]).range([0, chartWidth]);
    const fillWidth = widthScale(normalizedPercentage);
    const isRtl = getElementDirection(host) === 'rtl';

    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-progress-breakdown')
      .attr('dir', isRtl ? 'rtl' : 'ltr')
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('preserveAspectRatio', 'none')
      .attr('role', 'presentation')
      .attr('aria-hidden', 'true')
      .attr('focusable', 'false')
      .style('display', 'block');

    svg
      .append('rect')
      .attr('class', 'd3-progress-breakdown__track')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth)
      .attr('height', height)
      .attr('rx', radius)
      .attr('fill', theme.grid);

    svg
      .append('rect')
      .attr('class', `d3-progress-breakdown__value bg-${this.tone}`)
      .attr('x', isRtl ? chartWidth - fillWidth : 0)
      .attr('y', 0)
      .attr('width', fillWidth)
      .attr('height', height)
      .attr('rx', radius)
      .attr('fill', toneColor(theme, this.tone));

    svg
      .append('title')
      .text(`${this.ariaLabel}: ${Math.round(normalizedPercentage)}%`);
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
