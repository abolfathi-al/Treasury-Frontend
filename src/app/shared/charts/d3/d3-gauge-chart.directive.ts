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
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import {
  D3ChartTheme,
  GaugeChartSegment,
  getChartColorClass,
  getChartTone,
} from './d3-chart.types';

interface D3GaugeSegment extends GaugeChartSegment {
  readonly colorClass: string;
  readonly fill: string;
}

@Directive({
  selector: '[vlD3GaugeChart]',
  standalone: true,
})
export class D3GaugeChartDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() segments: readonly GaugeChartSegment[] = [];
  @Input() size = 180;
  @Input() thickness = 28;
  @Input() gapAngle = 4;
  @Input() cornerRadius = 6;
  @Input() sweepAngle = 230;
  @Input() ariaLabel = 'Gauge chart';

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
    const chartSize = Math.max(96, this.size);
    const chartThickness = Math.max(8, Math.min(this.thickness, chartSize / 2 - 8));
    const outerRadius = chartSize / 2 - 2;
    const innerRadius = Math.max(0, outerRadius - chartThickness);
    const sweep = Math.max(90, Math.min(this.sweepAngle, 300)) * (Math.PI / 180);
    const startAngle = -sweep / 2;
    const endAngle = sweep / 2;
    const padAngle =
      this.normalizedSegments(theme).length > 1
        ? Math.max(0, this.gapAngle) * (Math.PI / 180)
        : 0;

    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-gauge-chart')
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
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(Math.max(0, Math.min(this.cornerRadius, chartThickness / 2)));

    group
      .append('path')
      .attr('class', 'd3-gauge-chart__track')
      .attr('fill', theme.grid)
      .attr('d', trackArc());

    const renderSegments = [...this.normalizedSegments(theme)];
    const total = renderSegments.reduce((sum, segment) => sum + segment.value, 0);

    if (total <= 0) {
      return;
    }

    const pieLayout = pie<D3GaugeSegment>()
      .sort(null)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .value((segment) => segment.value)
      .padAngle(padAngle);

    const segmentArc = arc<PieArcDatum<D3GaugeSegment>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(Math.max(0, Math.min(this.cornerRadius, chartThickness / 2)));

    group
      .selectAll('path.d3-gauge-chart__segment')
      .data(pieLayout(renderSegments))
      .enter()
      .append('path')
      .attr('class', (datum) => `d3-gauge-chart__segment ${datum.data.colorClass}`)
      .attr('fill', (datum) => datum.data.fill)
      .attr('d', (datum) => segmentArc(datum))
      .append('title')
      .text((datum) => `${datum.data.label}: ${datum.data.value}`);
  }

  private normalizedSegments(theme: D3ChartTheme): readonly D3GaugeSegment[] {
    return this.segments
      .filter((segment) => segment.value > 0)
      .map((segment, index) => {
        const tone = getChartTone(segment, index);

        return {
          ...segment,
          colorClass: getChartColorClass(segment, index),
          fill: toneColor(theme, tone, index),
        };
      });
  }

  private clear(): void {
    select(this.elementRef.nativeElement).selectAll('*').remove();
  }
}
