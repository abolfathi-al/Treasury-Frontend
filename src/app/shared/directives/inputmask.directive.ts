import {
  Directive,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import Inputmask from 'inputmask';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { mergeOptionsIfChanged, runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface InputmaskOptions {
  mask?: string | string[] | ((opts: Inputmask.Options) => string | string[]) | { alias: string; inputFormat?: string };
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  showValidationErrors?: boolean;
  customValidationMessage?: string;
  clearMaskOnLostFocus?: boolean;
  showMaskOnFocus?: boolean;
  showMaskOnHover?: boolean;
  insertMode?: boolean;
  insertModeVisual?: boolean;
  autoUnmask?: boolean;
  removeMaskOnSubmit?: boolean;
  clearIncomplete?: boolean;
  nullable?: boolean;
  noValuePatching?: boolean;
  positionCaretOnClick?: Inputmask.PositionCaretOnClick;
  positionCaretOnTab?: boolean;
  tabThrough?: boolean;
  numericInput?: boolean;
  rightAlign?: boolean;
  undoOnEscape?: boolean;
  shiftPositions?: boolean;
  usePrototypeDefinitions?: boolean;
  importDataAttributes?: boolean;
  jitMasking?: boolean;
  keepStatic?: boolean | null;
  greedy?: boolean;
  repeat?: number | string;
  skipOptionalPartCharacter?: string;
  inputmode?: Inputmask.InputMode;
  casing?: Inputmask.Casing;
  min?: string | number;
  max?: string | number;
  digits?: string | number;
  digitsOptional?: boolean;
  enforceDigitsOnBlur?: boolean;
  allowMinus?: boolean;
  negationSymbol?: { front: string; back: string };
  prefix?: string;
  suffix?: string;
  SetMaxOnOverflow?: boolean;
  step?: number;
  unmaskAsNumber?: boolean;
  inputType?: 'text' | 'number';
  roundingFN?: (input: number) => number;
  shortcuts?: { [shortcut: string]: string } | null;
  inputFormat?: string;
  stripLeadingZeroes?: boolean;
  substituteRadixPoint?: boolean;
  prefillYear?: boolean;
  radixPoint?: string;
  groupSeparator?: string;
  alias?: string;
  regex?: string;
  oncomplete?: () => void;
  onincomplete?: () => void;
  oncleared?: () => void;
  onKeyDown?: (event: KeyboardEvent, buffer: string[], caretPos: { begin: number; end: number }, opts: Inputmask.Options) => void;
  onBeforeMask?: (initialValue: string, opts: Inputmask.Options) => string;
  onBeforePaste?: (pastedValue: string, opts: Inputmask.Options) => string;
  onBeforeWrite?: (event: KeyboardEvent, buffer: string[], caretPos: number, opts: Inputmask.Options) => Inputmask.CommandObject;
  onUnMask?: (maskedValue: string, unmaskedValue: string) => string;
  onKeyValidation?: (key: number, result: boolean) => void;
  isComplete?: (buffer: string[], opts: Inputmask.Options) => boolean;
  postValidation?: (buffer: string[], pos: number, char: string, currentResult: boolean, opts: Inputmask.Options, maskset: any, strict: boolean, fromCheckval: boolean) => boolean | Inputmask.CommandObject;
  preValidation?: (buffer: string[], pos: number, char: string, isSelection: boolean, opts: Inputmask.Options, maskset: any, caretPos: { begin: number; end: number }, strict: boolean) => boolean | Inputmask.CommandObject;
}

export interface InputmaskValidationResult {
  isValid: boolean;
  isComplete: boolean;
  maskedValue: string;
  unmaskedValue: string;
  error?: string;
}

export interface InputmaskError {
  code: string;
  message: string;
  details?: any;
}

const DEFAULTS = {
  PLACEHOLDER: '_',
  DISABLED: false,
  READONLY: false,
  VALIDATE_ON_BLUR: true,
  VALIDATE_ON_INPUT: false,
  SHOW_VALIDATION_ERRORS: true,
  CUSTOM_VALIDATION_MESSAGE: '',
  DEBOUNCE_TIME: 300,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

const DEFAULT_OPTIONS: Required<Pick<InputmaskOptions, 'placeholder' | 'disabled' | 'readonly' | 'validateOnBlur' | 'validateOnInput' | 'showValidationErrors' | 'customValidationMessage'>> = {
  placeholder: DEFAULTS.PLACEHOLDER,
  disabled: DEFAULTS.DISABLED,
  readonly: DEFAULTS.READONLY,
  validateOnBlur: DEFAULTS.VALIDATE_ON_BLUR,
  validateOnInput: DEFAULTS.VALIDATE_ON_INPUT,
  showValidationErrors: DEFAULTS.SHOW_VALIDATION_ERRORS,
  customValidationMessage: DEFAULTS.CUSTOM_VALIDATION_MESSAGE,
} as const;

@Directive({
  selector: '[vlVeloraInputmask]',
  exportAs: 'vlVeloraInputmask',
  standalone: true,
})
export class InputmaskDirective extends BaseDirective<InputmaskOptions, InputmaskError> implements OnInit, OnDestroy {
  private readonly host = useDirectiveHost();
  private readonly window = this.host.isBrowser ? inject(WINDOW) : null;

  private instance: Inputmask.Instance | null = null;
  private validationTimeout: number | null = null;
  private retryCount = 0;
  private retryTimeout: number | null = null;
  private readonly ownedTimeoutClearers = new Map<number, () => void>();
  private blurListener: (() => void) | null = null;
  private inputListener: (() => void) | null = null;
  private changeListener: (() => void) | null = null;
  private static definitionsExtended = false;

  private readonly _isValid = signal<boolean>(true);
  private readonly _isComplete = signal<boolean>(false);
  private readonly _maskedValue = signal<string>('');
  private readonly _unmaskedValue = signal<string>('');

  readonly isValidSignal = computed(() => this._isValid());
  readonly isCompleteSignal = computed(() => this._isComplete());
  readonly maskedValue = computed(() => this._maskedValue());
  readonly unmaskedValue = computed(() => this._unmaskedValue());

  readonly inputmaskOptions = input<InputmaskOptions>();
  readonly inputmaskMask = input<string | string[] | ((opts: Inputmask.Options) => string | string[]) | { alias: string; inputFormat?: string }>();
  readonly inputmaskPlaceholder = input<string>();
  readonly inputmaskDisabled = input<boolean>();
  readonly inputmaskReadonly = input<boolean>();
  readonly inputmaskValidateOnBlur = input<boolean>();
  readonly inputmaskValidateOnInput = input<boolean>();
  readonly inputmaskShowValidationErrors = input<boolean>();
  readonly inputmaskCustomValidationMessage = input<string>();

  readonly complete = output<void>();
  readonly incomplete = output<void>();
  readonly cleared = output<void>();
  readonly keyDown = output<KeyboardEvent>();
  readonly beforeMask = output<string>();
  readonly beforePaste = output<string>();
  readonly beforeWrite = output<KeyboardEvent>();
  readonly unMask = output<{ maskedValue: string; unmaskedValue: string }>();
  readonly keyValidation = output<{ key: number; result: boolean }>();
  readonly validationChange = output<InputmaskValidationResult>();
  readonly valueChange = output<{ maskedValue: string; unmaskedValue: string }>();

  constructor() {
    super(inject(LoggerService), 'InputmaskDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBindings();
  }

  private initBindings(): void {
    effect(() => {
      const options = this.inputmaskOptions();
      untracked(() => {
        if (options && this.updateOptions(options) && this.isBaseInitialized()) {
          this.reinitialize();
        }
      });
    });

    effect(() => {
      const value = this.inputmaskMask();
      untracked(() => {
        if (value !== undefined) {
          this.updateOption('mask', value);
          if (this.isBaseInitialized()) this.reinitialize();
        }
      });
    });

    const createEffect = <K extends keyof InputmaskOptions>(
      inputFn: () => InputmaskOptions[K] | undefined,
      key: K,
      callback?: () => void
    ) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) {
            this.updateOption(key, v);
            if (callback && this.isBaseInitialized()) callback();
          }
        });
      });
    };

    createEffect(this.inputmaskPlaceholder, 'placeholder');
    createEffect(this.inputmaskDisabled, 'disabled', () => this.updateElementState());
    createEffect(this.inputmaskReadonly, 'readonly', () => this.updateElementState());
    createEffect(this.inputmaskValidateOnBlur, 'validateOnBlur', () => this.updateValidationHandlers());
    createEffect(this.inputmaskValidateOnInput, 'validateOnInput', () => this.updateValidationHandlers());
    createEffect(this.inputmaskShowValidationErrors, 'showValidationErrors');
    createEffect(this.inputmaskCustomValidationMessage, 'customValidationMessage');
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncMaskInputs();
    this.initInputmask();
  }

  private syncMaskInputs(): void {
    const options = this.inputmaskOptions();
    if (options) this.updateOptions(options);

    const mask = this.inputmaskMask();
    if (mask !== undefined) this.updateOption('mask', mask);

    const placeholder = this.inputmaskPlaceholder();
    if (placeholder !== undefined) this.updateOption('placeholder', placeholder);

    const disabled = this.inputmaskDisabled();
    if (disabled !== undefined) this.updateOption('disabled', disabled);

    const readonly = this.inputmaskReadonly();
    if (readonly !== undefined) this.updateOption('readonly', readonly);

    const validateOnBlur = this.inputmaskValidateOnBlur();
    if (validateOnBlur !== undefined) this.updateOption('validateOnBlur', validateOnBlur);

    const validateOnInput = this.inputmaskValidateOnInput();
    if (validateOnInput !== undefined) this.updateOption('validateOnInput', validateOnInput);

    const showValidationErrors = this.inputmaskShowValidationErrors();
    if (showValidationErrors !== undefined) this.updateOption('showValidationErrors', showValidationErrors);

    const customValidationMessage = this.inputmaskCustomValidationMessage();
    if (customValidationMessage !== undefined) this.updateOption('customValidationMessage', customValidationMessage);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initInputmask(): void {
    const element = this.getElement();
    if (!element) {
      this.handleErr('Initialization failed', new Error('Element not found'), 'ELEMENT_NOT_FOUND');
      return;
    }

    this.status.setLoading(true);
    this.status.setError(null);

    runSafely(() => {
      this.createInstance(element);
      this.updateElementState();
      this.updateValidationHandlers();
      this.updateValueState();
    }, (error) => this.handleErr('Initialization failed', error, 'INITIALIZATION_FAILED'));

    if (!this.instance) {
      this.status.setLoading(false);
      return;
    }

    this.markBaseInitialized();
    this.status.setActive(true);
    this.status.setLoading(false);
  }

  private reinitialize(): void {
    this.remove();
    this.initInputmask();
  }

  private getElement(): HTMLInputElement | null {
    return this.host.elementRef.nativeElement as HTMLInputElement;
  }

  private getTimerWindow(): Window | null {
    return this.host.window ?? this.window ?? this.getHostWindow();
  }

  private setOwnedTimeout(callback: () => void, delay: number): number | null {
    const windowRef = this.getTimerWindow();
    let timeoutId: number | null = null;
    let clearTimeoutRef: ((timeoutId: number) => void) | null = null;

    if (windowRef?.setTimeout) {
      try {
        timeoutId = windowRef.setTimeout(callback, delay);
        clearTimeoutRef = (id: number) => windowRef.clearTimeout(id);
      } catch {}
    }

    if (timeoutId === null && typeof setTimeout !== 'undefined') {
      timeoutId = setTimeout(callback, delay) as unknown as number;
      clearTimeoutRef = (id: number) => clearTimeout(id);
    }

    if (timeoutId !== null && clearTimeoutRef) {
      this.ownedTimeoutClearers.set(timeoutId, () => clearTimeoutRef(timeoutId));
    }
    return timeoutId;
  }

  private clearOwnedTimeout(timeoutId: number | null): void {
    if (timeoutId === null) return;

    const clearTimeoutRef = this.ownedTimeoutClearers.get(timeoutId);
    this.ownedTimeoutClearers.delete(timeoutId);
    try {
      clearTimeoutRef?.();
    } catch {}
  }

  private clearValidationTimeout(): void {
    this.clearOwnedTimeout(this.validationTimeout);
    this.validationTimeout = null;
  }

  private clearRetryTimeout(): void {
    this.clearOwnedTimeout(this.retryTimeout);
    this.retryTimeout = null;
  }

  private clearAllOwnedTimeouts(): void {
    for (const timeoutId of Array.from(this.ownedTimeoutClearers.keys())) {
      this.clearOwnedTimeout(timeoutId);
    }
    this.validationTimeout = null;
    this.retryTimeout = null;
  }

  private extendDefinitions(): void {
    if (InputmaskDirective.definitionsExtended) return;

    runSafely(() => {
      Inputmask.extendDefinitions({
        A: { validator: '[A-Za-z]', casing: 'upper' },
        '+': { validator: '[A-Za-z\u0410-\u044F\u0401\u04510-9]', casing: 'upper' },
        C: { validator: '[0-9]', casing: undefined },
        P: { validator: '[0-9]', casing: undefined },
      });
      Inputmask.extendAliases({
        phone: { mask: '(999) 999-9999', placeholder: '_', clearMaskOnLostFocus: true, showMaskOnFocus: true, showMaskOnHover: true },
      });
      InputmaskDirective.definitionsExtended = true;
    }, () => { InputmaskDirective.definitionsExtended = false; });
  }

  private createInstance(element: HTMLInputElement): void {
    this.extendDefinitions();

    if (element.inputmask) {
      this.instance = element.inputmask;
      this.updateInstance();
      return;
    }

    this.interceptAddEventListener(element);

    const created = runSafely(
      () => new Inputmask(this.buildOptions()).mask(element),
      (error) => this.handleErr('Instance creation failed', error, 'INSTANCE_CREATION_FAILED')
    );

    if (created) this.instance = created;
  }

  private interceptAddEventListener(element: HTMLInputElement): void {
    if (!this.host.isBrowser) return;

    const original = element.addEventListener.bind(element);
    element.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
      if (type !== 'paste' || !listener) {
        return listener ? original(type, listener, options) : undefined;
      }

      const wrap: EventListener = (e: Event) => {
        const evt = e as ClipboardEvent;
        try { Object.defineProperty(evt, 'preventDefault', { value: () => {}, writable: false, configurable: true }); } catch {}
        if (!element.inputmask) return;
        if (evt.target !== element) {
          try { Object.defineProperty(evt, 'target', { value: element, writable: false, configurable: true }); } catch { return; }
        }
        if (!(evt.target as HTMLInputElement)?.inputmask) return;
        try { typeof listener === 'function' ? (listener as EventListener)(evt) : listener.handleEvent?.(evt); } catch {}
      };
      return original(type, wrap, options);
    };
  }

  private buildOptions(): Partial<Inputmask.Options> {
    const options = this.optionsManager.snapshot();
    const maskOptions: InputmaskOptions = { ...options };

    if (options.mask && typeof options.mask === 'object' && 'alias' in options.mask) {
      maskOptions.alias = options.mask.alias;
      if (options.mask.inputFormat) maskOptions.inputFormat = options.mask.inputFormat;
      delete maskOptions.mask;
    } else if (options.mask) {
      maskOptions.mask = options.mask;
    }

    delete maskOptions.disabled;
    delete maskOptions.readonly;
    delete maskOptions.validateOnBlur;
    delete maskOptions.validateOnInput;
    delete maskOptions.showValidationErrors;
    delete maskOptions.customValidationMessage;

    this.attachCallbacks(maskOptions);
    return maskOptions as Partial<Inputmask.Options>;
  }

  private attachCallbacks(options: Partial<InputmaskOptions>): void {
    options.oncomplete = () => { this.complete.emit(); this.updateValueState(); this.updateValidationState(); };
    options.onincomplete = () => { this.incomplete.emit(); this.updateValueState(); this.updateValidationState(); };
    options.oncleared = () => { this.cleared.emit(); this.updateValueState(); this.updateValidationState(); };
    options.onKeyDown = (event: KeyboardEvent) => this.keyDown.emit(event);
    options.onBeforeMask = (initialValue: string) => { this.beforeMask.emit(initialValue); return initialValue; };
    options.onBeforePaste = (pastedValue: string) => {
      this.beforePaste.emit(pastedValue);
      const opts = this.optionsManager.snapshot();
      let normalized = pastedValue;

      if (opts.mask) {
        const maskStr = typeof opts.mask === 'string' ? opts.mask : typeof opts.mask === 'object' && 'alias' in opts.mask ? opts.mask.alias : '';
        if (maskStr.includes('999') && (maskStr.includes('(') || maskStr.includes(')') || maskStr.includes('phone'))) {
          normalized = pastedValue.replace(/\D/g, '');
        } else if (opts.numericInput || opts.alias === 'numeric' || opts.alias === 'currency' || maskStr.includes('$') || maskStr.includes(',')) {
          normalized = pastedValue.replace(/[^\d.,-]/g, '');
        } else if (maskStr.includes('/') || maskStr.includes('-') || opts.alias === 'datetime' || opts.alias === 'date') {
          normalized = pastedValue.replace(/[^\d\/\-]/g, '');
        } else if (maskStr.includes('999.999.999.999') || maskStr.includes('ip')) {
          normalized = pastedValue.replace(/[^\d.]/g, '');
        } else if (maskStr.includes(':') || opts.alias === 'time') {
          normalized = pastedValue.replace(/[^\d:]/g, '');
        } else if (maskStr.includes('999-99-9999') || maskStr.includes('ssn')) {
          normalized = pastedValue.replace(/[^\d-]/g, '');
        } else if (maskStr.includes('%') || opts.suffix === '%') {
          normalized = pastedValue.replace(/[^\d.%]/g, '');
        } else {
          normalized = pastedValue.replace(/[^\w\s\-_.,()]/g, '');
        }
      }
      return normalized || '';
    };
    options.onBeforeWrite = (event: KeyboardEvent, _buffer: string[], caretPos: number): Inputmask.CommandObject => {
      this.beforeWrite.emit(event);
      return { c: event.key ?? '', caret: caretPos };
    };
    options.onUnMask = (maskedValue: string, unmaskedValue: string) => { this.unMask.emit({ maskedValue, unmaskedValue }); return unmaskedValue; };
    options.onKeyValidation = (key: number, result: boolean) => { this.keyValidation.emit({ key, result }); };
  }

  private updateInstance(): void {
    if (!this.instance) return;
    const element = this.getElement();
    if (!element) return;

    const newInstance = runSafely(() => {
      this.instance!.remove();
      return new Inputmask(this.buildOptions()).mask(element);
    }, (error) => this.handleErr('Update instance failed', error));

    if (newInstance) this.instance = newInstance;
  }

  private updateOptions(options: Partial<InputmaskOptions>): boolean {
    return mergeOptionsIfChanged(this.optionsManager, options);
  }

  protected override updateOption<K extends keyof InputmaskOptions>(key: K, value: InputmaskOptions[K]): boolean {
    return setOptionIfChanged(this.optionsManager, key, value);
  }

  private updateElementState(): void {
    const element = this.getElement();
    if (!element) return;
    const options = this.optionsManager.snapshot();
    element.disabled = options.disabled || false;
    element.readOnly = options.readonly || false;
  }

  private updateValidationHandlers(): void {
    const element = this.getElement();
    if (!element) return;

    this.removeValidationListeners();
    const options = this.optionsManager.snapshot();

    if (options.validateOnBlur) {
      this.blurListener = this.host.renderer.listen(element, 'blur', () => this.debouncedValidate());
    }
    if (options.validateOnInput) {
      this.inputListener = this.host.renderer.listen(element, 'input', () => this.debouncedValidate());
    }
    this.changeListener = this.host.renderer.listen(element, 'change', () => this.updateValueState());
  }

  private removeValidationListeners(): void {
    this.blurListener?.();
    this.inputListener?.();
    this.changeListener?.();
    this.blurListener = null;
    this.inputListener = null;
    this.changeListener = null;
  }

  private updateValueState(): void {
    if (!this.instance) return;
    const element = this.getElement();
    if (!element) return;

    const maskedValue = element.value || '';
    const unmaskedValue = this.instance.unmaskedvalue() || '';

    this._maskedValue.set(maskedValue);
    this._unmaskedValue.set(unmaskedValue);
    this.valueChange.emit({ maskedValue, unmaskedValue });
  }

  private updateValidationState(): void {
    if (!this.instance) return;

    const result = runSafely(() => ({
      isValid: this.instance!.isValid() || false,
      isComplete: this.instance!.isComplete() || false,
    }), (error) => this.handleErr('Update validation state failed', error, 'VALIDATION_FAILED'));

    if (!result) return;

    this._isValid.set(result.isValid);
    this._isComplete.set(result.isComplete);
    this.validationChange.emit({ isValid: result.isValid, isComplete: result.isComplete, maskedValue: this._maskedValue(), unmaskedValue: this._unmaskedValue() });
  }

  private debouncedValidate(): void {
    this.clearValidationTimeout();

    let timeoutId: number | null = null;
    timeoutId = this.setOwnedTimeout(() => {
      if (timeoutId !== null) this.ownedTimeoutClearers.delete(timeoutId);
      if (this.validationTimeout === timeoutId) this.validationTimeout = null;
      this.updateValidationState();
    }, DEFAULTS.DEBOUNCE_TIME);
    this.validationTimeout = timeoutId;
  }

  private handleErr(message: string, error: Error, code?: string): void {
    const errorObj: InputmaskError = { code: code || 'UNKNOWN_ERROR', message: `${message}: ${error.message}`, details: error };
    this.status.setError(errorObj);
    this.logger.error(message, 'InputmaskDirective', { error: errorObj });

    if (code === 'INSTANCE_CREATION_FAILED' && this.retryCount < DEFAULTS.RETRY_ATTEMPTS) {
      this.scheduleRetry();
    }
  }

  private scheduleRetry(): void {
    this.clearRetryTimeout();

    let timeoutId: number | null = null;
    timeoutId = this.setOwnedTimeout(() => {
      if (timeoutId !== null) this.ownedTimeoutClearers.delete(timeoutId);
      if (this.retryTimeout === timeoutId) this.retryTimeout = null;
      this.retryCount++;
      this.initInputmask();
    }, DEFAULTS.RETRY_DELAY);
    this.retryTimeout = timeoutId;
  }

  private cleanup(): void {
    this.clearAllOwnedTimeouts();
    this.removeValidationListeners();
    this.remove();
    this.baseCleanup();
    this.retryCount = 0;
  }

  getMaskedValue(): string { return this.maskedValue(); }
  getUnmaskedValue(): string { return this.unmaskedValue(); }

  setValue(value: string): void {
    runSafely(() => {
      if (this.instance && this.getElement()) {
        this.instance.setValue(value);
        this.updateValueState();
      }
    }, (error) => this.handleErr('Set value failed', error));
  }

  isValid(): boolean { return this.isValidSignal(); }
  isComplete(): boolean { return this.isCompleteSignal(); }
  getOption<K extends keyof InputmaskOptions>(key: K): InputmaskOptions[K] { return this.options()[key]; }
  setOption<K extends keyof InputmaskOptions>(key: K, value: InputmaskOptions[K]): void { this.updateOption(key, value); }

  getEmptyMask(): string {
    return runSafely(() => this.instance?.getemptymask() || '', (error) => this.handleErr('Get empty mask failed', error)) ?? '';
  }

  getMetadata(): Record<string, any> | null {
    return runSafely(() => this.instance?.getmetadata() || null, (error) => this.handleErr('Get metadata failed', error)) ?? null;
  }

  hasMaskedValue(): boolean {
    return runSafely(() => this.instance?.hasMaskedValue() || false, (error) => this.handleErr('Has masked value check failed', error)) ?? false;
  }

  remove(): void {
    runSafely(() => {
      if (this.instance) {
        this.instance.remove();
        this.instance = null;
        this.status.setActive(false);
      }
    }, (error) => this.handleErr('Remove failed', error));
  }

  reapply(): void { this.reinitialize(); }

  formatValue(value: string): string {
    if (!this.instance) return value;
    return runSafely(() => Inputmask.format(value, this.buildOptions()), (error) => this.handleErr('Format value failed', error)) ?? value;
  }

  validateValue(value: string): boolean {
    if (!this.instance) return true;
    return runSafely(() => Inputmask.isValid(value, this.buildOptions()), (error) => this.handleErr('Validate value failed', error)) ?? false;
  }

  unmaskValue(value: string): string {
    if (!this.instance) return value;
    return runSafely(() => Inputmask.unmask(value, this.buildOptions()), (error) => this.handleErr('Unmask value failed', error)) ?? value;
  }
}
