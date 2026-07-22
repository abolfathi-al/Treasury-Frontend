import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { Selection, select } from 'd3';

import { applySvgAccessibility } from './d3-chart-accessibility';
import { chartSize } from './d3-chart-scales';
import { D3ChartConfig } from './d3-chart.types';

@Directive({
  selector: '[vlD3ChartHost]',
  standalone: true,
  exportAs: 'vlD3ChartHost',
})
export class D3ChartHostDirective implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private resizeObserver?: ResizeObserver;

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  createSvg(
    className: string,
    config: D3ChartConfig = {}
  ): Selection<SVGSVGElement, unknown, null, undefined> | null {
    if (!this.isBrowser) {
      return null;
    }

    this.clear();

    const size = chartSize(this.element, config.height, config.margin);
    const svg = select(this.element)
      .append('svg')
      .attr('class', className)
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, config.ariaLabel ?? 'Chart');
    return svg;
  }

  observe(render: () => void): void {
    if (!this.isBrowser || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => render());
    this.resizeObserver.observe(this.element);
  }

  clear(): void {
    select(this.element).selectAll('*').remove();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.clear();
  }
}
