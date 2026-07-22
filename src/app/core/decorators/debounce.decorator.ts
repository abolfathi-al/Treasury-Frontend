const DEFAULT_DEBOUNCE_MS = 100;
const CANCEL_DEBOUNCE_PROPERTY = 'cancelDebounce';

type DebouncedSourceMethod = (this: object, ...args: unknown[]) => unknown;

export function Debounce(milliseconds: number = DEFAULT_DEBOUNCE_MS): MethodDecorator {
  let timeoutRef: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: unknown[] | null = null;

  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as DebouncedSourceMethod;

    const debouncedMethod = function (this: object, ...args: unknown[]): void {
      if (hasSameArgs(lastArgs, args)) {
        clearTimeout(timeoutRef);
      }

      lastArgs = args;

      timeoutRef = setTimeout(() => {
        originalMethod.apply(this, args);
        lastArgs = null;
      }, milliseconds);
    };

    addCancelMethod(debouncedMethod, () => {
      clearTimeout(timeoutRef);
      lastArgs = null;
    });

    return {
      ...descriptor,
      value: debouncedMethod
    };
  };
}

const hasSameArgs = (
  lastArgs: readonly unknown[] | null,
  currentArgs: readonly unknown[]
): boolean => {
  if (!lastArgs || lastArgs.length !== currentArgs.length) {
    return false;
  }
  return currentArgs.every((arg, index) => arg === lastArgs[index]);
};

const addCancelMethod = (method: object, cancelFn: () => void): void => {
  Object.defineProperty(method, CANCEL_DEBOUNCE_PROPERTY, {
    value: cancelFn,
    writable: false,
    enumerable: false,
    configurable: true
  });
};
