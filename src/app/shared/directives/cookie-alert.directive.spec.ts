import { Component, Renderer2, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/tokens';
import { LoggerService } from '@core/services/logger.service';

import { CookieAlertDirective } from './cookie-alert.directive';

const TEST_COOKIE_NAME = 'codex-cookie-alert-test';

type CookieAlertDirectiveInternals = {
  host: { renderer: Renderer2 };
  handleError: (message: string, error: Error) => void;
  hideAlert: () => void;
  initialize: () => void;
  removeAlert: () => void;
};

function virtualAsync(testFn: () => void): () => void {
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

function createTimerWindow(): Window {
  let nextTimerId = 100_000;
  const timerMap = new Map<number, number>();

  const timerWindow = Object.create(window) as Pick<
    Window,
    'setTimeout' | 'clearTimeout'
  >;
  timerWindow.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]): number => {
    const timerId = nextTimerId++;
    const realTimerId = window.setTimeout(handler, timeout, ...args);
    timerMap.set(timerId, realTimerId);
    return timerId;
  }) as Window['setTimeout'];
  timerWindow.clearTimeout = ((timerId?: number): void => {
    if (timerId === undefined) return;
    const realTimerId = timerMap.get(timerId);
    if (realTimerId === undefined) return;
    window.clearTimeout(realTimerId);
    timerMap.delete(timerId);
  }) as Window['clearTimeout'];

  return timerWindow as unknown as Window;
}

@Component({
  imports: [CookieAlertDirective],
  standalone: true,
  template: `
    <div
      vlVeloraCookieAlert
      [cookieAlertCookieName]="cookieName"
      [cookieAlertCookieValue]="cookieValue"
      [cookieAlertShowOnLoad]="showOnLoad"
      [cookieAlertAutoHide]="autoHide"
      [cookieAlertAutoHideDelay]="autoHideDelay"
      [cookieAlertAnimation]="animation"
      [cookieAlertAnimationDuration]="animationDuration"
    ></div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(CookieAlertDirective);

  cookieName = TEST_COOKIE_NAME;
  cookieValue = 'accepted';
  showOnLoad = false;
  autoHide = false;
  autoHideDelay = 50;
  animation = true;
  animationDuration = 25;
}

describe('CookieAlertDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: WINDOW, useFactory: createTimerWindow },
        {
          provide: LoggerService,
          useValue: {
            error: jasmine.createSpy('logger.error'),
            warn: jasmine.createSpy('logger.warn'),
            info: jasmine.createSpy('logger.info'),
            debug: jasmine.createSpy('logger.debug'),
          },
        },
      ],
    });
  });

  afterEach(() => {
    document.querySelectorAll('.cookiealert').forEach((node) => node.remove());
    document.cookie = `${TEST_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });

  function setup(overrides: Partial<HostComponent> = {}): {
    fixture: ComponentFixture<HostComponent>;
    directive: CookieAlertDirective;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      directive: fixture.componentInstance.directive(),
    };
  }

  it('creates and removes the alert through the public show/hide API', virtualAsync(() => {
    const { directive } = setup();

    directive.show();
    tick(10);

    expect(document.querySelectorAll('.cookiealert').length).toBe(1);
    expect(directive.isVisible()).toBeTrue();

    directive.hide();
    tick(25);

    expect(document.querySelector('.cookiealert')).toBeNull();
    expect(directive.isVisible()).toBeFalse();
  }));

  it('does not run delayed hide removal after destroy', virtualAsync(() => {
    const { fixture, directive } = setup();
    const removeAlertSpy = spyOn(
      directive as unknown as CookieAlertDirectiveInternals,
      'removeAlert'
    ).and.callThrough();

    directive.show();
    tick(10);
    directive.hide();
    fixture.destroy();
    tick(25);

    expect(document.querySelector('.cookiealert')).toBeNull();
    expect(removeAlertSpy).toHaveBeenCalledTimes(1);
  }));

  it('does not run auto-hide after destroy', virtualAsync(() => {
    const { fixture, directive } = setup({
      showOnLoad: true,
      autoHide: true,
      autoHideDelay: 50,
      animation: false,
    });
    const hideAlertSpy = spyOn(
      directive as unknown as CookieAlertDirectiveInternals,
      'hideAlert'
    ).and.callThrough();
    const hideEventSpy = spyOn(directive.hideEvent, 'emit').and.callThrough();

    fixture.destroy();
    tick(50);

    expect(hideAlertSpy).not.toHaveBeenCalled();
    expect(hideEventSpy).not.toHaveBeenCalled();
    expect(document.querySelector('.cookiealert')).toBeNull();
  }));

  it('does not run the initial show animation style update after destroy', virtualAsync(() => {
    const { fixture, directive } = setup();
    const renderer = (directive as unknown as CookieAlertDirectiveInternals).host.renderer;
    const setStyleSpy = spyOn(renderer, 'setStyle').and.stub();

    directive.show();
    setStyleSpy.calls.reset();
    fixture.destroy();
    tick(10);

    expect(setStyleSpy).not.toHaveBeenCalled();
    expect(document.querySelector('.cookiealert')).toBeNull();
  }));

  it('clears the earlier retry timer before scheduling another retry', virtualAsync(() => {
    const { directive } = setup();
    const internals = directive as unknown as CookieAlertDirectiveInternals;
    const initializeSpy = spyOn(internals, 'initialize').and.stub();

    internals.handleError('retry failed', new Error('first'));
    internals.handleError('retry failed', new Error('second'));

    tick(1000);
    expect(initializeSpy).not.toHaveBeenCalled();

    tick(1000);
    expect(initializeSpy).toHaveBeenCalledTimes(1);
  }));
});
