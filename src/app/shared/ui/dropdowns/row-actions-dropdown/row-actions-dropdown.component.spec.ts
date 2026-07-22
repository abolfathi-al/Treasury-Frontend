import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { RowActionItem } from '../dropdown.types';
import { RowActionsDropdownComponent } from './row-actions-dropdown.component';

describe('RowActionsDropdownComponent', () => {
  let fixture: ComponentFixture<RowActionsDropdownComponent>;
  let component: RowActionsDropdownComponent;

  const actions: readonly RowActionItem[] = [
    {
      id: 'view-details',
      labelKey: 'workspace.scopeHierarchyExplorer.rowActions.viewDetails',
      icon: 'eye',
    },
    {
      id: 'copy-id',
      labelKey: 'workspace.scopeHierarchyExplorer.rowActions.copyId',
      icon: 'copy',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowActionsDropdownComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(RowActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();
  });

  it('anchors the menu as an overlay so it does not expand table rows', () => {
    const host = fixture.nativeElement as HTMLElement;
    const wrapper = host.querySelector('.row-actions-dropdown');
    const menu = host.querySelector('.row-actions-dropdown-menu');
    const trigger = host.querySelector('.row-actions-dropdown > button');

    expect(wrapper).not.toBeNull();
    expect(menu).not.toBeNull();
    expect(menu?.classList).toContain('menu-sub-dropdown');
    expect(menu?.classList).toContain('row-actions-dropdown-menu-bottom');
    expect(menu?.getAttribute('data-velora-menu-attach')).toBe('body');
    expect(trigger?.getAttribute('data-velora-menu-attach')).toBe('body');
    expect(trigger?.getAttribute('data-velora-menu-placement')).toBe('bottom-end');
  });

  it('supports opening upward for action cells near the viewport edge', () => {
    fixture.componentRef.setInput('placement', 'top-end');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const menu = host.querySelector('.row-actions-dropdown-menu');
    const trigger = host.querySelector('.row-actions-dropdown > button');

    expect(menu?.classList).toContain('row-actions-dropdown-menu-top');
    expect(trigger?.getAttribute('data-velora-menu-placement')).toBe('top-end');
  });

  it('emits enabled actions only', () => {
    const emitted: RowActionItem[] = [];
    component.actionSelected.subscribe((action) => emitted.push(action));

    component.selectAction(actions[0]);
    component.selectAction({ ...actions[1], disabled: true });

    expect(emitted).toEqual([actions[0]]);
  });
});
