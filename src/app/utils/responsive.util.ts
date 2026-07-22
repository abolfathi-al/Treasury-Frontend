import { computed, DestroyRef, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, startWith } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { CoreUtil } from './core.util';

const BOOTSTRAP_PREFIX = '--bs-';
const DEFAULT_BREAKPOINT = 'xs';
const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type ResponsiveBreakpointPrimitive = string | number | boolean;

export type ResponsiveBreakpointMap<
  T extends ResponsiveBreakpointPrimitive = string | number,
> = { default?: T; [key: string]: T | undefined };

export type ResponsiveBreakpointValue<
  T extends ResponsiveBreakpointPrimitive = string | number,
> = T | ResponsiveBreakpointMap<T>;

export class ResponsiveUtil {
  static getBreakpoint(breakpoint: string): number | string {
    try {
      let value: number | string = this.getCSSVariableValue(`${BOOTSTRAP_PREFIX}${breakpoint}`);
      if (value) {
        value = parseInt(value.trim());
      }
      return value;
    } catch (error) {
      LoggerService.Error('Failed to get breakpoint', 'ResponsiveUtil', {
        data: { breakpoint, error }
      });
      return 0;
    }
  }

  static getCSSVariableValue(variableName: string): string {
    try {
      if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
        return '';
      }
      let hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) {
        hex = hex.trim();
      }
      return hex;
    } catch (error) {
      LoggerService.Error('Failed to get CSS variable value', 'ResponsiveUtil', {
        data: { variableName, error }
      });
      return '';
    }
  }

  static getViewPort(): { width: number; height: number } {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return { width: 0, height: 0 };
      }
      return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      };
    } catch (error) {
      LoggerService.Error('Failed to get viewport', 'ResponsiveUtil', {
        data: { error }
      });
      return { width: 0, height: 0 };
    }
  }

  static getBreakpointValue<T extends ResponsiveBreakpointPrimitive>(
    value: ResponsiveBreakpointValue<T>,
    breakpoint?: string
  ): T | '' {
    try {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'object' && value !== null) {
        const width = this.getViewPort().width;
        let resultKey: string | undefined;
        let resultBreakpoint = -1;
        let breakpointValue;

        for (let key in value) {
          if (key === 'default') {
            breakpointValue = 0;
          } else {
            breakpointValue = this.getBreakpoint(key) ? +this.getBreakpoint(key) : parseInt(key);
          }

          if (breakpointValue <= width && breakpointValue > resultBreakpoint) {
            resultKey = key;
            resultBreakpoint = breakpointValue;
          }
        }

        return resultKey ? value[resultKey] ?? '' : value.default ?? '';
      }

      return '';
    } catch (error) {
      LoggerService.Error('Failed to get breakpoint value', 'ResponsiveUtil', {
        data: { value, breakpoint, error }
      });
      return '';
    }
  }

  static getAttributeValueByBreakpoint(incomingAttr: string): unknown {
    try {
      let value = CoreUtil.toJSON(incomingAttr);
      if (typeof value !== 'object' || value === null) {
        return incomingAttr;
      }

      const breakpointMap = value as Record<string, unknown>;
      const width = this.getViewPort().width;
      let resultKey: string | undefined;
      let resultBreakpoint = -1;
      let breakpoint: number;

      for (let key in breakpointMap) {
        if (key === 'default') {
          breakpoint = 0;
        } else {
          breakpoint = this.getBreakpoint(key) ? +this.getBreakpoint(key) : parseInt(key);
        }

        if (breakpoint <= width && breakpoint > resultBreakpoint) {
          resultKey = key;
          resultBreakpoint = breakpoint;
        }
      }

      return resultKey ? CoreUtil.getNestedProperty(breakpointMap, resultKey) : breakpointMap;
    } catch (error) {
      LoggerService.Error('Failed to get attribute value by breakpoint', 'ResponsiveUtil', {
        data: { incomingAttr, error }
      });
      return incomingAttr;
    }
  }

  static matchesBreakpoint(breakpoint: string): boolean {
    try {
      const width = this.getViewPort().width;
      const breakpointValue = this.getBreakpoint(breakpoint);
      return width >= parseInt(breakpointValue.toString());
    } catch (error) {
      LoggerService.Error('Failed to check breakpoint match', 'ResponsiveUtil', {
        data: { breakpoint, error }
      });
      return false;
    }
  }

  static getCurrentBreakpoint(): string {
    try {
      const width = this.getViewPort().width;

      for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
        const breakpoint = BREAKPOINTS[i];
        const breakpointValue = this.getBreakpoint(breakpoint);
        if (width >= parseInt(breakpointValue.toString())) {
          return breakpoint;
        }
      }

      return DEFAULT_BREAKPOINT;
    } catch (error) {
      LoggerService.Error('Failed to get current breakpoint', 'ResponsiveUtil', {
        data: { error }
      });
      return DEFAULT_BREAKPOINT;
    }
  }

  static isMobileViewport(): boolean {
    try {
      const width = this.getViewPort().width;
      const smBreakpoint = this.getBreakpoint('sm');
      return width < parseInt(smBreakpoint.toString());
    } catch (error) {
      LoggerService.Error('Failed to check mobile viewport', 'ResponsiveUtil', {
        data: { error }
      });
      return false;
    }
  }

  static isTabletViewport(): boolean {
    try {
      const width = this.getViewPort().width;
      const smBreakpoint = this.getBreakpoint('sm');
      const lgBreakpoint = this.getBreakpoint('lg');
      return width >= parseInt(smBreakpoint.toString()) && width < parseInt(lgBreakpoint.toString());
    } catch (error) {
      LoggerService.Error('Failed to check tablet viewport', 'ResponsiveUtil', {
        data: { error }
      });
      return false;
    }
  }

  static isDesktopViewport(): boolean {
    try {
      const width = this.getViewPort().width;
      const lgBreakpoint = this.getBreakpoint('lg');
      return width >= parseInt(lgBreakpoint.toString());
    } catch (error) {
      LoggerService.Error('Failed to check desktop viewport', 'ResponsiveUtil', {
        data: { error }
      });
      return false;
    }
  }

  static getResponsiveItemCount<T extends { items?: number }>(
    responsive: () => { [key: number]: T },
    destroyRef: DestroyRef,
    defaultCount = 1
  ): Signal<number> {
    const viewportTrigger = signal(0);

    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(startWith(null), takeUntilDestroyed(destroyRef))
        .subscribe(() => viewportTrigger.update(v => v + 1));
    }

    return computed(() => {
      viewportTrigger();
      try {
        const width = this.getViewPort().width;
        const config = responsive();
        const breakpoints = Object.keys(config)
          .map(Number)
          .sort((a, b) => b - a);
        for (const bp of breakpoints) {
          if (width >= bp) {
            return config[bp].items ?? defaultCount;
          }
        }
        return defaultCount;
      } catch (error) {
        LoggerService.Error('Failed to get responsive item count', 'ResponsiveUtil', {
          data: { error }
        });
        return defaultCount;
      }
    });
  }
}
