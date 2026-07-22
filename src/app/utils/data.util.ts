import { LoggerService } from "@core/services/logger.service";

export class DataUtil {
  private static store = new Map<HTMLElement, Map<string, unknown>>();

  static set(instance: HTMLElement | undefined, key: string, data: unknown): void {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { key, data }
        });
        return;
      }

      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { instance, key, data }
        });
        return;
      }

      let instanceData = this.store.get(instance);
      if (!instanceData) {
        instanceData = new Map();
        this.store.set(instance, instanceData);
      }

      instanceData.set(key, data);
    } catch (error) {
      LoggerService.Error('Failed to set data', 'DataUtil', {
        data: { instance, key, data, error }
      });
    }
  }

  static get<T = unknown>(instance: HTMLElement, key: string): T | undefined {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { instance, key }
        });
        return undefined;
      }

      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { instance, key }
        });
        return undefined;
      }

      const instanceData = this.store.get(instance);
      if (!instanceData) {
        return undefined;
      }

      return instanceData.get(key) as T;
    } catch (error) {
      LoggerService.Error('Failed to get data', 'DataUtil', {
        data: { instance, key, error }
      });
      return undefined;
    }
  }

  static remove(instance: HTMLElement, key: string): void {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { instance, key }
        });
        return;
      }

      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { instance, key }
        });
        return;
      }

      const instanceData = this.store.get(instance);
      if (!instanceData) {
        return;
      }

      instanceData.delete(key);

      if (instanceData.size === 0) {
        this.store.delete(instance);
      }
    } catch (error) {
      LoggerService.Error('Failed to remove data', 'DataUtil', {
        data: { instance, key, error }
      });
    }
  }

  static removeFromArray(instance: HTMLElement, key: string, itemToRemove: string): void {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { instance, key, itemToRemove }
        });
        return;
      }

      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { instance, key, itemToRemove }
        });
        return;
      }

      const instanceData = this.store.get(instance);
      if (!instanceData) {
        return;
      }

      const arrayData = instanceData.get(key);
      if (!Array.isArray(arrayData)) {
        LoggerService.Warn('Data is not an array', 'DataUtil', {
          data: { instance, key, itemToRemove, arrayData }
        });
        return;
      }

      const updatedArray = arrayData.filter(item => item !== itemToRemove);
      instanceData.set(key, updatedArray);
    } catch (error) {
      LoggerService.Error('Failed to remove item from array', 'DataUtil', {
        data: { instance, key, itemToRemove, error }
      });
    }
  }

  static has(instance: HTMLElement, key: string): boolean {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { key }
        });
        return false;
      }

      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { instance, key }
        });
        return false;
      }

      const instanceData = this.store.get(instance);
      return instanceData ? instanceData.has(key) : false;
    } catch (error) {
      LoggerService.Error('Failed to check data existence', 'DataUtil', {
        data: { instance, key, error }
      });
      return false;
    }
  }

  static getAllByKey<T = unknown>(key: string): T[] {
    try {
      if (!key) {
        LoggerService.Warn('Key is empty or undefined', 'DataUtil', {
          data: { key }
        });
        return [];
      }

      const result: T[] = [];
      
      this.store.forEach((instanceData) => {
        instanceData.forEach((value, instanceKey) => {
          if (instanceKey === key) {
            result.push(value as T);
          }
        });
      });

      return result;
    } catch (error) {
      LoggerService.Error('Failed to get all data by key', 'DataUtil', {
        data: { key }
      });
      return [];
    }
  }

  static clear(instance: HTMLElement): void {
    try {
      if (!instance) {
        LoggerService.Warn('Instance is null or undefined', 'DataUtil', {
          data: { instance }
        });
        return;
      }

      this.store.delete(instance);
    } catch (error) {
      LoggerService.Error('Failed to clear instance data', 'DataUtil', {
        data: { instance, error }
      });
    }
  }

  static clearAll(): void {
    try {
      this.store.clear();
    } catch (error) {
      LoggerService.Error('Failed to clear all data', 'DataUtil', {
        data: { error }
      });
    }
  }

  static getInstanceCount(): number {
    try {
      return this.store.size;
    } catch (error) {
      LoggerService.Error('Failed to get instance count', 'DataUtil', {
        data: { error }
      });
      return 0;
    }
  }

  static removeOne(instance: HTMLElement, key: string, eventId: string): void {
    this.removeFromArray(instance, key, eventId);
  }

  static getAllInstancesByKey(key: string): unknown[] {
    return this.getAllByKey(key);
  }
}
