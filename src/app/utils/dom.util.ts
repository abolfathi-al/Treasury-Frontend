import { CoreUtil } from './core.util';
import { ResponsiveBreakpointPrimitive, ResponsiveBreakpointValue, ResponsiveUtil } from './responsive.util';
import { EventUtil } from './event.util';
import { LoggerService } from '@core/services/logger.service';

const DEFAULT_TEXT_WIDTH_OFFSET = 8;
const DEFAULT_TEXT_WIDTH_MULTIPLIER = 8;

export class DomUtil {
  static getCSS(el: HTMLElement, styleProp: string): string {
    try {
      if (!el || !styleProp) {
        LoggerService.Warn('Element or style property is null/undefined', 'DomUtil', {
          data: { el, styleProp }
        });
        return '';
      }
      const defaultView = (el.ownerDocument || document).defaultView;
      if (!defaultView) {
        return '';
      }
      styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
      return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } catch (error) {
      LoggerService.Error('Failed to get CSS property', 'DomUtil', {
        data: { el, styleProp, error }
      });
      return '';
    }
  }

  static getCSSVariableValue(variableName: string): string {
    try {
      let hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) {
        hex = hex.trim();
      }
      return hex;
    } catch (error) {
      LoggerService.Error('Failed to get CSS variable value', 'DomUtil', {
        data: { variableName },
        error
      });
      return '';
    }
  }

  static getHighestZIndex(element?: HTMLElement): number {
    try {
      const elements = Array.from(document.querySelectorAll('*'))
        .map(el => parseFloat(this.getCSS(el as HTMLElement, 'z-index')) || 0)
        .filter(zIndex => zIndex > 0);
      return elements.length > 0 ? Math.max(...elements) : 0;
    } catch (error) {
      LoggerService.Error('Failed to get highest z-index', 'DomUtil', {
        data: { element, error }
      });
      return 0;
    }
  }

  static getScrollTop(): number {
    try {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    } catch (error) {
      LoggerService.Error('Failed to get scroll top', 'DomUtil', {
        data: { error }
      });
      return 0;
    }
  }

  static getViewPort(): { width: number; height: number } {
    try {
      return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      };
    } catch (error) {
      LoggerService.Error('Failed to get viewport', 'ComponentName', {
        data: { error }
      });
      return { width: 0, height: 0 };
    }
  }

  static getElementOffset(el: HTMLElement): { top: number; left: number } {
    try {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top + this.getScrollTop(),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
      };
    } catch (error) {
      LoggerService.Error('Failed to get element offset', 'DomUtil', {
        data: { element: el, error }
      });
      return { top: 0, left: 0 };
    }
  }

  static isVisibleElement(element: HTMLElement): boolean {
    try {
      return !(element.offsetWidth === 0 && element.offsetHeight === 0);
    } catch (error) {
      LoggerService.Error('Failed to check element visibility', 'DomUtil', {
        data: { element },
        error
      });
      return false;
    }
  }

  static getElementActualHeight(el: HTMLElement): number {
    try {
      return this.getElementActualCss(el, 'height', true);
    } catch (error) {
      LoggerService.Error('Failed to get element actual height', 'DomUtil', {
        data: { element: el, error }
      });
      return 0;
    }
  }

  static getElementActualWidth(el: HTMLElement, cache?: boolean): number {
    try {
      return this.getElementActualCss(el, 'width', cache !== false);
    } catch (error) {
      LoggerService.Error('Failed to get element actual width', 'DomUtil', {
        data: { element: el, error }
      });
      return 0;
    }
  }

  static getElementActualCss(el: HTMLElement, prop: string, cache: boolean): number {
    try {
      let css = '';

      const cacheAttr = `velora-hidden-${prop}`;
      if (!el.getAttribute(cacheAttr) || cache === false) {
        let value: number = 0;

        // the element is hidden so:
        // making the el block so we can measure its height but still be hidden
        css = el.style.cssText;
        el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

        if (prop === 'width') {
          value = el.offsetWidth;
        } else if (prop === 'height') {
          value = el.offsetHeight;
        }

        el.style.cssText = css;

        el.setAttribute(cacheAttr, value.toString());
        return value;
      } else {
        return parseInt(el.getAttribute(cacheAttr) || '0');
      }
    } catch (error) {
      LoggerService.Error('Failed to get element actual CSS', 'DomUtil', {
        data: { element: el, prop, cache, error }
      });
      return 0;
    }
  }

  static getElementIndex(element: HTMLElement): number {
    try {
      if (!element || !element.parentElement) {
        return -1;
      }
      return Array.from(element.parentElement.children).indexOf(element);
    } catch (error) {
      LoggerService.Error('Get element index failed', 'DomUtil', {
        data: { element, error }  
      });
      return -1;
    }
  }

  static getElementMatches(element: HTMLElement, selector: string): boolean {
    try {
      return element.matches(selector);
    } catch (error) {
      LoggerService.Error('Get element matches failed', 'DomUtil', {
        data: { element, selector, error }
      });
      return false;
    }
  }

  static getElementParents(element: Element, selector: string): Element[] {
    try {
      const parents: Element[] = [];
      let parent = element.parentElement;
      
      while (parent) {
        if (parent.matches(selector)) {
          parents.push(parent);
        }
        parent = parent.parentElement;
      }
      
      return parents;
    } catch (error) {
      LoggerService.Error('Get element parents failed', 'DomUtil', {
        data: { element, selector, error }
      });
      return [];
    }
  }

  static getElementChildren(element: HTMLElement, selector: string): Array<HTMLElement> | null {
    try {
      if (!element || !element.childNodes) {
        return null;
      }

      const result: Array<HTMLElement> = [];
      const children = element.children;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.matches(selector)) {
          result.push(child);
        }
      }

      return result;
    } catch (error) {
      LoggerService.Error('Get element children failed', 'DomUtil', {
        data: { element, selector, error }
      });
      return null;
    }
  }

  static getElementChild(element: HTMLElement, selector: string): HTMLElement | null {
    try {
      if (!element) {
        return null;
      }
      return element.querySelector(selector) as HTMLElement;
    } catch (error) {
      LoggerService.Error('Get element child failed', 'DomUtil', {
        data: { element, selector, error }
      });
      return null;
    }
  }

  static insertAfterElement(el: HTMLElement, referenceNode: HTMLElement): void {
    try {
      if (referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
      }
    } catch (error) {
      LoggerService.Error('Insert after element failed', 'DomUtil', {
        data: { element: el, referenceNode, error }
      });
    }
  }

  static clearClassList(element: HTMLElement): void {
    try {
      if (!element || !element.classList) {
        return;
      }
      const classes = element.classList.value.split(' ');
      classes.forEach((name) => name && element.classList.remove(name));
    } catch (error) {
      LoggerService.Error('Clear class list failed', 'DomUtil', {
        data: { element, error }
      });
    }
  }

  static removeDataAttributes(element: HTMLElement): void {
    try {
      if (!element) {
        return;
      }
      const dataAttrs = element.getAttributeNames().filter((name) => name.startsWith('data-'));
      dataAttrs.forEach((attr) => element.removeAttribute(attr));
    } catch (error) {
      LoggerService.Error('Remove data attributes failed', 'DomUtil', {
        data: { element, error }
      });
    }
  }

  static isElementHasClasses(element: HTMLElement, classesStr: string): boolean {
    try {
      const classes = classesStr.split(' ');
      return classes.every(className => element.classList.contains(className));
    } catch (error) {
      LoggerService.Error('Is element has classes failed', 'DomUtil', {
        data: { element, classesStr, error }
      });
      return false;
    }
  }

  static nextFormSiblingFocus(event: Event): void {
    try {
      const target = event.target as HTMLElement;
      const form = target.closest('form');
      if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        const currentIndex = Array.from(inputs).indexOf(target);
        const nextInput = inputs[currentIndex + 1] as HTMLElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } catch (error) {
      LoggerService.Error('Next form sibling focus failed', 'ComponentName', {
        data: { event, error },
      });
    }
  }

  static nextSiblingFocus(event: Event): void {
    try {
      const target = event.target as HTMLElement;
      const nextSibling = target.nextElementSibling as HTMLElement;
      if (nextSibling) {
        nextSibling.focus();
      }
    } catch (error) {
      LoggerService.Error('Next sibling focus failed', 'ComponentName', {
        data: { event, error }
      });
    }
  }

  static colorLighten(color: string, amount: number): string {
    try {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const newR = Math.min(255, r + amount);
      const newG = Math.min(255, g + amount);
      const newB = Math.min(255, b + amount);
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch (error) {
      LoggerService.Error('Color lighten failed', 'DomUtil', {
        data: { color, amount },
        error
      });
      return color;
    }
  }

  static colorDarken(color: string, amount: number): string {
    try {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const newR = Math.max(0, r - amount);
      const newG = Math.max(0, g - amount);
      const newB = Math.max(0, b - amount);
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch (error) {
      LoggerService.Error('Color darken failed', 'DomUtil', {
        data: { color, amount },
        error
      });
      return color;
    }
  }

  static getUniqueIdWithPrefix(prefix: string = 'id'): string {
    return CoreUtil.getUniqueIdWithPrefix(prefix);
  }

  static parseNumber(value: string | number): number {
    return CoreUtil.parseNumber(value);
  }

  static getBreakpointValue<T extends ResponsiveBreakpointPrimitive>(
    value: ResponsiveBreakpointValue<T>, 
    breakpoint?: string
  ): T | '' {
    return ResponsiveUtil.getBreakpointValue(value, breakpoint);
  }

  static trigger(element: HTMLElement, name: string, target?: unknown, e?: Event): boolean {
    return EventUtil.trigger(element, name, target, e);
  }

  static on(element: HTMLElement, name: string, callback: Function): string {
    return EventUtil.addEventListener(element, name, callback);
  }

  static off(element: HTMLElement, name: string, handlerId: string): void {
    EventUtil.removeEventListener(element, name, handlerId);
  }

  static addEventDelegate(
    element: HTMLElement, 
    selector: string, 
    eventName: string, 
    callback: (event: Event, target: HTMLElement) => void
  ): string {
    return EventUtil.addEventDelegate(element, selector, eventName, callback);
  }

  static removeEventDelegate(element: HTMLElement, eventName: string, eventId: string): void {
    EventUtil.removeEventDelegate(element, eventName, eventId);
  }

  static async slideUp(element: HTMLElement, duration: number = 500): Promise<void> {
    const { AnimationUtil } = await import('./animation.util');
    return AnimationUtil.slideUp(element, duration);
  }

  static async slideDown(element: HTMLElement, duration: number = 500): Promise<void> {
    const { AnimationUtil } = await import('./animation.util');
    return AnimationUtil.slideDown(element, duration);
  }
}
