import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUtil } from '@utils/data.util';
import { MenuDirective } from './menu.directive';

@Component({
  imports: [MenuDirective],
  standalone: true,
  template: `
    <button type="button" data-velora-menu-trigger="click">Open menu</button>
    <div class="menu" vlVeloraMenu>Menu content</div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(MenuDirective);
}

@Component({
  imports: [MenuDirective],
  standalone: true,
  template: `
    <div class="menu" vlVeloraMenu [menuHoverTimeout]="100">
      <div class="menu-item" data-velora-menu-trigger="hover">
        <button type="button" class="menu-link">Hover item</button>
        <div class="menu-sub menu-sub-dropdown">Submenu</div>
      </div>
    </div>
  `,
})
class HoverHostComponent {
  readonly directive = viewChild.required(MenuDirective);
}

describe('MenuDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('opens from its external trigger and closes on an outside click', () => {
    const fixture: ComponentFixture<HostComponent> =
      TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector<HTMLButtonElement>('button')!;
    const menu = host.querySelector<HTMLElement>('[vlVeloraMenu]')!;
    const directive = fixture.componentInstance.directive();
    const shown = spyOn(directive.menuShown, 'emit').and.callThrough();
    const hidden = spyOn(directive.menuHidden, 'emit').and.callThrough();

    trigger.click();

    expect(menu.classList.contains('show')).toBeTrue();
    expect(shown).toHaveBeenCalledTimes(1);

    document.body.click();

    expect(menu.classList.contains('show')).toBeFalse();
    expect(hidden).toHaveBeenCalledTimes(1);

    jasmine.clock().tick(50);
    expect(menu.style.opacity).toBe('0');
    expect(menu.style.visibility).toBe('hidden');

    fixture.destroy();
  });

  it('cancels delayed initialization and removes host and trigger registry entries on destroy', () => {
    const fixture: ComponentFixture<HostComponent> =
      TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector<HTMLElement>(
      '[data-velora-menu-trigger]'
    )!;
    const menu = host.querySelector<HTMLElement>('[vlVeloraMenu]')!;
    const directive = fixture.componentInstance.directive();

    expect(DataUtil.get(menu, 'menuDirective')).toBe(directive);
    expect(DataUtil.get(trigger, 'menuDirective')).toBe(directive);

    fixture.destroy();
    jasmine.clock().tick(0);

    expect(DataUtil.get(menu, 'menuDirective')).toBeUndefined();
    expect(DataUtil.get(trigger, 'menuDirective')).toBeUndefined();
  });

  it('cancels pending hover work on destroy', () => {
    const fixture = TestBed.createComponent(HoverHostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as {
      hideInternal(item?: HTMLElement): void;
    };
    const hideSpy = spyOn(internals, 'hideInternal').and.callThrough();
    const item = fixture.nativeElement.querySelector(
      '.menu-item'
    ) as HTMLElement;

    item.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    fixture.destroy();
    jasmine.clock().tick(100);

    expect(hideSpy).not.toHaveBeenCalled();
    expect(DataUtil.get(item, 'hover')).toBeUndefined();
    expect(DataUtil.get(item, 'timeout')).toBeUndefined();
  });
});
