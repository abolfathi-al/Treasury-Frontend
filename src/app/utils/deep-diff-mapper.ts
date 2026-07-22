export enum DiffType {
  ADDED = 'added',
  REMOVED = 'removed',
  UPDATED = 'updated',
  UNCHANGED = 'unchanged'
}

export interface DiffResult {
  type: DiffType;
  key?: string;
  oldValue?: unknown;
  newValue?: unknown;
  children?: DiffResultMap;
}

export interface DiffResultMap {
  [key: string]: DiffResult;
}

export class DeepDiffMapper {
  static map<T extends object, K extends keyof T>(oldObj: T, newObj: T): DiffResultMap | DiffResult {
    if (DeepDiffMapper.isFunction(oldObj) || DeepDiffMapper.isFunction(newObj)) {
      throw new Error('Invalid argument. Function given, object expected.');
    }
    if (DeepDiffMapper.isValue(oldObj) || DeepDiffMapper.isValue(newObj)) {
      return DeepDiffMapper.compareValues(oldObj, newObj);
    }

    const diff: DiffResultMap = {};
    const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    keys.forEach(key => {
      const typedKey = key as K;
      if (DeepDiffMapper.isFunction(oldObj[typedKey]) || DeepDiffMapper.isFunction(newObj[typedKey])) {
        return;
      }

      if (oldObj[typedKey] !== undefined && newObj[typedKey] !== undefined) {
        diff[key] = DeepDiffMapper.map(oldObj[typedKey] as object, newObj[typedKey] as object) as DiffResult;
      } else if (oldObj[typedKey] !== undefined) {
        diff[key] = { type: DiffType.REMOVED, oldValue: oldObj[typedKey] };
      } else {
        diff[key] = { type: DiffType.ADDED, newValue: newObj[typedKey] };
      }
    });

    return diff;
  }

  private static compareValues(oldValue: unknown, newValue: unknown): DiffResult {
    if (oldValue === newValue) {
      return { type: DiffType.UNCHANGED, oldValue, newValue };
    }

    if (oldValue === undefined) {
      return { type: DiffType.ADDED, newValue };
    }

    if (newValue === undefined) {
      return { type: DiffType.REMOVED, oldValue };
    }

    return { type: DiffType.UPDATED, oldValue, newValue };
  }

  private static isFunction(x: unknown): boolean {
    return Object.prototype.toString.call(x) === '[object Function]';
  }

  private static isValue(x: unknown): boolean {
    return typeof x !== 'object' || x === null;
  }
}
