import {
  Component,
  provideZonelessChangeDetection,
  viewChild,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUtil } from '@utils/data.util';
import { DomUtil } from '@utils/dom.util';
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

@Component({
  imports: [MenuDirective],
  standalone: true,
  template: `
    <div class="menu" vlVeloraMenu>
      <div class="menu-item" data-velora-menu-trigger="click">
        <button type="button" class="menu-link">Accordion item</button>
        <div class="menu-sub menu-sub-accordion">Submenu</div>
      </div>
    </div>
  `,
})
class AccordionHostComponent {
  readonly directive = viewChild.required(MenuDirective);
}

type TestPopperFactory = (
  reference: Element,
  popper: HTMLElement,
  options?: unknown
) => { destroy(): void; update(): void; setOptions(options: unknown): void };

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

  it('removes every handler registered for the same event', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const first = jasmine.createSpy('first');
    const second = jasmine.createSpy('second');

    directive.on('menu:test', first);
    directive.on('menu:test', second);
    directive.off('menu:test');
    fixture.nativeElement
      .querySelector('[vlVeloraMenu]')
      .dispatchEvent(new CustomEvent('menu:test'));

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('keeps multiple one-time handlers independent and cleans them after firing', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const first = jasmine.createSpy('first');
    const second = jasmine.createSpy('second');
    const menu = fixture.nativeElement.querySelector('[vlVeloraMenu]');

    directive.one('menu:once', first);
    directive.one('menu:once', second);
    menu.dispatchEvent(new CustomEvent('menu:once'));
    menu.dispatchEvent(new CustomEvent('menu:once'));

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });

  it('removes every custom handler on destroy', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const first = jasmine.createSpy('first');
    const second = jasmine.createSpy('second');
    const menu = fixture.nativeElement.querySelector('[vlVeloraMenu]');

    directive.on('menu:destroy', first);
    directive.on('menu:destroy', second);
    fixture.destroy();
    menu.dispatchEvent(new CustomEvent('menu:destroy'));

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('does not create a lazy Popper instance after the standalone menu closes', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as {
      loadPopper(): Promise<TestPopperFactory | null>;
    };
    let resolveLoader!: (factory: TestPopperFactory) => void;
    const loader = new Promise<TestPopperFactory>((resolve) => {
      resolveLoader = resolve;
    });
    const factory = jasmine.createSpy('factory').and.returnValue({
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
      setOptions: jasmine.createSpy('setOptions'),
    });
    spyOn(internals, 'loadPopper').and.returnValue(loader);

    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLButtonElement>('[data-velora-menu-trigger]')!.click();
    document.body.click();
    resolveLoader(factory);
    await loader;
    await Promise.resolve();

    expect(factory).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('does not create a lazy Popper instance after a dropdown closes', async () => {
    const fixture = TestBed.createComponent(HoverHostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as {
      loadPopper(): Promise<TestPopperFactory | null>;
      showDropdown(item: HTMLElement): void;
      hideDropdown(item: HTMLElement): void;
    };
    let resolveLoader!: (factory: TestPopperFactory) => void;
    const loader = new Promise<TestPopperFactory>((resolve) => {
      resolveLoader = resolve;
    });
    const factory = jasmine.createSpy('factory').and.returnValue({
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
      setOptions: jasmine.createSpy('setOptions'),
    });
    spyOn(internals, 'loadPopper').and.returnValue(loader);
    const item = fixture.nativeElement.querySelector('.menu-item') as HTMLElement;

    internals.showDropdown(item);
    internals.hideDropdown(item);
    resolveLoader(factory);
    await loader;
    await Promise.resolve();

    expect(factory).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('does not complete an accordion animation after destroy', async () => {
    const fixture = TestBed.createComponent(AccordionHostComponent);
    fixture.detectChanges();
    jasmine.clock().tick(0);

    const directive = fixture.componentInstance.directive();
    const internals = directive as unknown as {
      showAccordion(item: HTMLElement): void;
    };
    let resolveAnimation!: () => void;
    const animation = new Promise<void>((resolve) => {
      resolveAnimation = resolve;
    });
    spyOn(DomUtil, 'slideDown').and.returnValue(animation);
    const shown = spyOn(directive.menuAccordionShown, 'emit').and.callThrough();
    const item = fixture.nativeElement.querySelector('.menu-item') as HTMLElement;

    internals.showAccordion(item);
    fixture.destroy();
    resolveAnimation();
    await animation;
    await Promise.resolve();

    expect(shown).not.toHaveBeenCalled();
  });
});
