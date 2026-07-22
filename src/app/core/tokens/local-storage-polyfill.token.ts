const KEY_ERROR_MESSAGE = "Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.";

class LocalStoragePolyfillImpl implements Storage {
  private readonly valuesMap = new Map<string, string>();

  getItem(key: string): string | null {
    const stringKey = String(key);
    return this.valuesMap.has(stringKey) ? String(this.valuesMap.get(stringKey)) : null;
  }

  setItem(key: string, value: string): void {
    this.valuesMap.set(String(key), String(value));
  }

  removeItem(key: string): void {
    this.valuesMap.delete(String(key));
  }

  clear(): void {
    this.valuesMap.clear();
  }

  key(index: number): string | null {
    if (arguments.length === 0) {
      throw new TypeError(KEY_ERROR_MESSAGE);
    }
    const keys = Array.from(this.valuesMap.keys());
    return keys[index] ?? null;
  }

  get length(): number {
    return this.valuesMap.size;
  }
}

export const LocalStoragePolyfill = new LocalStoragePolyfillImpl();
