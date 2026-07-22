import { DataUtil } from './data.util';
import { CoreUtil } from './core.util';
import { LoggerService } from '@core/services/logger.service';

const DELEGATE_PREFIX = 'delegate';
const EVENT_PREFIX = 'event';

export class EventUtil {
  static addEventDelegate(
    element: HTMLElement, 
    selector: string, 
    eventName: string, 
    callback: (event: Event, target: HTMLElement) => void
  ): string {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'EventUtil', {
          data: { element, selector, eventName }
        });
        return '';
      }

      const eventId = CoreUtil.getUniqueIdWithPrefix(DELEGATE_PREFIX);

      const handler = (e: Event) => {
        const target = e.target as HTMLElement;
        let currentTarget: HTMLElement | null = target;

        while (currentTarget && currentTarget !== element) {
          if (currentTarget.matches(selector)) {
            callback(e, currentTarget);
            break;
          }
          currentTarget = currentTarget.parentElement;
        }
      };

      element.addEventListener(eventName, handler);
      DataUtil.set(element, `${EVENT_PREFIX}_${eventId}`, handler);

      return eventId;
    } catch (error) {
      LoggerService.Error('Failed to add event delegate', 'EventUtil', {
        element,
        data: { selector, eventName, error }
      });
      return '';
    }
  }

  static removeEventDelegate(element: HTMLElement, eventName: string, eventId: string): void {
    try {
      if (!element || !eventId) {
        LoggerService.Warn('Element or eventId is null/undefined', 'EventUtil', {
          element,
          data: { eventId }
        });
        return; 
      }

      const handler = DataUtil.get<EventListener>(element, `${EVENT_PREFIX}_${eventId}`);
      if (handler) {
        element.removeEventListener(eventName, handler);
        DataUtil.remove(element, `${EVENT_PREFIX}_${eventId}`);
      }
    } catch (error) {
      LoggerService.Error('Failed to remove event delegate', 'EventUtil', {
        element,
        data: { eventId, error }
      });
    }
  }

  static addOneTimeEvent(element: HTMLElement, eventName: string, callback: (event: Event) => void): void {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'EventUtil', {
          data: { element, eventName }
        });
        return;
      }

      const handler = (e: Event) => {
        element.removeEventListener(eventName, handler);
        callback(e);
      };

      element.addEventListener(eventName, handler);
    } catch (error) {
      LoggerService.Error('Failed to add one-time event', 'EventUtil', {
        data: { element, eventName, error }
      });
    }
  }

  static addEventListener(element: HTMLElement, name: string, callback: Function): string {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'EventUtil', {
          data: { element, name }
        });
        return '';
      }

      const eventId = CoreUtil.getUniqueIdWithPrefix(EVENT_PREFIX);
      const handler = (e: Event) => callback(e);
      
      element.addEventListener(name, handler);
      DataUtil.set(element, `${EVENT_PREFIX}_${eventId}`, handler);
      
      return eventId;
    } catch (error) {
      LoggerService.Error('Failed to add event listener', 'EventUtil', {
        data: { element, name, error }
      });
      return '';
    }
  }

  static removeEventListener(element: HTMLElement, name: string, handlerId: string): void {
    try {
      if (!element || !handlerId) {
        LoggerService.Warn('Element or handlerId is null/undefined', 'EventUtil', {
          data: { element, handlerId }
        });
        return;
      }

      const handler = DataUtil.get<EventListener>(element, `${EVENT_PREFIX}_${handlerId}`);
      if (handler) {
        element.removeEventListener(name, handler);
        DataUtil.remove(element, `${EVENT_PREFIX}_${handlerId}`);
      }
    } catch (error) {
      LoggerService.Error('Failed to remove event listener', 'EventUtil', {
        data: { element, handlerId, error }
      });
    }
  }

  static trigger(element: HTMLElement, name: string, target?: unknown, e?: Event): boolean {
    try {
      if (!element) {
        LoggerService.Warn('Element is null or undefined', 'EventUtil', {
          data: { element, name, target }
        });
        return true;
      }

      const customEvent = new CustomEvent<unknown>(name, {
        detail: target,
        bubbles: true,
        cancelable: true
      });
      
      return element.dispatchEvent(customEvent);
    } catch (error) {
      LoggerService.Error('Failed to trigger event', 'EventUtil', {
        data: { element, name, target, error }
      });
      return true;
    }
  }

  static on(element: HTMLElement, name: string, callback: Function): string {
    return this.addEventListener(element, name, callback);
  }

  static off(element: HTMLElement, name: string, handlerId: string): void {
    this.removeEventListener(element, name, handlerId);
  }
}
