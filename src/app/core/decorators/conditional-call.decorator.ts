type ConditionalMethod<T> = (this: T, ...args: unknown[]) => unknown;

export function ConditionalCall<T extends object = object>(
  conditionFn: (instance: T) => boolean
): MethodDecorator {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as ConditionalMethod<T>;

    const conditionalMethod = function (this: T, ...args: unknown[]): unknown {
      if (conditionFn(this)) {
        return originalMethod.apply(this, args);
      }
      return undefined;
    };

    return {
      ...descriptor,
      value: conditionalMethod
    };
  };
}
