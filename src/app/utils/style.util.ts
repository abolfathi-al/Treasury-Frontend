import { LoggerService } from '@core/services/logger.service';

export class StyleUtil {
  static setProperty(element: HTMLElement, property: string, value?: string, important = false): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { property, value }
        });
        return;
      }

      if (important) {
        element.style.setProperty(property, value || '', 'important');
      } else {
        element.style.setProperty(property, value || '');
      }
    } catch (error) {
      LoggerService.Error('Failed to set CSS property', 'StyleUtil', {
        element,
        data: { property, value, important, error }
      });
    }
  }

  static getProperty(element: HTMLElement, property: string): string {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { property }
        });
        return '';
      }

      return element.style.getPropertyValue(property);
    } catch (error) {
      LoggerService.Error('Failed to get CSS property', 'StyleUtil', {
        element,
        data: { property }
      });
      return '';
    }
  }

  static removeProperty(element: HTMLElement, property: string): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { property }
        });
        return;
      }

      element.style.removeProperty(property);
    } catch (error) {
      LoggerService.Error('Failed to remove CSS property', 'StyleUtil', {
        element,
        data: { property }
      });
    }
  }

  static toggleClass(element: HTMLElement, className: string, force?: boolean): boolean {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { className, force }
        });
        return false;
      }

      return element.classList.toggle(className, force);
    } catch (error) {
      LoggerService.Error('Failed to toggle CSS class', 'StyleUtil', {
        element,
        data: { className, force }
      });
      return false;
    }
  }

  static addClass(element: HTMLElement, className: string): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { className }
        });
        return;
      }

      element.classList.add(className);
    } catch (error) {
      LoggerService.Error('Failed to add CSS class', 'StyleUtil', {
        element,
        data: { className }
      });
    }
  }

  static removeClass(element: HTMLElement, className: string): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { className }
        });
        return;
      }

      element.classList.remove(className);
    } catch (error) {
      LoggerService.Error('Failed to remove CSS class', 'StyleUtil', {
        element,
        data: { className }
      });
    }
  }

  static hasClass(element: HTMLElement, className: string): boolean {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { className }
        });
        return false;
      }

      return element.classList.contains(className);
    } catch (error) {
      LoggerService.Error('Failed to check CSS class', 'StyleUtil', {
        element,
        data: { className }
      });
      return false;
    }
  }

  static setAttribute(element: HTMLElement, name: string, value: string): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { name, value }
        });
        return;
      }

      element.setAttribute(name, value);
    } catch (error) {
      LoggerService.Error('Failed to set attribute', 'StyleUtil', {
        element,
        data: { name, value, error }
      });
    }
  }

  static removeAttribute(element: HTMLElement, name: string): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { name }
        });
        return;
      }

      element.removeAttribute(name);
    } catch (error) {
      LoggerService.Error('Failed to remove attribute', 'StyleUtil', {
        element,
        data: { name, error }
      });
    }
  }

  static getAttribute(element: HTMLElement, name: string): string | null {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'StyleUtil', {
          data: { name }
        });
        return null;
      }

      return element.getAttribute(name);
    } catch (error) {
      LoggerService.Error('Failed to get attribute', 'StyleUtil', {
        data: { name, error }
      });
      return null;
    }
  }

  static set(element: HTMLElement, property: string, value?: unknown, important?: boolean): void {
    this.setProperty(element, property, this.toStyleValue(value), important);
  }

  static get(element: HTMLElement, attributeName: string): string {
    return this.getProperty(element, attributeName);
  }

  static remove(element: HTMLElement, attributeName: string): void {
    this.removeProperty(element, attributeName);
  }

  private static toStyleValue(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return String(value);
  }
}
