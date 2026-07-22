import { select } from 'd3';

import { D3ChartTheme } from './d3-chart.types';

export type D3LegendLayout = 'right' | 'bottom' | 'inline' | 'scale';

export interface D3LegendItem {
  readonly id: string;
  readonly label: string;
  readonly value?: string | number;
  readonly percentage?: number;
  readonly color: string;
  readonly disabled?: boolean;
}

export interface D3LegendInteraction {
  readonly onItemEnter?: (item: D3LegendItem, index: number) => void;
  readonly onItemLeave?: () => void;
}

export interface D3LegendRenderOptions {
  readonly container: HTMLElement;
  readonly items: readonly D3LegendItem[];
  readonly theme: D3ChartTheme;
  readonly layout?: D3LegendLayout;
  readonly ariaLabel?: string;
  readonly valueFormatter?: (value: string | number, item: D3LegendItem) => string;
  readonly percentageFormatter?: (percentage: number, item: D3LegendItem) => string;
  readonly interactive?: D3LegendInteraction;
}

export interface D3LegendRenderResult {
  readonly highlight: (id: string | null) => void;
}

export function renderD3Legend(options: D3LegendRenderOptions): D3LegendRenderResult {
  const legend = select(options.container)
    .append('div')
    .attr('class', `d3-chart-legend d3-chart-legend--${options.layout ?? 'bottom'}`)
    .attr('role', 'list')
    .attr('aria-label', options.ariaLabel ?? null)
    .style('display', 'grid')
    .style('grid-template-columns', legendGridTemplate(options.layout ?? 'bottom'))
    .style('gap', '0.45rem 0.75rem')
    .style('align-content', 'center')
    .style('min-width', 'min(100%, 9rem)')
    .style('max-width', '100%');

  const itemSelection = legend
    .selectAll<HTMLDivElement, D3LegendItem>('div.d3-chart-legend__item')
    .data(options.items)
    .enter()
    .append('div')
    .attr('class', (item) =>
      `d3-chart-legend__item${item.disabled ? ' d3-chart-legend__item--disabled' : ''}`
    )
    .attr('data-testid', 'd3-chart-legend-item')
    .attr('data-legend-id', (item) => item.id)
    .attr('role', 'listitem')
    .attr('tabindex', '0')
    .attr('aria-label', (item) => legendItemLabel(item, options))
    .style('display', 'grid')
    .style('grid-template-columns', '0.65rem minmax(0, 1fr) auto')
    .style('align-items', 'center')
    .style('gap', '0.35rem')
    .style('min-width', '0')
    .style('color', options.theme.textPrimary)
    .style('font-size', '0.75rem')
    .style('line-height', '1.25')
    .style('opacity', (item) => (item.disabled ? '0.54' : '1'));

  itemSelection
    .append('span')
    .attr('class', 'd3-chart-legend__marker')
    .attr('data-testid', 'd3-chart-legend-marker')
    .attr('aria-hidden', 'true')
    .style('width', '0.55rem')
    .style('height', '0.55rem')
    .style('border-radius', '50%')
    .style('background-color', (item) => item.color)
    .style('box-shadow', `0 0 0 1px ${options.theme.borderSubtle}`);

  itemSelection
    .append('span')
    .attr('class', 'd3-chart-legend__label')
    .style('min-width', '0')
    .style('overflow', 'hidden')
    .style('text-overflow', 'ellipsis')
    .style('white-space', 'nowrap')
    .style('font-weight', '600')
    .text((item) => item.label);

  itemSelection
    .append('span')
    .attr('class', 'd3-chart-legend__meta')
    .style('color', options.theme.textMuted)
    .style('font-size', '0.7rem')
    .style('white-space', 'nowrap')
    .text((item) => legendItemMeta(item, options));

  itemSelection
    .on('pointerenter', (_event, item) => {
      const index = options.items.indexOf(item);
      options.interactive?.onItemEnter?.(item, index);
    })
    .on('pointerleave', () => options.interactive?.onItemLeave?.())
    .on('focusin', (_event, item) => {
      const index = options.items.indexOf(item);
      options.interactive?.onItemEnter?.(item, index);
    })
    .on('focusout', () => options.interactive?.onItemLeave?.());

  const highlight = (id: string | null): void => {
    itemSelection
      .classed('is-highlighted', (item) => item.id === id)
      .style('opacity', (item) => {
        if (item.disabled) {
          return '0.54';
        }
        return id && item.id !== id ? '0.42' : '1';
      });
  };

  return { highlight };
}

function legendGridTemplate(layout: D3LegendLayout): string {
  if (layout === 'inline') {
    return 'repeat(auto-fit, minmax(7.5rem, max-content))';
  }

  if (layout === 'right') {
    return 'minmax(8rem, 1fr)';
  }

  return 'repeat(auto-fit, minmax(8rem, 1fr))';
}

function legendItemLabel(item: D3LegendItem, options: D3LegendRenderOptions): string {
  return [item.label, legendItemMeta(item, options)].filter(Boolean).join(' ');
}

function legendItemMeta(item: D3LegendItem, options: D3LegendRenderOptions): string {
  const value = item.value === undefined
    ? ''
    : (options.valueFormatter ?? defaultValueFormatter)(item.value, item);
  const percentage = item.percentage === undefined
    ? ''
    : (options.percentageFormatter ?? defaultPercentageFormatter)(item.percentage, item);

  return [value, percentage].filter(Boolean).join(' · ');
}

function defaultValueFormatter(value: string | number): string {
  return String(value);
}

function defaultPercentageFormatter(percentage: number): string {
  return `${Math.round(percentage)}%`;
}
