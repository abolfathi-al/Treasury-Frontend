import { LoggerService } from '@core/services/logger.service';

const DEFAULT_PREFIX = 'id';
const RANDOM_PART_LENGTH = 5;
const MILLISECONDS_PER_DAY = 86400000;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export class CoreUtil {
  static getUniqueIdWithPrefix(prefix: string = DEFAULT_PREFIX): string {
    try {
      const timestamp = Date.now().toString(36);
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 2 + RANDOM_PART_LENGTH);
      return `${prefix}_${timestamp}_${randomPart}`;
    } catch (error) {
      LoggerService.Error('Failed to generate unique ID', 'CoreUtil', {
        data: { prefix, error },
      });
      return `${prefix}_${Date.now()}`;
    }
  }

  static getNestedProperty<T = unknown>(
    obj: unknown,
    path: string,
    defaultValue?: T
  ): T | undefined {
    try {
      if (!obj || !path) return defaultValue;

      const keys = path.split('.');
      let result: unknown = obj;

      for (const key of keys) {
        if (!isRecord(result)) {
          return defaultValue;
        }
        result = result[key];
      }

      return result !== undefined ? (result as T) : defaultValue;
    } catch (error) {
      LoggerService.Error('Failed to get nested property', 'CoreUtil', {
        data: { obj, path, defaultValue, error },
      });
      return defaultValue;
    }
  }

  static setNestedProperty(obj: unknown, path: string, value: unknown): boolean {
    try {
      if (!isRecord(obj) || !path) return false;

      const keys = path.split('.');
      let current: UnknownRecord = obj;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!isRecord(current[key])) {
          current[key] = {};
        }
        current = current[key] as UnknownRecord;
      }

      current[keys[keys.length - 1]] = value;
      return true;
    } catch (error) {
      LoggerService.Error('Failed to set nested property', 'CoreUtil', {
        data: { obj, path, value, error },
      });
      return false;
    }
  }

  static hasNestedProperty(obj: unknown, path: string): boolean {
    try {
      if (!isRecord(obj) || !path) return false;
      const keys = path.split('.');
      let current: unknown = obj;
      for (const key of keys) {
        if (
          !isRecord(current) ||
          !(key in current)
        ) {
          return false;
        }
        current = current[key];
      }
      return true;
    } catch (error) {
      LoggerService.Error(
        'Failed to check nested property existence',
        'CoreUtil',
        {
          data: { obj, path, error },
        }
      );
      return false;
    }
  }

  static deleteNestedProperty(obj: unknown, path: string): boolean {
    try {
      if (!isRecord(obj) || !path) return false;
      const keys = path.split('.');
      let current: UnknownRecord = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!isRecord(current[key])) {
          return false;
        }
        current = current[key] as UnknownRecord;
      }
      const leafKey = keys[keys.length - 1];
      if (leafKey in current) {
        delete current[leafKey];
        return true;
      }
      return false;
    } catch (error) {
      LoggerService.Error('Failed to delete nested property', 'CoreUtil', {
        data: { obj, path, error },
      });
      return false;
    }
  }

  static ensureNestedPath<T extends object = UnknownRecord>(
    obj: unknown,
    path: string
  ): T | undefined {
    try {
      if (!isRecord(obj) || !path) return undefined;
      const keys = path.split('.');
      let current: UnknownRecord = obj;
      for (const key of keys) {
        if (!isRecord(current[key])) {
          current[key] = {};
        }
        current = current[key] as UnknownRecord;
      }
      return current as T;
    } catch (error) {
      LoggerService.Error('Failed to ensure nested path', 'CoreUtil', {
        data: { obj, path, error },
      });
      return undefined;
    }
  }

  static ensureNestedArray<T = unknown>(
    obj: Record<string, unknown>,
    path: string
  ): T[] | undefined {
    try {
      if (!obj || !path) return undefined;
      const pathParts = path.split('.');
      const parentPath = pathParts.slice(0, -1).join('.');
      const arrayKey = pathParts[pathParts.length - 1];
      const parent = parentPath
        ? this.ensureNestedPath<Record<string, unknown>>(obj, parentPath)
        : obj;

      if (!parent || !arrayKey) {
        return undefined;
      }

      const existingValue = parent[arrayKey];
      if (Array.isArray(existingValue)) {
        return existingValue as T[];
      }

      const nextValue: T[] = [];
      parent[arrayKey] = nextValue;
      return nextValue;
    } catch (error) {
      LoggerService.Error('Failed to ensure nested array', 'CoreUtil', {
        data: { obj, path, error },
      });
      return undefined;
    }
  }

  static updateNestedProperty<T = unknown>(
    obj: unknown,
    path: string,
    updater: (prev: T | undefined) => T
  ): boolean {
    try {
      if (!isRecord(obj) || !path || typeof updater !== 'function') return false;
      const keys = path.split('.');
      let current: UnknownRecord = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!isRecord(current[key])) {
          current[key] = {};
        }
        current = current[key] as UnknownRecord;
      }
      const leafKey = keys[keys.length - 1];
      const nextValue = updater(current[leafKey] as T | undefined);
      current[leafKey] = nextValue;
      return true;
    } catch (error) {
      LoggerService.Error('Failed to update nested property', 'CoreUtil', {
        data: { obj, path, error },
      });
      return false;
    }
  }

  static pushToNestedArray<T = unknown>(
    obj: Record<string, unknown>,
    path: string,
    value: T
  ): boolean {
    try {
      const nestedArray = this.ensureNestedArray<T>(obj, path);
      if (!nestedArray) return false;
      nestedArray.push(value);
      return true;
    } catch (error) {
      LoggerService.Error('Failed to push to nested array', 'CoreUtil', {
        data: { obj, path, value, error },
      });
      return false;
    }
  }

  static isEmptyValue(value: unknown): boolean {
    try {
      return value === null || value === undefined || value === '' || value === ' ';
    } catch (error) {
      LoggerService.Error('Failed to check if value is empty', 'CoreUtil', {
        data: { value, error },
      });
      return true;
    }
  }

  static isNotEmptyValue(value: unknown): boolean {
    return !this.isEmptyValue(value);
  }

  static isObject(item: unknown): item is Record<string, unknown> {
    try {
      return item !== null && typeof item === 'object' && !Array.isArray(item);
    } catch (error) {
      LoggerService.Error('Failed to check if value is object', 'CoreUtil', {
        data: { item, error },
      });
      return false;
    }
  }

  static createDeepClone<T extends Object>(value: T): T {
    try {
      if ('structuredClone' in window) {
        return window.structuredClone(value);
      }
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      LoggerService.Error('Failed to create deep clone', 'CoreUtil', {
        data: { value, error },
      });
      return value;
    }
  }

  static deepMergeObjects<T extends Object>(target: T, ...sources: T[]): T {
    try {
      if (!sources.length) return target;
      const source = sources.shift();

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            this.deepMergeObjects(target[key] || <T>{}, source[key] || <T>{});
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return this.deepMergeObjects(target, ...sources);
    } catch (error) {
      LoggerService.Error('Failed to deep merge objects', 'CoreUtil', {
        data: { target, sources, error },
      });
      return target;
    }
  }

  static findObjectDifferences<T extends object, K extends keyof T>(
    obj1: T,
    obj2: T
  ): K[] {
    try {
      return (Object.keys(obj1) as K[]).reduce((diffKeys, key) => {
        if (!(key in obj2) || obj1[key] !== obj2[key]) {
          diffKeys.push(key);
        }
        return diffKeys;
      }, [] as K[]);
    } catch (error) {
      LoggerService.Error('Failed to find object differences', 'CoreUtil', {
        data: { obj1, obj2, error },
      });
      return [];
    }
  }

  static renameObjectKey<T extends Object, K extends keyof T>(
    inputObj: T,
    oldKey: K,
    newKey: K
  ): T {
    try {
      const obj = { ...inputObj };

      if (
        Object.prototype.hasOwnProperty.call(obj, oldKey) &&
        oldKey !== newKey
      ) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, oldKey);
        if (descriptor) {
          Object.defineProperty(obj, newKey, descriptor);
          delete obj[oldKey];
        }
      }
      return obj;
    } catch (error) {
      LoggerService.Error('Failed to rename object key', 'CoreUtil', {
        data: { inputObj, oldKey, newKey, error },
      });
      return inputObj;
    }
  }

  static removeBlankAttributes<T extends Object>(inputObj: T): Partial<T> {
    try {
      const result: Partial<T> = {};
      for (const key in inputObj) {
        const value = inputObj[key];
        if (value !== null && value !== undefined && value !== '') {
          result[key] = value;
        }
      }
      return result;
    } catch (error) {
      LoggerService.Error('Failed to remove blank attributes', 'CoreUtil', {
        data: { inputObj, error },
      });
      return {};
    }
  }

  static filterObjectByPredicate<T extends Object, K extends keyof T>(
    obj: T,
    predicate: (value: T[K]) => boolean
  ): Partial<T> {
    try {
      return (Object.keys(obj) as K[])
        .filter((key) => predicate(obj[key]))
        .reduce((result, key) => {
          result[key] = obj[key];
          return result;
        }, {} as Partial<T>);
    } catch (error) {
      LoggerService.Error('Failed to filter object by predicate', 'CoreUtil', {
        data: { obj, predicate: predicate.toString(), error },
      });
      return {};
    }
  }

  static convertToPersianCharacters(value: string): string {
    try {
      if (!value) {
        return '';
      }

      const characterMap: Record<string, string> = {
        ك: 'ک',
        دِ: 'د',
        بِ: 'ب',
        زِ: 'ز',
        ذِ: 'ذ',
        شِ: 'ش',
        سِ: 'س',
        ى: 'ی',
        ي: 'ی',
        '١': '۱',
        '٢': '۲',
        '٣': '۳',
        '٤': '۴',
        '٥': '۵',
        '٦': '۶',
        '٧': '۷',
        '٨': '۸',
        '٩': '۹',
        '٠': '۰',
      };

      const regex = new RegExp(Object.keys(characterMap).join('|'), 'g');
      return value.replace(regex, (match) => {
        return characterMap[match] || match;
      });
    } catch (error) {
      LoggerService.Error(
        'Failed to convert to Persian characters',
        'CoreUtil',
        {
          data: { value, error },
        }
      );
      return value || '';
    }
  }

  static searchObjectByValue<T extends Object, K extends keyof T>(
    obj: T,
    keys: K[],
    searchTerm: string
  ): boolean {
    try {
      return keys.some((key) =>
        this.convertToPersianCharacters(String(obj[key])).includes(
          this.convertToPersianCharacters(searchTerm)
        )
      );
    } catch (error) {
      LoggerService.Error('Failed to search object by value', 'CoreUtil', {
        data: { obj, keys, searchTerm, error },
      });
      return false;
    }
  }

  static createSortComparer<T, K extends keyof T>(
    fields: K[],
    order: 'asc' | 'desc' = 'asc'
  ): (a: T, b: T) => number {
    try {
      return function compareFn(a: T, b: T, i = 0): number {
        const field = fields[i];

        if (field && a[field] === b[field]) {
          return compareFn(a, b, i + 1);
        }

        if (a[field] < b[field]) {
          return order === 'asc' ? -1 : 1;
        }

        if (a[field] > b[field]) {
          return order === 'asc' ? 1 : -1;
        }

        return 0;
      };
    } catch (error) {
      LoggerService.Error('Failed to create sort comparer', 'CoreUtil', {
        data: { fields, order, error },
      });
      return () => 0;
    }
  }

  static generateDayWiseTimeSeries(
    startDate: number,
    count: number,
    range: { min: number; max: number }
  ): [number, number][] {
    try {
      let i = 0;
      let currentDate = startDate;
      const series: [number, number][] = [];
      while (i < count) {
        const x = currentDate;
        const y =
          Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        series.push([x, y]);
        currentDate += MILLISECONDS_PER_DAY;
        i++;
      }
      return series;
    } catch (error) {
      LoggerService.Error(
        'Failed to generate day-wise time series',
        'CoreUtil',
        {
          data: { startDate, count, range, error },
        }
      );
      return [];
    }
  }

  static replaceUrlParameter(
    url: string,
    paramName: string,
    paramValue: string
  ): string {
    try {
      if (paramValue == null) {
        paramValue = '';
      }

      const pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');

      if (url.search(pattern) >= 0) {
        return url.replace(pattern, '$1' + paramValue + '$2');
      }

      url = url.replace(/[?#]$/, '');
      return (
        url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
      );
    } catch (error) {
      LoggerService.Error('Failed to replace URL parameter', 'CoreUtil', {
        data: { url, paramName, paramValue, error },
      });
      return url;
    }
  }

  static calculateTextWidth(text: string, offset = 13): number {
    try {
      if (!text) return 0;

      const textElement = document.createElement('span');
      textElement.style.width = 'auto';
      textElement.style.position = 'absolute';
      textElement.style.whiteSpace = 'nowrap';
      textElement.style.opacity = '0';
      textElement.style.visibility = 'hidden';
      textElement.textContent = text;

      document.body.appendChild(textElement);
      const width = Math.ceil(textElement.clientWidth) + offset;
      document.body.removeChild(textElement);

      return width;
    } catch (error) {
      LoggerService.Error('Failed to calculate text width', 'CoreUtil', {
        data: { text, offset, error },
      });
      return text ? text.length * 8 + offset : offset;
    }
  }

  static throttle(
    timer: number | undefined,
    func: Function,
    delay?: number
  ): void {
    try {
      if (timer) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        func();
        timer = undefined;
      }, delay || 0);

      timer = timeoutId;
    } catch (error) {
      LoggerService.Error('Throttle failed', 'CoreUtil', {
        data: { error, timer, func, delay },
      });
    }
  }

  static isMobileDevice(): boolean {
    try {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    } catch (error) {
      LoggerService.Error('Is mobile device failed', 'CoreUtil', {
        data: { error },
      });
      return false;
    }
  }

  static parseNumber(value: string | number): number {
    try {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    } catch (error) {
      LoggerService.Error('Failed to parse number', 'CoreUtil', {
        data: { value, error },
      });
      return 0;
    }
  }

  static toJSON(value: string | object): unknown {
    if (typeof value !== 'string') {
      return value;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      LoggerService.Error('Failed to convert string to JSON', 'CoreUtil', {
        data: { value, error },
      });
      return value;
    }
  }

  static toBoolean(value: string | boolean): boolean {
    try {
      return value === 'true' || (value === 'false' ? false : Boolean(value));
    } catch (error) {
      LoggerService.Error('Failed to convert string to boolean', 'CoreUtil', {
        data: { value, error },
      });
      return Boolean(value);
    }
  }

  static stringSnakeToCamel(str: string): string {
    try {
      return str.replace(/(\-\w)/g, function (m) {
        return m[1].toUpperCase();
      });
    } catch (error) {
      LoggerService.Error(
        'Failed to convert snake_case to camelCase',
        'CoreUtil',
        {
          data: { str, error },
        }
      );
      return str;
    }
  }

  static coerceBooleanProperty(value: unknown): boolean {
    try {
      return value != null && `${value}` !== 'false';
    } catch (error) {
      LoggerService.Error('Failed to coerce boolean property', 'CoreUtil', {
        data: { value, error },
      });
      return Boolean(value);
    }
  }

  static coerceNumberProperty(
    value: unknown,
    fallbackValue: number = 0
  ): number {
    try {
      if (value == null) {
        return fallbackValue;
      }
      const parsed = Number(value);
      return isNaN(parsed) ? fallbackValue : parsed;
    } catch (error) {
      LoggerService.Error('Failed to coerce number property', 'CoreUtil', {
        data: { value, fallbackValue, error },
      });
      return fallbackValue;
    }
  }

  static randomInt(min: number, max: number): number {
    try {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
      LoggerService.Error('Failed to generate random integer', 'CoreUtil', {
        data: { min, max, error },
      });
      return min;
    }
  }
}
