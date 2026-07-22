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
import {
  SimulationLinkDatum,
  SimulationNodeDatum,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
} from 'd3';

import { applySvgAccessibility, renderEmptyState } from './d3-chart-accessibility';
import { compactD3ChartLabel } from './d3-chart-formatters';
import { chartSize } from './d3-chart-scales';
import { resolveD3Theme, toneColor } from './d3-chart-theme';
import { D3ChartConfig, D3ForceGraphLink, D3ForceGraphNode } from './d3-chart.types';

interface D3ForceLayoutNode extends D3ForceGraphNode, SimulationNodeDatum {}

interface D3ForceLayoutLink extends SimulationLinkDatum<D3ForceLayoutNode> {
  readonly label?: string;
}

@Directive({
  selector: '[vlD3ForceGraph]',
  standalone: true,
})
export class D3ForceGraphDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() nodes: readonly D3ForceGraphNode[] = [];
  @Input() links: readonly D3ForceGraphLink[] = [];
  @Input() config: D3ChartConfig = {};

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private resizeObserver?: ResizeObserver;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.observeSize();
    this.render();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.viewReady) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.clear();
  }

  private render(): void {
    if (!this.isBrowser) {
      return;
    }

    this.clear();

    const host = this.elementRef.nativeElement;
    const theme = resolveD3Theme(host);
    const size = chartSize(host, this.config.height ?? 260, {
      top: 14,
      right: 14,
      bottom: 14,
      left: 14,
      ...this.config.margin,
    });
    const svg = select(host)
      .append('svg')
      .attr('class', 'd3-force-graph')
      .attr('viewBox', `0 0 ${size.width} ${size.height}`)
      .attr('width', '100%')
      .attr('height', size.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    applySvgAccessibility(svg, this.config.ariaLabel ?? 'Relationship graph');

    if (this.nodes.length === 0) {
      renderEmptyState(svg, size.width, size.height, this.config.emptyLabel ?? 'No relationship data', theme);
      return;
    }

    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const layoutNodes: D3ForceLayoutNode[] = this.nodes.map((node, index) => ({
      ...node,
      x: node.primary ? centerX : centerX + Math.cos(index) * 72,
      y: node.primary ? centerY : centerY + Math.sin(index) * 72,
      fx: node.primary ? centerX : undefined,
      fy: node.primary ? centerY : undefined,
    }));
    const knownNodeIds = new Set(layoutNodes.map((node) => node.id));
    const layoutLinks: D3ForceLayoutLink[] = this.links
      .filter((link) => knownNodeIds.has(link.source) && knownNodeIds.has(link.target))
      .map((link) => ({ source: link.source, target: link.target, label: link.label }));

    forceSimulation(layoutNodes)
      .force(
        'link',
        forceLink<D3ForceLayoutNode, D3ForceLayoutLink>(layoutLinks)
          .id((node) => node.id)
          .distance((link) => {
            const source = link.source as D3ForceLayoutNode;
            const target = link.target as D3ForceLayoutNode;
            return source.primary || target.primary ? 92 : 68;
          })
      )
      .force('charge', forceManyBody().strength(-210))
      .force('center', forceCenter(centerX, centerY))
      .force('collide', forceCollide<D3ForceLayoutNode>().radius((node) => (node.primary ? 42 : 32)))
      .stop()
      .tick(90);

    const graph = svg.append('g').attr('class', 'd3-force-graph__layout');

    graph
      .selectAll('line.d3-force-graph__link')
      .data(layoutLinks)
      .enter()
      .append('line')
      .attr('class', 'd3-force-graph__link')
      .attr('x1', (link) => ((link.source as D3ForceLayoutNode).x ?? centerX))
      .attr('y1', (link) => ((link.source as D3ForceLayoutNode).y ?? centerY))
      .attr('x2', (link) => ((link.target as D3ForceLayoutNode).x ?? centerX))
      .attr('y2', (link) => ((link.target as D3ForceLayoutNode).y ?? centerY))
      .attr('stroke', theme.axis)
      .attr('stroke-width', 1.4)
      .attr('stroke-linecap', 'round');

    const nodeGroups = graph
      .selectAll('g.d3-force-graph__node')
      .data(layoutNodes)
      .enter()
      .append('g')
      .attr('class', (node) => `d3-force-graph__node${node.primary ? ' d3-force-graph__node--primary' : ''}`)
      .attr('transform', (node) => `translate(${node.x ?? centerX}, ${node.y ?? centerY})`);

    nodeGroups
      .append('circle')
      .attr('r', (node) => (node.primary ? 33 : 25))
      .attr('fill', (node, index) => toneColor(theme, node.tone, index))
      .attr('fill-opacity', (node) => (node.primary ? 0.18 : 0.12))
      .attr('stroke', (node, index) => toneColor(theme, node.tone, index))
      .attr('stroke-width', (node) => (node.primary ? 2.4 : 1.6));

    nodeGroups
      .append('text')
      .attr('class', 'd3-force-graph__label')
      .attr('y', (node) => (node.primary ? 46 : 38))
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 11)
      .attr('font-weight', (node) => (node.primary ? 700 : 600))
      .text((node) => compactD3ChartLabel(node.label, node.primary ? 22 : 16));

    nodeGroups
      .filter((node) => Boolean(node.value))
      .append('text')
      .attr('class', 'd3-force-graph__value')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', theme.textPrimary)
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .text((node) => node.value ?? '');

    nodeGroups
      .append('title')
      .text((node) => [node.label, node.value].filter(Boolean).join(': '));
  }

  private observeSize(): void {
    if (!this.isBrowser || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  private clear(): void {
    select(this.elementRef.nativeElement).selectAll('*').remove();
  }
}
