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
import { hierarchy, pointer, select } from 'd3';
import type {
  HierarchyNode as D3HierarchyNode,
  Selection,
} from 'd3';
import { HierarchyNode, HierarchyTone } from '../hierarchy.types';

interface TreeRenderNode extends HierarchyNode {
  readonly collapsed?: boolean;
  readonly hasChildren?: boolean;
  readonly children?: readonly TreeRenderNode[];
}

interface OutlineNode {
  readonly d3Node: D3HierarchyNode<TreeRenderNode>;
  readonly data: TreeRenderNode;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
}

interface OutlineLink {
  readonly source: OutlineNode;
  readonly target: OutlineNode;
}

type LayoutDirection = 'auto' | 'ltr' | 'rtl';

@Component({
  selector: 'vl-hierarchy-tree',
  standalone: true,
  imports: [VeloraIconComponent, TranslateModule],
  templateUrl: './hierarchy-tree.component.html',
  styleUrls: ['./hierarchy-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyTreeComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('treeHost', { static: true })
  private readonly treeHost?: ElementRef<HTMLDivElement>;

  readonly nodes = input<readonly HierarchyNode[]>([]);
  readonly selectedNodeId = input<string | undefined>();
  readonly searchPlaceholderKey = input<string>(
    'workspace.scopeHierarchyExplorer.tree.searchPlaceholder'
  );
  readonly showSearch = input<boolean>(true);
  readonly treeMinHeight = input<number>(360);
  readonly layoutDirection = input<LayoutDirection>('auto');

  readonly nodeSelected = output<HierarchyNode>();

  readonly searchQuery = signal('');
  readonly collapsedNodeIds = signal<ReadonlySet<string>>(new Set());
  readonly visibleNodes = computed<readonly TreeRenderNode[]>(() => {
    const query = this.normalizedSearchQuery();
    const collapsedIds = query ? new Set<string>() : this.collapsedNodeIds();
    const nodes = this.nodes().map((node) => this.cloneNode(node, collapsedIds));

    if (!query) {
      return nodes;
    }

    return this.filterNodes(nodes, query);
  });

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private viewReady = false;

  constructor() {
    effect(() => {
      this.visibleNodes();
      this.selectedNodeId();
      this.treeMinHeight();
      this.layoutDirection();
      this.collapsedNodeIds();

      if (this.viewReady) {
        queueMicrotask(() => this.render());
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

  searchTree(query: string): void {
    this.searchQuery.set(query);
  }

  onSearchInput(event: Event): void {
    const target = event.target;
    this.searchTree(target instanceof HTMLInputElement ? target.value : '');
  }

  private render(): void {
    if (!this.isBrowser || !this.treeHost?.nativeElement) {
      return;
    }

    const host = this.treeHost.nativeElement;
    const rootData = this.toRenderRoot(this.visibleNodes());
    const isRtl = this.isRtlLayout(host);

    this.clear();

    if (!rootData) {
      select(host)
        .append('div')
        .attr('class', 'hierarchy-tree-empty p-8 text-center fs-8 text-muted')
        .text('No matching nodes');
      return;
    }

    const layoutRoot = hierarchy<TreeRenderNode>(
      rootData,
      (node) => node.children ? [...node.children] : undefined
    );
    const rowHeight = 32;
    const topPadding = 28;
    const leftPadding = 24;
    const indentWidth = 34;
    const descendants: D3HierarchyNode<TreeRenderNode>[] = [];
    layoutRoot.eachBefore((node) => descendants.push(node));
    const maxDepth = Math.max(0, ...descendants.map((node) => node.depth));
    const width = Math.max(
      host.clientWidth || 900,
      leftPadding + maxDepth * indentWidth + 420
    );
    const nodes = descendants.map((node, index) => ({
      d3Node: node,
      data: node.data,
      depth: node.depth,
      x: isRtl
        ? width - leftPadding - node.depth * indentWidth
        : leftPadding + node.depth * indentWidth,
      y: topPadding + index * rowHeight,
    }));
    const nodeById = new Map(nodes.map((node) => [node.data.id, node]));
    const links = layoutRoot.links()
      .map((link) => ({
        source: nodeById.get(link.source.data.id),
        target: nodeById.get(link.target.data.id),
      }))
      .filter(
        (link): link is OutlineLink => Boolean(link.source && link.target)
      );
    const height = Math.max(
      this.treeMinHeight(),
      topPadding * 2 + Math.max(0, nodes.length - 1) * rowHeight + 24
    );
    const activeIds = this.getActiveNodeIds();

    const svg = select(host)
      .append('svg')
      .attr('class', 'hierarchy-tree-svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', isRtl ? 'xMaxYMin meet' : 'xMinYMin meet')
      .attr('width', '100%')
      .attr('height', height)
      .attr('dir', isRtl ? 'rtl' : 'ltr')
      .attr('role', 'img')
      .attr('aria-label', 'Hierarchy tree');

    const root = svg.append('g').attr('class', 'hierarchy-tree-root');

    this.drawLinks(root, links, activeIds, isRtl);
    this.drawNodes(root, nodes, activeIds, width, isRtl);
  }

  private drawLinks(
    root: Selection<SVGGElement, unknown, null, undefined>,
    links: readonly OutlineLink[],
    activeIds: ReadonlySet<string>,
    isRtl: boolean
  ): void {
    root
      .append('g')
      .attr('class', 'hierarchy-tree-links')
      .selectAll<SVGPathElement, OutlineLink>('path')
      .data(links)
      .enter()
      .append('path')
      .attr('class', (link) =>
        activeIds.has(link.source.data.id) && activeIds.has(link.target.data.id)
          ? 'hierarchy-tree-link hierarchy-tree-link-active'
          : 'hierarchy-tree-link'
      )
      .attr('d', (link) => this.getOutlineLinkPath(link, isRtl))
      .attr('fill', 'none')
      .attr('stroke', (link) =>
        this.getToneColor(this.getLevelTone(link.target.data.level))
      )
      .attr('stroke-opacity', (link) =>
        activeIds.has(link.source.data.id) && activeIds.has(link.target.data.id)
          ? 0.92
          : 0.56
      )
      .attr('stroke-width', (link) =>
        activeIds.has(link.source.data.id) && activeIds.has(link.target.data.id)
          ? 2.25
          : 1.55
      );
  }

  private drawNodes(
    root: Selection<SVGGElement, unknown, null, undefined>,
    nodes: readonly OutlineNode[],
    activeIds: ReadonlySet<string>,
    width: number,
    isRtl: boolean
  ): void {
    const selectedId = this.selectedNodeId();
    const rowHeight = 30;
    const toggleX = isRtl ? 18 : -18;
    const toggleHitboxX = isRtl ? 6 : -30;
    const checkboxX = isRtl ? -14 : 0;
    const labelX = isRtl ? -24 : 24;
    const labelAnchor = 'start';
    const groups = root
      .append('g')
      .attr('class', 'hierarchy-tree-nodes')
      .selectAll<SVGGElement, OutlineNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', (node) =>
        node.data.id === selectedId
          ? 'hierarchy-tree-node hierarchy-tree-outline-row hierarchy-tree-node-selected'
          : activeIds.has(node.data.id)
            ? 'hierarchy-tree-node hierarchy-tree-outline-row hierarchy-tree-node-path'
            : 'hierarchy-tree-node hierarchy-tree-outline-row'
      )
      .attr('data-node-id', (node) => node.data.id)
      .attr('tabindex', '0')
      .attr('role', 'button')
      .attr('aria-expanded', (node) =>
        node.data.hasChildren ? String(!node.data.collapsed) : null
      )
      .attr('aria-label', (node) => `${node.data.label}, ${node.data.type}`)
      .attr('transform', (node) => `translate(${node.x}, ${node.y})`)
      .on('click', (event, node) => {
        if (
          node.data.hasChildren &&
          this.isTogglePointerEvent(event, isRtl)
        ) {
          event.stopPropagation();
          this.toggleNodeCollapsed(node.data);
          return;
        }

        this.selectNode(node.data);
      })
      .on('keydown', (event, node) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.selectNode(node.data);
        }
      });

    groups
      .append('rect')
      .attr('class', 'hierarchy-tree-row-hitbox')
      .attr('x', (node) =>
        isRtl ? -Math.max(260, node.x - 26) + 20 : -20
      )
      .attr('y', -rowHeight / 2)
      .attr('width', (node) =>
        isRtl ? Math.max(260, node.x - 26) : Math.max(260, width - node.x - 26)
      )
      .attr('height', rowHeight)
      .attr('rx', 6);

    groups
      .filter((node) => Boolean(node.data.hasChildren))
      .append('rect')
      .attr('class', 'hierarchy-tree-toggle-hitbox')
      .attr('x', toggleHitboxX)
      .attr('y', -12)
      .attr('width', 24)
      .attr('height', 24)
      .attr('rx', 4)
      .on('click', (event, node) => {
        event.stopPropagation();
        this.toggleNodeCollapsed(node.data);
      });

    groups
      .append('text')
      .attr('class', 'hierarchy-tree-toggle')
      .attr('x', toggleX)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .text((node) =>
        node.data.hasChildren ? (node.data.collapsed ? '+' : '-') : ''
      );

    groups
      .append('rect')
      .attr('class', (node) =>
        node.data.id === selectedId
          ? 'hierarchy-tree-node-icon hierarchy-tree-node-icon-selected'
          : activeIds.has(node.data.id)
            ? 'hierarchy-tree-node-icon hierarchy-tree-node-icon-path'
            : 'hierarchy-tree-node-icon'
      )
      .attr('x', checkboxX)
      .attr('y', -7)
      .attr('width', 14)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', (node) =>
        activeIds.has(node.data.id)
          ? this.getToneSubtleColor(this.getLevelTone(node.data.level))
          : 'var(--bs-body-bg)'
      )
      .attr('stroke', (node) => this.getToneColor(this.getLevelTone(node.data.level)))
      .attr('stroke-width', (node) => (node.data.id === selectedId ? 2 : 1));

    groups
      .filter((node) => activeIds.has(node.data.id))
      .append('path')
      .attr('class', 'hierarchy-tree-checkmark')
      .attr('stroke', (node) => this.getToneColor(this.getLevelTone(node.data.level)))
      .attr('d', () =>
        [
          `M ${checkboxX + 3} -1`,
          `L ${checkboxX + 6} 3`,
          `L ${checkboxX + 11} -4`,
        ].join(' ')
      );

    groups
      .append('text')
      .attr('x', labelX)
      .attr('y', 5)
      .attr('class', 'hierarchy-tree-node-label')
      .attr('text-anchor', labelAnchor)
      .text((node) => this.formatNodeText(node.data));

    groups
      .append('title')
      .text((node) => `${node.data.label} - ${node.data.type}`);
  }

  private selectNode(node: HierarchyNode): void {
    const selected = this.findNodeById(node.id) ?? node;
    this.nodeSelected.emit(selected);
  }

  private toRenderRoot(nodes: readonly TreeRenderNode[]): TreeRenderNode | undefined {
    if (nodes.length === 0) {
      return undefined;
    }

    if (nodes.length === 1) {
      return nodes[0];
    }

    return {
      id: '__hierarchy-root__',
      label: 'Hierarchy',
      type: 'Root',
      level: 0,
      count: nodes.length,
      expanded: true,
      hasChildren: true,
      children: nodes,
    };
  }

  private cloneNode(
    node: HierarchyNode,
    collapsedIds: ReadonlySet<string>
  ): TreeRenderNode {
    const children = node.children?.map((child) =>
      this.cloneNode(child, collapsedIds)
    );
    const hasChildren = Boolean(children?.length);
    const collapsed = hasChildren && collapsedIds.has(node.id);

    return {
      ...node,
      hasChildren,
      collapsed,
      children: hasChildren && !collapsed ? children : undefined,
    };
  }

  private filterNodes(
    nodes: readonly TreeRenderNode[],
    query: string
  ): readonly TreeRenderNode[] {
    const result: TreeRenderNode[] = [];

    for (const node of nodes) {
      const children = node.children ? this.filterNodes(node.children, query) : [];
      const matches = this.nodeMatchesQuery(node, query);

      if (!matches && children.length === 0) {
        continue;
      }

      result.push(
        children.length > 0
          ? { ...node, children }
          : this.withoutChildren(node)
      );
    }

    return result;
  }

  private withoutChildren(node: TreeRenderNode): TreeRenderNode {
    const { children: _children, ...rest } = node;

    return rest;
  }

  private nodeMatchesQuery(node: HierarchyNode, query: string): boolean {
    return [node.id, node.label, node.type, String(node.count ?? '')]
      .join(' ')
      .toLowerCase()
      .includes(query);
  }

  private normalizedSearchQuery(): string {
    return this.searchQuery().trim().toLowerCase();
  }

  private getActiveNodeIds(): ReadonlySet<string> {
    const selectedId = this.selectedNodeId();

    if (!selectedId) {
      return new Set();
    }

    const path = this.findNodePath(this.nodes(), selectedId);

    return new Set(path.map((node) => node.id));
  }

  private getOutlineLinkPath(link: OutlineLink, isRtl: boolean): string {
    const sourceX = link.source.x + (isRtl ? -7 : 7);
    const sourceY = link.source.y + 16;
    const targetX = link.target.x + (isRtl ? 12 : -12);
    const targetY = link.target.y;

    return [
      `M ${sourceX} ${sourceY}`,
      `V ${targetY}`,
      `H ${targetX}`,
    ].join(' ');
  }

  private getLevelTone(level: number): HierarchyTone {
    const tones: readonly HierarchyTone[] = [
      'primary',
      'info',
      'primary',
      'success',
      'warning',
      'danger',
      'primary',
    ];

    return tones[level] ?? 'secondary';
  }

  private getToneColor(tone: HierarchyTone): string {
    return `var(--bs-${tone})`;
  }

  private getToneSubtleColor(tone: HierarchyTone): string {
    return `var(--bs-${tone}-light, var(--bs-light-${tone}))`;
  }

  private formatNodeText(node: HierarchyNode): string {
    if (node.count === undefined || node.count === '') {
      return node.label;
    }

    return `${node.label} (${node.count})`;
  }

  private toggleNodeCollapsed(node: TreeRenderNode): void {
    if (!node.hasChildren) {
      return;
    }

    this.collapsedNodeIds.update((collapsedIds) => {
      const next = new Set(collapsedIds);

      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }

      return next;
    });
  }

  private isTogglePointerEvent(event: Event, isRtl: boolean): boolean {
    if (!(event instanceof MouseEvent) || !(event.currentTarget instanceof SVGElement)) {
      return false;
    }

    const [x, y] = pointer(event, event.currentTarget);
    const toggleX = isRtl ? 6 : -30;

    return x >= toggleX && x <= toggleX + 24 && y >= -12 && y <= 12;
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

  private findNodeById(id: string | undefined): HierarchyNode | undefined {
    if (!id) {
      return undefined;
    }

    const visit = (nodes: readonly HierarchyNode[]): HierarchyNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }

        const match = node.children ? visit(node.children) : undefined;

        if (match) {
          return match;
        }
      }

      return undefined;
    };

    return visit(this.nodes());
  }

  private findNodePath(
    nodes: readonly HierarchyNode[],
    id: string
  ): readonly HierarchyNode[] {
    for (const node of nodes) {
      if (node.id === id) {
        return [node];
      }

      const childPath = node.children ? this.findNodePath(node.children, id) : [];

      if (childPath.length > 0) {
        return [node, ...childPath];
      }
    }

    return [];
  }

  private clear(): void {
    if (this.treeHost?.nativeElement) {
      select(this.treeHost.nativeElement).selectAll('*').remove();
    }
  }
}
