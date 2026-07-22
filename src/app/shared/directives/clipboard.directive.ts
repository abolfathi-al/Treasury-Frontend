import {
  Directive,
  OnChanges,
  OnInit,
  SimpleChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type ClipboardJS from 'clipboard';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { InputEffectBinding, runSafely } from './shared/directive-helpers';

export interface ClipboardOptions {
  target?: string | ((trigger: HTMLElement) => HTMLElement);
  text?: string | ((trigger: HTMLElement) => string);
  action?: 'copy' | 'cut';
  container?: HTMLElement;
}

export interface ClipboardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ClipboardError {
  code: string;
  message: string;
  details?: unknown;
}

type ClipboardFactory = typeof import('clipboard');

const DEFAULT_OPTIONS: Partial<ClipboardOptions> = {
  action: 'copy',
};

@Directive({
  selector: '[vlVeloraClipboard]',
  exportAs: 'veloraClipboard',
  standalone: true,
})
export class ClipboardDirective
  extends BaseDirective<ClipboardOptions, ClipboardError>
  implements OnInit, OnChanges
{
  private readonly host = useDirectiveHost();

  private clipboardInstance: ClipboardJS | null = null;
  private clipboardCtor: ClipboardFactory | null = null;
  private clipboardLoader: Promise<ClipboardFactory> | null = null;

  private readonly _lastAction = signal<string>('');
  private readonly _lastText = signal<string>('');
  private readonly _isSupported = signal<boolean>(false);

  readonly lastAction = computed(() => this._lastAction());
  readonly lastText = computed(() => this._lastText());
  readonly isSupported = computed(() => this._isSupported());

  readonly clipboardTarget = input<string | ((trigger: HTMLElement) => HTMLElement)>();
  readonly clipboardText = input<string | ((trigger: HTMLElement) => string)>();
  readonly clipboardAction = input<'copy' | 'cut'>();
  readonly clipboardContainer = input<HTMLElement>();

  readonly successEvent = output<{ action: string; text: string; trigger: HTMLElement }>();
  readonly errorEvent = output<{ action: string; trigger: HTMLElement; error: ClipboardError }>();
  readonly validationChange = output<ClipboardValidationResult>();

  constructor() {
    super(inject(LoggerService), 'ClipboardDirective', { ...DEFAULT_OPTIONS } as ClipboardOptions);
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.destroy();
    });
    this.bindInputs(this.getInputBindings(), () => {
      if (this.isBaseInitialized()) this.reinitialize();
    });
  }

  private getInputBindings(): InputEffectBinding<ClipboardOptions>[] {
    return [
      { input: this.clipboardTarget, key: 'target' },
      { input: this.clipboardText, key: 'text' },
      { input: this.clipboardAction, key: 'action' },
      { input: this.clipboardContainer, key: 'container' },
    ];
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.syncInputs(this.getInputBindings());
    this.bootstrap();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.host.isBrowser || !this.isBaseInitialized()) return;
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (this.isBaseDestroyed()) return;
        this.initialize();
      })
      .catch((error) => this.handleError('Failed to initialize clipboard', this.normalizeError(error)));
  }

  private loadLibrary(): Promise<ClipboardFactory> {
    if (this.clipboardLoader) return this.clipboardLoader;

    this.clipboardLoader = import('clipboard').then((module) => {
      const resolved = module as { default?: ClipboardFactory };
      const ctor = resolved?.default ?? (module as unknown as ClipboardFactory);
      this.clipboardCtor = ctor;
      return ctor;
    });

    return this.clipboardLoader;
  }

  private normalizeError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }

  private initialize(): void {
    const ctor = this.clipboardCtor;
    if (!this.host.isBrowser || !ctor) return;

    runSafely(
      () => {
        this.status.setLoading(true);
        this.status.setError(null);
        this._isSupported.set(ctor.isSupported());

        if (!this._isSupported()) {
          throw new Error('Clipboard API not supported in this browser');
        }

        this.createInstance();
      },
      (error) => this.handleError('Failed to initialize clipboard', error)
    );
  }

  private reinitialize(): void {
    this.destroy();
    if (this.clipboardCtor) {
      this.initialize();
    } else if (this.host.isBrowser) {
      this.bootstrap();
    }
  }

  private createInstance(): void {
    runSafely(
      () => {
        const element = this.host.elementRef.nativeElement;
        if (!element) throw new Error('Element not available');

        const options = this.options();
        const validation = this.validate();
        this.validationChange.emit(validation);

        if (!validation.isValid) {
          throw new Error(validation.errors.join('; ') || 'Clipboard configuration invalid');
        }

        const ctor = this.clipboardCtor;
        if (!ctor) throw new Error('Clipboard library not loaded');

        this.setDataAttributes(element, options);
        const clipboardConfig = this.buildConfig(options);

        this.clipboardInstance = new ctor(element, clipboardConfig);
        this.bindEvents();

        this.status.setActive(true);
        this.status.setLoading(false);
        this.status.setError(null);
        this.markBaseInitialized();
      },
      (error) => this.handleError('Failed to create clipboard instance', error)
    );
  }

  private buildConfig(options: ClipboardOptions): ClipboardJS.Options {
    const config: ClipboardJS.Options = {};

    if (options.target && typeof options.target === 'string') {
      config.target = () => {
        const targetElement = this.host.document.querySelector(options.target as string) as HTMLElement | null;
        if (!targetElement) throw new Error(`Clipboard target not found: ${options.target}`);
        return targetElement;
      };

      config.text = () => {
        const targetElement = this.host.document.querySelector(options.target as string) as HTMLElement | null;
        if (!targetElement) return '';
        const isFormElement = targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA';
        return isFormElement
          ? (targetElement as HTMLInputElement | HTMLTextAreaElement).value?.trim() ?? ''
          : targetElement.textContent?.trim() ?? '';
      };
    } else if (typeof options.target === 'function') {
      const targetResolver = options.target;
      config.target = (trigger: Element) => targetResolver(trigger as HTMLElement);
    }

    if (options.text) {
      config.text = (trigger: Element) => {
        if (typeof options.text === 'string') return options.text;
        if (typeof options.text === 'function') return options.text(trigger as HTMLElement);
        return '';
      };
    }

    if (options.action) config.action = () => options.action!;
    if (options.container) config.container = options.container;

    return config;
  }

  private setDataAttributes(element: HTMLElement, options: ClipboardOptions): void {
    if (!this.host.isBrowser) return;

    if (options.target && typeof options.target === 'string') {
      this.host.renderer.setAttribute(element, 'data-clipboard-target', options.target);
    }
    if (options.text && typeof options.text === 'string') {
      this.host.renderer.setAttribute(element, 'data-clipboard-text', options.text);
    }
    if (options.action) {
      this.host.renderer.setAttribute(element, 'data-clipboard-action', options.action);
    }
  }

  private clearDataAttributes(element: HTMLElement): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.removeAttribute(element, 'data-clipboard-target');
    this.host.renderer.removeAttribute(element, 'data-clipboard-text');
    this.host.renderer.removeAttribute(element, 'data-clipboard-action');
  }

  private bindEvents(): void {
    if (!this.clipboardInstance) return;
    this.clipboardInstance.on('success', (e: ClipboardJS.Event) => this.handleSuccess(e));
    this.clipboardInstance.on('error', (e: ClipboardJS.Event) =>
      this.handleError('Clipboard operation failed', e as unknown as Error)
    );
  }

  private handleSuccess(e: ClipboardJS.Event): void {
    runSafely(
      () => {
        const { action, text, trigger } = e;
        this._lastAction.set(action);
        this._lastText.set(text);
        this.status.setError(null);

        if (action === 'cut') this.clearSourceElement();

        this.successEvent.emit({ action, text, trigger: trigger as HTMLElement });
        e.clearSelection();
      },
      (error) => this.handleError('Failed to handle clipboard success', error)
    );
  }

  private clearSourceElement(): void {
    runSafely(
      () => {
        const options = this.options();
        if (options.target && typeof options.target === 'string') {
          const targetElement = this.host.document.querySelector(options.target);
          if (targetElement) {
            const isFormElement = targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA';
            if (isFormElement) {
              this.host.renderer.setProperty(targetElement, 'value', '');
            } else {
              this.host.renderer.setProperty(targetElement, 'textContent', '');
            }
          }
        }
      },
      () => {}
    );
  }

  private handleError(message: string, error: Error | unknown): void {
    let errorMessage = 'Unknown clipboard error';

    if (error) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if ((error as Error).message) {
        errorMessage = (error as Error).message;
      } else if ((error as ClipboardJS.Event).action) {
        const { action, text } = error as ClipboardJS.Event;
        if (action === 'cut' && (!text || text.trim().length === 0)) {
          errorMessage = 'No text to cut - target element is empty';
        } else if (action === 'copy' && (!text || text.trim().length === 0)) {
          errorMessage = 'No text to copy - target element is empty';
        } else {
          errorMessage = `Clipboard ${action} operation failed`;
        }
      }
    }

    this.logger.error(message, 'ClipboardDirective', { error: errorMessage });

    const clipboardError: ClipboardError = {
      code: 'CLIPBOARD_ERROR',
      message: errorMessage,
      details: error,
    };
    this.status.setError(clipboardError);
    this.status.setActive(false);
    this.status.setLoading(false);

    this.errorEvent.emit({
      action: this._lastAction(),
      trigger: this.host.elementRef.nativeElement,
      error: clipboardError,
    });
  }

  private validate(): ClipboardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const options = this.options();

    if (!options.target && !options.text) {
      errors.push('Either target or text must be specified');
    }

    if (options.target && typeof options.target === 'string') {
      const targetElement = this.host.document.querySelector(options.target);
      if (!targetElement) errors.push(`Target element not found: ${options.target}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private destroy(): void {
    runSafely(
      () => {
        if (this.clipboardInstance) {
          this.clipboardInstance.destroy();
          this.clipboardInstance = null;
        }
        this.clearDataAttributes(this.host.elementRef.nativeElement);
        this.baseCleanup();
        this.status.setLoading(false);
      },
      () => {}
    );
  }

  getOptions(): ClipboardOptions {
    return { ...this.options() };
  }

  getLastAction(): string {
    return this._lastAction();
  }

  getLastText(): string {
    return this._lastText();
  }

  isClipboardSupported(): boolean {
    return this._isSupported();
  }

  getValidationResult(): ClipboardValidationResult {
    return this.validate();
  }

  updateOptions(options: Partial<ClipboardOptions>): void {
    this.mergeOptions(options);
    if (this.isBaseInitialized()) this.reinitialize();
  }

  refresh(): void {
    if (this.isBaseInitialized()) this.reinitialize();
  }

  recreate(): void {
    this.destroy();
    this.initialize();
  }

  reset(): void {
    this.mergeOptions({ ...DEFAULT_OPTIONS });
    if (this.isBaseInitialized()) this.reinitialize();
    this._lastAction.set('');
    this._lastText.set('');
    this.status.setError(null);
  }

  trigger(): void {
    if (this.clipboardInstance && this.host.isBrowser) {
      this.host.elementRef.nativeElement.click();
    }
  }

  clearSelection(): void {
    if (!this.host.isBrowser || !this.host.window?.getSelection) return;
    this.host.window.getSelection()?.removeAllRanges();
  }
}
