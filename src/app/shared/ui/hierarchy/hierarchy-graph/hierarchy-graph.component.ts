import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  drag,
  select,
  zoom,
  zoomIdentity,
} from 'd3';
import type {
  D3DragEvent,
  D3ZoomEvent,
  Selection,
  ZoomBehavior,
  ZoomTransform,
} from 'd3';
import {
  HierarchyGraphLink,
  HierarchyGraphNode,
  HierarchyTone,
} from '../hierarchy.types';

interface PositionedNode extends HierarchyGraphNode {
  x: number;
  y: number;
}

interface PositionedLink {
  readonly source: PositionedNode;
  readonly target: PositionedNode;
}

interface GraphLegendItem {
  readonly labelKey: string;
  readonly level: number;
  readonly tone: HierarchyTone;
}

interface MiniMapNode extends HierarchyGraphNode {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
  readonly selected: boolean;
}

interface MiniMapLink {
  readonly source: MiniMapNode;
  readonly target: MiniMapNode;
  readonly active: boolean;
}

type LayoutDirection = 'auto' | 'ltr' | 'rtl';

@Component({
  selector: 'vl-hierarchy-graph',
  standalone: true,
  imports: [VeloraIconComponent, TranslateModule],
  templateUrl: './hierarchy-graph.component.html',
  styleUrls: ['./hierarchy-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyGraphComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('graphHost', { static: true })
  private readonly graphHost?: ElementRef<HTMLDivElement>;

  readonly nodes = input<readonly HierarchyGraphNode[]>([]);
  readonly links = input<readonly HierarchyGraphLink[]>([]);
  readonly selectedNodeId = input<string | undefined>();
  readonly height = input<number>(520);
  readonly ariaLabel = input<string>('Scope hierarchy graph');
  readonly showControls = input<boolean>(true);
  readonly showLegend = input<boolean>(true);
  readonly showMiniMap = input<boolean>(true);
  readonly dragEnabled = input<boolean>(true);
  readonly layoutDirection = input<LayoutDirection>('auto');

  readonly nodeSelected = output<HierarchyGraphNode>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private viewReady = false;
  private zoomBehavior?: ZoomBehavior<SVGSVGElement, unknown>;
  private svgSelection?: Selection<SVGSVGElement, unknown, null, undefined>;
  private rootSelection?: Selection<SVGGElement, unknown, null, undefined>;
  private currentZoomTransform: ZoomTransform = zoomIdentity;

  readonly isExpanded = signal(false);
  readonly isLegendVisible = signal(false);
  readonly isMiniMapVisible = signal(true);
  readonly nodesLocked = signal(false);

  readonly legendItems: readonly GraphLegendItem[] = [
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level0',
      level: 0,
      tone: 'primary',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level1',
      level: 1,
      tone: 'info',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level2',
      level: 2,
      tone: 'primary',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level3',
      level: 3,
      tone: 'success',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level4',
      level: 4,
      tone: 'warning',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level5',
      level: 5,
      tone: 'danger',
    },
    {
      labelKey: 'workspace.scopeHierarchyExplorer.graph.legend.level6',
      level: 6,
      tone: 'primary',
    },
  ];

  readonly miniMapNodes = computed<readonly MiniMapNode[]>(() => {
    const activeIds = this.getActiveNodeIds(this.selectedNodeId());
    const selectedId = this.selectedNodeId();
    const nodes = [...this.nodes()];
    const isRtl = this.isRtlLayout();
    const levels = Array.from(new Set(nodes.map((node) => node.level))).sort(
      (a, b) => a - b
    );
    const width = 160;
    const height = 88;
    const columnGap = levels.length > 1 ? width / (levels.length - 1) : 0;

    return nodes.map((node) => {
      const column = levels.indexOf(node.level);
      const siblings = nodes.filter((candidate) => candidate.level === node.level);
      const siblingIndex = siblings.findIndex((candidate) => candidate.id === node.id);

      return {
        ...node,
        x: isRtl ? width - column * columnGap : column * columnGap,
        y: ((siblingIndex + 1) * height) / (siblings.length + 1),
        active: activeIds.has(node.id),
        selected: selectedId === node.id,
      };
    });
  });

  readonly miniMapLinks = computed<readonly MiniMapLink[]>(() => {
    const nodeById = new Map(this.miniMapNodes().map((node) => [node.id, node]));

    return this.links()
      .map((link) => ({
        source: nodeById.get(link.source),
        target: nodeById.get(link.target),
      }))
      .filter(
        (link): link is { source: MiniMapNode; target: MiniMapNode } =>
          Boolean(link.source && link.target)
      )
      .map((link) => ({
        ...link,
        active: link.source.active && link.target.active,
      }));
  });

  constructor() {
    effect(() => {
      this.nodes();
      this.links();
      this.height();
      this.isExpanded();
      this.nodesLocked();
      this.dragEnabled();
      this.layoutDirection();

      if (this.viewReady) {
        queueMicrotask(() => this.render());
      }
    });

    effect(() => {
      this.selectedNodeId();

      if (this.viewReady) {
        queueMicrotask(() => this.updateSelectionState());
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private render(): void {
    if (!this.isBrowser || !this.graphHost?.nativeElement) {
      return;
    }

    const host = this.graphHost.nativeElement;
    const isRtl = this.isRtlLayout(host);
    const levelCount = this.getLevelCount();
    const width = Math.max(
      host.clientWidth || 900,
      980,
      220 + levelCount * 170
    );
    const height = this.getGraphHeight();
    const positionedNodes = this.positionNodes(width, height, isRtl).map((node) => ({
      ...node,
    }));
    const nodeById = new Map(positionedNodes.map((node) => [node.id, node]));

    this.clear();

    const svg = select(host)
      .append('svg')
      .attr('class', 'hierarchy-graph-svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', isRtl ? 'xMaxYMin meet' : 'xMinYMin meet')
      .attr('width', '100%')
      .attr('height', height)
      .attr('dir', isRtl ? 'rtl' : 'ltr')
      .attr('role', 'img')
      .attr('aria-label', this.ariaLabel());

    const root = svg.append('g').attr('class', 'hierarchy-graph-root');

    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> =
      zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.72, 1.7])
        .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
          this.currentZoomTransform = event.transform;
          root.attr('transform', event.transform.toString());
        });

    svg.call(zoomBehavior);
    this.svgSelection = svg;
    this.zoomBehavior = zoomBehavior;
    this.rootSelection = root;

    const linkSelection = this.drawLinks(root, nodeById, isRtl);
    this.drawNodes(root, positionedNodes, linkSelection, width, height, isRtl);

    if (this.currentZoomTransform !== zoomIdentity) {
      svg.call(zoomBehavior.transform, this.currentZoomTransform);
    }
  }

  private drawLinks(
    root: Selection<SVGGElement, unknown, null, undefined>,
    nodeById: ReadonlyMap<string, PositionedNode>,
    isRtl: boolean
  ): Selection<SVGPathElement, PositionedLink, SVGGElement, unknown> {
    const links = this.links()
      .map((link) => ({
        source: nodeById.get(link.source),
        target: nodeById.get(link.target),
      }))
      .filter(
        (link): link is { source: PositionedNode; target: PositionedNode } =>
          Boolean(link.source && link.target)
      );
    const activeIds = this.getActiveNodeIds(this.selectedNodeId());

    return root
      .append('g')
      .attr('class', 'hierarchy-graph-links')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('class', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id)
          ? 'hierarchy-graph-link hierarchy-graph-link-active'
          : 'hierarchy-graph-link hierarchy-graph-link-muted'
      )
      .attr('d', (link) => this.getLinkPath(link, isRtl))
      .attr('fill', 'none')
      .attr('stroke', (link) =>
        this.getToneColor(this.getLevelTone(link.target.level))
      )
      .attr('stroke-opacity', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id) ? 0.92 : 0.62
      )
      .attr('stroke-width', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id) ? 2.35 : 1.7
      )
      .attr('stroke-dasharray', '0');
  }

  private drawNodes(
    root: Selection<SVGGElement, unknown, null, undefined>,
    nodes: readonly PositionedNode[],
    linkSelection: Selection<SVGPathElement, PositionedLink, SVGGElement, unknown>,
    width: number,
    height: number,
    isRtl: boolean
  ): void {
    const selectedId = this.selectedNodeId();
    const activeIds = this.getActiveNodeIds(selectedId);
    const nodeWidth = 146;
    const nodeHeight = 66;
    const isDragEnabled = this.dragEnabled() && !this.nodesLocked();

    const groups = root
      .append('g')
      .attr('class', 'hierarchy-graph-nodes')
      .selectAll<SVGGElement, PositionedNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', (node) =>
        node.id === selectedId
          ? 'hierarchy-graph-node hierarchy-graph-node-active'
          : activeIds.has(node.id)
            ? 'hierarchy-graph-node hierarchy-graph-node-path'
          : 'hierarchy-graph-node'
      )
      .attr(
        'transform',
        (node) => `translate(${node.x - nodeWidth / 2}, ${node.y - nodeHeight / 2})`
      )
      .attr('data-node-id', (node) => node.id)
      .attr('data-draggable', String(isDragEnabled))
      .attr('tabindex', '0')
      .attr('role', 'button')
      .attr('aria-label', (node) => `${node.label}, ${node.type}`)
      .on('click', (_event, node) => this.nodeSelected.emit(node))
      .on('keydown', (event, node) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.nodeSelected.emit(node);
        }
      });

    groups
      .append('rect')
      .attr('class', 'hierarchy-graph-node-ring')
      .attr('x', -7)
      .attr('y', -7)
      .attr('width', nodeWidth + 14)
      .attr('height', nodeHeight + 14)
      .attr('rx', 12)
      .attr('fill', 'none')
      .attr('stroke', (node) => this.getToneColor(this.getLevelTone(node.level)))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 4')
      .attr('opacity', (node) => (node.id === selectedId ? 0.5 : 0));

    groups
      .append('rect')
      .attr('class', 'hierarchy-graph-node-card')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .attr('fill', (node) => this.getToneSubtleColor(this.getLevelTone(node.level)))
      .attr('stroke', (node) => this.getToneColor(this.getLevelTone(node.level)))
      .attr('stroke-width', (node) => (node.id === selectedId ? 2.75 : 1.25))
      .attr('opacity', (node) => (activeIds.has(node.id) ? 1 : 0.72));

    groups
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', 17)
      .attr('text-anchor', 'middle')
      .attr('class', 'hierarchy-graph-node-type')
      .text((node) => this.truncateLabel(node.type, 22));

    groups
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('class', 'hierarchy-graph-node-label')
      .text((node) => this.truncateLabel(node.label, 20));

    groups
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', 53)
      .attr('text-anchor', 'middle')
      .attr('class', 'hierarchy-graph-node-count')
      .text((node) => this.truncateLabel(`${node.count ?? node.type}`, 22));

    groups
      .append('title')
      .text((node) => `${node.label} - ${node.type}`);

    if (isDragEnabled) {
      groups.call(
        drag<SVGGElement, PositionedNode>()
          .on('start', function () {
            select(this).classed('hierarchy-graph-node-dragging', true);
          })
          .on(
            'drag',
            (
              event: D3DragEvent<SVGGElement, PositionedNode, PositionedNode>,
              node
            ) => {
              node.x = this.clamp(event.x, nodeWidth / 2, width - nodeWidth / 2);
              node.y = this.clamp(event.y, nodeHeight / 2, height - nodeHeight / 2);
              select(event.sourceEvent.currentTarget as SVGGElement).attr(
                'transform',
                `translate(${node.x - nodeWidth / 2}, ${node.y - nodeHeight / 2})`
              );
              linkSelection.attr('d', (link) => this.getLinkPath(link, isRtl));
            }
          )
          .on('end', function () {
            select(this).classed('hierarchy-graph-node-dragging', false);
          })
      );
    }
  }

  zoomIn(): void {
    this.applyScale(1.18);
  }

  zoomOut(): void {
    this.applyScale(0.84);
  }

  fitToView(): void {
    const transform = this.getFitTransform();

    this.applyTransform(transform);
  }

  resetView(): void {
    this.applyTransform(zoomIdentity);
  }

  toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }

  toggleLegendVisibility(): void {
    this.isLegendVisible.update((value) => !value);
  }

  toggleMiniMapVisibility(): void {
    this.isMiniMapVisible.update((value) => !value);
  }

  toggleNodeLock(): void {
    this.nodesLocked.update((value) => !value);
  }

  getLevelTone(level: number): HierarchyTone {
    return this.legendItems.find((item) => item.level === level)?.tone ?? 'secondary';
  }

  getLevelToneColor(level: number): string {
    return this.getToneColor(this.getLevelTone(level));
  }

  private positionNodes(
    width: number,
    height: number,
    isRtl: boolean
  ): readonly PositionedNode[] {
    const nodes = [...this.nodes()];
    const levels = Array.from(new Set(nodes.map((node) => node.level))).sort(
      (a, b) => a - b
    );
    const leftPadding = 96;
    const rightPadding = 96;
    const topPadding = 34;
    const bottomPadding = 78;
    const usableWidth = Math.max(1, width - leftPadding - rightPadding);
    const usableHeight = Math.max(1, height - topPadding - bottomPadding);
    const columnGap = levels.length > 1 ? usableWidth / (levels.length - 1) : 0;

    return nodes.map((node) => {
      const column = levels.indexOf(node.level);
      const siblings = nodes.filter((candidate) => candidate.level === node.level);
      const siblingIndex = siblings.findIndex((candidate) => candidate.id === node.id);
      const siblingGap =
        siblings.length > 1 ? usableHeight / (siblings.length - 1) : 0;
      const ltrX = leftPadding + column * columnGap;
      const x = isRtl ? width - ltrX : ltrX;
      const y =
        siblings.length > 1
          ? topPadding + siblingIndex * siblingGap
          : topPadding + usableHeight / 2;

      return { ...node, x, y };
    });
  }

  private getToneColor(tone: HierarchyTone): string {
    return `var(--bs-${tone})`;
  }

  private getToneSubtleColor(tone: HierarchyTone): string {
    return `var(--bs-${tone}-light, var(--bs-light-${tone}))`;
  }

  private getGraphHeight(): number {
    const deepHierarchyHeight = 160 + this.getMaxLevelNodeCount() * 74;

    if (this.isExpanded() && this.isBrowser) {
      return Math.max(window.innerHeight - 120, this.height(), deepHierarchyHeight);
    }

    return Math.max(this.height(), deepHierarchyHeight, 360);
  }

  private getMaxLevelNodeCount(): number {
    const nodes = this.nodes();
    const countsByLevel = new Map<number, number>();

    for (const node of nodes) {
      countsByLevel.set(node.level, (countsByLevel.get(node.level) ?? 0) + 1);
    }

    return Math.max(1, ...countsByLevel.values());
  }

  private getLevelCount(): number {
    return new Set(this.nodes().map((node) => node.level)).size;
  }

  private truncateLabel(label: string, maxLength: number): string {
    if (label.length <= maxLength) {
      return label;
    }

    return `${label.slice(0, Math.max(0, maxLength - 3))}...`;
  }

  private getLinkPath(link: PositionedLink, isRtl: boolean): string {
    const sourceX = link.source.x + (isRtl ? -73 : 73);
    const targetX = link.target.x + (isRtl ? 73 : -73);
    const midX = sourceX + (targetX - sourceX) / 2;

    return [
      `M ${sourceX} ${link.source.y}`,
      `C ${midX} ${link.source.y}, ${midX} ${link.target.y}, ${targetX} ${link.target.y}`,
    ].join(' ');
  }

  private isRtlLayout(host?: HTMLElement): boolean {
    const direction = this.layoutDirection();

    if (direction !== 'auto') {
      return direction === 'rtl';
    }

    if (!this.isBrowser) {
      return false;
    }

    const hostDirection = host ? getComputedStyle(host).direction : '';
    const documentDirection =
      document.documentElement.getAttribute('dir') ??
      document.body?.getAttribute('dir') ??
      '';

    return hostDirection === 'rtl' || documentDirection.toLowerCase() === 'rtl';
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getActiveNodeIds(selectedId: string | undefined): ReadonlySet<string> {
    if (!selectedId) {
      return new Set();
    }

    const active = new Set<string>([selectedId]);
    let currentId: string | undefined = selectedId;

    while (currentId) {
      const parentLink = this.links().find((link) => link.target === currentId);

      if (!parentLink || active.has(parentLink.source)) {
        break;
      }

      active.add(parentLink.source);
      currentId = parentLink.source;
    }

    return active;
  }

  private applyScale(scale: number): void {
    if (!this.svgSelection || !this.zoomBehavior) {
      return;
    }

    this.svgSelection.call(this.zoomBehavior.scaleBy, scale);
  }

  private applyTransform(transform: ZoomTransform): void {
    if (!this.svgSelection || !this.zoomBehavior) {
      return;
    }

    this.svgSelection.call(this.zoomBehavior.transform, transform);
  }

  private updateSelectionState(): void {
    if (!this.isBrowser || !this.graphHost?.nativeElement) {
      return;
    }

    const selectedId = this.selectedNodeId();
    const activeIds = this.getActiveNodeIds(selectedId);
    const host = select(this.graphHost.nativeElement);

    host
      .selectAll<SVGGElement, PositionedNode>('.hierarchy-graph-node')
      .attr('class', (node) =>
        node.id === selectedId
          ? 'hierarchy-graph-node hierarchy-graph-node-active'
          : activeIds.has(node.id)
            ? 'hierarchy-graph-node hierarchy-graph-node-path'
            : 'hierarchy-graph-node'
      );

    host
      .selectAll<SVGRectElement, PositionedNode>('.hierarchy-graph-node-ring')
      .attr('stroke', (node) => this.getToneColor(this.getLevelTone(node.level)))
      .attr('opacity', (node) => (node.id === selectedId ? 0.5 : 0));

    host
      .selectAll<SVGRectElement, PositionedNode>('.hierarchy-graph-node-card')
      .attr('stroke-width', (node) => (node.id === selectedId ? 2.75 : 1.25))
      .attr('opacity', (node) => (activeIds.has(node.id) ? 1 : 0.72));

    host
      .selectAll<SVGPathElement, PositionedLink>('.hierarchy-graph-link')
      .attr('class', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id)
          ? 'hierarchy-graph-link hierarchy-graph-link-active'
          : 'hierarchy-graph-link hierarchy-graph-link-muted'
      )
      .attr('stroke-opacity', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id) ? 0.92 : 0.62
      )
      .attr('stroke-width', (link) =>
        activeIds.has(link.source.id) && activeIds.has(link.target.id) ? 2.35 : 1.7
      );
  }

  private getFitTransform(): ZoomTransform {
    const svg = this.svgSelection?.node();
    const root = this.rootSelection?.node();

    if (!svg || !root) {
      return zoomIdentity;
    }

    const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) ?? [];
    const viewBoxWidth = viewBox[2] || svg.clientWidth || 980;
    const viewBoxHeight = viewBox[3] || this.getGraphHeight();
    const bounds = root.getBBox();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return zoomIdentity;
    }

    const padding = 32;
    const scale = this.clamp(
      Math.min(
        (viewBoxWidth - padding * 2) / bounds.width,
        (viewBoxHeight - padding * 2) / bounds.height
      ),
      0.72,
      1.7
    );
    const x = (viewBoxWidth - bounds.width * scale) / 2 - bounds.x * scale;
    const y = (viewBoxHeight - bounds.height * scale) / 2 - bounds.y * scale;

    return zoomIdentity.translate(x, y).scale(scale);
  }

  private clear(): void {
    if (this.graphHost?.nativeElement) {
      select(this.graphHost.nativeElement).selectAll('*').remove();
    }
  }
}
