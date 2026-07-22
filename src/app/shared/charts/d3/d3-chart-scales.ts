import { D3ChartMargin } from './d3-chart.types';

export interface D3ChartSize {
  readonly width: number;
  readonly height: number;
  readonly margin: D3ChartMargin;
  readonly innerWidth: number;
  readonly innerHeight: number;
}

export const DEFAULT_D3_CHART_MARGIN: D3ChartMargin = {
  top: 24,
  right: 28,
  bottom: 40,
  left: 48,
};

export function normalizePercent(value: number): number {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

export function mergedMargin(margin?: Partial<D3ChartMargin>): D3ChartMargin {
  return {
    ...DEFAULT_D3_CHART_MARGIN,
    ...margin,
  };
}

export function chartSize(
  host: HTMLElement,
  requestedHeight: number | undefined,
  margin?: Partial<D3ChartMargin>,
  minimumWidth = 320
): D3ChartSize {
  const chartMargin = mergedMargin(margin);
  const width = Math.max(
    minimumWidth,
    Math.round(host.clientWidth || host.getBoundingClientRect().width || minimumWidth)
  );
  const height = Math.max(160, requestedHeight ?? 220);

  return {
    width,
    height,
    margin: chartMargin,
    innerWidth: Math.max(1, width - chartMargin.left - chartMargin.right),
    innerHeight: Math.max(1, height - chartMargin.top - chartMargin.bottom),
  };
}
