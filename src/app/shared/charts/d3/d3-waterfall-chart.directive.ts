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
import { ScaleBand, ScaleLinear, Selection, scaleBand, scaleLinear, select } from 'd3';
import {
  ChartTone,
  WaterfallChartItem,
  getElementDirection,
} from './d3-chart.types';
import { resolveD3Theme, toneColor } from './d3-chart-theme';

interface WaterfallBar extends WaterfallChartItem {
  readonly index: number;
  readonly start: number;
  readonly end: number;
  readonly tone: ChartTone;
}

@Directive({
  selector: '[vlD3WaterfallChart]',
  standalone: true,
})
export class D3WaterfallChartDirective
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() items: readonly WaterfallChartItem[] = [];
  @Input() height = 260;
  @Input() ariaLabel = 'Waterfall chart';

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
    const bars = this.buildBars();
    const isRtl = getElementDirection(host) === 'rtl';
    const chartWidth = Math.max(680, host.clientWidth || 680);
    const chartHeight = Math.max(180, this.height);
    const margin = isRtl
      ? { top: 24, right: 42, bottom: 54, left: 24 }
      : { top: 24, right: 24, bottom: 54, left: 42 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    if (bars.length === 0) {
      return;
    }

    const values = bars.flatMap((bar) => [bar.start, bar.end, 0]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valuePadding = Math.max((maxValue - minValue) * 0.12, 10);
    const yDomainMin = Math.min(0, minValue - valuePadding);
    const yDomainMax = Math.max(0, maxValue + valuePadding);

    const xScale = scaleBand<string>()
      .domain(bars.map((bar) => bar.label))
      .range(isRtl ? [innerWidth, 0] : [0, innerWidth])
      .padding(0.35);
    const yScale = scaleLinear()
      .domain([yDomainMin, yDomainMax])
      .range([innerHeight, 0])
      .nice();

    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-waterfall-chart')
      .attr('dir', isRtl ? 'rtl' : 'ltr')
      .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
      .attr('width', '100%')
      .attr('height', chartHeight)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('role', 'presentation')
      .attr('aria-hidden', 'true')
      .attr('focusable', 'false')
      .style('display', 'block');

    const group = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    group
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', theme.axis)
      .attr('stroke-width', 1);

    group
      .selectAll('line.d3-waterfall-chart__grid')
      .data(yScale.ticks(4))
      .enter()
      .append('line')
      .attr('class', 'd3-waterfall-chart__grid')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (value) => yScale(value))
      .attr('y2', (value) => yScale(value))
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 5');

    group
      .selectAll('text.d3-waterfall-chart__tick')
      .data(yScale.ticks(4))
      .enter()
      .append('text')
      .attr('class', 'd3-waterfall-chart__tick')
      .attr('x', isRtl ? innerWidth + 12 : -12)
      .attr('y', (value) => yScale(value))
      .attr('dy', '0.35em')
      .attr('text-anchor', isRtl ? 'start' : 'end')
      .attr('fill', theme.textMuted)
      .attr('font-size', 11)
      .text((value) => String(value));

    this.renderConnectors(group, bars, xScale, yScale, isRtl, theme.axis);

    group
      .selectAll('rect.d3-waterfall-chart__bar')
      .data(bars)
      .enter()
      .append('rect')
      .attr('class', (bar) => `d3-waterfall-chart__bar bg-${bar.tone}`)
      .attr('x', (bar) => xScale(bar.label) ?? 0)
      .attr('y', (bar) => yScale(Math.max(bar.start, bar.end)))
      .attr('width', xScale.bandwidth())
      .attr('height', (bar) =>
        Math.max(4, Math.abs(yScale(bar.start) - yScale(bar.end)))
      )
      .attr('rx', 4)
      .attr('fill', (bar, index) => toneColor(theme, bar.tone, index))
      .append('title')
      .text((bar) => `${bar.label}: ${bar.displayValue ?? bar.value}`);

    group
      .selectAll('text.d3-waterfall-chart__value')
      .data(bars)
      .enter()
      .append('text')
      .attr('class', 'd3-waterfall-chart__value')
      .attr('x', (bar) => (xScale(bar.label) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', (bar) => yScale(Math.max(bar.start, bar.end)) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .text((bar) => bar.displayValue ?? this.formatValue(bar.value));

    group
      .selectAll('text.d3-waterfall-chart__label')
      .data(bars)
      .enter()
      .append('text')
      .attr('class', 'd3-waterfall-chart__label')
      .attr('x', (bar) => (xScale(bar.label) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textSecondary)
      .attr('font-size', 11)
      .attr('direction', isRtl ? 'rtl' : 'ltr')
      .attr('unicode-bidi', 'plaintext')
      .text((bar) => bar.label);

    svg.append('title').text(this.ariaLabel);
  }

  private buildBars(): readonly WaterfallBar[] {
    let runningTotal = 0;

    return this.items.map((item, index) => {
      const type = item.type ?? 'decrease';
      const isAbsolute = type === 'start' || type === 'subtotal' || type === 'total';
      const start = isAbsolute ? 0 : runningTotal;
      const end = isAbsolute ? item.value : runningTotal + item.value;
      runningTotal = end;

      return {
        ...item,
        index,
        start,
        end,
        tone: item.tone ?? this.resolveTone(type, item.value),
      };
    });
  }

  private renderConnectors(
    group: Selection<SVGGElement, unknown, null, undefined>,
    bars: readonly WaterfallBar[],
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>,
    isRtl: boolean,
    connectorStroke: string
  ): void {
    bars.slice(0, -1).forEach((bar, index) => {
      const next = bars[index + 1];
      const currentX = xScale(bar.label) ?? 0;
      const nextX = xScale(next.label) ?? 0;
      const x1 = isRtl ? currentX : currentX + xScale.bandwidth();
      const x2 = isRtl ? nextX + xScale.bandwidth() : nextX;
      const y = yScale(bar.end);

      group
        .append('line')
        .attr('class', 'd3-waterfall-chart__connector')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', connectorStroke)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');
    });
  }

  private resolveTone(type: string, value: number): ChartTone {
    if (type === 'start' || type === 'total') {
      return 'primary';
    }

    if (type === 'subtotal') {
      return 'secondary';
    }

    return value >= 0 ? 'success' : 'danger';
  }

  private formatValue(value: number): string {
    return value > 0 ? `+${value}` : String(value);
  }

  private clear(): void {
    select(this.elementRef.nativeElement).selectAll('*').remove();
  }
}
