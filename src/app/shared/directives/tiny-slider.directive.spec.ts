import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';

import { TinySliderDirective } from './tiny-slider.directive';

type TinySliderDirectiveInternals = {
  bootstrap: () => void;
  initSlider: () => void;
  scheduleBootstrap: () => void;
  scheduleInit: () => void;
  waitForChildren: (element: HTMLElement, attempt?: number) => void;
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
  const frameMap = new Map<number, number>();

  const timerWindow = Object.create(window) as Pick<
    Window,
    'setTimeout' | 'clearTimeout' | 'requestAnimationFrame' | 'cancelAnimationFrame'
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

  timerWindow.requestAnimationFrame = ((callback: FrameRequestCallback): number => {
    const frameId = nextTimerId++;
    const realTimerId = window.setTimeout(() => callback(16), 16);
    frameMap.set(frameId, realTimerId);
    return frameId;
  }) as Window['requestAnimationFrame'];

  timerWindow.cancelAnimationFrame = ((frameId: number): void => {
    const realTimerId = frameMap.get(frameId);
    if (realTimerId === undefined) return;
    window.clearTimeout(realTimerId);
    frameMap.delete(frameId);
  }) as Window['cancelAnimationFrame'];

  return timerWindow as unknown as Window;
}

@Component({
  imports: [TinySliderDirective],
  standalone: true,
  template: `
    <div vlVeloraTinySlider>
      <div>A</div>
      <div>B</div>
    </div>
  `,
})
class HostComponent {
  readonly directive = viewChild.required(TinySliderDirective);
}

@Component({
  imports: [TinySliderDirective],
  standalone: true,
  template: `<div vlVeloraTinySlider></div>`,
})
class EmptyHostComponent {
  readonly directive = viewChild.required(TinySliderDirective);
}

describe('TinySliderDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: WINDOW, useFactory: createTimerWindow },
        {
          provide: CssLoaderService,
          useValue: {
            loadCss: jasmine
              .createSpy('cssLoader.loadCss')
              .and.returnValue(new Promise<void>(() => {})),
          },
        },
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

  function setup(): {
    directive: TinySliderDirective;
    fixture: ComponentFixture<HostComponent>;
    hostElement: HTMLElement;
    internals: TinySliderDirectiveInternals;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('[vlVeloraTinySlider]') as HTMLElement;
    const directive = fixture.componentInstance.directive();

    return {
      directive,
      fixture,
      hostElement,
      internals: directive as unknown as TinySliderDirectiveInternals,
    };
  }

  function setupEmpty(): {
    directive: TinySliderDirective;
    fixture: ComponentFixture<EmptyHostComponent>;
    hostElement: HTMLElement;
    internals: TinySliderDirectiveInternals;
  } {
    const fixture = TestBed.createComponent(EmptyHostComponent);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('[vlVeloraTinySlider]') as HTMLElement;
    const directive = fixture.componentInstance.directive();

    return {
      directive,
      fixture,
      hostElement,
      internals: directive as unknown as TinySliderDirectiveInternals,
    };
  }

  it('initializes public state without creating slider while CSS loading is pending', () => {
    const { directive } = setup();

    expect(directive).toBeTruthy();
    expect(directive.isActive()).toBeFalse();
    expect(directive.isLoading()).toBeFalse();
    expect(directive.error()).toBeNull();
    expect(directive.getCurrentIndex()).toBe(0);
    expect(directive.getSlideCount()).toBe(0);
    expect(directive.isValidSlider()).toBeTrue();
    expect(directive.getInfo()).toBeNull();
  });

  it('cancels scheduled bootstrap frame when destroyed before the frame runs', virtualAsync(() => {
    const { fixture, internals } = setup();
    const globalRequestAnimationFrame = window.requestAnimationFrame;
    const globalCancelAnimationFrame = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((callback: FrameRequestCallback): number =>
      window.setTimeout(() => callback(16), 16)) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((frameId: number): void => {
      window.clearTimeout(frameId);
    }) as typeof window.cancelAnimationFrame;

    try {
      const bootstrapSpy = spyOn(internals, 'bootstrap').and.stub();

      internals.scheduleBootstrap();
      fixture.destroy();
      tick(16);

      expect(bootstrapSpy).not.toHaveBeenCalled();
    } finally {
      window.requestAnimationFrame = globalRequestAnimationFrame;
      window.cancelAnimationFrame = globalCancelAnimationFrame;
    }
  }));

  it('clears deferred initialization when destroyed before init runs', virtualAsync(() => {
    const { fixture, internals } = setup();
    const initSliderSpy = spyOn(internals, 'initSlider').and.stub();

    internals.scheduleInit();
    fixture.destroy();
    tick(0);

    expect(initSliderSpy).not.toHaveBeenCalled();
  }));

  it('clears child wait timeout when destroyed before the next wait attempt', virtualAsync(() => {
    const { fixture, hostElement, internals } = setupEmpty();
    const waitForChildrenSpy = spyOn(internals, 'waitForChildren').and.callThrough();

    internals.waitForChildren(hostElement);
    fixture.destroy();
    tick(100);

    expect(waitForChildrenSpy).toHaveBeenCalledTimes(1);
  }));

  it('clears child wait timeout through the owning timer source only', virtualAsync(() => {
    const { fixture, hostElement, internals } = setupEmpty();
    const clearedGlobalTimerIds: number[] = [];
    const globalClearTimeout = window.clearTimeout;
    const callGlobalClearTimeout = globalClearTimeout as (timerId?: unknown) => void;
    window.clearTimeout = ((timerId?: unknown): void => {
      if (typeof timerId === 'number') clearedGlobalTimerIds.push(timerId);
      callGlobalClearTimeout(timerId);
    }) as typeof window.clearTimeout;

    try {
      internals.waitForChildren(hostElement);
      fixture.destroy();
    } finally {
      window.clearTimeout = globalClearTimeout;
    }

    expect(clearedGlobalTimerIds.some((timerId) => timerId >= 100_000)).toBeFalse();
  }));
});
