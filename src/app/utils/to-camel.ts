export function toCamel<T = unknown>(obj: T): T {
  if (obj instanceof Array) {
    return obj.map((value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        return toCamel(value);
      }
      return value;
    }) as T;
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {} as Record<string, unknown>;
    for (const origKey in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, origKey)) {
        const newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
        let value = (obj as Record<string, unknown>)[origKey];
        if (value instanceof Array || (value !== null && value !== undefined && value.constructor === Object)) {
          value = toCamel(value);
        }
        newObj[newKey] = value;
      }
    }
    return newObj as T;
  }
  return obj;
}
