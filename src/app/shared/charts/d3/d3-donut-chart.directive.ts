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
import { PieArcDatum, arc, pie, select } from 'd3';
import { applySvgAccessibility } from './d3-chart-accessibility';
import { D3LegendRenderResult, renderD3Legend } from './d3-chart-legend';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import {
  D3ChartTheme,
  DonutChartSegment,
  getChartColorClass,
  getChartTone,
  getElementDirection,
} from './d3-chart.types';

interface D3DonutSegment extends DonutChartSegment {
  readonly legendId: string;
  readonly colorClass: string;
  readonly fill: string;
}

@Directive({
  selector: '[vlD3DonutChart]',
  standalone: true,
})
export class D3DonutChartDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() segments: readonly DonutChartSegment[] = [];
  @Input() size = 150;
  @Input() thickness = 22;
  @Input() gapAngle = 4;
  @Input() cornerRadius = 5;
  @Input() ariaLabel = 'Donut chart';

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.render();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.viewReady) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private render(): void {
    if (!this.isBrowser) {
      return;
    }

    this.clear();

    const host = this.elementRef.nativeElement;
    const theme = resolveD3Theme(host);
    const chartSize = Math.max(72, this.size);
    const chartThickness = Math.max(6, Math.min(this.thickness, chartSize / 2 - 4));
    const outerRadius = chartSize / 2 - 1;
    const innerRadius = Math.max(0, outerRadius - chartThickness);
    const isRtl = getElementDirection(host) === 'rtl';
    const padAngle =
      this.normalizedSegments(theme).length > 1
        ? Math.max(0, this.gapAngle) * (Math.PI / 180)
        : 0;

    const layout = select(host)
      .append('div')
      .attr('class', 'd3-donut-chart__layout')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('gap', '0.9rem')
      .style('flex-wrap', 'wrap')
      .style('width', '100%');

    const visual = layout
      .append('div')
      .attr('class', 'd3-donut-chart__visual')
      .style('width', `${chartSize}px`)
      .style('max-width', '100%')
      .style('aspect-ratio', '1')
      .style('flex', `0 0 min(${chartSize}px, 100%)`);

    const svg = visual
      .append('svg')
      .attr('class', 'd3-donut-chart')
      .attr('dir', isRtl ? 'rtl' : 'ltr')
      .attr('viewBox', `0 0 ${chartSize} ${chartSize}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.ariaLabel);

    const group = svg
      .append('g')
      .attr('transform', `translate(${chartSize / 2}, ${chartSize / 2})`);

    const trackArc = arc<void>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(Math.PI * 2);

    group
      .append('path')
      .attr('class', 'd3-donut-chart__track')
      .attr('fill', theme.grid)
      .attr('d', trackArc());

    const normalizedSegments = this.normalizedSegments(theme);
    const renderSegments = isRtl
      ? [...normalizedSegments].reverse()
      : [...normalizedSegments];
    const total = renderSegments.reduce(
      (sum, segment) => sum + segment.value,
      0
    );

    if (total <= 0) {
      return;
    }

    const pieLayout = pie<D3DonutSegment>()
      .sort(null)
      .value((segment) => segment.value)
      .padAngle(padAngle);

    const segmentArc = arc<PieArcDatum<D3DonutSegment>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(Math.max(0, Math.min(this.cornerRadius, chartThickness / 2)));

    const segmentPaths = group
      .selectAll('path.d3-donut-chart__segment')
      .data(pieLayout(renderSegments))
      .enter()
      .append('path')
      .attr(
        'class',
        (datum) => `d3-donut-chart__segment ${datum.data.colorClass}`
      )
      .attr('fill', (datum) => datum.data.fill)
      .attr('d', (datum) => segmentArc(datum))
      .attr('tabindex', '0')
      .attr('aria-label', (datum) => this.segmentAccessibilityLabel(datum.data, total));

    let legend: D3LegendRenderResult | undefined;
    const setHighlight = (legendId: string | null): void => {
      legend?.highlight(legendId);
      segmentPaths
        .classed('is-highlighted', (datum) => datum.data.legendId === legendId)
        .attr('opacity', (datum) => legendId && datum.data.legendId !== legendId ? 0.36 : 1)
        .attr('stroke', (datum) => datum.data.legendId === legendId ? theme.surfaceCard : 'none')
        .attr('stroke-width', (datum) => datum.data.legendId === legendId ? 2 : 0);
    };

    segmentPaths
      .on('pointerenter', (_event, datum) => setHighlight(datum.data.legendId))
      .on('pointerleave', () => setHighlight(null))
      .on('focusin', (_event, datum) => setHighlight(datum.data.legendId))
      .on('focusout', () => setHighlight(null))
      .append('title')
      .text((datum) => this.segmentTooltip(datum.data, total));

    const layoutNode = layout.node();
    if (layoutNode) {
      legend = renderD3Legend({
        container: layoutNode,
        items: renderSegments.map((segment) => ({
          id: segment.legendId,
          label: segment.label,
          value: segment.displayValue ?? segment.value,
          percentage: this.segmentPercentage(segment, total),
          color: segment.fill,
        })),
        theme,
        layout: 'right',
        ariaLabel: this.ariaLabel,
        interactive: {
          onItemEnter: (item) => setHighlight(item.id),
          onItemLeave: () => setHighlight(null),
        },
      });
    }
  }

  private normalizedSegments(theme: D3ChartTheme): readonly D3DonutSegment[] {
    return this.segments
      .filter((segment) => segment.value > 0)
      .map((segment, index) => {
        const tone = getChartTone(segment, index);

        return {
          ...segment,
          legendId: segment.id ?? `${index}-${segment.label}`,
          colorClass: getChartColorClass(segment, index),
          fill: toneColor(theme, tone, index),
        };
      });
  }

  private segmentTooltip(segment: D3DonutSegment, total: number): string {
    const value = segment.displayValue ?? segment.value;
    const percent = Math.round(this.segmentPercentage(segment, total));

    return `${segment.label}: ${value} (${percent}%)`;
  }

  private segmentAccessibilityLabel(segment: D3DonutSegment, total: number): string {
    const value = segment.displayValue ?? segment.value;
    const percent = Math.round(this.segmentPercentage(segment, total));

    return `${segment.label} ${value} ${percent}%`;
  }

  private segmentPercentage(segment: DonutChartSegment, total: number): number {
    return segment.percentage ?? (total > 0 ? (segment.value / total) * 100 : 0);
  }

  private clear(): void {
    select(this.elementRef.nativeElement).selectAll('*').remove();
  }
}
