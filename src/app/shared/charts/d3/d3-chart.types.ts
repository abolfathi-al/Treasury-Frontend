export type ChartTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary';

export interface ChartToneInput {
  readonly tone?: ChartTone;
  readonly colorClass?: string;
}

export interface D3ChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface D3ChartConfig {
  readonly ariaLabel?: string;
  readonly emptyLabel?: string;
  readonly height?: number;
  readonly margin?: Partial<D3ChartMargin>;
  readonly maxValue?: number;
  readonly valueSuffix?: string;
  readonly compact?: boolean;
}

export interface D3ChartDatum extends ChartToneInput {
  readonly id?: string;
  readonly label: string;
  readonly value: number;
  readonly displayValue?: string;
}

export interface D3TimelineItem extends ChartToneInput {
  readonly id?: string;
  readonly label: string;
  readonly detail?: string;
  readonly timestamp?: string;
  readonly value?: number;
}

export interface D3ChartSeries {
  readonly id: string;
  readonly label: string;
  readonly data: readonly D3ChartDatum[];
  readonly tone?: ChartTone;
}

export type D3ChartState = 'ready' | 'empty' | 'loading' | 'error';

export interface D3ChartTheme {
  readonly surfaceCard: string;
  readonly surfaceMuted: string;
  readonly borderSubtle: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accentPrimary: string;
  readonly accentSecondary: string;
  readonly chartPalette: readonly string[];
  readonly grid: string;
  readonly axis: string;
  readonly label: string;
  readonly tooltipBg: string;
  readonly tooltipText: string;
  readonly positive: string;
  readonly warning: string;
  readonly negative: string;
  readonly neutral: string;
}

export interface D3ChartTooltip {
  readonly title: string;
  readonly value?: string;
  readonly detail?: string;
}

export interface D3ChartLegend {
  readonly label: string;
  readonly value: string;
  readonly tone?: ChartTone;
}

export interface D3ForceGraphNode extends ChartToneInput {
  readonly id: string;
  readonly label: string;
  readonly value?: string;
  readonly primary?: boolean;
}

export interface D3ForceGraphLink {
  readonly source: string;
  readonly target: string;
  readonly label?: string;
}

export interface DonutChartSegment {
  readonly id?: string;
  readonly label: string;
  readonly value: number;
  readonly displayValue?: string;
  readonly percentage?: number;
  readonly tone?: ChartTone;
  readonly colorClass?: string;
}

export type GaugeChartSegment = DonutChartSegment;

export interface DonutChartLegendSegment extends DonutChartSegment {
  readonly percent: number;
  readonly tone: ChartTone;
  readonly colorClass: string;
}

export interface ProgressBreakdownItem {
  readonly label: string;
  readonly value: string | number;
  readonly percentage: number;
  readonly tone?: ChartTone;
}

export type WaterfallStepType =
  | 'start'
  | 'increase'
  | 'decrease'
  | 'subtotal'
  | 'total';

export interface WaterfallChartItem {
  readonly label: string;
  readonly value: number;
  readonly displayValue?: string;
  readonly type?: WaterfallStepType;
  readonly tone?: ChartTone;
}

export const DEFAULT_CHART_TONES: readonly ChartTone[] = [
  'primary',
  'danger',
  'warning',
  'info',
  'success',
  'secondary',
];

export function getDefaultChartTone(index: number): ChartTone {
  return DEFAULT_CHART_TONES[index % DEFAULT_CHART_TONES.length];
}

export function getChartTone(segment: ChartToneInput, index: number): ChartTone {
  return segment.tone ?? getDefaultChartTone(index);
}

export function getChartColorClass(
  segment: ChartToneInput,
  index: number
): string {
  return segment.colorClass ?? `bg-${getChartTone(segment, index)}`;
}

export type ChartDirection = 'ltr' | 'rtl';

export function getElementDirection(element: HTMLElement): ChartDirection {
  const explicitDirection = element
    .closest('[dir]')
    ?.getAttribute('dir')
    ?.toLowerCase();

  if (explicitDirection === 'rtl') {
    return 'rtl';
  }

  if (explicitDirection === 'ltr') {
    return 'ltr';
  }

  return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}
