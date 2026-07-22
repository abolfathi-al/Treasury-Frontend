import {
  Component,
  Directive,
  input,
  provideZonelessChangeDetection,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  bindInputEffects,
  createDomListenerManager,
  createOptionsManager,
  runSafely,
} from './directive-helpers';

interface HelperOptions {
  readonly label: string;
  readonly disabled: boolean;
}

@Directive({
  selector: '[vlDirectiveHelperSpec]',
  standalone: true,
})
class DirectiveHelperSpecDirective {
  readonly label = input<string>('default');
  readonly disabled = input(false);
  readonly manager = createOptionsManager<HelperOptions>({
    label: 'default',
    disabled: false,
  });
  readonly reinitCount = signal(0);

  constructor() {
    bindInputEffects(
      [
        {
          input: this.label,
          key: 'label',
          transform: (value: string) => value.trim(),
        },
        { input: this.disabled, key: 'disabled' },
      ],
      (key, value) => this.manager.setOption(key, value),
      () => this.reinitCount.update((count) => count + 1)
    );
  }
}

@Component({
  imports: [DirectiveHelperSpecDirective],
  standalone: true,
  template: `
    <div
      vlDirectiveHelperSpec
      [label]="label()"
      [disabled]="disabled()"
    ></div>
  `,
})
class DirectiveHelperSpecHostComponent {
  readonly label = signal('default');
  readonly disabled = signal(false);
  readonly directive = viewChild.required(DirectiveHelperSpecDirective);
}

describe('directive helpers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('does not call the reinitialize callback when a changed input normalizes to the current option value', () => {
    const fixture = TestBed.createComponent(DirectiveHelperSpecHostComponent);
    fixture.detectChanges();

    const directive = fixture.componentInstance.directive();
    expect(directive.manager.snapshot().label).toBe('default');
    expect(directive.reinitCount()).toBe(0);

    fixture.componentInstance.label.set(' next ');
    fixture.detectChanges();

    expect(directive.manager.snapshot().label).toBe('next');
    expect(directive.reinitCount()).toBe(1);

    fixture.componentInstance.label.set('next');
    fixture.detectChanges();

    expect(directive.manager.snapshot().label).toBe('next');
    expect(directive.reinitCount()).toBe(1);
  });

  it('calls the reinitialize callback once for simultaneous input changes', () => {
    const fixture = TestBed.createComponent(DirectiveHelperSpecHostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive();

    fixture.componentInstance.label.set('next');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(directive.manager.snapshot()).toEqual({
      label: 'next',
      disabled: true,
    });
    expect(directive.reinitCount()).toBe(1);
  });

  it('clears every registered DOM listener even when one unlistener throws', () => {
    const calls: string[] = [];
    const cleanupError = new Error('first cleanup failed');
    const warnSpy = spyOn(console, 'warn');
    const renderer: Pick<Renderer2, 'listen'> = {
      listen: (_target: unknown, eventName: string) => {
        return () => {
          calls.push(eventName);
          if (eventName === 'first') {
            throw cleanupError;
          }
        };
      },
    };
    const manager = createDomListenerManager(renderer as Renderer2, true);

    manager.add('window', 'first', () => undefined);
    manager.add('window', 'second', () => undefined);

    expect(() => manager.clear()).not.toThrow();
    expect(calls).toEqual(['first', 'second']);
    expect(warnSpy).toHaveBeenCalledOnceWith(
      'One or more directive DOM listeners failed to clean up',
      {
        errors: [cleanupError],
      }
    );
  });

  it('normalizes non-Error thrown values before reporting them', () => {
    const reportedErrors: Error[] = [];

    const result = runSafely(
      () => {
        throw 'plugin failed';
      },
      (error) => reportedErrors.push(error)
    );

    expect(result).toBeUndefined();
    expect(reportedErrors.length).toBe(1);
    expect(reportedErrors[0]).toEqual(jasmine.any(Error));
    expect(reportedErrors[0].message).toBe('plugin failed');
  });
});
