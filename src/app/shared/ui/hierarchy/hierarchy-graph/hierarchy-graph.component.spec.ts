import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HierarchyGraphComponent } from './hierarchy-graph.component';

describe('HierarchyGraphComponent', () => {
  let fixture: ComponentFixture<HierarchyGraphComponent>;
  let component: HierarchyGraphComponent;

  const nodes = Array.from({ length: 12 }, (_value, index) => ({
    id: `node-${index}`,
    label: `Hierarchy Node ${index}`,
    type: `Level ${index}`,
    level: index,
    count: index,
  }));

  const links = nodes.slice(1).map((node, index) => ({
    source: nodes[index].id,
    target: node.id,
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarchyGraphComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarchyGraphComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('selectedNodeId', 'node-8');
    fixture.detectChanges();
  });

  it('hides legend by default, keeps minimap visible, and toggles visibility from graph actions', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(component.isLegendVisible()).toBeFalse();
    expect(component.isMiniMapVisible()).toBeTrue();
    expect(host.querySelector('.hierarchy-graph-legend-body')).toBeNull();
    expect(host.querySelector('.hierarchy-graph-minimap')).not.toBeNull();

    component.toggleLegendVisibility();
    fixture.detectChanges();

    expect(component.isLegendVisible()).toBeTrue();
    expect(host.querySelector('.hierarchy-graph-legend-body')).not.toBeNull();

    component.toggleMiniMapVisibility();
    fixture.detectChanges();

    expect(component.isMiniMapVisible()).toBeFalse();
    expect(host.querySelector('.hierarchy-graph-minimap')).toBeNull();
    expect(host.querySelector('.hierarchy-graph-legend-toggle')).toBeNull();
  });

  it('mirrors horizontal graph layout in RTL mode', async () => {
    fixture.componentRef.setInput('layoutDirection', 'rtl');
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const rootNode = host.querySelector<SVGGElement>('[data-node-id="node-0"]');
    const childNode = host.querySelector<SVGGElement>('[data-node-id="node-1"]');

    expect(rootNode).not.toBeNull();
    expect(childNode).not.toBeNull();
    expect(readTranslateX(rootNode)).toBeGreaterThan(readTranslateX(childNode));
  });

  it('colors muted relation lines by target level instead of low-contrast gray dashes', () => {
    const host = fixture.nativeElement as HTMLElement;
    const mutedLink = host.querySelector('.hierarchy-graph-link-muted');

    expect(mutedLink).not.toBeNull();
    expect(mutedLink?.getAttribute('stroke')).not.toBe('var(--bs-gray-300)');
    expect(mutedLink?.getAttribute('stroke-dasharray')).toBe('0');
    expect(Number(mutedLink?.getAttribute('stroke-width'))).toBeGreaterThan(1.4);
  });

  it('preserves zoom transform and node positions when selection changes', async () => {
    const host = fixture.nativeElement as HTMLElement;

    component.zoomIn();
    await fixture.whenStable();
    fixture.detectChanges();

    const rootBefore = host.querySelector<SVGGElement>('.hierarchy-graph-root');
    const transformBefore = rootBefore?.getAttribute('transform');
    const selectedBefore = host.querySelector<SVGGElement>('[data-node-id="node-8"]');
    const selectedPositionBefore = selectedBefore?.getAttribute('transform');

    fixture.componentRef.setInput('selectedNodeId', 'node-5');
    await fixture.whenStable();
    fixture.detectChanges();

    const rootAfter = host.querySelector<SVGGElement>('.hierarchy-graph-root');
    const selectedAfter = host.querySelector<SVGGElement>('[data-node-id="node-8"]');

    expect(rootAfter).toBe(rootBefore);
    expect(rootAfter?.getAttribute('transform')).toBe(transformBefore);
    expect(selectedAfter?.getAttribute('transform')).toBe(selectedPositionBefore);
    expect(host.querySelector('[data-node-id="node-5"]')?.getAttribute('class')).toContain(
      'hierarchy-graph-node-active'
    );
    expect(host.querySelector('[data-node-id="node-8"]')?.getAttribute('class')).not.toContain(
      'hierarchy-graph-node-active'
    );
  });

  it('renders icon-only graph controls with tooltip labels and without a duplicate reset action', () => {
    const host = fixture.nativeElement as HTMLElement;
    const controlButtons = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.hierarchy-graph-controls button')
    );

    expect(host.querySelector('[data-testid="hierarchy-graph-fit-view"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="hierarchy-graph-reset-view"]')).toBeNull();
    expect(controlButtons.length).toBeGreaterThan(0);
    expect(
      controlButtons.every(
        (button) =>
          button.getAttribute('title')?.startsWith('workspace.scopeHierarchyExplorer.graph.controls.')
      )
    ).toBeTrue();
    expect(
      controlButtons.every(
        (button) =>
          button.querySelector('.hierarchy-graph-control-label')?.classList.contains('d-none')
      )
    ).toBeTrue();
  });

  it('toggles the expanded graph shell from a clear full-screen action', () => {
    const host = fixture.nativeElement as HTMLElement;
    const expandButton = host.querySelector<HTMLButtonElement>(
      '[data-testid="hierarchy-graph-toggle-fullscreen"]'
    );

    expect(expandButton).not.toBeNull();
    expect(component.isExpanded()).toBeFalse();

    expandButton?.click();
    fixture.detectChanges();

    expect(component.isExpanded()).toBeTrue();
    expect(host.querySelector('.hierarchy-graph-shell-expanded')).not.toBeNull();
    expect(expandButton?.querySelector('.hierarchy-graph-control-label')?.textContent).toContain(
      'workspace.scopeHierarchyExplorer.graph.controls.collapse'
    );

    expandButton?.click();
    fixture.detectChanges();

    expect(component.isExpanded()).toBeFalse();
    expect(host.querySelector('.hierarchy-graph-shell-expanded')).toBeNull();
  });

  it('allocates a wider canvas for left-to-right product-depth levels', () => {
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    const viewBox = svg?.getAttribute('viewBox') ?? '';
    const [, , width, height] = viewBox.split(' ').map((value) => Number(value));

    expect(width).toBeGreaterThanOrEqual(220 + nodes.length * 170);
    expect(height).toBeGreaterThanOrEqual(420);
  });

  it('marks graph nodes as locally draggable demo items and supports locking', async () => {
    const host = fixture.nativeElement as HTMLElement;
    const renderedDraggableNodes = host.querySelectorAll(
      '.hierarchy-graph-node[data-draggable="true"]'
    );

    expect(component.dragEnabled()).toBeTrue();
    expect(renderedDraggableNodes.length).toBe(nodes.length);

    component.toggleNodeLock();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const renderedLockedNodes = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.hierarchy-graph-node[data-draggable="false"]'
    );

    expect(component.nodesLocked()).toBeTrue();
    expect(renderedLockedNodes.length).toBe(nodes.length);
  });
});

function readTranslateX(element: Element | null): number {
  const transform = element?.getAttribute('transform') ?? '';
  const match = /translate\(([-\d.]+)/.exec(transform);

  return match ? Number(match[1]) : Number.NaN;
}
