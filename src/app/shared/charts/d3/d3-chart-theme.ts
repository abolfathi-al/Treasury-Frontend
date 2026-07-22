import { ChartTone, D3ChartTheme } from './d3-chart.types';

const VARIABLE_FALLBACKS: Readonly<Record<keyof D3ChartTheme, string>> = {
  surfaceCard: 'var(--velora-surface-card)',
  surfaceMuted: 'var(--velora-surface-muted)',
  borderSubtle: 'var(--velora-border-subtle)',
  textPrimary: 'var(--velora-text-primary)',
  textSecondary: 'var(--velora-text-secondary)',
  textMuted: 'var(--velora-text-muted)',
  accentPrimary: 'var(--velora-accent-primary)',
  accentSecondary: 'var(--velora-accent-secondary)',
  chartPalette: 'var(--velora-chart-1)',
  grid: 'var(--velora-chart-grid)',
  axis: 'var(--velora-chart-axis)',
  label: 'var(--velora-chart-label)',
  tooltipBg: 'var(--velora-chart-tooltip-bg)',
  tooltipText: 'var(--velora-chart-tooltip-text)',
  positive: 'var(--velora-chart-positive)',
  warning: 'var(--velora-chart-warning)',
  negative: 'var(--velora-chart-negative)',
  neutral: 'var(--velora-chart-neutral)',
};

export function resolveD3Theme(host: HTMLElement): D3ChartTheme {
  const root = document.documentElement;
  const hostStyles = getComputedStyle(host);
  const rootStyles = getComputedStyle(root);
  const css = (name: string, fallback: string): string => {
    const hostInlineValue = host.style.getPropertyValue(name).trim();
    const rootInlineValue = root.style.getPropertyValue(name).trim();

    return (
      hostInlineValue ||
      rootInlineValue ||
      hostStyles.getPropertyValue(name).trim() ||
      rootStyles.getPropertyValue(name).trim() ||
      fallback
    );
  };

  return {
    surfaceCard: css('--velora-surface-card', VARIABLE_FALLBACKS.surfaceCard),
    surfaceMuted: css('--velora-surface-muted', VARIABLE_FALLBACKS.surfaceMuted),
    borderSubtle: css('--velora-border-subtle', VARIABLE_FALLBACKS.borderSubtle),
    textPrimary: css('--velora-text-primary', VARIABLE_FALLBACKS.textPrimary),
    textSecondary: css('--velora-text-secondary', VARIABLE_FALLBACKS.textSecondary),
    textMuted: css('--velora-text-muted', VARIABLE_FALLBACKS.textMuted),
    accentPrimary: css('--velora-accent-primary', VARIABLE_FALLBACKS.accentPrimary),
    accentSecondary: css('--velora-accent-secondary', VARIABLE_FALLBACKS.accentSecondary),
    chartPalette: [
      css('--velora-chart-1', 'var(--velora-chart-1)'),
      css('--velora-chart-2', 'var(--velora-chart-2)'),
      css('--velora-chart-3', 'var(--velora-chart-3)'),
      css('--velora-chart-4', 'var(--velora-chart-4)'),
      css('--velora-chart-5', 'var(--velora-chart-5)'),
      css('--velora-chart-6', 'var(--velora-chart-6)'),
    ],
    grid: css('--velora-chart-grid', VARIABLE_FALLBACKS.grid),
    axis: css('--velora-chart-axis', VARIABLE_FALLBACKS.axis),
    label: css('--velora-chart-label', VARIABLE_FALLBACKS.label),
    tooltipBg: css('--velora-chart-tooltip-bg', VARIABLE_FALLBACKS.tooltipBg),
    tooltipText: css('--velora-chart-tooltip-text', VARIABLE_FALLBACKS.tooltipText),
    positive: css('--velora-chart-positive', VARIABLE_FALLBACKS.positive),
    warning: css('--velora-chart-warning', VARIABLE_FALLBACKS.warning),
    negative: css('--velora-chart-negative', VARIABLE_FALLBACKS.negative),
    neutral: css('--velora-chart-neutral', VARIABLE_FALLBACKS.neutral),
  };
}

export const resolveD3ChartTheme = resolveD3Theme;

export function toneColor(theme: D3ChartTheme, tone: ChartTone | undefined, index = 0): string {
  switch (tone) {
    case 'success':
      return theme.positive;
    case 'warning':
      return theme.warning;
    case 'danger':
      return theme.negative;
    case 'info':
      return theme.chartPalette[1] ?? theme.accentSecondary;
    case 'secondary':
      return theme.neutral;
    case 'primary':
      return theme.accentPrimary;
    case undefined:
      return theme.chartPalette[index % theme.chartPalette.length];
  }
}
