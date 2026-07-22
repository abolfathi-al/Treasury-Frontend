import { Selection } from 'd3';
import { D3ChartTheme } from './d3-chart.types';

export function applySvgAccessibility(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  ariaLabel: string
): void {
  svg
    .attr('role', 'img')
    .attr('aria-label', ariaLabel)
    .attr('focusable', 'false');

  svg.append('title').text(ariaLabel);
}

export function renderEmptyState(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  width: number,
  height: number,
  label: string,
  theme: D3ChartTheme
): void {
  svg
    .append('text')
    .attr('class', 'd3-chart-empty-state')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', theme.textMuted)
    .attr('font-size', 12)
    .text(label);
}
