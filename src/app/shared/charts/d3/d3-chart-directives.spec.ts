import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import {
  D3BarChartDirective,
  D3DonutChartDirective,
  D3ForceGraphDirective,
  D3LineChartDirective,
  D3ScoreChartDirective,
  D3TimelineDirective,
  D3ChartConfig,
  D3ChartDatum,
  D3ForceGraphLink,
  D3ForceGraphNode,
  D3TimelineItem,
  DonutChartSegment,
  resolveD3Theme,
} from './index';

@Component({
  standalone: true,
  imports: [
    D3DonutChartDirective,
    D3BarChartDirective,
    D3LineChartDirective,
    D3ScoreChartDirective,
    D3ForceGraphDirective,
    D3TimelineDirective,
  ],
  template: `
    <div data-testid="donut" vlD3DonutChart [segments]="donutSegments()" [size]="160" ariaLabel="Donut"></div>
    <div data-testid="bar" vlD3BarChart [data]="barData()" [config]="chartConfig"></div>
    <div data-testid="line" vlD3LineChart [data]="lineData()" [config]="chartConfig"></div>
    <div data-testid="score" vlD3ScoreChart [data]="scoreData()" [config]="chartConfig"></div>
    <div data-testid="force" vlD3ForceGraph [nodes]="graphNodes()" [links]="graphLinks()" [config]="graphConfig"></div>
    <div data-testid="timeline" vlD3Timeline [data]="timelineData()" [config]="timelineConfig"></div>
  `,
})
class D3ChartDirectiveHostComponent {
  readonly donutSegments = signal<readonly DonutChartSegment[]>([
    { label: 'Active', value: 70, tone: 'success' },
    { label: 'Review', value: 30, tone: 'warning' },
  ]);
  readonly barData = signal<readonly D3ChartDatum[]>([
    { label: 'Contracts', value: 64, displayValue: '64', tone: 'primary' },
    { label: 'Catalogs', value: 48, displayValue: '48', tone: 'info' },
  ]);
  readonly lineData = signal<readonly D3ChartDatum[]>([
    { label: 'Jan', value: 52, displayValue: '52', tone: 'info' },
    { label: 'Feb', value: 57, displayValue: '57', tone: 'success' },
  ]);
  readonly scoreData = signal<readonly D3ChartDatum[]>([
    { label: 'Quality', value: 94, displayValue: '4.7 / 5', tone: 'success' },
    { label: 'Delivery', value: 90, displayValue: '4.5 / 5', tone: 'success' },
    { label: 'Cost', value: 86, displayValue: '4.3 / 5', tone: 'info' },
  ]);
  readonly graphNodes = signal<readonly D3ForceGraphNode[]>([
    { id: 'supplier', label: 'Hilton Worldwide', tone: 'primary', primary: true },
    { id: 'contracts', label: 'Contracts', value: '48', tone: 'success' },
    { id: 'catalogs', label: 'Catalogs', value: '12', tone: 'info' },
  ]);
  readonly graphLinks = signal<readonly D3ForceGraphLink[]>([
    { source: 'supplier', target: 'contracts' },
    { source: 'supplier', target: 'catalogs' },
  ]);
  readonly timelineData = signal<readonly D3TimelineItem[]>([
    { label: 'Invited', detail: '2026-01-01', value: 1, tone: 'info' },
    { label: 'Accepted', detail: '2026-01-02', value: 2, tone: 'success' },
  ]);
  chartConfig: D3ChartConfig = {
    ariaLabel: 'Supplier chart',
    height: 180,
    emptyLabel: 'No chart data',
  };
  graphConfig: D3ChartConfig = {
    ariaLabel: 'Supplier relationships',
    height: 220,
    emptyLabel: 'No relationship data',
  };
  timelineConfig: D3ChartConfig = {
    ariaLabel: 'Membership lifecycle timeline',
    height: 170,
    emptyLabel: 'No timeline data',
  };
}

describe('shared D3 chart directives', () => {
  let fixture: ComponentFixture<D3ChartDirectiveHostComponent>;
  let host: D3ChartDirectiveHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3ChartDirectiveHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(D3ChartDirectiveHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders focused reusable SVG directives', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-testid="donut"] svg.d3-donut-chart')).not.toBeNull();
    expect(element.querySelector('[data-testid="bar"] svg.d3-bar-chart')).not.toBeNull();
    expect(element.querySelector('[data-testid="line"] svg.d3-line-chart')).not.toBeNull();
    expect(element.querySelector('[data-testid="score"] svg.d3-score-chart')).not.toBeNull();
    expect(element.querySelector('[data-testid="force"] svg.d3-force-graph')).not.toBeNull();
    expect(element.querySelector('[data-testid="timeline"] svg.d3-timeline')).not.toBeNull();
  });

  it('renders donut legend items with matching values, percentages, and theme colors', () => {
    const element = fixture.nativeElement as HTMLElement;
    const donut = element.querySelector('[data-testid="donut"]') as HTMLElement;
    const legendItems = donut.querySelectorAll<HTMLElement>('[data-testid="d3-chart-legend-item"]');
    const firstSlice = donut.querySelector<SVGPathElement>('path.d3-donut-chart__segment');
    const firstMarker = legendItems[0]?.querySelector<HTMLElement>('[data-testid="d3-chart-legend-marker"]');

    expect(legendItems.length).toBe(2);
    expect(legendItems[0].textContent).toContain('Active');
    expect(legendItems[0].textContent).toContain('70');
    expect(legendItems[0].textContent).toContain('70%');
    expect(legendItems[1].textContent).toContain('Review');
    expect(legendItems[1].textContent).toContain('30');
    expect(legendItems[1].textContent).toContain('30%');
    expect(firstMarker).not.toBeNull();
    expect(firstSlice).not.toBeNull();
    expect(firstMarker?.style.backgroundColor).toBe(firstSlice?.getAttribute('fill') ?? '');
  });

  it('omits zero-value donut legend items without crashing', async () => {
    host.donutSegments.set([
      { label: 'Empty', value: 0, tone: 'secondary' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const donut = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="donut"]') as HTMLElement;

    expect(donut.querySelector('svg.d3-donut-chart')).not.toBeNull();
    expect(donut.querySelectorAll('[data-testid="d3-chart-legend-item"]').length).toBe(0);
  });

  it('renders accessible empty states for empty data', async () => {
    host.barData.set([]);
    host.lineData.set([]);
    host.scoreData.set([]);
    host.graphNodes.set([]);
    host.graphLinks.set([]);
    host.timelineData.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No chart data');
    expect(text).toContain('No relationship data');
    expect(text).toContain('No timeline data');
  });

  it('rerenders when input data changes', async () => {
    host.barData.set([
      { label: 'Contracts', value: 96, displayValue: '96', tone: 'success' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('[data-testid="bar"] rect.d3-bar-chart__bar').length).toBe(1);
    expect(element.textContent).toContain('96');
  });

  it('cleans rendered SVG content on directive destroy', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('svg').length).toBeGreaterThan(0);
    fixture.destroy();
    expect(element.querySelectorAll('svg').length).toBe(0);
  });
});

describe('shared D3 theme resolver', () => {
  const root = document.documentElement;
  const legacySurfaceCardAlias = ['--surface', 'card'].join('-');

  afterEach(() => {
    root.removeAttribute('data-bs-theme');
    [
      '--velora-surface-card',
      '--velora-surface-muted',
      '--velora-border-subtle',
      '--velora-text-primary',
      '--velora-text-secondary',
      '--velora-text-muted',
      '--velora-accent-primary',
      '--velora-accent-secondary',
      '--velora-chart-1',
      '--velora-chart-2',
      '--velora-chart-3',
      '--velora-chart-4',
      '--velora-chart-5',
      '--velora-chart-6',
      '--velora-chart-grid',
      '--velora-chart-axis',
      '--velora-chart-label',
      '--velora-chart-tooltip-bg',
      '--velora-chart-tooltip-text',
      '--velora-chart-positive',
      '--velora-chart-warning',
      '--velora-chart-negative',
      '--velora-chart-neutral',
      legacySurfaceCardAlias,
    ].forEach((property) => root.style.removeProperty(property));
  });

  it('returns Velora values from the chart host in light mode', () => {
    const host = document.createElement('div');

    host.style.setProperty('--velora-surface-card', 'light-card');
    host.style.setProperty('--velora-surface-muted', 'light-muted');
    host.style.setProperty('--velora-border-subtle', 'light-border');
    host.style.setProperty('--velora-text-primary', 'light-primary-text');
    host.style.setProperty('--velora-text-secondary', 'light-secondary-text');
    host.style.setProperty('--velora-text-muted', 'light-muted-text');
    host.style.setProperty('--velora-accent-primary', 'light-accent-primary');
    host.style.setProperty('--velora-accent-secondary', 'light-accent-secondary');
    host.style.setProperty('--velora-chart-1', 'light-chart-1');
    host.style.setProperty('--velora-chart-2', 'light-chart-2');
    host.style.setProperty('--velora-chart-3', 'light-chart-3');
    host.style.setProperty('--velora-chart-4', 'light-chart-4');
    host.style.setProperty('--velora-chart-5', 'light-chart-5');
    host.style.setProperty('--velora-chart-6', 'light-chart-6');
    host.style.setProperty('--velora-chart-grid', 'light-grid');
    host.style.setProperty('--velora-chart-axis', 'light-axis');
    host.style.setProperty('--velora-chart-label', 'light-label');
    host.style.setProperty('--velora-chart-tooltip-bg', 'light-tooltip-bg');
    host.style.setProperty('--velora-chart-tooltip-text', 'light-tooltip-text');
    host.style.setProperty('--velora-chart-positive', 'light-positive');
    host.style.setProperty('--velora-chart-warning', 'light-warning');
    host.style.setProperty('--velora-chart-negative', 'light-negative');
    host.style.setProperty('--velora-chart-neutral', 'light-neutral');

    const theme = resolveD3Theme(host);

    expect(theme.surfaceCard).toBe('light-card');
    expect(theme.chartPalette).toEqual([
      'light-chart-1',
      'light-chart-2',
      'light-chart-3',
      'light-chart-4',
      'light-chart-5',
      'light-chart-6',
    ]);
    expect(theme.grid).toBe('light-grid');
    expect(theme.axis).toBe('light-axis');
    expect(theme.label).toBe('light-label');
    expect(theme.positive).toBe('light-positive');
    expect(theme.warning).toBe('light-warning');
    expect(theme.negative).toBe('light-negative');
    expect(theme.neutral).toBe('light-neutral');
  });

  it('falls back to document root Velora values in dark mode', () => {
    root.setAttribute('data-bs-theme', 'dark');
    root.style.setProperty('--velora-surface-card', 'dark-card');
    root.style.setProperty('--velora-surface-muted', 'dark-muted');
    root.style.setProperty('--velora-border-subtle', 'dark-border');
    root.style.setProperty('--velora-text-primary', 'dark-primary-text');
    root.style.setProperty('--velora-text-secondary', 'dark-secondary-text');
    root.style.setProperty('--velora-text-muted', 'dark-muted-text');
    root.style.setProperty('--velora-accent-primary', 'dark-accent-primary');
    root.style.setProperty('--velora-accent-secondary', 'dark-accent-secondary');
    root.style.setProperty('--velora-chart-1', 'dark-chart-1');
    root.style.setProperty('--velora-chart-2', 'dark-chart-2');
    root.style.setProperty('--velora-chart-3', 'dark-chart-3');
    root.style.setProperty('--velora-chart-4', 'dark-chart-4');
    root.style.setProperty('--velora-chart-5', 'dark-chart-5');
    root.style.setProperty('--velora-chart-6', 'dark-chart-6');
    root.style.setProperty('--velora-chart-grid', 'dark-grid');
    root.style.setProperty('--velora-chart-axis', 'dark-axis');
    root.style.setProperty('--velora-chart-label', 'dark-label');
    root.style.setProperty('--velora-chart-tooltip-bg', 'dark-tooltip-bg');
    root.style.setProperty('--velora-chart-tooltip-text', 'dark-tooltip-text');
    root.style.setProperty('--velora-chart-positive', 'dark-positive');
    root.style.setProperty('--velora-chart-warning', 'dark-warning');
    root.style.setProperty('--velora-chart-negative', 'dark-negative');
    root.style.setProperty('--velora-chart-neutral', 'dark-neutral');

    const theme = resolveD3Theme(document.createElement('div'));

    expect(theme.surfaceCard).toBe('dark-card');
    expect(theme.chartPalette[0]).toBe('dark-chart-1');
    expect(theme.grid).toBe('dark-grid');
    expect(theme.axis).toBe('dark-axis');
    expect(theme.tooltipBg).toBe('dark-tooltip-bg');
    expect(theme.tooltipText).toBe('dark-tooltip-text');
  });

  it('updates chart palette values when theme variables change', () => {
    const host = document.createElement('div');

    host.style.setProperty('--velora-chart-1', 'light-chart-one');
    const lightTheme = resolveD3Theme(host);
    host.style.setProperty('--velora-chart-1', 'dark-chart-one');
    const darkTheme = resolveD3Theme(host);

    expect(lightTheme.chartPalette[0]).toBe('light-chart-one');
    expect(darkTheme.chartPalette[0]).toBe('dark-chart-one');
  });

  it('keeps compatibility aliases usable for legacy consumers', () => {
    const probe = document.createElement('div');

    root.style.setProperty('--velora-surface-card', 'rgb(1, 2, 3)');
    root.style.setProperty(legacySurfaceCardAlias, 'var(--velora-surface-card)');
    probe.style.backgroundColor = `var(${legacySurfaceCardAlias})`;
    document.body.appendChild(probe);

    expect(getComputedStyle(probe).backgroundColor).toBe('rgb(1, 2, 3)');
    probe.remove();
  });
});
