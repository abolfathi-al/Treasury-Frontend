import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HierarchyNode } from '../hierarchy.types';
import { HierarchyTreeComponent } from './hierarchy-tree.component';

describe('HierarchyTreeComponent', () => {
  let fixture: ComponentFixture<HierarchyTreeComponent>;
  let component: HierarchyTreeComponent;

  const nodes: readonly HierarchyNode[] = [
    {
      id: 'workspace',
      label: 'Velora Global',
      type: 'Workspace',
      level: 0,
      count: 2,
      expanded: true,
      children: [
        {
          id: 'division-operations',
          label: 'Operations',
          type: 'Division',
          level: 1,
          count: 1,
          children: [
            {
              id: 'workspace-access',
              label: 'Access',
              type: 'Catalog',
              level: 2,
              count: 1,
            },
          ],
        },
        {
          id: 'division-support',
          label: 'Support',
          type: 'Division',
          level: 1,
          count: 1,
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarchyTreeComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarchyTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('selectedNodeId', 'workspace-access');
    fixture.detectChanges();
  });

  it('renders a D3 SVG outline tree instead of jstree or graph-card nodes', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('svg.hierarchy-tree-svg')).not.toBeNull();
    expect(host.querySelectorAll('.hierarchy-tree-outline-row').length).toBe(4);
    expect(host.querySelectorAll('.hierarchy-tree-link').length).toBe(3);
    expect(host.querySelector('.hierarchy-tree-node-card')).toBeNull();
    expect(host.querySelector('.jstree')).toBeNull();

    const rowTransforms = Array.from(
      host.querySelectorAll<SVGGElement>('.hierarchy-tree-outline-row')
    ).map((row) => row.getAttribute('transform') ?? '');

    expect(rowTransforms[0]).toContain('translate(24,');
    expect(rowTransforms[1]).toContain('translate(58,');
  });

  it('renders children directly below their parent in depth-first order', () => {
    const rowIds = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<SVGGElement>(
        '.hierarchy-tree-outline-row'
      )
    ).map((row) => row.getAttribute('data-node-id'));

    expect(rowIds).toEqual([
      'workspace',
      'division-operations',
      'workspace-access',
      'division-support',
    ]);
  });

  it('filters the rendered D3 tree locally from search input state', async () => {
    component.searchTree('Operations');
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Velora Global');
    expect(text).toContain('Operations');
    expect(text).not.toContain('Support');
  });

  it('updates search state through a typed input event helper', () => {
    const input = document.createElement('input');
    input.value = 'Support';

    component.onSearchInput({ target: input } as unknown as Event);

    expect(component.searchQuery()).toBe('Support');
  });

  it('emits the selected hierarchy node from the D3 rendered node', () => {
    spyOn(component.nodeSelected, 'emit');

    const operationsNode = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-node-id="division-operations"]'
    );
    operationsNode?.dispatchEvent(new Event('click'));

    expect(component.nodeSelected.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 'division-operations' })
    );
  });

  it('collapses and expands branch nodes from the D3 toggle control', async () => {
    const host = fixture.nativeElement as HTMLElement;
    const operationsToggle = host.querySelector(
      '[data-node-id="division-operations"] .hierarchy-tree-toggle-hitbox'
    );

    expect(operationsToggle).not.toBeNull();

    operationsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('[data-node-id="workspace-access"]')).toBeNull();
    expect(
      host.querySelector('[data-node-id="division-operations"]')?.getAttribute('aria-expanded')
    ).toBe('false');
    expect(
      host.querySelector('[data-node-id="workspace"] .hierarchy-tree-checkmark')
    ).not.toBeNull();
    expect(
      host.querySelector('[data-node-id="division-operations"] .hierarchy-tree-checkmark')
    ).not.toBeNull();
    expect(host.querySelectorAll('.hierarchy-tree-checkmark').length).toBe(2);

    host
      .querySelector('[data-node-id="division-operations"] .hierarchy-tree-toggle-hitbox')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('[data-node-id="workspace-access"]')).not.toBeNull();
    expect(
      host.querySelector('[data-node-id="division-operations"]')?.getAttribute('aria-expanded')
    ).toBe('true');
    expect(host.querySelectorAll('.hierarchy-tree-checkmark').length).toBe(3);
  });

  it('renders checked markers from selected node to root using the checkbox color', () => {
    const host = fixture.nativeElement as HTMLElement;
    const selectedIcon = host.querySelector(
      '[data-node-id="workspace-access"] .hierarchy-tree-node-icon'
    );
    const selectedCheckmark = host.querySelector(
      '[data-node-id="workspace-access"] .hierarchy-tree-checkmark'
    );

    expect(
      host.querySelector('[data-node-id="workspace-access"] .hierarchy-tree-checkmark')
    ).not.toBeNull();
    expect(
      host.querySelector('[data-node-id="division-operations"] .hierarchy-tree-checkmark')
    ).not.toBeNull();
    expect(
      host.querySelector('[data-node-id="workspace"] .hierarchy-tree-checkmark')
    ).not.toBeNull();
    expect(
      host.querySelector('[data-node-id="division-support"] .hierarchy-tree-checkmark')
    ).toBeNull();
    expect(selectedCheckmark?.getAttribute('stroke')).toBe(
      selectedIcon?.getAttribute('stroke')
    );
  });

  it('mirrors the D3 outline tree in RTL mode', async () => {
    fixture.componentRef.setInput('layoutDirection', 'rtl');
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const rootNode = host.querySelector('[data-node-id="workspace"]');
    const divisionNode = host.querySelector('[data-node-id="division-operations"]');
    const rootLabel = rootNode?.querySelector('.hierarchy-tree-node-label');
    const rootIcon = rootNode?.querySelector('.hierarchy-tree-node-icon');

    expect(readTranslateX(rootNode)).toBeGreaterThan(readTranslateX(divisionNode));
    expect(rootLabel?.getAttribute('text-anchor')).toBe('start');
    expect(Number(rootLabel?.getAttribute('x'))).toBeLessThan(
      Number(rootIcon?.getAttribute('x'))
    );
  });
});

function readTranslateX(element: Element | null): number {
  const transform = element?.getAttribute('transform') ?? '';
  const match = /translate\(([-\d.]+)/.exec(transform);

  return match ? Number(match[1]) : Number.NaN;
}
