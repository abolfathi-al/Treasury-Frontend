import {
  Directive,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { CountUp } from 'countup.js';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { InputEffectBinding, runSafely } from './shared/directive-helpers';

export interface CountUpOptions {
  endVal?: number | null;
  startVal?: number;
  decimalPlaces?: number;
  duration?: number;
  useGrouping?: boolean;
  useIndianSeparators?: boolean;
  useEasing?: boolean;
  smartEasingThreshold?: number;
  smartEasingAmount?: number;
  separator?: string;
  decimal?: string;
  prefix?: string;
  suffix?: string;
  enableScrollSpy?: boolean;
  scrollSpyDelay?: number;
  scrollSpyOnce?: boolean;
  autoStart?: boolean;
}

export interface CountUpError {
  message: string;
  code: string;
  details?: unknown;
}

export interface CountUpValidationResult {
  isValid: boolean;
  errors: CountUpError[];
  warnings: string[];
}

type CountUpCtor = typeof import('countup.js').CountUp;

@Directive({
  selector: '[vlVeloraCountUp]',
  exportAs: 'vlVeloraCountUp',
  standalone: true,
})
export class CountUpDirective
  extends BaseDirective<CountUpOptions, CountUpError>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  private countUpInstance: CountUp | null = null;
  private countUpCtor: CountUpCtor | null = null;
  private countUpLoader: Promise<CountUpCtor> | null = null;
  private scrollSpyObserver: IntersectionObserver | null = null;

  private readonly _currentValue = signal<number>(0);
  private readonly _isAnimating = signal<boolean>(false);
  private readonly _isPaused = signal<boolean>(false);
  private readonly _isComplete = signal<boolean>(false);
  private readonly _validationResult = signal<CountUpValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  readonly currentValue = computed(() => this._currentValue());
  readonly isAnimating = computed(() => this._isAnimating());
  readonly isPaused = computed(() => this._isPaused());
  readonly isComplete = computed(() => this._isComplete());
  readonly validationResult = computed(() => this._validationResult());

  readonly countUpEndVal = input<number | null>();
  readonly countUpStartVal = input<number>();
  readonly countUpDecimalPlaces = input<number>();
  readonly countUpDuration = input<number>();
  readonly countUpUseGrouping = input<boolean>();
  readonly countUpUseIndianSeparators = input<boolean>();
  readonly countUpUseEasing = input<boolean>();
  readonly countUpSmartEasingThreshold = input<number>();
  readonly countUpSmartEasingAmount = input<number>();
  readonly countUpSeparator = input<string>();
  readonly countUpDecimal = input<string>();
  readonly countUpPrefix = input<string>();
  readonly countUpSuffix = input<string>();
  readonly countUpEnableScrollSpy = input<boolean>();
  readonly countUpScrollSpyDelay = input<number>();
  readonly countUpScrollSpyOnce = input<boolean>();
  readonly countUpAutoStart = input<boolean>();

  readonly startEvent = output<void>();
  readonly completeEvent = output<void>();
  readonly updateEvent = output<{ value: number; formatted: string }>();
  readonly pauseEvent = output<void>();
  readonly resumeEvent = output<void>();
  readonly resetEvent = output<void>();
  readonly errorEvent = output<CountUpError>();
  readonly validationChange = output<CountUpValidationResult>();

  constructor() {
    super(inject(LoggerService), 'CountUpDirective', {});
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.cleanup();
    });
    this.bindInputs(this.getInputBindings(), () => {
      if (this.countUpInstance) this.reinitialize();
    });
  }

  private getInputBindings(): InputEffectBinding<CountUpOptions>[] {
    return [
      { input: this.countUpEndVal, key: 'endVal' },
      { input: this.countUpStartVal, key: 'startVal' },
      { input: this.countUpDecimalPlaces, key: 'decimalPlaces' },
      { input: this.countUpDuration, key: 'duration' },
      { input: this.countUpUseGrouping, key: 'useGrouping' },
      { input: this.countUpUseIndianSeparators, key: 'useIndianSeparators' },
      { input: this.countUpUseEasing, key: 'useEasing' },
      { input: this.countUpSmartEasingThreshold, key: 'smartEasingThreshold' },
      { input: this.countUpSmartEasingAmount, key: 'smartEasingAmount' },
      { input: this.countUpSeparator, key: 'separator' },
      { input: this.countUpDecimal, key: 'decimal' },
      { input: this.countUpPrefix, key: 'prefix' },
      { input: this.countUpSuffix, key: 'suffix' },
      { input: this.countUpEnableScrollSpy, key: 'enableScrollSpy' },
      { input: this.countUpScrollSpyDelay, key: 'scrollSpyDelay' },
      { input: this.countUpScrollSpyOnce, key: 'scrollSpyOnce' },
      { input: this.countUpAutoStart, key: 'autoStart' },
    ];
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncInputs(this.getInputBindings());
    this.bootstrap();
  }

  start(): void {
    this.runOperation(() => {
      if (!this.countUpInstance) return;
      this._isAnimating.set(true);
      this._isPaused.set(false);
      this._isComplete.set(false);
      this.startEvent.emit();
      this.countUpInstance.start(() => this.handleUpdate());
    }, 'Start animation failed');
  }

  pauseResume(): void {
    this.runOperation(() => {
      if (!this.countUpInstance) return;
      this.countUpInstance.pauseResume();
      if (this._isPaused()) {
        this._isPaused.set(false);
        this.resumeEvent.emit();
      } else {
        this._isPaused.set(true);
        this.pauseEvent.emit();
      }
    }, 'Pause/Resume failed');
  }

  reset(): void {
    this.runOperation(() => {
      if (!this.countUpInstance) return;
      this.countUpInstance.reset();
      this._isAnimating.set(false);
      this._isPaused.set(false);
      this._isComplete.set(false);
      this._currentValue.set(this.optionsManager.snapshot().startVal || 0);
      this.resetEvent.emit();
    }, 'Reset failed');
  }

  update(endVal: number): void {
    this.runOperation(() => {
      if (!this.countUpInstance) return;
      this.countUpInstance.update(endVal);
    }, 'Update failed');
  }

  getOptions(): CountUpOptions {
    return this.optionsManager.snapshot();
  }

  getCurrentValue(): number {
    return this._currentValue();
  }

  isValidCountUp(): boolean {
    return this._validationResult().isValid;
  }

  getValidationResult(): CountUpValidationResult {
    return this._validationResult();
  }

  refresh(): void {
    this.reinitialize();
  }

  recreate(): void {
    this.cleanup();
    if (this.countUpCtor) {
      this.initialize();
    } else {
      this.bootstrap();
    }
  }

  destroyCountUp(): void {
    this.cleanup();
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (this.isBaseDestroyed() || !this.host.isBrowser) return;
        this.initialize();
      })
      .catch((error) => this.handleError('Failed to load CountUp library', 'LOAD_ERROR', error));
  }

  private loadLibrary(): Promise<CountUpCtor> {
    if (this.countUpLoader) return this.countUpLoader;

    this.countUpLoader = import('countup.js').then((module) => {
      this.countUpCtor = module.CountUp;
      return module.CountUp;
    });

    return this.countUpLoader;
  }

  private initialize(): void {
    if (!this.countUpCtor) return;

    this.status.setLoading(true);
    this.status.setError(null);

    const validation = this.validate();
    this._validationResult.set(validation);
    this.validationChange.emit(validation);

    if (!validation.isValid) {
      this.handleError('Validation failed', 'VALIDATION_ERROR', validation.errors);
      return;
    }

    const endVal = this.getEndValue();
    const options = this.optionsManager.snapshot();
    this.createInstance(endVal, options);
  }

  private createInstance(endVal: number, options: CountUpOptions): void {
    if (!this.host.elementRef.nativeElement) {
      this.handleError('Element not ready', 'INSTANCE_ERROR');
      return;
    }

    const ctor = this.countUpCtor;
    if (!ctor) {
      this.handleError('CountUp constructor not loaded', 'INSTANCE_ERROR');
      return;
    }

    const instance = runSafely(
      () =>
        new ctor(this.host.elementRef.nativeElement, endVal, {
          ...options,
          onStartCallback: () => this.handleStart(),
          onCompleteCallback: () => this.handleComplete(),
        }),
      (error) => this.handleError('CountUp instance creation failed', 'INSTANCE_ERROR', error)
    );

    if (!instance) return;

    this.countUpInstance = instance;

    if (this.countUpInstance.error) {
      this.handleError('CountUp instance creation failed', 'INSTANCE_ERROR', this.countUpInstance.error);
      return;
    }

    this.status.setActive(true);
    this.status.setLoading(false);
    this._currentValue.set(options.startVal || 0);
    this.markBaseInitialized();

    if (options.enableScrollSpy) {
      this.setupScrollSpy();
    } else if (options.autoStart) {
      this.start();
    }
  }

  private getEndValue(): number {
    const options = this.optionsManager.snapshot();
    if (options.endVal !== null && options.endVal !== undefined) return options.endVal;

    const textContent = this.host.elementRef.nativeElement.textContent?.trim();
    if (textContent) {
      const numericValue = parseFloat(textContent.replace(/[^\d.-]/g, ''));
      if (!isNaN(numericValue)) return numericValue;
    }

    return 0;
  }

  private validate(): CountUpValidationResult {
    const errors: CountUpError[] = [];
    const warnings: string[] = [];
    const options = this.optionsManager.snapshot();

    if (
      options.endVal !== null &&
      options.endVal !== undefined &&
      (isNaN(options.endVal) || !isFinite(options.endVal))
    ) {
      errors.push({ message: 'End value must be a valid number', code: 'INVALID_END_VAL' });
    }

    if (
      options.startVal !== undefined &&
      (isNaN(options.startVal) || !isFinite(options.startVal))
    ) {
      errors.push({ message: 'Start value must be a valid number', code: 'INVALID_START_VAL' });
    }

    if (options.duration !== undefined && options.duration < 0) {
      errors.push({ message: 'Duration must be non-negative', code: 'INVALID_DURATION' });
    }

    if (
      options.decimalPlaces !== undefined &&
      (options.decimalPlaces < 0 || !Number.isInteger(options.decimalPlaces))
    ) {
      errors.push({ message: 'Decimal places must be a non-negative integer', code: 'INVALID_DECIMAL_PLACES' });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private setupScrollSpy(): void {
    if (!this.host.isBrowser || typeof IntersectionObserver === 'undefined') return;

    const options = this.optionsManager.snapshot();
    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.start();
            if (options.scrollSpyOnce) this.scrollSpyObserver?.disconnect();
          }, options.scrollSpyDelay || 0);
        }
      });
    });

    this.scrollSpyObserver.observe(this.host.elementRef.nativeElement);
  }

  private reinitialize(): void {
    this.cleanup();
    this.initialize();
  }

  private cleanup(): void {
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
      this.scrollSpyObserver = null;
    }
    this.countUpInstance = null;
    this.status.setActive(false);
    this._isAnimating.set(false);
    this._isPaused.set(false);
    this._isComplete.set(false);
  }

  private handleStart(): void {
    this._isAnimating.set(true);
    this._isPaused.set(false);
    this._isComplete.set(false);
    this.startEvent.emit();
  }

  private handleComplete(): void {
    this._isAnimating.set(false);
    this._isPaused.set(false);
    this._isComplete.set(true);
    this.completeEvent.emit();
  }

  private handleUpdate(): void {
    const currentValue = parseFloat(
      this.host.elementRef.nativeElement.textContent?.replace(/[^\d.-]/g, '') || '0'
    );
    const formatted = this.host.elementRef.nativeElement.textContent || '';
    this._currentValue.set(currentValue);
    this.updateEvent.emit({ value: currentValue, formatted });
  }

  private handleError(message: string, code: string, details?: unknown): void {
    const error: CountUpError = { message, code, details };
    this.status.setError(error);
    this.status.setLoading(false);
    this.status.setActive(false);
    this.errorEvent.emit(error);
    this.logger.error(message, 'CountUpDirective', details as Record<string, unknown> | undefined);
  }
}
