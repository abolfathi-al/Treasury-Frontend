import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
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

describe('DrawerDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  afterEach(() => {
    document.body.removeAttribute('data-velora-drawer');
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
});
