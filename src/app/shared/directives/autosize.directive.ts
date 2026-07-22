import {
  Directive,
  ElementRef,
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
import { runSafely } from './shared/directive-helpers';

export interface AutosizeOptions {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  minHeight?: number;
  maxHeight?: number;
  disabled?: boolean;
  readonly?: boolean;
  validateOnResize?: boolean;
  showValidationErrors?: boolean;
  customValidationMessage?: string;
  onResized?: () => void;
  onUpdate?: () => void;
  onDestroy?: () => void;
}

export interface AutosizeValidationResult {
  isValid: boolean;
  height: number;
  scrollHeight: number;
  error?: string;
}

export interface AutosizeError {
  code: string;
  message: string;
  details?: unknown;
}

type AutosizeTarget = Element | Element[] | NodeListOf<Element>;
type AutosizeFactory = {
  (target: AutosizeTarget): AutosizeTarget;
  update(target: AutosizeTarget): void;
  destroy(target: AutosizeTarget): void;
};

const DEFAULT_OPTIONS: Partial<AutosizeOptions> = {
  resize: 'vertical',
  minHeight: 0,
  maxHeight: 1000,
  disabled: false,
  readonly: false,
  validateOnResize: true,
  showValidationErrors: true,
};

@Directive({
  selector: '[vlVeloraAutosize]',
  exportAs: 'vlVeloraAutosize',
  standalone: true,
})
export class AutosizeDirective
  extends BaseDirective<AutosizeOptions, AutosizeError>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  private readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);

  private instance: unknown = null;
  private autosizeFactory: AutosizeFactory | null = null;
  private autosizeLoader: Promise<AutosizeFactory> | null = null;
  private isComponentDestroyed = false;

  private readonly _height = signal<number>(0);
  private readonly _scrollHeight = signal<number>(0);
  private readonly _isValid = signal<boolean>(true);

  readonly height = computed(() => this._height());
  readonly scrollHeight = computed(() => this._scrollHeight());
  readonly isValid = computed(() => this._isValid());

  readonly autosizeResize = input<'none' | 'vertical' | 'horizontal' | 'both'>();
  readonly autosizeMinHeight = input<number>();
  readonly autosizeMaxHeight = input<number>();
  readonly autosizeDisabled = input<boolean>();
  readonly autosizeReadonly = input<boolean>();
  readonly autosizeValidateOnResize = input<boolean>();
  readonly autosizeShowValidationErrors = input<boolean>();
  readonly autosizeCustomValidationMessage = input<string>();

  readonly resized = output<void>();
  readonly updateEvent = output<void>();
  readonly destroyEvent = output<void>();
  readonly validationChange = output<AutosizeValidationResult>();
  readonly heightChange = output<{ height: number; scrollHeight: number }>();

  constructor() {
    super(inject(LoggerService), 'AutosizeDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.isComponentDestroyed = true;
      this.cleanup();
    });
    this.bindInputs(this.getInputBindings(), () => {
      if (this.isBaseInitialized()) this.reinitialize();
    });
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncInputs(this.getInputBindings());
    this.bootstrap();
  }

  private getInputBindings() {
    return [
      { input: this.autosizeResize, key: 'resize' as const },
      { input: this.autosizeMinHeight, key: 'minHeight' as const },
      { input: this.autosizeMaxHeight, key: 'maxHeight' as const },
      { input: this.autosizeDisabled, key: 'disabled' as const },
      { input: this.autosizeReadonly, key: 'readonly' as const },
      { input: this.autosizeValidateOnResize, key: 'validateOnResize' as const },
      { input: this.autosizeShowValidationErrors, key: 'showValidationErrors' as const },
      { input: this.autosizeCustomValidationMessage, key: 'customValidationMessage' as const },
    ];
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (this.isComponentDestroyed || this.isBaseDestroyed()) return;
        runSafely(
          () => this.initAutosize(),
          (error) => this.handleError('Initialization failed', error)
        );
      })
      .catch((error) => this.handleError('Initialization failed', this.normalizeError(error)));
  }

  private loadLibrary(): Promise<AutosizeFactory> {
    if (this.autosizeLoader) return this.autosizeLoader;

    this.autosizeLoader = import('autosize').then((module) => {
      const factory = (module?.default ?? module) as AutosizeFactory;
      this.autosizeFactory = factory;
      return factory;
    });

    return this.autosizeLoader;
  }

  private normalizeError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }

  getHeight(): number {
    return this._height();
  }

  getScrollHeight(): number {
    return this._scrollHeight();
  }

  isValidAutosize(): boolean {
    return this._isValid();
  }

  updateAutosize(): void {
    const autosize = this.autosizeFactory;
    if (!this.instance || !autosize) return;

    runSafely(
      () => {
        autosize.update(this.instance as AutosizeTarget);
        this.updateHeightState();
        this.updateEvent.emit();
      },
      (error) => this.handleError('Update autosize failed', error)
    );
  }

  resize(): void {
    const autosize = this.autosizeFactory;
    if (!this.instance || !autosize) return;

    runSafely(
      () => {
        autosize.update(this.instance as AutosizeTarget);
        this.updateHeightState();
        this.resized.emit();
      },
      (error) => this.handleError('Resize failed', error)
    );
  }

  setValue(value: string): void {
    const element = this.getElement();
    if (!element || !this.host.isBrowser) return;

    this.host.renderer.setProperty(element, 'value', value);
    this.updateAutosize();
  }

  getValue(): string {
    const element = this.getElement();
    return element ? element.value : '';
  }

  focus(): void {
    const element = this.getElement();
    if (!element || !this.host.isBrowser) return;
    element.focus();
  }

  blur(): void {
    const element = this.getElement();
    if (!element || !this.host.isBrowser) return;
    element.blur();
  }

  destroyAutosize(): void {
    const autosize = this.autosizeFactory;
    runSafely(
      () => {
        if (!this.instance || !autosize) return;

        autosize.destroy(this.instance as AutosizeTarget);
        this.instance = null;
        this.baseCleanup();
        this.status.setActive(false);
        this.destroyEvent.emit();
      },
      (error) => this.handleError('Destroy autosize failed', error)
    );
  }

  private initAutosize(): void {
    const element = this.getElement();
    if (!element) {
      this.handleError('Initialization failed', new Error('Element not found'));
      this.status.setLoading(false);
      return;
    }

    if (!this.autosizeFactory) return;

    this.status.setLoading(true);
    this.status.setError(null);

    runSafely(
      () => {
        this.createInstance(element);
        this.updateHeightState();

        this.markBaseInitialized();
        this.status.setActive(true);
        this.status.setLoading(false);
      },
      (error) => {
        this.handleError('Initialization failed', error);
        this.status.setLoading(false);
      }
    );
  }

  private reinitialize(): void {
    this.destroyAutosize();
    if (this.autosizeFactory) {
      this.initAutosize();
    } else if (this.host.isBrowser) {
      this.bootstrap();
    }
  }

  private getElement(): HTMLTextAreaElement | null {
    return this.host.isBrowser ? this.elementRef.nativeElement : null;
  }

  private createInstance(element: HTMLTextAreaElement): void {
    const autosize = this.autosizeFactory;
    if (!autosize) return;

    this.applyHeightConstraints(element);
    this.instance = autosize(element);
  }

  private applyHeightConstraints(element: HTMLTextAreaElement): void {
    if (!this.host.isBrowser) return;

    const options = this.optionsManager.snapshot();

    if (options.minHeight !== undefined) {
      this.host.renderer.setStyle(element, 'min-height', `${options.minHeight}px`);
    }

    if (options.maxHeight !== undefined) {
      this.host.renderer.setStyle(element, 'max-height', `${options.maxHeight}px`);
      this.host.renderer.setStyle(element, 'overflow-y', 'auto');
    }
  }

  private updateHeightState(): void {
    const element = this.getElement();
    if (!element || !this.host.isBrowser) return;

    this._height.set(element.offsetHeight);
    this._scrollHeight.set(element.scrollHeight);

    this.heightChange.emit({
      height: element.offsetHeight,
      scrollHeight: element.scrollHeight,
    });
  }

  private updateValidationState(): void {
    const isValid = this.validateAutosize();
    this._isValid.set(isValid);

    const validationResult: AutosizeValidationResult = {
      isValid,
      height: this._height(),
      scrollHeight: this._scrollHeight(),
      error: isValid ? undefined : 'Autosize validation failed',
    };

    this.validationChange.emit(validationResult);
  }

  private validateAutosize(): boolean {
    if (!this.instance || !this.host.isBrowser || !this.isBaseInitialized()) return false;

    const element = this.getElement();
    if (!element) return false;

    const options = this.optionsManager.snapshot();

    if (options.minHeight !== undefined && element.offsetHeight < options.minHeight) {
      return false;
    }

    if (options.maxHeight !== undefined && element.offsetHeight > options.maxHeight) {
      return false;
    }

    return true;
  }

  private handleError(message: string, error: Error): void {
    const errorObj: AutosizeError = {
      code: 'AUTOSIZE_ERROR',
      message,
      details: error.message,
    };

    this.status.setError(errorObj);
    this.logger.error(message, 'AutosizeDirective', { error: errorObj });
  }

  private cleanup(): void {
    this.destroyAutosize();
    this.baseCleanup();
  }
}
