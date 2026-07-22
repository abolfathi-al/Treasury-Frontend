import { Component, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';

import { InputmaskDirective, type InputmaskOptions } from './inputmask.directive';

type InputmaskDirectiveInternals = {
  debouncedValidate: () => void;
  handleErr: (message: string, error: Error, code?: string) => void;
  initInputmask: () => void;
  retryCount: number;
  validationTimeout: number | null;
  updateValidationState: () => void;
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
  const timerWindow = Object.create(window) as Pick<Window, 'setTimeout' | 'clearTimeout'>;

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
  imports: [InputmaskDirective],
  standalone: true,
  template: `
    <input
      vlVeloraInputmask
      [inputmaskMask]="mask"
      [inputmaskValidateOnInput]="validateOnInput"
      [inputmaskValidateOnBlur]="validateOnBlur"
    />
  `,
})
class HostComponent {
  readonly directive = viewChild.required(InputmaskDirective);

  mask = '999';
  validateOnInput = false;
  validateOnBlur = true;
}

@Component({
  imports: [InputmaskDirective],
  standalone: true,
  template: `
    <input
      vlVeloraInputmask
      [inputmaskOptions]="options()"
    />
  `,
})
class OptionsHostComponent {
  readonly directive = viewChild.required(InputmaskDirective);

  readonly options = signal<InputmaskOptions>({ mask: '999' });
}

describe('InputmaskDirective', () => {
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

  function setup(): {
    fixture: ComponentFixture<HostComponent>;
    directive: InputmaskDirective;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    return {
      fixture,
      directive: fixture.componentInstance.directive(),
    };
  }

  function setupOptionsHost(): {
    fixture: ComponentFixture<OptionsHostComponent>;
    directive: InputmaskDirective;
    input: HTMLInputElement;
  } {
    const fixture = TestBed.createComponent(OptionsHostComponent);
    fixture.detectChanges();

    return {
      fixture,
      directive: fixture.componentInstance.directive(),
      input: fixture.nativeElement.querySelector('input') as HTMLInputElement,
    };
  }

  it('initializes and exposes public value API', () => {
    const { directive } = setup();

    expect(directive).toBeTruthy();
    expect(directive.getMaskedValue()).toBe('');
    expect(directive.getUnmaskedValue()).toBe('');
    expect(directive.isValid()).toBeTrue();
    expect(directive.isComplete()).toBeFalse();
  });

  it('clears pending validation debounce when destroyed before it fires', virtualAsync(() => {
    const { fixture, directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;
    const updateValidationStateSpy = spyOn(internals, 'updateValidationState').and.callThrough();

    internals.debouncedValidate();
    fixture.destroy();
    tick(300);

    expect(updateValidationStateSpy).not.toHaveBeenCalled();
  }));

  it('replaces existing validation debounce timer when validation is requested again', virtualAsync(() => {
    const { directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;
    const updateValidationStateSpy = spyOn(internals, 'updateValidationState').and.callThrough();

    internals.debouncedValidate();
    internals.debouncedValidate();
    tick(300);

    expect(updateValidationStateSpy).toHaveBeenCalledTimes(1);
  }));

  it('clears pending validation debounce through the owning timer source only', virtualAsync(() => {
    const { fixture, directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;

    internals.debouncedValidate();
    const syntheticTimerId = internals.validationTimeout;
    const clearedGlobalTimerIds: number[] = [];
    const globalClearTimeout = window.clearTimeout;
    const callGlobalClearTimeout = globalClearTimeout as (timerId?: unknown) => void;
    window.clearTimeout = ((timerId?: unknown): void => {
      if (typeof timerId === 'number') clearedGlobalTimerIds.push(timerId);
      callGlobalClearTimeout(timerId);
    }) as typeof window.clearTimeout;

    try {
      fixture.destroy();
    } finally {
      window.clearTimeout = globalClearTimeout;
    }

    expect(clearedGlobalTimerIds).not.toContain(syntheticTimerId as number);
  }));

  it('clears pending retry when destroyed before it fires', virtualAsync(() => {
    const { fixture, directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;
    const initInputmaskSpy = spyOn(internals, 'initInputmask').and.stub();

    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');
    fixture.destroy();
    tick(1000);

    expect(initInputmaskSpy).not.toHaveBeenCalled();
  }));

  it('replaces existing retry timer when another retry is scheduled', virtualAsync(() => {
    const { directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;
    const initInputmaskSpy = spyOn(internals, 'initInputmask').and.stub();

    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');
    tick(999);
    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');
    tick(999);

    expect(initInputmaskSpy).not.toHaveBeenCalled();

    tick(1);

    expect(initInputmaskSpy).toHaveBeenCalledTimes(1);
  }));

  it('does not exhaust retry attempts with canceled replacement timers', virtualAsync(() => {
    const { directive } = setup();
    const internals = directive as unknown as InputmaskDirectiveInternals;
    const initInputmaskSpy = spyOn(internals, 'initInputmask').and.stub();

    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');
    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');
    internals.handleErr('failed', new Error('boom'), 'INSTANCE_CREATION_FAILED');

    expect(internals.retryCount).toBe(0);

    tick(1000);

    expect(initInputmaskSpy).toHaveBeenCalledTimes(1);
    expect(internals.retryCount).toBe(1);
  }));

  it('reinitializes the inputmask instance when options change after init', () => {
    const { fixture, directive, input } = setupOptionsHost();

    directive.setValue('1234');
    expect(input.value).toBe('123');

    fixture.componentInstance.options.set({ mask: '9999' });
    fixture.detectChanges();
    expect(directive.getOption('mask')).toBe('9999');
    directive.setValue('1234');

    expect(input.value).toBe('1234');
    expect(directive.getUnmaskedValue()).toBe('1234');
  });
});
