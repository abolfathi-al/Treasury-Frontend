import {
  effect,
  Renderer2,
  Signal,
  signal,
  untracked,
} from '@angular/core';

export interface DirectiveStateSnapshot<TError> {
  isActive: boolean;
  isLoading: boolean;
  error: TError | null;
}

export interface DirectiveState<TError> {
  readonly isActive: Signal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<TError | null>;
  setActive(value: boolean): void;
  setLoading(value: boolean): void;
  setError(value: TError | null): void;
  getActive(): boolean;
  getLoading(): boolean;
  getError(): TError | null;
  reset(): void;
  snapshot(): DirectiveStateSnapshot<TError>;
}

export interface DomListenerManager {
  add(
    target: HTMLElement | Document | 'document' | 'window',
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void;
  clear(): void;
}

export function createDomListenerManager(
  renderer: Renderer2,
  isBrowser: boolean
): DomListenerManager {
  const unlisteners: Array<() => void> = [];

  return {
    add(
      target: HTMLElement | Document | 'document' | 'window',
      eventName: string,
      handler: EventListener,
      options?: AddEventListenerOptions
    ): void {
      if (!isBrowser) return;

      if (target === 'document' || target === 'window') {
        const unlisten = renderer.listen(target, eventName, handler);
        unlisteners.push(unlisten);
      } else if (target instanceof Document) {
        target.addEventListener(eventName, handler, options);
        unlisteners.push(() =>
          target.removeEventListener(eventName, handler, options)
        );
      } else {
        if (options) {
          target.addEventListener(eventName, handler, options);
          unlisteners.push(() =>
            target.removeEventListener(eventName, handler, options)
          );
        } else {
          const unlisten = renderer.listen(target, eventName, handler);
          unlisteners.push(unlisten);
        }
      }
    },
    clear(): void {
      const cleanupErrors: unknown[] = [];

      for (const unlisten of unlisteners.splice(0)) {
        try {
          unlisten();
        } catch (error) {
          cleanupErrors.push(error);
        }
      }

      if (cleanupErrors.length) {
        console.warn('One or more directive DOM listeners failed to clean up', {
          errors: cleanupErrors,
        });
      }
    },
  };
}

export type InputEffectBinding<
  TOptions,
  K extends keyof TOptions = keyof TOptions
> = {
  input: () => unknown;
  key: K;
  transform?: (value: TOptions[K]) => TOptions[K];
};

export function bindInputEffects<TOptions extends object>(
  bindings: InputEffectBinding<TOptions>[],
  updateOption: <K extends keyof TOptions>(
    key: K,
    value: TOptions[K]
  ) => boolean,
  onReinit?: () => void
): void {
  bindings.forEach(({ input, key, transform }) => {
    effect(() => {
      const value = input() as unknown;
      untracked(() => {
        if (value !== undefined) {
          const typedValue = value as TOptions[typeof key];
          const finalValue = transform ? transform(typedValue) : typedValue;
          const changed = updateOption(key, finalValue);
          if (changed) {
            onReinit?.();
          }
        }
      });
    });
  });
}

export function syncInputsToOptions<TOptions extends object>(
  bindings: InputEffectBinding<TOptions>[],
  updateOption: <K extends keyof TOptions>(
    key: K,
    value: TOptions[K]
  ) => boolean
): void {
  bindings.forEach(({ input, key, transform }) => {
    const value = input() as unknown;
    if (value !== undefined) {
      const typedValue = value as TOptions[typeof key];
      const finalValue = transform ? transform(typedValue) : typedValue;
      updateOption(key, finalValue);
    }
  });
}

export function createDirectiveState<TError = unknown>(
  initialState: Partial<DirectiveStateSnapshot<TError>> = {}
): DirectiveState<TError> {
  const { isActive = false, isLoading = false, error = null } = initialState;

  const activeSignal = signal<boolean>(isActive);
  const loadingSignal = signal<boolean>(isLoading);
  const errorSignal = signal<TError | null>(error);

  const setActive = (value: boolean) => activeSignal.set(value);
  const setLoading = (value: boolean) => loadingSignal.set(value);
  const setError = (value: TError | null) => errorSignal.set(value);

  return {
    isActive: activeSignal.asReadonly(),
    isLoading: loadingSignal.asReadonly(),
    error: errorSignal.asReadonly(),
    setActive,
    setLoading,
    setError,
    getActive: () => activeSignal(),
    getLoading: () => loadingSignal(),
    getError: () => errorSignal(),
    reset: () => {
      activeSignal.set(false);
      loadingSignal.set(false);
      errorSignal.set(null);
    },
    snapshot: () => ({
      isActive: activeSignal(),
      isLoading: loadingSignal(),
      error: errorSignal(),
    }),
  };
}

export interface OptionsManager<T extends object> {
  readonly options: Signal<T>;
  snapshot(): T;
  setOption<K extends keyof T>(key: K, value: T[K] | undefined): boolean;
  mergeOptions(options: Partial<T> | undefined): boolean;
  set(options: T): boolean;
  reset(): boolean;
}

export type OptionsChangeHandler<T extends object> = (
  options: T,
  changedKey?: keyof T
) => void;

export function createOptionsManager<T extends object>(
  defaults: T,
  onChange?: OptionsChangeHandler<T>
): OptionsManager<T> {
  const initialState = { ...defaults };
  const optionsSignal = signal<T>({ ...initialState });

  const notify = (next: T, key?: keyof T) => {
    onChange?.(next, key);
  };

  const resolveValue = <K extends keyof T>(
    key: K,
    value: T[K] | undefined
  ): T[K] => {
    return value === undefined ? initialState[key] : value;
  };

  const shallowEqual = (a: T, b: T): boolean => {
    if (a === b) return true;
    const keysA = Object.keys(a) as (keyof T)[];
    const keysB = Object.keys(b) as (keyof T)[];
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => Object.is(a[key], b[key]));
  };

  const setOption: OptionsManager<T>['setOption'] = (key, value) => {
    const current = optionsSignal();
    const nextValue = resolveValue(key, value);

    if (Object.is(current[key], nextValue)) {
      return false;
    }

    const next = { ...current, [key]: nextValue };
    optionsSignal.set(next);
    notify(next, key);
    return true;
  };

  const mergeOptions: OptionsManager<T>['mergeOptions'] = (options) => {
    if (!options) {
      return false;
    }

    const current = optionsSignal();
    let changed = false;
    const next: T = { ...current };

    (Object.keys(options) as (keyof T)[]).forEach((key) => {
      const candidate = resolveValue(key, options[key]);
      if (!Object.is(current[key], candidate)) {
        next[key] = candidate;
        changed = true;
      }
    });

    if (!changed) {
      return false;
    }

    optionsSignal.set(next);
    notify(next);
    return true;
  };

  const set: OptionsManager<T>['set'] = (options) => {
    const next = { ...options };
    const current = optionsSignal();

    if (shallowEqual(current, next)) {
      return false;
    }

    optionsSignal.set(next);
    notify(next);
    return true;
  };

  const reset: OptionsManager<T>['reset'] = () => set(initialState);

  return {
    options: optionsSignal.asReadonly(),
    snapshot: () => optionsSignal(),
    setOption,
    mergeOptions,
    set,
    reset,
  };
}

export type OptionsChangedCallback<T extends object> = (
  options: T
) => void;

export function setOptionIfChanged<
  T extends object,
  K extends keyof T
>(
  manager: OptionsManager<T>,
  key: K,
  value: T[K] | undefined,
  onChanged?: OptionsChangedCallback<T>
): boolean {
  const changed = manager.setOption(key, value);
  if (changed) {
    onChanged?.(manager.snapshot());
  }
  return changed;
}

export function mergeOptionsIfChanged<T extends object>(
  manager: OptionsManager<T>,
  options: Partial<T> | undefined,
  onChanged?: OptionsChangedCallback<T>
): boolean {
  const changed = manager.mergeOptions(options);
  if (changed) {
    onChanged?.(manager.snapshot());
  }
  return changed;
}

export function setOptionsIfChanged<T extends object>(
  manager: OptionsManager<T>,
  options: T,
  onChanged?: OptionsChangedCallback<T>
): boolean {
  const changed = manager.set(options);
  if (changed) {
    onChanged?.(manager.snapshot());
  }
  return changed;
}

export function runSafely<T>(
  fn: () => T,
  onError: (error: Error) => void
): T | undefined {
  try {
    return fn();
  } catch (error) {
    onError(normalizeThrownError(error));
    return undefined;
  }
}

function normalizeThrownError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return new Error(error.message);
  }

  return new Error(String(error));
}

export interface LoggerAdapter {
  error(
    message: string,
    context?: string,
    meta?: Record<string, unknown>
  ): void;
}

export function createSafeExecutor(
  logger: LoggerAdapter,
  context: string
): <T>(operation: () => T, errorMessage: string) => T | undefined {
  return (operation, errorMessage) =>
    runSafely(operation, (error) =>
      logger.error(errorMessage, context, { error })
    );
}

export function invokeCallbackSafely<TArgs extends unknown[]>(
  callback: ((...args: TArgs) => void) | undefined,
  logger: LoggerAdapter,
  context: string,
  errorMessage: string,
  ...args: TArgs
): void {
  if (!callback) {
    return;
  }
  runSafely(
    () => {
      callback(...args);
    },
    (error) => logger.error(errorMessage, context, { error })
  );
}
