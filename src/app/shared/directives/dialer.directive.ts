import {
  Directive,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';

export interface DialerOptions {
  step: number;
  min: number | undefined;
  max: number | undefined;
  decimals: number;
  prefix: string;
  suffix: string;
}

export interface DialerChangeEvent {
  value: number;
  previousValue: number;
  source: 'manual' | 'increase' | 'decrease';
}

const DEFAULT_OPTIONS: DialerOptions = {
  step: 1,
  min: undefined,
  max: undefined,
  decimals: 0,
  prefix: '',
  suffix: '',
};

@Directive({
  selector: '[vlVeloraDialer]',
  exportAs: 'vlVeloraDialer',
  standalone: true,
})
export class DialerDirective
  extends BaseDirective<DialerOptions, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();

  private incElement: HTMLElement | null = null;
  private decElement: HTMLElement | null = null;
  private inputElement: HTMLInputElement | null = null;

  private readonly _value = signal<number>(0);
  private readonly _isActivated = signal<boolean>(true);
  readonly value = computed(() => this._value());

  readonly formattedValue = computed(() => this.formatValue(this._value()));
  readonly isAtMin = computed(() => {
    const { min } = this.optionsManager.snapshot();
    return min !== undefined && this._value() <= min;
  });
  readonly isAtMax = computed(() => {
    const { max } = this.optionsManager.snapshot();
    return max !== undefined && this._value() >= max;
  });

  readonly dialerValue = input<number>();
  readonly dialerActivate = input<boolean>();
  readonly dialerStep = input<number>();
  readonly dialerMin = input<number | undefined>();
  readonly dialerMax = input<number | undefined>();
  readonly dialerDecimals = input<number>();
  readonly dialerPrefix = input<string>();
  readonly dialerSuffix = input<string>();

  readonly valueChange = output<number>();
  readonly dialerChange = output<DialerChangeEvent>();
  readonly dialerIncrease = output<DialerChangeEvent>();
  readonly dialerDecrease = output<DialerChangeEvent>();

  constructor() {
    super(inject(LoggerService), 'DialerDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.bindInputs(this.getInputBindings());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.executeSafely(() => {
      if (!this.shouldInitialize()) return;
      this.syncInputs(this.getInputBindings());
      this.initializeDialer();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  private getInputBindings() {
    return [
      { input: this.dialerStep, key: 'step' as const },
      { input: this.dialerMin, key: 'min' as const },
      { input: this.dialerMax, key: 'max' as const },
      { input: this.dialerDecimals, key: 'decimals' as const },
      { input: this.dialerPrefix, key: 'prefix' as const },
      { input: this.dialerSuffix, key: 'suffix' as const },
    ];
  }

  increase(): void {
    if (!this.isBaseInitialized()) return;
    this.executeSafely(() => {
      const currentValue = this._value();
      const { step } = this.optionsManager.snapshot();
      const newValue = this.calculateNewValue(currentValue + step);

      if (newValue !== currentValue) {
        this.setValue(newValue, 'increase');
      }
    }, 'Increase failed');
  }

  decrease(): void {
    if (!this.isBaseInitialized()) return;
    this.executeSafely(() => {
      const currentValue = this._value();
      const { step } = this.optionsManager.snapshot();
      const newValue = this.calculateNewValue(currentValue - step);

      if (newValue !== currentValue) {
        this.setValue(newValue, 'decrease');
      }
    }, 'Decrease failed');
  }

  setValue(value: number, source: 'manual' | 'increase' | 'decrease' = 'manual'): void {
    if (!this.isBaseInitialized()) return;
    this.executeSafely(() => {
      const previousValue = this._value();
      const newValue = this.calculateNewValue(value);

      if (newValue !== previousValue) {
        this._value.set(newValue);
        this.emitValueChange(newValue, previousValue, source);
        this.updateButtonStates();
      }
    }, 'Set value failed');
  }

  private shouldInitialize(): boolean {
    return Boolean(this.host.elementRef.nativeElement) && this._isActivated();
  }

  private initializeDialer(): void {
    this.queryElements();
    this.setupEventListeners();
    this.updateButtonStates();
  }

  private queryElements(): void {
    const element = this.host.elementRef.nativeElement;

    this.incElement = element.querySelector('[data-velora-dialer-action="increase"]') as HTMLElement | null;
    this.decElement = element.querySelector('[data-velora-dialer-action="decrease"]') as HTMLElement | null;
    this.inputElement = element.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement | null;
  }

  private setupEventListeners(): void {
    if (this.incElement) {
      this.addBaseDomListener(this.incElement, 'click', () => this.increase());
    }
    if (this.decElement) {
      this.addBaseDomListener(this.decElement, 'click', () => this.decrease());
    }
    if (this.inputElement) {
      this.addBaseDomListener(this.inputElement, 'input', () => this.handleInputChange());
    }
  }

  private handleInputChange(): void {
    if (!this.inputElement) return;

    const inputValue = this.inputElement.value;
    const numericValue = this.parseInputValue(inputValue);

    if (!isNaN(numericValue)) {
      this.setValue(numericValue, 'manual');
    }
  }

  private parseInputValue(value: string): number {
    const options = this.optionsManager.snapshot();
    const cleanValue = value.replace(options.prefix, '').replace(options.suffix, '');
    const parsed = parseFloat(cleanValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private calculateNewValue(value: number): number {
    const options = this.optionsManager.snapshot();
    let newValue = value;

    if (options.min !== undefined) {
      newValue = Math.max(newValue, options.min);
    }

    if (options.max !== undefined) {
      newValue = Math.min(newValue, options.max);
    }

    return this.roundToDecimals(newValue, options.decimals);
  }

  private roundToDecimals(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  private formatValue(value: number): string {
    const options = this.optionsManager.snapshot();
    const roundedValue = this.roundToDecimals(value, options.decimals);
    return `${options.prefix}${roundedValue}${options.suffix}`;
  }

  private updateButtonStates(): void {
    if (this.incElement) {
      this.toggleElementDisabled(this.incElement, this.isAtMax());
    }
    if (this.decElement) {
      this.toggleElementDisabled(this.decElement, this.isAtMin());
    }
  }

  private toggleElementDisabled(element: HTMLElement, disabled: boolean): void {
    if (!this.host.isBrowser) return;

    this.setDataAttr(this.host.renderer, element, 'disabled', disabled ? 'true' : null);
    this.setClass(this.host.renderer, element, 'disabled', disabled);
  }

  private emitValueChange(
    newValue: number,
    previousValue: number,
    source: 'manual' | 'increase' | 'decrease'
  ): void {
    const changeEvent: DialerChangeEvent = { value: newValue, previousValue, source };

    this.valueChange.emit(newValue);
    this.dialerChange.emit(changeEvent);

    if (source === 'increase') {
      this.dialerIncrease.emit(changeEvent);
    } else if (source === 'decrease') {
      this.dialerDecrease.emit(changeEvent);
    }
  }

  protected override updateOption<K extends keyof DialerOptions>(key: K, value: DialerOptions[K]): boolean {
    const changed = this.optionsManager.setOption(key, value);
    if (changed) this.updateButtonStates();
    return changed;
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.clearBaseDomListeners();
      this.incElement = null;
      this.decElement = null;
      this.inputElement = null;
      this.baseCleanup();
      this.status.setError(null);
    }, 'Cleanup failed');
  }
}
