import { Renderer2, Signal, signal } from '@angular/core';
import {
  bindInputEffects,
  createDirectiveState,
  createDomListenerManager,
  createOptionsManager,
  createSafeExecutor,
  DomListenerManager,
  InputEffectBinding,
  LoggerAdapter,
  runSafely,
  syncInputsToOptions,
} from './directive-helpers';

type BaseRenderer = Pick<
  Renderer2,
  'addClass' | 'removeClass' | 'setAttribute' | 'removeAttribute'
>;

export abstract class BaseDirective<
  TOptions extends object,
  TError = string
> {
  protected readonly status = createDirectiveState<TError>();
  protected readonly optionsManager = createOptionsManager<TOptions>(
    this.defaults,
    (next) => this.onOptionsChanged(next)
  );
  protected readonly executeSafely = createSafeExecutor(
    this.logger,
    this.contextName
  );
  private readonly __baseInitialized = signal<boolean>(false);
  private readonly __baseDestroyed = signal<boolean>(false);

  readonly options: Signal<TOptions> = this.optionsManager.options;
  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;

  private __baseDomListeners: DomListenerManager | null = null;

  constructor(
    protected readonly logger: LoggerAdapter,
    protected readonly contextName: string,
    private readonly defaults: TOptions
  ) {}

  protected onOptionsChanged(_next: TOptions): void {}

  protected setActive(active: boolean): void {
    this.status.setActive(active);
  }
  protected setLoading(loading: boolean): void {
    this.status.setLoading(loading);
  }
  protected setError(error: TError | null): void {
    this.status.setError(error);
  }

  protected updateOption<K extends keyof TOptions>(
    key: K,
    value: TOptions[K]
  ): boolean {
    return this.optionsManager.setOption(key, value);
  }

  protected mergeOptions(options: Partial<TOptions> | undefined): boolean {
    return this.optionsManager.mergeOptions(options);
  }

  protected setOptions(options: TOptions): boolean {
    return this.optionsManager.set(options);
  }

  protected runOperation(action: () => void, message: string): void {
    runSafely(action, (error) => {
      const msg = error.message || String(error);
      this.status.setError(msg as unknown as TError);
      this.logger.error(message, this.contextName, { error });
    });
  }

  protected initBaseDomListeners(
    renderer: Renderer2,
    isBrowser: boolean
  ): DomListenerManager {
    if (!this.__baseDomListeners) {
      this.__baseDomListeners = createDomListenerManager(renderer, isBrowser);
    }
    return this.__baseDomListeners;
  }

  protected addBaseDomListener(
    target: HTMLElement | Document | 'document' | 'window',
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    this.__baseDomListeners?.add(target, eventName, handler, options);
  }

  protected clearBaseDomListeners(): void {
    this.__baseDomListeners?.clear();
  }

  protected bindInputs(
    bindings: InputEffectBinding<TOptions>[],
    onReinit?: () => void
  ): void {
    bindInputEffects(
      bindings,
      (key, value) => this.updateOption(key, value),
      onReinit
    );
  }

  protected syncInputs(bindings: InputEffectBinding<TOptions>[]): void {
    syncInputsToOptions(bindings, (key, value) =>
      this.updateOption(key, value)
    );
  }

  protected setClass(
    renderer: BaseRenderer,
    el: HTMLElement | null,
    className: string,
    add: boolean
  ): void {
    if (!el || !className) return;
    if (add) renderer.addClass(el, className);
    else renderer.removeClass(el, className);
  }

  protected setDataAttr(
    renderer: BaseRenderer,
    el: HTMLElement | null,
    name: string,
    value: string | null
  ): void {
    if (!el || !name) return;
    if (value === null) renderer.removeAttribute(el, name);
    else renderer.setAttribute(el, name, value);
  }

  protected getHostWindow(): Window | null {
    return typeof window === 'undefined' ? null : window;
  }

  protected isActivateOn(): boolean {
    const snapshot = this.optionsManager.snapshot() as TOptions & {
      activate?: boolean;
    };
    return snapshot.activate ?? true;
  }

  protected markBaseInitialized(): void {
    this.__baseInitialized.set(true);
  }

  protected markBaseDestroyed(): void {
    this.__baseDestroyed.set(true);
  }

  protected isBaseInitialized(): boolean {
    return this.__baseInitialized();
  }

  protected isBaseDestroyed(): boolean {
    return this.__baseDestroyed();
  }

  protected baseCleanup(): void {
    this.clearBaseDomListeners();
    this.__baseInitialized.set(false);
    this.status.setActive(false);
    this.status.setError(null);
  }
}
