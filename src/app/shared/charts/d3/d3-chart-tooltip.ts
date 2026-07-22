import { D3ChartDatum, D3ChartTooltip } from './d3-chart.types';
import { formatD3ChartValue } from './d3-chart-formatters';

export function chartDatumTooltip(
  datum: D3ChartDatum,
  suffix = ''
): D3ChartTooltip {
  return {
    title: datum.label,
    value: formatD3ChartValue(datum.value, datum.displayValue, suffix),
  };
}

export function tooltipText(tooltip: D3ChartTooltip): string {
  return [tooltip.title, tooltip.value, tooltip.detail]
    .filter((part): part is string => Boolean(part))
    .join(': ');
}
