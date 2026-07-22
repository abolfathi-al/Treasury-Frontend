const PRIVATE_FIELD_PREFIX = '_';

type CoercionBackingStore = Record<string, unknown>;

const getBackingStore = (instance: object): CoercionBackingStore =>
  instance as CoercionBackingStore;

export function coercionDecoratorFactory<ReturnType>(
  coercionFunc: (value: unknown) => ReturnType
): PropertyDecorator {
  return function (target: unknown, propertyKey: PropertyKey): PropertyDescriptor {
    const privateFieldName = `${PRIVATE_FIELD_PREFIX}${String(propertyKey)}`;

    return {
      get(this: object): ReturnType {
        return getBackingStore(this)[privateFieldName] as ReturnType;
      },
      set(this: object, value: unknown): void {
        getBackingStore(this)[privateFieldName] = coercionFunc(value);
      },
      enumerable: true,
      configurable: true
    };
  };
}
