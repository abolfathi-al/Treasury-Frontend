import {
  computed,
  Directive,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  createPopper,
  Placement,
  Instance as PopperInstance,
} from '@popperjs/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface MaxlengthOptions {
  alwaysShow?: boolean;
  threshold?: number;
  warningClass?: string;
  limitReachedClass?: string;
  limitExceededClass?: string;
  separator?: string;
  preText?: string;
  postText?: string;
  showMaxLength?: boolean;
  showCharsTyped?: boolean;
  appendToParent?: boolean;
  message?: string | ((currentText: string, maxLength: number) => string);
  utf8?: boolean;
  showOnReady?: boolean;
  twoCharLinebreak?: boolean;
  customMaxAttribute?: string;
  customMaxClass?: string;
  validate?: boolean;
  allowOverMax?: boolean;
  zIndex?: number;
  placement?:
    | Placement
    | 'bottom-right-inside'
    | 'top-right-inside'
    | 'top-left-inside'
    | 'bottom-left-inside'
    | 'bottom-right'
    | 'top-right'
    | 'top-left'
    | 'bottom-left'
    | 'centered-right'
    | {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        position?: string;
      }
    | ((
        element: HTMLElement,
        counter: HTMLElement,
        position: {
          bottom: number;
          height: number;
          left: number;
          right: number;
          top: number;
          width: number;
        }
      ) => void);
}

export interface MaxlengthValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface MaxlengthError {
  code: string;
  message: string;
  details?: unknown;
}

const DEFAULT_OPTIONS: Required<
  Pick<
    MaxlengthOptions,
    | 'alwaysShow'
    | 'threshold'
    | 'warningClass'
    | 'limitReachedClass'
    | 'separator'
    | 'showMaxLength'
    | 'showCharsTyped'
    | 'placement'
    | 'validate'
    | 'zIndex'
  >
> = {
  alwaysShow: false,
  threshold: 0,
  warningClass: 'badge badge-warning',
  limitReachedClass: 'badge badge-success',
  separator: '/',
  showMaxLength: true,
  showCharsTyped: true,
  placement: 'bottom-right-inside',
  validate: false,
  zIndex: 1099,
};

@Directive({
  selector: '[vlVeloraMaxlength]',
  exportAs: 'veloraMaxlength',
  standalone: true,
})
export class MaxlengthDirective
  extends BaseDirective<MaxlengthOptions, MaxlengthError>
  implements OnInit, OnDestroy
{
  private readonly host = useDirectiveHost();

  private counterElement: HTMLElement | null = null;
  private popperInstance: PopperInstance | null = null;
  private retryCount = 0;
  private readonly maxRetries = 3;

  private readonly _currentLength = signal<number>(0);
  private readonly _maxLength = signal<number>(0);
  private readonly _remainingChars = signal<number>(0);
  private readonly _isValid = signal<boolean>(true);
  private readonly _isWarning = signal<boolean>(false);
  private readonly _isLimitReached = signal<boolean>(false);

  readonly currentLength = computed(() => this._currentLength());
  readonly maxLength = computed(() => this._maxLength());
  readonly remainingChars = computed(() => this._remainingChars());
  readonly isValid = computed(() => this._isValid());
  readonly isWarning = computed(() => this._isWarning());
  readonly isLimitReached = computed(() => this._isLimitReached());

  readonly maxlengthAlwaysShow = input<boolean>();
  readonly maxlengthThreshold = input<number>();
  readonly maxlengthWarningClass = input<string>();
  readonly maxlengthLimitReachedClass = input<string>();
  readonly maxlengthLimitExceededClass = input<string>();
  readonly maxlengthSeparator = input<string>();
  readonly maxlengthPreText = input<string>();
  readonly maxlengthPostText = input<string>();
  readonly maxlengthShowMaxLength = input<boolean>();
  readonly maxlengthShowCharsTyped = input<boolean>();
  readonly maxlengthAppendToParent = input<boolean>();
  readonly maxlengthMessage = input<
    string | ((currentText: string, maxLength: number) => string)
  >();
  readonly maxlengthUtf8 = input<boolean>();
  readonly maxlengthShowOnReady = input<boolean>();
  readonly maxlengthTwoCharLinebreak = input<boolean>();
  readonly maxlengthCustomMaxAttribute = input<string>();
  readonly maxlengthCustomMaxClass = input<string>();
  readonly maxlengthValidate = input<boolean>();
  readonly maxlengthAllowOverMax = input<boolean>();
  readonly maxlengthZIndex = input<number>();
  readonly maxlengthPlacement = input<MaxlengthOptions['placement']>();

  readonly changeEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
  }>();
  readonly validEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
  }>();
  readonly invalidEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    errors: string[];
  }>();
  readonly warning = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    threshold: number;
  }>();
  readonly limitReached = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
  }>();
  readonly focusEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
  }>();
  readonly blurEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
  }>();
  readonly keyupEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    event: KeyboardEvent;
  }>();
  readonly keydownEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    event: KeyboardEvent;
  }>();
  readonly inputEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    event: Event;
  }>();
  readonly pasteEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    event: ClipboardEvent;
  }>();
  readonly cutEvent = output<{
    currentLength: number;
    maxLength: number;
    remainingChars: number;
    event: ClipboardEvent;
  }>();
  readonly errorEvent = output<MaxlengthError>();
  readonly validationChange = output<MaxlengthValidationResult>();
  readonly shown = output<void>();
  readonly hidden = output<void>();

  constructor() {
    super(inject(LoggerService), 'MaxlengthDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.destroy());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.initInputEffects();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncMaxlengthInputs();
    this.bootstrap();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  getCurrentLength(): number {
    return this._currentLength();
  }

  getMaxLength(): number {
    return this._maxLength();
  }

  getRemainingChars(): number {
    return this._remainingChars();
  }

  isValidLength(): boolean {
    return this._isValid();
  }

  isInWarningState(): boolean {
    return this._isWarning();
  }

  getValidationResult(): MaxlengthValidationResult {
    return this.buildValidationResult();
  }

  updateOptions(newOptions: Partial<MaxlengthOptions>): void {
    this.runOp(() => {
      if (mergeOptionsIfChanged(this.optionsManager, newOptions)) {
        this.reinitialize();
      }
    }, 'Update options failed');
  }

  refresh(): void {
    this.reinitialize();
  }

  recreate(): void {
    this.destroy();
    this.retryCount = 0;
    this.bootstrap();
  }

  getOptions(): MaxlengthOptions {
    return this.options();
  }

  getError(): MaxlengthError | null {
    return this.status.getError();
  }

  clearError(): void {
    this.status.setError(null);
  }

  reset(): void {
    this.runOp(() => {
      this.destroyInternal();
      this.retryCount = 0;
      this.status.setError(null);
      this.status.setLoading(false);
      this.status.setActive(false);
      this._currentLength.set(0);
      this._maxLength.set(0);
      this._remainingChars.set(0);
      this._isValid.set(true);
      this._isWarning.set(false);
      this._isLimitReached.set(false);
    }, 'Reset failed');
  }

  private initInputEffects(): void {
    const bind = <T>(
      inputFn: () => T | undefined,
      key: keyof MaxlengthOptions
    ) => {
      effect(() => {
        const v = inputFn();
        untracked(() => {
          if (v !== undefined) this.updateOption(key, v as MaxlengthOptions[typeof key]);
        });
      });
    };

    bind(this.maxlengthAlwaysShow, 'alwaysShow');
    bind(this.maxlengthThreshold, 'threshold');
    bind(this.maxlengthWarningClass, 'warningClass');
    bind(this.maxlengthLimitReachedClass, 'limitReachedClass');
    bind(this.maxlengthLimitExceededClass, 'limitExceededClass');
    bind(this.maxlengthSeparator, 'separator');
    bind(this.maxlengthPreText, 'preText');
    bind(this.maxlengthPostText, 'postText');
    bind(this.maxlengthShowMaxLength, 'showMaxLength');
    bind(this.maxlengthShowCharsTyped, 'showCharsTyped');
    bind(this.maxlengthAppendToParent, 'appendToParent');
    bind(this.maxlengthMessage, 'message');
    bind(this.maxlengthUtf8, 'utf8');
    bind(this.maxlengthShowOnReady, 'showOnReady');
    bind(this.maxlengthTwoCharLinebreak, 'twoCharLinebreak');
    bind(this.maxlengthCustomMaxAttribute, 'customMaxAttribute');
    bind(this.maxlengthCustomMaxClass, 'customMaxClass');
    bind(this.maxlengthValidate, 'validate');
    bind(this.maxlengthAllowOverMax, 'allowOverMax');
    bind(this.maxlengthZIndex, 'zIndex');
    bind(this.maxlengthPlacement, 'placement');
  }

  private syncMaxlengthInputs(): void {
    const sync = <T>(
      inputFn: () => T | undefined,
      key: keyof MaxlengthOptions
    ) => {
      const v = inputFn();
      if (v !== undefined) this.updateOption(key, v as MaxlengthOptions[typeof key]);
    };

    sync(this.maxlengthAlwaysShow, 'alwaysShow');
    sync(this.maxlengthThreshold, 'threshold');
    sync(this.maxlengthWarningClass, 'warningClass');
    sync(this.maxlengthLimitReachedClass, 'limitReachedClass');
    sync(this.maxlengthLimitExceededClass, 'limitExceededClass');
    sync(this.maxlengthSeparator, 'separator');
    sync(this.maxlengthPreText, 'preText');
    sync(this.maxlengthPostText, 'postText');
    sync(this.maxlengthShowMaxLength, 'showMaxLength');
    sync(this.maxlengthShowCharsTyped, 'showCharsTyped');
    sync(this.maxlengthAppendToParent, 'appendToParent');
    sync(this.maxlengthMessage, 'message');
    sync(this.maxlengthUtf8, 'utf8');
    sync(this.maxlengthShowOnReady, 'showOnReady');
    sync(this.maxlengthTwoCharLinebreak, 'twoCharLinebreak');
    sync(this.maxlengthCustomMaxAttribute, 'customMaxAttribute');
    sync(this.maxlengthCustomMaxClass, 'customMaxClass');
    sync(this.maxlengthValidate, 'validate');
    sync(this.maxlengthAllowOverMax, 'allowOverMax');
    sync(this.maxlengthZIndex, 'zIndex');
    sync(this.maxlengthPlacement, 'placement');
  }

  protected override updateOption<K extends keyof MaxlengthOptions>(
    key: K,
    value: MaxlengthOptions[K]
  ): boolean {
    if (value === undefined) return false;
    const changed = setOptionIfChanged(this.optionsManager, key, value);
    if (changed && this.isBaseInitialized()) this.reinitialize();
    return changed;
  }

  private bootstrap(): void {
    this.status.setLoading(true);
    this.status.setError(null);

    this.runOp(
      () => {
        this.createInstance();
        this.status.setLoading(false);
      },
      'Bootstrap failed',
      true
    );
  }

  private createInstance(): void {
    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    if (!el) throw new Error('Element not available');

    const opts = this.options();
    this.createCounterElement(opts);
    this.bindEvents();

    this.status.setActive(true);
    this.status.setError(null);

    this.updateState();
    this.markBaseInitialized();
    this.retryCount = 0;
  }

  private createCounterElement(opts: MaxlengthOptions): void {
    if (!this.host.isBrowser) return;

    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    this.counterElement = this.host.renderer.createElement('div');
    this.host.renderer.addClass(this.counterElement, 'small');
    this.host.renderer.addClass(this.counterElement, 'form-text');
    this.host.renderer.addClass(this.counterElement, 'text-body-secondary');

    this.host.renderer.setStyle(this.counterElement, 'position', 'absolute');
    this.host.renderer.setStyle(this.counterElement, 'z-index', String(opts.zIndex || 1099));
    this.host.renderer.setStyle(this.counterElement, 'pointer-events', 'none');
    this.host.renderer.setStyle(this.counterElement, 'display', 'none');

    this.updateCounterDisplay();

    if (opts.appendToParent && el.parentNode) {
      this.host.renderer.appendChild(el.parentNode, this.counterElement);
    } else {
      this.host.renderer.appendChild(this.host.document.body, this.counterElement);
    }

    this.initPopper(opts);
  }

  private initPopper(opts: MaxlengthOptions): void {
    if (!this.counterElement) return;

    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const placement = this.convertPlacement(opts.placement || 'bottom-right-inside');

    this.popperInstance = createPopper(el, this.counterElement, {
      placement: placement as Placement,
      modifiers: [
        { name: 'offset', options: { offset: this.getOffset(placement) } },
        { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } },
        { name: 'preventOverflow', options: { boundary: 'viewport' } },
      ],
    });
  }

  private convertPlacement(placement: MaxlengthOptions['placement']): Placement {
    if (typeof placement === 'string') {
      const map: Record<string, Placement> = {
        'bottom-right-inside': 'bottom-end',
        'top-right-inside': 'top-end',
        'top-left-inside': 'top-start',
        'bottom-left-inside': 'bottom-start',
        'bottom-right': 'bottom-end',
        'top-right': 'top-end',
        'top-left': 'top-start',
        'bottom-left': 'bottom-start',
        'centered-right': 'right',
      };
      return map[placement] || (placement as Placement);
    }
    return 'bottom-end';
  }

  private getOffset(placement: Placement): [number, number] {
    const map: Record<string, [number, number]> = {
      'bottom-end': [0, 2],
      'bottom-start': [0, 2],
      'top-end': [0, -2],
      'top-start': [0, -2],
      left: [-8, 0],
      right: [8, 0],
    };
    return map[placement] || [0, 2];
  }

  private updateCounterDisplay(): void {
    if (!this.counterElement) return;

    const cur = this._currentLength();
    const max = this._maxLength();
    const rem = this._remainingChars();
    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const text = el.value || '';
    const opts = this.options();

    let display = '';
    if (opts.message) {
      if (typeof opts.message === 'function') {
        display = opts.message(text, max);
      } else {
        display = opts.message
          .replace('%charsTyped%', cur.toString())
          .replace('%charsRemaining%', rem.toString())
          .replace('%charsTotal%', max.toString());
      }
    } else {
      if (opts.preText) display += opts.preText;
      if (opts.showCharsTyped) display += cur.toString();
      if (opts.showMaxLength && opts.separator) display += opts.separator + max.toString();
      if (opts.postText) display += opts.postText;
    }

    if (this.host.isBrowser && this.counterElement) {
      this.host.renderer.setProperty(this.counterElement, 'textContent', display);
    }

    this.updateCounterClasses();
  }

  private updateCounterClasses(): void {
    if (!this.host.isBrowser || !this.counterElement) return;

    const cur = this._currentLength();
    const max = this._maxLength();
    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const opts = this.options();

    const baseClasses = ['small', 'form-text'];
    const stateClasses = [
      'text-body-secondary',
      'text-danger',
      'text-warning',
      'badge',
      'badge-warning',
      'badge-success',
    ];

    [...baseClasses, ...stateClasses].forEach((cls) =>
      this.host.renderer.removeClass(this.counterElement!, cls)
    );

    if (opts.customMaxClass) {
      this.host.renderer.removeClass(el, opts.customMaxClass);
    }

    if (cur > max) {
      baseClasses.forEach((cls) => this.host.renderer.addClass(this.counterElement!, cls));
      const exceededClass = opts.limitExceededClass || opts.limitReachedClass || 'small form-text text-danger';
      exceededClass.split(' ').forEach((cls) => this.host.renderer.addClass(this.counterElement!, cls));
      if (opts.customMaxClass) this.host.renderer.addClass(el, opts.customMaxClass);
    } else if (cur === max) {
      const reachedClass = opts.limitReachedClass || 'small form-text text-danger';
      reachedClass.split(' ').forEach((cls) => this.host.renderer.addClass(this.counterElement!, cls));
    } else if (cur >= max - (opts.threshold || 0)) {
      const warnClass = opts.warningClass || 'small form-text text-warning';
      warnClass.split(' ').forEach((cls) => this.host.renderer.addClass(this.counterElement!, cls));
    } else {
      ['small', 'form-text', 'text-body-secondary'].forEach((cls) =>
        this.host.renderer.addClass(this.counterElement!, cls)
      );
    }
  }

  private calculateLength(text: string): number {
    const opts = this.options();
    if (opts.utf8) return new TextEncoder().encode(text).length;
    if (opts.twoCharLinebreak) return text.length + (text.match(/\n/g) || []).length;
    return text.length;
  }

  private showCounter(): void {
    if (!this.host.isBrowser || !this.counterElement) return;

    const opts = this.optionsManager.snapshot();
    const shouldShow =
      opts.alwaysShow ||
      this._currentLength() >= this._maxLength() - (opts.threshold || 0) ||
      opts.showOnReady;

    if (shouldShow) {
      this.host.renderer.setStyle(this.counterElement, 'display', 'block');
      this.popperInstance?.update();
      this.shown.emit();
    }
  }

  private hideCounter(): void {
    if (!this.host.isBrowser || !this.counterElement) return;
    if (!this.optionsManager.snapshot().alwaysShow) {
      this.host.renderer.setStyle(this.counterElement, 'display', 'none');
      this.hidden.emit();
    }
  }

  private bindEvents(): void {
    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    this.addBaseDomListener(el, 'input', (e) => this.handleInput(e));
    this.addBaseDomListener(el, 'keyup', (e) => this.handleKeyup(e as KeyboardEvent));
    this.addBaseDomListener(el, 'keydown', (e) => this.handleKeydown(e as KeyboardEvent));
    this.addBaseDomListener(el, 'focus', () => this.handleFocus());
    this.addBaseDomListener(el, 'blur', () => this.handleBlur());
    this.addBaseDomListener(el, 'paste', (e) => this.handlePaste(e as ClipboardEvent));
    this.addBaseDomListener(el, 'cut', (e) => this.handleCut(e as ClipboardEvent));
  }

  private handleInput(event: Event): void {
    this.enforceLimit();
    this.updateState();
    this.popperInstance?.update();
    this.inputEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
      event,
    });
  }

  private handleKeyup(event: KeyboardEvent): void {
    this.enforceLimit();
    this.updateState();
    this.popperInstance?.update();
    this.keyupEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
      event,
    });
  }

  private handleKeydown(event: KeyboardEvent): void {
    this.enforceLimit();
    this.updateState();
    this.keydownEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
      event,
    });
  }

  private handleFocus(): void {
    this.showCounter();
    this.updateState();
    this.focusEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
    });
  }

  private handleBlur(): void {
    this.hideCounter();
    this.updateState();
    this.blurEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
    });
  }

  private handlePaste(event: ClipboardEvent): void {
    setTimeout(() => {
      this.enforceLimit();
      this.updateState();
      this.popperInstance?.update();
    }, 0);

    this.pasteEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
      event,
    });
  }

  private handleCut(event: ClipboardEvent): void {
    setTimeout(() => {
      this.updateState();
      this.popperInstance?.update();
    }, 0);

    this.cutEvent.emit({
      currentLength: this._currentLength(),
      maxLength: this._maxLength(),
      remainingChars: this._remainingChars(),
      event,
    });
  }

  private updateState(): void {
    this.runOp(() => {
      const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
      const text = el.value || '';
      const opts = this.options();

      let max = 0;
      if (opts.customMaxAttribute && el.hasAttribute(opts.customMaxAttribute)) {
        max = parseInt(el.getAttribute(opts.customMaxAttribute) || '0', 10);
      } else if (el.hasAttribute('maxlength')) {
        max = parseInt(el.getAttribute('maxlength') || '0', 10);
      }

      const cur = this.calculateLength(text);
      const rem = max - cur;

      this._currentLength.set(cur);
      this._maxLength.set(max);
      this._remainingChars.set(rem);

      const valid = cur <= max;
      const warn = rem <= (opts.threshold || 0) && rem > 0;
      const reached = rem <= 0;

      this._isValid.set(valid);
      this._isWarning.set(warn);
      this._isLimitReached.set(reached);

      this.updateCounterDisplay();

      this.changeEvent.emit({ currentLength: cur, maxLength: max, remainingChars: rem });

      if (valid) {
        this.validEvent.emit({ currentLength: cur, maxLength: max, remainingChars: rem });
      } else {
        const errors = this.getValidationErrors(cur, max);
        this.invalidEvent.emit({ currentLength: cur, maxLength: max, remainingChars: rem, errors });
      }

      if (warn) {
        this.warning.emit({
          currentLength: cur,
          maxLength: max,
          remainingChars: rem,
          threshold: opts.threshold || 0,
        });
      }

      if (reached) {
        this.limitReached.emit({ currentLength: cur, maxLength: max, remainingChars: rem });
      }

      this.validationChange.emit(this.buildValidationResult());
    }, 'Update state failed');
  }

  private getValidationErrors(cur: number, max: number): string[] {
    const errors: string[] = [];
    if (cur > max) {
      errors.push(`Character limit exceeded. Maximum ${max} characters allowed.`);
    }
    return errors;
  }

  private buildValidationResult(): MaxlengthValidationResult {
    const cur = this._currentLength();
    const max = this._maxLength();
    const valid = cur <= max;
    const errors = valid ? [] : this.getValidationErrors(cur, max);
    const warnings: string[] = [];
    const rem = this._remainingChars();
    const threshold = this.options().threshold || 0;

    if (rem <= threshold && rem > 0) {
      warnings.push(`Only ${rem} characters remaining.`);
    }

    return { isValid: valid, warnings, errors };
  }

  private destroy(): void {
    this.runOp(() => this.destroyInternal(), 'Destroy failed');
  }

  private destroyInternal(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    if (this.host.isBrowser && this.counterElement?.parentNode) {
      this.host.renderer.removeChild(this.counterElement.parentNode, this.counterElement);
      this.counterElement = null;
    }

    this.clearBaseDomListeners();
    this.status.setActive(false);
    this.status.setLoading(false);
    this.status.setError(null);
  }

  private runOp(action: () => void, message: string, retry = false): void {
    runSafely(action, (error) => {
      const err = error instanceof Error ? error : new Error(String(error));
      if (retry) {
        this.handleCriticalError(message, err);
      } else {
        this.reportError(message, err);
      }
    });
  }

  private handleCriticalError(message: string, error: Error): void {
    const err = this.createError(message, error);
    this.status.setError(err);
    this.errorEvent.emit(err);
    this.logger.error(message, 'MaxlengthDirective', { error });

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.bootstrap(), 1000 * this.retryCount);
    } else {
      this.status.setLoading(false);
      this.logger.error('Max retries reached', 'MaxlengthDirective');
    }
  }

  private reportError(message: string, error: Error): void {
    const err = this.createError(message, error);
    this.status.setError(err);
    this.errorEvent.emit(err);
    this.logger.error(message, 'MaxlengthDirective', { error });
  }

  private createError(message: string, error: Error): MaxlengthError {
    return {
      code: 'MAXLENGTH_ERROR',
      message: error.message,
      details: { originalMessage: message, stack: error.stack },
    };
  }

  private reinitialize(): void {
    this.status.setLoading(true);
    this.runOp(
      () => {
        this.destroyInternal();
        this.createInstance();
        this.status.setLoading(false);
      },
      'Reinitialize failed',
      true
    );
  }

  private enforceLimit(): void {
    const el = this.host.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const text = el.value || '';
    const max = this._maxLength();
    const opts = this.optionsManager.snapshot();

    if (text.length > max && !opts.allowOverMax) {
      if (this.host.isBrowser) {
        this.host.renderer.setProperty(el, 'value', text.substring(0, max));
      }
      this.updateState();
    }
  }
}
