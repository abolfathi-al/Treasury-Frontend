// Contract only. Do not store real tokens until the backend session contract exists.
export abstract class SessionStorageAdapter {
  abstract readJson<T>(key: string): T | undefined;
  abstract writeJson<T>(key: string, value: T): void;
  abstract remove(key: string): void;
  abstract clearNamespace(namespace: string): void;
}

