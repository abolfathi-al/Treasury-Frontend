import {
  AfterViewInit,
  Directive,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { LOCAL_STORAGE, WINDOW } from '@core/tokens';
import { CoreUtil } from '@utils/core.util';
import { DomUtil } from '@utils/dom.util';
import { ResponsiveUtil } from '@utils/responsive.util';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely, setOptionIfChanged } from './shared/directive-helpers';

export interface ScrollOptions {
  height?: string | { [key: string]: string };
  minHeight?: string | { [key: string]: string };
  maxHeight?: string | { [key: string]: string };
  offset?: string | number | { [key: string]: string | number };
  autoHeight?: boolean;
  smooth?: boolean;
  wheelStep?: number;
  scrollShadows?: boolean;
  saveState?: boolean;
  storageKey?: string;
  reflowThrottleMs?: number;
  dependencies?: string | string[];
  wrappers?: string | string[];
}

type ScrollResponsiveValue =
  | ScrollOptions['height']
  | ScrollOptions['minHeight']
  | ScrollOptions['maxHeight']
  | ScrollOptions['offset'];

const SCROLL_CONSTANTS = {
  // defaults
  DEFAULTS: {
    HEIGHT: '',
    MIN_HEIGHT: '',
    MAX_HEIGHT: '',
    OFFSET: 0,
    AUTO_HEIGHT: true,
    WHEEL_STEP: 40,
    REFLOW_THROTTLE_MS: 150,
    STORAGE_KEY: 'velora_scroll_state',
  },
} as const;

const DEFAULT_SCROLL_OPTIONS: Required<ScrollOptions> = {
  height: SCROLL_CONSTANTS.DEFAULTS.HEIGHT,
  minHeight: SCROLL_CONSTANTS.DEFAULTS.MIN_HEIGHT,
  maxHeight: SCROLL_CONSTANTS.DEFAULTS.MAX_HEIGHT,
  offset: SCROLL_CONSTANTS.DEFAULTS.OFFSET,
  autoHeight: SCROLL_CONSTANTS.DEFAULTS.AUTO_HEIGHT,
  smooth: true,
  wheelStep: SCROLL_CONSTANTS.DEFAULTS.WHEEL_STEP,
  scrollShadows: false,
  saveState: false,
  storageKey: SCROLL_CONSTANTS.DEFAULTS.STORAGE_KEY,
  reflowThrottleMs: SCROLL_CONSTANTS.DEFAULTS.REFLOW_THROTTLE_MS,
  dependencies: '',
  wrappers: '',
} as const;

@Directive({
  selector: '[vlVeloraScroll]',
  exportAs: 'vlVeloraScroll',
  standalone: true,
})
export class ScrollDirective
  extends BaseDirective<ScrollOptions, string>
  implements OnInit, AfterViewInit
{
  private readonly host = useDirectiveHost();
  // ============================================================================
  // DEPENDENCY INJECTION
  // ============================================================================
  private readonly window = this.host.isBrowser ? inject(WINDOW) : null;
  private readonly router = inject(Router);
  private readonly localStorage = inject(LOCAL_STORAGE, { optional: true });

  // ============================================================================
  // PRIVATE PROPERTIES
  // ============================================================================

  private applyTimer: number | undefined;
  private resizeObserver: ResizeObserver | null = null;
  private routerSubscription: Subscription | null = null;

  // ============================================================================
  // SIGNALS & COMPUTED VALUES
  // ============================================================================

  private readonly _activate = signal<boolean | { [key: string]: boolean }>(
    true
  );
  readonly activate = computed(() => this._activate());
  readonly isResponsive = computed(() =>
    this.resolveResponsiveValue(this._activate())
  );

  constructor() {
    super(inject(LoggerService), 'ScrollDirective', {
      ...DEFAULT_SCROLL_OPTIONS,
    });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupInputBindings();
  }

  readonly scrollActivate = input<boolean | { [key: string]: boolean }>();
  readonly scrollHeight = input<string | { [key: string]: string }>();
  readonly scrollMinHeight = input<string | { [key: string]: string }>();
  readonly scrollMaxHeight = input<string | { [key: string]: string }>();
  readonly scrollOffset = input<
    string | number | { [key: string]: string | number }
  >();
  readonly scrollAutoHeight = input<boolean>();
  readonly scrollSmooth = input<boolean>();
  readonly scrollWheelStep = input<number>();
  readonly scrollShadows = input<boolean>();
  readonly scrollSaveState = input<boolean>();
  readonly scrollDependencies = input<string | string[]>();
  readonly scrollWrappers = input<string | string[]>();
  readonly scrollStorageKey = input<string>();
  readonly scrollReflowThrottleMs = input<number>();

  private setupInputBindings(): void {
    const bindings = [
      { input: this.scrollHeight, key: 'height' as const },
      { input: this.scrollMinHeight, key: 'minHeight' as const },
      { input: this.scrollMaxHeight, key: 'maxHeight' as const },
      { input: this.scrollOffset, key: 'offset' as const },
      { input: this.scrollAutoHeight, key: 'autoHeight' as const },
      { input: this.scrollSmooth, key: 'smooth' as const },
      { input: this.scrollWheelStep, key: 'wheelStep' as const },
      { input: this.scrollShadows, key: 'scrollShadows' as const },
      { input: this.scrollSaveState, key: 'saveState' as const },
      { input: this.scrollDependencies, key: 'dependencies' as const },
      { input: this.scrollWrappers, key: 'wrappers' as const },
      { input: this.scrollStorageKey, key: 'storageKey' as const },
      { input: this.scrollReflowThrottleMs, key: 'reflowThrottleMs' as const },
    ];
    this.bindInputs(bindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) {
      return;
    }

    if (!this.shouldInitialize()) {
      return;
    }

    this.executeSafely(() => {
      this.initializeScroll();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  private shouldInitialize(): boolean {
    return !!this.host.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (!this.host.isBrowser || !this.isBaseInitialized()) return;

    this.executeSafely(() => {
      this.setupScrollStateManagement();
      this.restoreScrollState();
    }, 'AfterViewInit scroll state setup failed');
  }

  private initializeScroll(): void {
    this.scheduleApply();
    this.setupWheelStepHandling();
    this.setupScrollShadows();
    this.setupResizeListener();
    this.observeLayoutChanges();
  }

  private scheduleApply(): void {
    if (!this.host.isBrowser || !this.host.window) {
      return;
    }

    if (this.applyTimer) {
      clearTimeout(this.applyTimer);
    }
    const hostWindow = this.host.window ?? window;
    this.applyTimer = hostWindow.setTimeout(() => {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => this.applyStyles())
        );
      } else {
        setTimeout(() => this.applyStyles(), 0);
      }
    }, 0);
  }

  private applyStyles(): void {
    if (!this.isActivated()) return;

    const host = this.host.elementRef.nativeElement;
    const options = this.options();
    this.applyHeightStyles(host, options);
    this.applyOffsetStyles(host, options);
    this.applySmoothScrolling(host, options);
  }

  private isActivated(): boolean {
    return (
      runSafely(
        () => {
          const activate = this._activate();
          if (typeof activate === 'boolean') {
            return activate;
          }

          const responsiveValue = DomUtil.getBreakpointValue(activate);
          return String(responsiveValue) === 'true';
        },
        (error) =>
          this.logger.error('Activation check failed', 'ScrollDirective', {
            error,
          })
      ) ?? false
    );
  }

  private applyHeightStyles(host: HTMLElement, options: ScrollOptions): void {
    if (!this.host.isBrowser) return;

    const height = this.getResponsiveValue(options.height);
    const minHeight = this.getResponsiveValue(options.minHeight);
    const maxHeight = this.getResponsiveValue(options.maxHeight);

    if (this.isExplicitSize(height))
      this.host.renderer.setStyle(host, 'height', String(height));
    if (this.isExplicitSize(minHeight))
      this.host.renderer.setStyle(host, 'min-height', String(minHeight));
    if (this.isExplicitSize(maxHeight))
      this.host.renderer.setStyle(host, 'max-height', String(maxHeight));

    const noConstraints =
      !this.isExplicitSize(height) &&
      !this.isExplicitSize(minHeight) &&
      !this.isExplicitSize(maxHeight);
    if (options.autoHeight && noConstraints) {
      const computed = this.computeAutoMaxHeightPx(host, options);
      if (computed > 0)
        this.host.renderer.setStyle(host, 'max-height', `${computed}px`);
    }

    this.host.renderer.setStyle(host, 'overflow-y', 'auto');
  }

  private isExplicitSize(value: unknown): boolean {
    if (value == null) return false;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      return v !== '' && !['auto', 'initial', 'inherit'].includes(v);
    }
    return typeof value === 'number' && isFinite(value);
  }

  private applyOffsetStyles(host: HTMLElement, options: ScrollOptions): void {
    if (!this.host.isBrowser) return;

    const offset = this.getResponsiveValue(options.offset);
    if (offset != null) {
      this.host.renderer.setStyle(
        host,
        'margin-top',
        typeof offset === 'number' ? `${offset}px` : String(offset)
      );
    }
  }

  private computeAutoMaxHeightPx(
    host: HTMLElement,
    options: ScrollOptions
  ): number {
    return (
      runSafely(
        () => {
          const hostRect = host.getBoundingClientRect();
          const offsetPx = this.parsePx(
            this.getResponsiveValue(options.offset)
          );
          const normalizeSelectors = (input?: string | string[]) =>
            Array.isArray(input) ? input : input ? [input] : [];

          const hostWindow = this.host.window ?? window;
          let boundary =
            hostWindow.innerHeight ||
            this.host.document.documentElement.clientHeight;

          // Process wrappers
          normalizeSelectors(options.wrappers).forEach((selector) => {
            runSafely(
              () => {
                const wrapper = host.ownerDocument.querySelector(
                  selector
                ) as HTMLElement | null;
                if (wrapper?.contains(host)) {
                  boundary = Math.min(
                    boundary,
                    Math.floor(wrapper.getBoundingClientRect().bottom)
                  );
                }
              },
              () => {}
            );
          });

          let available = Math.max(
            0,
            boundary - Math.floor(hostRect.top) - offsetPx
          );

          // Process dependencies
          normalizeSelectors(options.dependencies).forEach((selector) => {
            runSafely(
              () => {
                const dep = host.ownerDocument.querySelector(
                  selector
                ) as HTMLElement | null;
                if (!dep) return;

                const dRect = dep.getBoundingClientRect();
                if (dRect.top >= hostRect.top - 1) {
                  const depHeight = DomUtil.getElementActualHeight(dep);
                  available = Math.max(0, available - depHeight);
                }
              },
              () => {}
            );
          });

          return Math.floor(Math.max(0, available));
        },
        () => {}
      ) ?? 0
    );
  }

  private parsePx(value: unknown): number {
    if (value == null) return 0;
    if (typeof value === 'number' && isFinite(value)) return value;
    if (typeof value === 'string') {
      const match = value.trim().match(/^-?\d+(?:\.\d+)?/);
      return match ? Number(match[0]) : 0;
    }
    return 0;
  }

  private applySmoothScrolling(
    host: HTMLElement,
    options: ScrollOptions
  ): void {
    if (!this.host.isBrowser) return;

    this.host.renderer.setStyle(
      host,
      'scroll-behavior',
      options.smooth ? 'smooth' : 'auto'
    );
  }

  private getResponsiveValue(value: ScrollResponsiveValue): unknown {
    return (
      runSafely(
        () => {
          if (typeof value === 'object' && value !== null) {
            return DomUtil.getBreakpointValue(value);
          }
          return value;
        },
        (error) =>
          this.logger.error(
            'Responsive value resolution failed',
            'ScrollDirective',
            { error }
          )
      ) ?? value
    );
  }

  private setupWheelStepHandling(): void {
    const options = this.options();
    if (
      options.smooth ||
      typeof options.wheelStep !== 'number' ||
      !Number.isFinite(options.wheelStep)
    ) {
      return;
    }

    const handler = (event: Event) =>
      this.handleWheelEvent(event as WheelEvent);
    this.addDomListener(this.host.elementRef.nativeElement, 'wheel', handler, {
      passive: false,
    });
  }

  private handleWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey || event.shiftKey || event.metaKey) return;

    event.preventDefault();
    const options = this.optionsManager.snapshot();
    this.host.elementRef.nativeElement.scrollTop +=
      Math.sign(event.deltaY) * (options.wheelStep || 0);
  }

  private setupScrollShadows(): void {
    const options = this.options();
    if (!options.scrollShadows) return;

    const host = this.host.elementRef.nativeElement;
    this.addDomListener(
      host,
      'scroll',
      this.createDebouncedHandler(() => this.updateShadows(), 16),
      { passive: true }
    );
    this.updateShadows();
  }

  private updateShadows(): void {
    const host = this.host.elementRef.nativeElement;
    const { scrollTop, scrollHeight, clientHeight } = host;
    this.toggleElementClass(host, 'scroll-shadow-top', scrollTop > 0);
    this.toggleElementClass(
      host,
      'scroll-shadow-bottom',
      scrollTop + clientHeight < scrollHeight
    );
  }

  private setupResizeListener(): void {
    if (!this.host.window) return; // SSR: window not available
    this.addDomListener(this.host.window, 'resize', () => this.scheduleApply());
  }

  private observeLayoutChanges(): void {
    const options = this.options();
    if (options.dependencies || options.wrappers) {
      this.setupResizeObserver();
    }
    if (this.host.window) {
      this.addDomListener(this.host.window, 'load', () => this.scheduleApply());
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => this.scheduleApply());
    const host = this.host.elementRef.nativeElement;
    this.resizeObserver.observe(host);

    const options = this.options();
    const selectors = [
      ...(Array.isArray(options.dependencies)
        ? options.dependencies
        : options.dependencies
        ? [options.dependencies]
        : []),
      ...(Array.isArray(options.wrappers)
        ? options.wrappers
        : options.wrappers
        ? [options.wrappers]
        : []),
    ];

    selectors.forEach((selector) => {
      runSafely(
        () => {
          const nodes = host.ownerDocument.querySelectorAll(
            selector
          ) as NodeListOf<HTMLElement>;
          nodes.forEach((element) => this.resizeObserver?.observe(element));
        },
        () => {}
      );
    });
  }

  private toggleElementClass(
    element: HTMLElement,
    className: string,
    add: boolean
  ): void {
    if (!this.host.isBrowser) return;

    if (add) {
      this.host.renderer.addClass(element, className);
    } else {
      this.host.renderer.removeClass(element, className);
    }
  }

  private updateActivate(activate: boolean | { [key: string]: boolean }): void {
    this._activate.set(activate);
    this.scheduleApply();
  }

  protected override updateOption<K extends keyof ScrollOptions>(
    key: K,
    value: ScrollOptions[K]
  ): boolean {
    return setOptionIfChanged(this.optionsManager, key, value, () =>
      this.scheduleApply()
    );
  }

  // ============================================================================
  // STANDARDIZED UTILITY METHODS
  // ============================================================================

  private resolveResponsiveValue(value: boolean | { [key: string]: boolean } | undefined): boolean {
    return (
      runSafely(
        () => {
          if (typeof value === 'boolean') {
            return value;
          }
          if (typeof value === 'object' && value !== null) {
            return CoreUtil.coerceBooleanProperty(
              ResponsiveUtil.getBreakpointValue(value)
            );
          }
          return true;
        },
        (error) =>
          this.logger.error(
            'Responsive value resolution failed',
            'ScrollDirective',
            { error }
          )
      ) ?? true
    );
  }

  private setupScrollStateManagement(): void {
    const options = this.options();
    if (!options.saveState || !this.localStorage) {
      return;
    }

    const host = this.host.elementRef.nativeElement;
    const isWindowScroll = this.isWindowScrollTarget();
    const scrollTarget = isWindowScroll ? this.host.window ?? window : host;

    // Listen to scroll events (element or window)
    this.addDomListener(
      scrollTarget,
      'scroll',
      this.createDebouncedHandler(() => this.saveScrollState(), 150),
      { passive: true }
    );

    // Fallback: also listen to window if element scrolling
    if (!isWindowScroll) {
      this.addDomListener(
        this.host.window ?? window,
        'scroll',
        this.createDebouncedHandler(() => this.saveScrollState(), 150),
        { passive: true }
      );
    }

    // Router navigation handlers
    if (!this.routerSubscription) {
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.saveScrollState();
        } else if (event instanceof NavigationEnd) {
          setTimeout(() => this.restoreScrollState(), 150);
        }
      });
    }
  }

  private isWindowScrollTarget(): boolean {
    const host = this.host.elementRef.nativeElement;
    if (host === this.host.document.body || host === this.host.document.documentElement) {
      return true;
    } else if (
      host === this.host.document.body ||
      host === this.host.document.documentElement
    ) {
      return true;
    }

    const hostWindow = this.host.window ?? window;
    const style = hostWindow.getComputedStyle(host);
    const hasOverflow = ['auto', 'scroll'].includes(
      style.overflowY || style.overflow
    );
    return hasOverflow ? host.scrollHeight <= host.clientHeight : true;
  }

  private getScrollPosition(): number {
    if (this.isWindowScrollTarget()) {
      const hostWindow = this.host.window ?? window;
      return (
        hostWindow.scrollY ||
        hostWindow.pageYOffset ||
        this.host.document.documentElement.scrollTop ||
        0
      );
    }

    const elementTop = this.host.elementRef.nativeElement.scrollTop;
    const hostWindow = this.host.window ?? window;
    const windowY = hostWindow.scrollY || hostWindow.pageYOffset || 0;
    return windowY > 0 ? windowY : elementTop;
  }

  private setScrollPosition(position: number): void {
    if (this.isWindowScrollTarget()) {
      const hostWindow = this.host.window ?? window;
      hostWindow.scrollTo({ top: position, behavior: 'auto' });
      return;
    }

    const element = this.host.elementRef.nativeElement;
    const prevTop = element.scrollTop;
    element.scrollTop = position;

    // Fallback to window if element didn't scroll
    if (element.scrollTop === prevTop && position > 0) {
      const hostWindow = this.host.window ?? window;
      hostWindow.scrollTo({ top: position, behavior: 'auto' });
    }
  }

  private saveScrollState(): void {
    const options = this.options();
    if (!options.saveState || !this.localStorage) return;

    runSafely(
      () => {
        const storageKey = this.getStorageKey();
        const data = this.localStorage!.getItem(storageKey);
        const positions = data ? JSON.parse(data) : {};
        const scrollPos = this.getScrollPosition();
        positions[this.router.url] = scrollPos;
        this.localStorage!.setItem(storageKey, JSON.stringify(positions));
      },
      () => {
        // Ignore storage errors (quota exceeded, private browsing, etc.)
      }
    );
  }

  private restoreScrollState(): void {
    const options = this.optionsManager.snapshot();
    if (!options.saveState || !this.localStorage) return;

    runSafely(
      () => {
        const storageKey = this.getStorageKey();
        const data = this.localStorage!.getItem(storageKey);
        if (!data) return;

        const scrollTop = JSON.parse(data)[this.router.url];
        if (typeof scrollTop === 'number' && scrollTop >= 0) {
          setTimeout(() => {
            if (typeof requestAnimationFrame !== 'undefined') {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => this.setScrollPosition(scrollTop));
              });
            } else {
              // SSR: use setTimeout fallback
              setTimeout(() => this.setScrollPosition(scrollTop), 0);
            }
          }, 100);
        }
      },
      () => {
        // Ignore storage errors (quota exceeded, private browsing, etc.)
      }
    );
  }

  private getStorageKey(): string {
    const options = this.options();
    return options.storageKey || SCROLL_CONSTANTS.DEFAULTS.STORAGE_KEY;
  }

  private cleanup(): void {
    if (this.applyTimer) {
      clearTimeout(this.applyTimer);
      this.applyTimer = undefined;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.clearBaseDomListeners();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
    this.baseCleanup();
  }

  private addDomListener(
    target: HTMLElement | Document | Window | null,
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    if (!this.host.isBrowser || !target) return;

    if (target === this.host.window) {
      this.addBaseDomListener('window', eventName, handler, options);
    } else if (target === this.host.document) {
      this.addBaseDomListener('document', eventName, handler, options);
    } else {
      this.addBaseDomListener(
        target as HTMLElement,
        eventName,
        handler,
        options
      );
    }
  }

  private createDebouncedHandler(
    callback: () => void,
    delay: number
  ): EventListener {
    let timeoutId: number | null = null;
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = (this.host.window ?? window).setTimeout(() => {
        timeoutId = null;
        callback();
      }, delay);
    };
  }
}
