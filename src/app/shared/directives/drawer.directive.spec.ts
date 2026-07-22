import {
  Component,
  provideZonelessChangeDetection,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DrawerDirective } from './drawer.directive';

function fakeAsync(testFn: () => void): () => void {
  return () => {
    jasmine.clock().install();
    try {
      testFn();
    } finally {
      jasmine.clock().uninstall();
    }
  };
}

function tick(millis = 0): void {
  jasmine.clock().tick(millis);
}

@Component({
  imports: [DrawerDirective],
  standalone: true,
  template: '<aside vlVeloraDrawer></aside>',
})
class HostComponent {
  readonly directive = viewChild.required(DrawerDirective);
}

@Component({
  imports: [DrawerDirective],
  standalone: true,
  template: `
    <aside id="first-drawer" vlVeloraDrawer drawerName="shared"></aside>
    <aside id="second-drawer" vlVeloraDrawer drawerName="shared"></aside>
  `,
})
class MultiDrawerHostComponent {
  readonly directives = viewChildren(DrawerDirective);
}

@Component({
  imports: [DrawerDirective],
  standalone: true,
  template: `
    <aside
      id="reactive-drawer"
      vlVeloraDrawer
      [drawerShown]="shown()"
      [drawerOverlay]="overlay()"
      [drawerOverlayClass]="overlayClass()"
      [drawerDirection]="direction()"
      [drawerWidth]="width()"
      [drawerName]="name()"
      [drawerBaseClass]="baseClass()"
      [drawerActivate]="activate()"
      [drawerEscape]="escape()"
    ></aside>
  `,
})
class ReactiveDrawerHostComponent {
  readonly directive = viewChild.required(DrawerDirective);
  readonly shown = signal(false);
  readonly overlay = signal(true);
  readonly overlayClass = signal('drawer-overlay');
  readonly direction = signal<'start' | 'end'>('end');
  readonly width = signal<string | { [key: string]: string }>('300px');
  readonly name = signal('primary');
  readonly baseClass = signal('drawer');
  readonly activate = signal<boolean | { [key: string]: boolean }>(true);
  readonly escape = signal(true);
}

@Component({
  imports: [DrawerDirective],
  standalone: true,
  template: `
    <button class="toggle-one" type="button"><span>First toggle</span></button>
    <button class="toggle-two" type="button"><span>Second toggle</span></button>
    <button class="close-one" type="button">First close</button>
    <button class="close-two" type="button">Second close</button>
    <aside
      id="selector-drawer"
      vlVeloraDrawer
      [drawerToggleSelector]="toggleSelector()"
      [drawerClose]="closeSelector()"
    ></aside>
  `,
})
class SelectorDrawerHostComponent {
  readonly directive = viewChild.required(DrawerDirective);
  readonly toggleSelector = signal('.toggle-one');
  readonly closeSelector = signal('.close-one');
}

describe('DrawerDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  afterEach(() => {
    document.body.removeAttribute('data-velora-drawer');
    document.body.removeAttribute('data-velora-drawer-shared');
    document.body.removeAttribute('data-velora-drawer-primary');
    document.body.removeAttribute('data-velora-drawer-secondary');
  });

  function setup(): {
    fixture: ComponentFixture<HostComponent>;
    directive: DrawerDirective;
    aside: HTMLElement;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;
    return { fixture, directive: fixture.componentInstance.directive(), aside };
  }

  it('initializes and preserves basic show/hide behavior', fakeAsync(() => {
    const { directive, aside } = setup();
    tick(0);

    expect(directive).toBeTruthy();
    expect(directive.isShown()).toBeFalse();
    expect(aside.classList.contains('drawer')).toBeTrue();
    expect(aside.classList.contains('drawer-end')).toBeTrue();

    directive.show();
    expect(directive.isShown()).toBeTrue();
    expect(aside.classList.contains('drawer-on')).toBeTrue();
    expect(document.body.getAttribute('data-velora-drawer')).toBe('on');

    tick(10);

    directive.hide();
    expect(directive.isShown()).toBeFalse();
    expect(aside.classList.contains('drawer-on')).toBeFalse();
    expect(document.body.hasAttribute('data-velora-drawer')).toBeFalse();

    tick(10);
  }));

  it('does not emit drawerShownEvent after destroy before the settled timeout', fakeAsync(() => {
    const { fixture, directive } = setup();
    tick(0);
    const shownSpy = spyOn(directive.drawerShownEvent, 'emit').and.callThrough();
    let shownEmitted = false;
    directive.drawerShownEvent.subscribe(() => {
      shownEmitted = true;
    });

    directive.show();
    fixture.destroy();
    tick(10);

    expect(shownSpy).not.toHaveBeenCalled();
    expect(shownEmitted).toBeFalse();
  }));

  it('emits both settled events when show is followed by hide before the settled timeout', fakeAsync(() => {
    const { directive } = setup();
    tick(0);
    const shownSpy = spyOn(directive.drawerShownEvent, 'emit').and.callThrough();
    const hiddenSpy = spyOn(directive.drawerHiddenEvent, 'emit').and.callThrough();

    directive.show();
    directive.hide();
    tick(10);

    expect(shownSpy).toHaveBeenCalledTimes(1);
    expect(hiddenSpy).toHaveBeenCalledTimes(1);
  }));

  it('does not emit drawerHiddenEvent after destroy before the settled timeout', fakeAsync(() => {
    const { fixture, directive } = setup();
    tick(0);
    directive.show();
    tick(10);

    const hiddenSpy = spyOn(directive.drawerHiddenEvent, 'emit').and.callThrough();
    let hiddenEmitted = false;
    directive.drawerHiddenEvent.subscribe(() => {
      hiddenEmitted = true;
    });

    directive.hide();
    fixture.destroy();
    tick(10);

    expect(hiddenSpy).not.toHaveBeenCalled();
    expect(hiddenEmitted).toBeFalse();
  }));

  it('preserves shared body state while another drawer remains open', fakeAsync(() => {
    const fixture = TestBed.createComponent(MultiDrawerHostComponent);
    fixture.detectChanges();
    tick(0);
    const [first, second] = fixture.componentInstance.directives();

    first.show();
    second.show();
    first.hide();

    expect(document.body.getAttribute('data-velora-drawer')).toBe('on');
    expect(document.body.getAttribute('data-velora-drawer-shared')).toBe('on');

    second.hide();

    expect(document.body.hasAttribute('data-velora-drawer')).toBeFalse();
    expect(document.body.hasAttribute('data-velora-drawer-shared')).toBeFalse();
    tick(10);
    fixture.destroy();
  }));

  it('clears visible state when an open drawer is destroyed', fakeAsync(() => {
    const { fixture, directive, aside } = setup();
    tick(0);
    directive.show();

    fixture.destroy();

    expect(directive.isShown()).toBeFalse();
    expect(aside.classList.contains('drawer-on')).toBeFalse();
    expect(document.body.hasAttribute('data-velora-drawer')).toBeFalse();
    expect(document.body.querySelector('.drawer-overlay')).toBeNull();
    tick(10);
  }));

  it('applies reactive state, layout, and presentation inputs', fakeAsync(() => {
    const fixture = TestBed.createComponent(ReactiveDrawerHostComponent);
    fixture.detectChanges();
    tick(0);
    const component = fixture.componentInstance;
    const directive = component.directive();
    const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;

    component.shown.set(true);
    fixture.detectChanges();
    expect(directive.isShown()).toBeTrue();
    expect(aside.style.width).toBe('300px');
    expect(document.body.getAttribute('data-velora-drawer-primary')).toBe('on');

    component.overlayClass.set('floating-overlay');
    component.baseClass.set('sheet');
    component.direction.set('start');
    component.width.set('420px');
    component.name.set('secondary');
    fixture.detectChanges();

    const overlay = document.body.querySelector('.floating-overlay');
    expect(overlay).not.toBeNull();
    expect(aside.classList.contains('drawer')).toBeFalse();
    expect(aside.classList.contains('sheet')).toBeTrue();
    expect(aside.classList.contains('sheet-start')).toBeTrue();
    expect(aside.classList.contains('sheet-on')).toBeTrue();
    expect(aside.style.width).toBe('420px');
    expect(document.body.hasAttribute('data-velora-drawer-primary')).toBeFalse();
    expect(document.body.getAttribute('data-velora-drawer-secondary')).toBe('on');

    component.overlay.set(false);
    fixture.detectChanges();
    expect(document.body.querySelector('.floating-overlay')).toBeNull();

    component.activate.set(false);
    fixture.detectChanges();
    expect(directive.isShown()).toBeFalse();
    expect(aside.classList.contains('sheet')).toBeFalse();
    expect(aside.style.width).toBe('');
    tick(10);
    fixture.destroy();
  }));

  it('rebinds reactive toggle and close selectors without duplicate handlers', fakeAsync(() => {
    const fixture = TestBed.createComponent(SelectorDrawerHostComponent);
    fixture.detectChanges();
    tick(0);
    const component = fixture.componentInstance;
    const directive = component.directive();
    const host = fixture.nativeElement as HTMLElement;
    const firstToggle = host.querySelector<HTMLButtonElement>('.toggle-one')!;
    const secondToggle = host.querySelector<HTMLButtonElement>('.toggle-two')!;
    const firstClose = host.querySelector<HTMLButtonElement>('.close-one')!;
    const secondClose = host.querySelector<HTMLButtonElement>('.close-two')!;

    firstToggle.querySelector('span')!.click();
    expect(directive.isShown()).toBeTrue();
    firstClose.click();
    expect(directive.isShown()).toBeFalse();

    component.toggleSelector.set('.toggle-two');
    component.closeSelector.set('.close-two');
    fixture.detectChanges();

    firstToggle.click();
    expect(directive.isShown()).toBeFalse();
    secondToggle.click();
    expect(directive.isShown()).toBeTrue();
    firstClose.click();
    expect(directive.isShown()).toBeTrue();
    secondClose.click();
    expect(directive.isShown()).toBeFalse();
    tick(10);
    fixture.destroy();
  }));

  it('reacts to drawerShown and drawerEscape input changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(ReactiveDrawerHostComponent);
    fixture.detectChanges();
    tick(0);
    const component = fixture.componentInstance;
    const directive = component.directive();

    component.shown.set(true);
    component.escape.set(false);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(directive.isShown()).toBeTrue();

    component.escape.set(true);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(directive.isShown()).toBeFalse();

    component.shown.set(false);
    fixture.detectChanges();
    tick(10);
    fixture.destroy();
  }));
});
