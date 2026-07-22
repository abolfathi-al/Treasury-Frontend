import {
  Directive,
  OnChanges,
  OnInit,
  OutputEmitterRef,
  SimpleChanges,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import noUiSlider, { API, Options } from 'nouislider';

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface NoUiSliderOptions {
  start?: number | number[] | string | string[];
  connect?: boolean | boolean[];
  direction?: 'ltr' | 'rtl';
  orientation?: 'horizontal' | 'vertical';
  margin?: number;
  limit?: number;
  padding?: number | number[];
  step?: number;
  range?: { min?: number | number[]; max?: number | number[] };
  animate?: boolean;
  animationDuration?: number;
  format?: { to?: (value: number) => string | number; from?: (value: string) => number };
  tooltips?:
    | boolean
    | boolean[]
    | { to?: (value: number) => string | number; from?: (value: string) => number }[];
  pips?: {
    mode?: 'range' | 'steps' | 'positions' | 'count' | 'values';
    density?: number;
    filter?: (value: number, type: number) => number | number[];
    values?: number | number[];
    stepped?: boolean;
    format?: { to?: (value: number) => string | number; from?: (value: string) => number };
  };
  keyboardSupport?: boolean;
  keyboardPageMultiplier?: number;
  keyboardMultiplier?: number;
  keyboardDefaultStep?: number;
  documentElement?: HTMLElement;
  handleAttributes?: Array<{ [key: string]: unknown }>;
  ariaFormat?: { to?: (value: number) => string | number; from?: (value: string) => number };
  cssPrefix?: string;
  cssClasses?: {
    target?: string;
    base?: string;
    origin?: string;
    handle?: string;
    handleLower?: string;
    handleUpper?: string;
    touchArea?: string;
    horizontal?: string;
    vertical?: string;
    background?: string;
    connect?: string;
    connects?: string;
    ltr?: string;
    rtl?: string;
    textDirectionLtr?: string;
    textDirectionRtl?: string;
    draggable?: string;
    drag?: string;
    tap?: string;
    active?: string;
    tooltip?: string;
    pips?: string;
    pipsHorizontal?: string;
    pipsVertical?: string;
    marker?: string;
    markerHorizontal?: string;
    markerVertical?: string;
    markerNormal?: string;
    markerLarge?: string;
    markerSub?: string;
    value?: string;
    valueHorizontal?: string;
    valueVertical?: string;
    valueNormal?: string;
    valueLarge?: string;
    valueSub?: string;
  };
  onStart?: (
    values: string[],
    handle: number,
    unencoded: number[],
    tap: boolean,
    positions: number[]
  ) => void;
  onChange?: (
    values: string[],
    handle: number,
    unencoded: number[],
    tap: boolean,
    positions: number[]
  ) => void;
  onUpdate?: (
    values: string[],
    handle: number,
    unencoded: number[],
    tap: boolean,
    positions: number[]
  ) => void;
  onEnd?: (
    values: string[],
    handle: number,
    unencoded: number[],
    tap: boolean,
    positions: number[]
  ) => void;
  onSet?: (
    values: string[],
    handle: number,
    unencoded: number[],
    tap: boolean,
    positions: number[]
  ) => void;
}

export interface NoUiSliderValidationResult {
  isValid: boolean;
  values: number[];
  positions: number[];
  errors: string[];
}

export interface NoUiSliderError {
  code: string;
  message: string;
  details?: unknown;
}

const DEFAULT_OPTIONS: Required<
  Pick<
    NoUiSliderOptions,
    'start' | 'connect' | 'range' | 'step' | 'tooltips' | 'keyboardSupport' | 'animate'
  >
> = {
  start: 20,
  connect: true,
  range: { min: 0, max: 100 },
  step: 1,
  tooltips: true,
  keyboardSupport: true,
  animate: true,
};

@Directive({
  selector: '[vlVeloraNoUiSlider]',
  exportAs: 'vlVeloraNoUiSlider',
  standalone: true,
})
export class NoUiSliderDirective
  extends BaseDirective<NoUiSliderOptions, NoUiSliderError>
  implements OnInit, OnChanges
{
  private readonly host = useDirectiveHost();
  private readonly cssLoader = inject(CssLoaderService);

  private instance: API | null = null;

  private readonly _values = signal<number[]>([]);
  private readonly _positions = signal<number[]>([]);
  private readonly _isValid = signal<boolean>(true);

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly values = computed(() => this._values());
  readonly positions = computed(() => this._positions());
  readonly isValid = computed(() => this._isValid());

  readonly noUiSliderStart = input<number | number[] | string | string[]>();
  readonly noUiSliderConnect = input<boolean | boolean[]>();
  readonly noUiSliderDirection = input<'ltr' | 'rtl'>();
  readonly noUiSliderOrientation = input<'horizontal' | 'vertical'>();
  readonly noUiSliderMargin = input<number>();
  readonly noUiSliderLimit = input<number>();
  readonly noUiSliderPadding = input<number | number[]>();
  readonly noUiSliderStep = input<number>();
  readonly noUiSliderRangeMin = input<number>();
  readonly noUiSliderRangeMax = input<number>();
  readonly noUiSliderAnimate = input<boolean>();
  readonly noUiSliderAnimationDuration = input<number>();
  readonly noUiSliderTooltips = input<boolean | boolean[]>();
  readonly noUiSliderKeyboardSupport = input<boolean>();

  /* eslint-disable @angular-eslint/no-output-rename -- Public event aliases are used by modules/** dashboard showcase templates. */
  readonly sliderStart = output<{
    values: string[];
    handle: number;
    unencoded: number[];
    tap: boolean;
    positions: number[];
  }>({ alias: 'noUiSliderStart' });
  readonly sliderChange = output<{
    values: string[];
    handle: number;
    unencoded: number[];
    tap: boolean;
    positions: number[];
  }>({ alias: 'noUiSliderChange' });
  readonly sliderUpdate = output<{
    values: string[];
    handle: number;
    unencoded: number[];
    tap: boolean;
    positions: number[];
  }>({ alias: 'noUiSliderUpdate' });
  readonly sliderEnd = output<{
    values: string[];
    handle: number;
    unencoded: number[];
    tap: boolean;
    positions: number[];
  }>({ alias: 'noUiSliderEnd' });
  /* eslint-enable @angular-eslint/no-output-rename */
  readonly setEvent = output<{
    values: string[];
    handle: number;
    unencoded: number[];
    tap: boolean;
    positions: number[];
  }>();
  readonly validationChange = output<NoUiSliderValidationResult>();

  constructor() {
    super(inject(LoggerService), 'NoUiSliderDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initInputEffects();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.cssLoader
      .loadCss('nouislider.css')
      .then(() => {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => this.bootstrap());
        } else {
          setTimeout(() => this.bootstrap(), 16);
        }
      })
      .catch((error) => {
        this.logger.error('Failed to load CSS', 'NoUiSliderDirective', { error });
        this.bootstrap();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBaseInitialized()) return;

    const requiresReinit = !!(
      changes['noUiSliderStart'] ||
      changes['noUiSliderRangeMin'] ||
      changes['noUiSliderRangeMax'] ||
      changes['noUiSliderStep']
    );

    if (requiresReinit) {
      this.reinitialize();
    } else {
      this.updateInstance();
    }
  }

  getValues(): number[] {
    return this._values();
  }

  getPositions(): number[] {
    return this._positions();
  }

  isValidSlider(): boolean {
    return this._isValid();
  }

  setValues(values: number | number[] | string | string[]): void {
    this.withInstance((inst) => {
      inst.set(values as string | string[]);
      this.updateValuesState();
    }, 'Set values failed');
  }

  reset(): void {
    const opts = this.optionsManager.snapshot();
    if (opts.start !== undefined) this.setValues(opts.start);
  }

  getOptions(): NoUiSliderOptions {
    return { ...this.optionsManager.snapshot() };
  }

  updateOptions(options: Partial<NoUiSliderOptions>): void {
    mergeOptionsIfChanged(this.optionsManager, options, () => this.reinitialize());
  }

  destroyNoUiSlider(): void {
    if (!this.instance) return;
    this.runOp(() => {
      this.instance?.destroy();
      this.instance = null;
      this.baseCleanup();
      this.status.setActive(false);
    }, 'Destroy failed');
  }

  private initInputEffects(): void {
    const bind = <T>(inputFn: () => T | undefined, key: keyof NoUiSliderOptions) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) this.updateOption(key, v as NoUiSliderOptions[typeof key]);
        });
      });
    };

    bind(() => this.noUiSliderStart(), 'start');
    bind(() => this.noUiSliderConnect(), 'connect');
    bind(() => this.noUiSliderDirection(), 'direction');
    bind(() => this.noUiSliderOrientation(), 'orientation');
    bind(() => this.noUiSliderMargin(), 'margin');
    bind(() => this.noUiSliderLimit(), 'limit');
    bind(() => this.noUiSliderPadding(), 'padding');
    bind(() => this.noUiSliderStep(), 'step');
    bind(() => this.noUiSliderAnimate(), 'animate');
    bind(() => this.noUiSliderAnimationDuration(), 'animationDuration');
    bind(() => this.noUiSliderTooltips(), 'tooltips');
    bind(() => this.noUiSliderKeyboardSupport(), 'keyboardSupport');

    effect(() => {
      const v = this.noUiSliderRangeMin();
      untracked(() => {
        if (v !== undefined)
          this.updateOption('range', { ...this.optionsManager.snapshot().range, min: v });
      });
    });

    effect(() => {
      const v = this.noUiSliderRangeMax();
      untracked(() => {
        if (v !== undefined)
          this.updateOption('range', { ...this.optionsManager.snapshot().range, max: v });
      });
    });
  }

  protected override updateOption<K extends keyof NoUiSliderOptions>(
    key: K,
    value: NoUiSliderOptions[K]
  ): boolean {
    let changed = false;
    this.runOp(() => {
      changed = setOptionIfChanged(this.optionsManager, key, value);
    }, 'Update option failed');
    return changed;
  }

  private bootstrap(): void {
    const el = this.getElement();
    if (!el) {
      this.handleError('Bootstrap failed', new Error('Element not found'));
      return;
    }

    this.status.setLoading(true);
    this.status.setError(null);

    const inst = runSafely(
      () => this.createInstance(el),
      (error) => this.handleError('Create instance failed', error)
    );

    if (!inst) {
      this.status.setLoading(false);
      return;
    }

    this.instance = inst;
    this.markBaseInitialized();
    this.status.setActive(true);
    this.status.setLoading(false);

    this.updateValuesFromOptions();
    this.updateValuesState();
    this.updateValidationState();
    this.addAriaAttributes();
  }

  private reinitialize(): void {
    this.destroyNoUiSlider();
    this.bootstrap();
  }

  private getElement(): HTMLElement | null {
    return this.host.elementRef.nativeElement;
  }

  private createInstance(el: HTMLElement): API {
    const opts = this.buildOptions();
    return noUiSlider.create(el, opts);
  }

  private buildOptions(): Options {
    const opts = this.optionsManager.snapshot();
    const config: Options = { ...(opts as Options) };
    this.attachCallbacks(config, opts);
    return config;
  }

  private attachCallbacks(config: Options, opts: NoUiSliderOptions): void {
    const wrap =
      (message: string, emitter: OutputEmitterRef<unknown> | undefined, callback?: (...args: unknown[]) => void) =>
      (
        values: string[],
        handle: number,
        unencoded: number[],
        tap: boolean,
        positions: number[]
      ) => {
        this.runOp(() => {
          this._values.set(unencoded);
          this._positions.set(positions);
          emitter?.emit({ values, handle, unencoded, tap, positions });
          this.updateValidationState();
          this.updateAriaForHandle(handle, unencoded[handle]);
        }, message);

        runSafely(
          () => callback?.(values, handle, unencoded, tap, positions),
          (error) => this.handleError(message, error)
        );
      };

    const extConfig = config as {
      onStart?: ReturnType<typeof wrap>;
      onChange?: ReturnType<typeof wrap>;
      onUpdate?: ReturnType<typeof wrap>;
      onEnd?: ReturnType<typeof wrap>;
      onSet?: ReturnType<typeof wrap>;
    };

    extConfig.onStart = wrap('onStart failed', this.sliderStart, opts.onStart as (...args: unknown[]) => void);
    extConfig.onChange = wrap('onChange failed', this.sliderChange, opts.onChange as (...args: unknown[]) => void);
    extConfig.onUpdate = wrap('onUpdate failed', this.sliderUpdate, opts.onUpdate as (...args: unknown[]) => void);
    extConfig.onEnd = wrap('onEnd failed', this.sliderEnd, opts.onEnd as (...args: unknown[]) => void);
    extConfig.onSet = wrap('onSet failed', this.setEvent, opts.onSet as (...args: unknown[]) => void);
  }

  private updateInstance(): void {
    this.runOp(() => {
      if (!this.instance) {
        this.logger.error('Instance not available', 'NoUiSliderDirective');
        return;
      }

      const opts = this.optionsManager.snapshot();
      Object.keys(opts).forEach((key) => {
        const k = key as keyof NoUiSliderOptions;
        const v = opts[k];
        if (v !== undefined) {
          (this.instance as unknown as Record<string, unknown>)[k] = v;
        }
      });
    }, 'Update instance failed');
  }

  private updateValuesFromOptions(): void {
    const opts = this.optionsManager.snapshot();
    if (opts.start === undefined) return;

    const startVals = Array.isArray(opts.start) ? opts.start : [opts.start];
    this._values.set(startVals.map((v) => (typeof v === 'string' ? parseFloat(v) : v)));
  }

  private updateValuesState(): void {
    this.runOp(() => {
      if (!this.instance) return;

      const raw = this.instance.get();
      const vals = Array.isArray(raw) ? raw : [raw];
      this._values.set(vals.map((v) => (typeof v === 'string' ? parseFloat(v) : Number(v))));
      this._positions.set([]);
      this.updateValidationState();
    }, 'Update values state failed');
  }

  private updateValidationState(): void {
    const valid = this.validateSlider();
    this._isValid.set(valid);

    this.validationChange.emit({
      isValid: valid,
      values: this._values(),
      positions: this._positions(),
      errors: valid ? [] : ['Slider validation failed'],
    });
  }

  private validateSlider(): boolean {
    if (!this.instance) return false;

    const vals = this._values();
    const opts = this.optionsManager.snapshot();

    if (opts.range) {
      const min = Array.isArray(opts.range.min)
        ? Math.min(...opts.range.min)
        : opts.range.min ?? 0;
      const max = Array.isArray(opts.range.max)
        ? Math.max(...opts.range.max)
        : opts.range.max ?? 100;

      return vals.every((v) => v >= min && v <= max);
    }

    return vals.length > 0;
  }

  private addAriaAttributes(): void {
    if (!this.host.isBrowser || !this.instance) return;

    this.runOp(() => {
      const el = this.getElement();
      if (!el) return;

      const handles = el.querySelectorAll<HTMLElement>('.noUi-handle');
      const opts = this.optionsManager.snapshot();
      const rangeMin = Array.isArray(opts.range?.min)
        ? Math.min(...opts.range.min)
        : opts.range?.min ?? 0;
      const rangeMax = Array.isArray(opts.range?.max)
        ? Math.max(...opts.range.max)
        : opts.range?.max ?? 100;
      const vals = this._values();

      handles.forEach((handle, i) => {
        const isLower = handle.classList.contains('noUi-handle-lower');
        const isUpper = handle.classList.contains('noUi-handle-upper');
        const isSingle = handles.length === 1;

        handle.setAttribute('role', 'slider');
        handle.setAttribute('tabindex', '0');

        if (isSingle) {
          handle.setAttribute('aria-label', 'Slider value');
        } else if (isLower) {
          handle.setAttribute('aria-label', 'Minimum value');
        } else if (isUpper) {
          handle.setAttribute('aria-label', 'Maximum value');
        } else {
          handle.setAttribute('aria-label', `Slider handle ${i + 1}`);
        }

        const val = vals[i] ?? (isLower ? rangeMin : rangeMax);
        handle.setAttribute('aria-valuenow', String(val));
        handle.setAttribute('aria-valuemin', String(rangeMin));
        handle.setAttribute('aria-valuemax', String(rangeMax));
      });
    }, 'Add ARIA failed');
  }

  private updateAriaForHandle(handleIdx: number, value: number): void {
    if (!this.host.isBrowser || !this.instance) return;

    this.runOp(() => {
      const el = this.getElement();
      if (!el) return;

      const handles = el.querySelectorAll<HTMLElement>('.noUi-handle');
      if (handleIdx >= 0 && handleIdx < handles.length) {
        handles[handleIdx].setAttribute('aria-valuenow', String(value));
      }
    }, 'Update ARIA failed');
  }

  private cleanup(): void {
    this.destroyNoUiSlider();
    this.baseCleanup();
    this._values.set([]);
    this._positions.set([]);
    this._isValid.set(false);
  }

  private runOp(action: () => void, message: string): void {
    runSafely(action, (error) => this.handleError(message, error));
  }

  private withInstance(action: (inst: API) => void, message: string): void {
    if (!this.instance) {
      this.logger.error('Instance not available', 'NoUiSliderDirective');
      return;
    }
    this.runOp(() => action(this.instance!), message);
  }

  private handleError(message: string, error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    const errorObj: NoUiSliderError = {
      code: 'NOUISLIDER_ERROR',
      message,
      details: err.message,
    };
    this.status.setError(errorObj);
    this.logger.error(message, 'NoUiSliderDirective', { error: err });
  }
}
