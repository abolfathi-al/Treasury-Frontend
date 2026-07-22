import {
  Directive,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { CoreUtil } from '@utils/core.util';
import { DomUtil } from '@utils/dom.util';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  mergeOptionsIfChanged,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface StickyOptions {
  activate?: boolean;
  animation?: boolean;
  name?: string;
  offset?: string | { [breakpoint: string]: string };
  reverse?: boolean;
  width?: string | { [breakpoint: string]: string } | { target: string };
  left?: string | { [breakpoint: string]: string };
  top?: string | { [breakpoint: string]: string };
  zindex?: number;
  updateOnRouteChange?: boolean;
}

type StickyResponsiveValue =
  | StickyOptions['activate']
  | StickyOptions['offset']
  | StickyOptions['width']
  | StickyOptions['left']
  | StickyOptions['top'];

const DEFAULTS = {
  OFFSET: '0px',
  ZINDEX: 1000,
  WIDTH: 'auto',
  LEFT: 'auto',
  TOP: 'auto',
} as const;

const DEFAULT_OPTIONS: StickyOptions = {
  activate: true,
  animation: false,
  name: '',
  offset: DEFAULTS.OFFSET,
  reverse: false,
  width: DEFAULTS.WIDTH,
  left: DEFAULTS.LEFT,
  top: DEFAULTS.TOP,
  zindex: DEFAULTS.ZINDEX,
  updateOnRouteChange: false,
} as const;

@Directive({
  selector: '[vlVeloraSticky]',
  exportAs: 'vlVeloraSticky',
  standalone: true,
})
export class StickyDirective
  extends BaseDirective<StickyOptions, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  private readonly router = inject(Router);

  private instance: any = null;
  private attributeName = '';
  private attributeName2 = '';
  private eventTriggerState = true;
  private lastScrollTop = 0;
  private originalRect: DOMRect | null = null;
  private placeholder: HTMLElement | null = null;
  private cachedElementTop: number | null = null;
  private stickyPosition: { top: string; left: string; width: string } | null =
    null;
  private originalElementTop: number | null = null;
  private routerSubscription: Subscription | null = null;

  readonly isResponsive = computed(() =>
    this.resolveResponsive(this.optionsManager.snapshot().activate)
  );

  readonly stickyOptions = input<StickyOptions>();
  readonly stickyActivate = input<boolean>();
  readonly stickyAnimation = input<boolean>();
  readonly stickyName = input<string>();
  readonly stickyOffset = input<string | { [breakpoint: string]: string }>();
  readonly stickyReverse = input<boolean>();
  readonly stickyWidth = input<
    string | { [breakpoint: string]: string } | { target: string }
  >();
  readonly stickyLeft = input<string | { [breakpoint: string]: string }>();
  readonly stickyTop = input<string | { [breakpoint: string]: string }>();
  readonly stickyZindex = input<number>();
  readonly stickyUpdateOnRouteChange = input<boolean>();

  readonly stickyOn = output<PointerEvent>();
  readonly stickyOff = output<PointerEvent>();
  readonly stickyChange = output<void>();

  constructor() {
    super(inject(LoggerService), 'StickyDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.setupBindings();
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    if (!this.canInit()) return;
    this.executeSafely(() => this.initSticky(), 'Initialization failed');
  }

  update(): void {
    this.execMethod('update');
  }

  destroy(): void {
    this.cleanup();
  }

  enable(): void {
    this.execMethod('enable');
  }

  disable(): void {
    this.execMethod('disable');
  }

  toggle(): void {
    this.executeSafely(() => {
      const isEnabled = this.host.document.body.hasAttribute(this.attributeName);
      if (isEnabled) this.disable();
      else this.enable();
    }, 'Toggle failed');
  }

  static createInstances(selector: string = '[data-velora-sticky="true"]'): void {
    runSafely(
      () => {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          if (element instanceof HTMLElement) {
          }
        });
      },
      (error) =>
        LoggerService.Error('Create instances failed', 'StickyDirective', {
          error,
        })
    );
  }

  static getInstance(element: HTMLElement): any {
    return null;
  }

  private setupBindings(): void {
    effect(() => {
      const opts = this.stickyOptions();
      untracked(() => {
        if (opts !== undefined) this.mergeOpts(opts);
      });
    });

    const bindings = [
      { input: this.stickyActivate, key: 'activate' as const },
      { input: this.stickyAnimation, key: 'animation' as const },
      { input: this.stickyName, key: 'name' as const },
      { input: this.stickyOffset, key: 'offset' as const },
      { input: this.stickyReverse, key: 'reverse' as const },
      { input: this.stickyWidth, key: 'width' as const },
      { input: this.stickyLeft, key: 'left' as const },
      { input: this.stickyTop, key: 'top' as const },
      { input: this.stickyZindex, key: 'zindex' as const },
      { input: this.stickyUpdateOnRouteChange, key: 'updateOnRouteChange' as const },
    ];
    this.bindInputs(bindings);
  }

  private canInit(): boolean {
    return (
      runSafely(
        () =>
          Boolean(
            this.host.elementRef.nativeElement &&
              this.optionsManager.snapshot().activate
          ),
        (error) =>
          this.logger.error('Initialization check failed', 'StickyDirective', {
            error,
          })
      ) ?? false
    );
  }

  private initSticky(): void {
    if (this.isBaseInitialized()) return;
    this.setupBodyAttrNames();
    this.applyAttrs();
    this.createInstance();
    this.setupListeners();
    this.markBaseInitialized();
  }

  private applyAttrs(): void {
    this.executeSafely(() => {
      const element = this.host.elementRef.nativeElement;
      const options = this.optionsManager.snapshot();
      this.buildAttrMap(options).forEach(([attr, value]) =>
        this.applyAttr(element, attr, value)
      );
    }, 'Apply all sticky attributes failed');
  }

  private buildAttrMap(options: StickyOptions): Array<[string, any]> {
    return [
      ['data-velora-sticky', options.activate],
      ['data-velora-sticky-name', options.name],
      ['data-velora-sticky-offset', options.offset],
      ['data-velora-sticky-reverse', options.reverse],
      ['data-velora-sticky-width', options.width],
      ['data-velora-sticky-left', options.left],
      ['data-velora-sticky-top', options.top],
      ['data-velora-sticky-animation', options.animation],
      ['data-velora-sticky-zindex', options.zindex],
    ];
  }

  private createInstance(): void {
    this.executeSafely(() => {
      const element = this.host.elementRef.nativeElement;
      this.instance =
        this.getExisting(element) || this.createNew(element);
    }, 'Create sticky instance failed');
  }

  private setupListeners(): void {
    this.executeSafely(() => {
      this.setupScrollListener();
      this.setupRouteListener();
    }, 'Setup event listeners failed');
  }

  private setupScrollListener(): void {
    this.executeSafely(() => {
      if (!this.host.window) return;
      const handler = this.createThrottledHandler(() => this.handleScroll(), 16);
      this.addBaseDomListener('window', 'scroll', handler as EventListener);
    }, 'Setup scroll listener failed');
  }

  private setupRouteListener(): void {
    this.executeSafely(() => {
      const { name, updateOnRouteChange } = this.optionsManager.snapshot();
      if (!this.shouldSetupRoute(name, updateOnRouteChange) || this.routerSubscription) return;

      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
          this.update();
        }
      });
    }, 'Setup route change listener failed');
  }

  private setupBodyAttrNames(): void {
    this.executeSafely(() => {
      const name = this.optionsManager.snapshot().name || 'sticky';
      this.attributeName = `data-velora-sticky-${name}`;
      this.attributeName2 = `data-velora-${name}`;
    }, 'Setup body attribute names failed');
  }

  private getExisting(element: HTMLElement): any {
    return null;
  }

  private createNew(_element: HTMLElement): any {
    return {
      update: () => this.stickyChange.emit(),
      destroy: () => this.removeBodyAttrs(),
      enable: () => this.enableSticky(),
      disable: () => this.disableSticky(),
    };
  }

  private resetState(): void {
    this.instance = null;
    this.baseCleanup();
    this.eventTriggerState = true;
    this.lastScrollTop = 0;
  }

  private handleScroll(): void {
    this.executeSafely(() => {
      const options = this.optionsManager.snapshot();
      if (!this.isScrollEnabled(options)) return;

      const scrollData = this.prepareScrollData(options);
      if (!scrollData) return;

      const { offsetNum, scrollTop, isCurrentlySticky } = scrollData;
      if (isCurrentlySticky) {
        this.handleStickyState(scrollTop, offsetNum, options);
      } else {
        this.handleNormalState(scrollTop, offsetNum, options);
      }
    }, 'Handle scroll failed');
  }

  private isScrollEnabled(options: StickyOptions): boolean {
    return Boolean(options.activate);
  }

  private prepareScrollData(options: StickyOptions) {
    return (
      runSafely(
        () => {
          const offset = this.resolveResponsive(options.offset);
          if (offset === false) return null;

          return {
            offsetNum: this.parseOffset(offset),
            scrollTop: this.getScrollTop(),
            isCurrentlySticky: this.host.document.body.hasAttribute(this.attributeName),
          };
        },
        (error) =>
          this.logger.error('Prepare scroll data failed', 'StickyDirective', { error })
      ) ?? null
    );
  }

  private handleStickyState(scrollTop: number, offsetNum: number, options: StickyOptions): void {
    this.executeSafely(() => {
      const elementTop = this.originalElementTop || this.getElementTopCached();
      const shouldUnstick = !this.shouldStick(scrollTop, elementTop, offsetNum, options.reverse ?? false);

      if (shouldUnstick) this.deactivateSticky();
      else this.maintainPosition();
    }, 'Handle sticky state failed');
  }

  private handleNormalState(scrollTop: number, offsetNum: number, options: StickyOptions): void {
    this.executeSafely(() => {
      if (!this.originalElementTop) {
        this.originalElementTop = this.getElementTopCached();
      }

      if (this.shouldStick(scrollTop, this.originalElementTop, offsetNum, options.reverse ?? false)) {
        this.activateSticky();
      }
    }, 'Handle normal state failed');
  }

  private getElementTop(): number {
    const element = this.placeholder || this.host.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    return rect.top + this.host.window!.pageYOffset;
  }

  private getElementTopCached(): number {
    if (this.originalElementTop) return this.originalElementTop;

    const currentScrollTop = this.getScrollTop();
    if (!this.cachedElementTop || this.lastScrollTop !== currentScrollTop) {
      this.cachedElementTop = this.getElementTop();
      this.lastScrollTop = currentScrollTop;
    }
    return this.cachedElementTop ?? 0;
  }

  private shouldStick(scrollTop: number, elementTop: number, offsetNum: number, reverse: boolean): boolean {
    const threshold = elementTop - offsetNum;
    return reverse
      ? scrollTop > threshold && this.lastScrollTop < scrollTop
      : scrollTop > threshold;
  }

  private activateSticky(): void {
    this.executeSafely(() => {
      if (!this.host.document.body.hasAttribute(this.attributeName)) {
        this.enableSticky();
        this.setBodyAttrs();
      }
      this.handleEventState('on');
      this.lastScrollTop = this.getScrollTop();
    }, 'Activate sticky failed');
  }

  private deactivateSticky(): void {
    this.executeSafely(() => {
      if (this.host.document.body.hasAttribute(this.attributeName)) {
        this.disableSticky();
        this.removeBodyAttrs();
      }
      this.handleEventState('off');
      this.lastScrollTop = this.getScrollTop();
    }, 'Deactivate sticky failed');
  }

  private handleEventState(type: 'on' | 'off'): void {
    const shouldEmit = type === 'on' ? this.eventTriggerState : !this.eventTriggerState;
    if (!shouldEmit) return;

    this.emitEvents(type);
    this.eventTriggerState = type === 'off';
  }

  private emitEvents(type: 'on' | 'off'): void {
    const event = new PointerEvent(`sticky-${type}`);
    if (type === 'on') this.stickyOn.emit(event);
    else this.stickyOff.emit(event);
    this.stickyChange.emit();
  }

  private getScrollTop(): number {
    return (
      this.host.window!.pageYOffset ||
      this.host.document.documentElement.scrollTop ||
      this.host.document.body.scrollTop ||
      0
    );
  }

  private parseOffset(offset: any): number {
    return typeof offset === 'string'
      ? CoreUtil.parseNumber(offset.replace('px', ''))
      : 0;
  }

  private enableSticky(): void {
    this.executeSafely(() => {
      const element = this.host.elementRef.nativeElement;
      const options = this.optionsManager.snapshot();

      this.prepareElement(element);
      this.applyStickyStyles(element, options);
      this.finalizeSetup(element, options);
    }, 'Enable sticky failed');
  }

  private prepareElement(element: HTMLElement): void {
    const currentRect = element.getBoundingClientRect();
    this.originalRect = currentRect;

    if (!this.originalElementTop) {
      this.originalElementTop = this.getElementTop();
    }

    this.createPlaceholder(currentRect);
  }

  private applyStickyStyles(element: HTMLElement, options: StickyOptions): void {
    this.disableTransitions(element);
    this.applyCoreStyles(element, options);
    this.applyPos(element, options);
    this.applyDimensions(element, options);
    this.reenableTransitions(element);
  }

  private finalizeSetup(element: HTMLElement, options: StickyOptions): void {
    this.applyAnimation(element, options);
    this.storePosition(element);
  }

  private disableTransitions(element: HTMLElement): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.setStyle(element, 'transition', 'none');
  }

  private reenableTransitions(element: HTMLElement): void {
    if (!this.host.isBrowser) return;

    if (this.host.window && typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        this.host.renderer.removeStyle(element, 'transition');
      });
    }
  }

  private applyCoreStyles(element: HTMLElement, options: StickyOptions): void {
    if (!this.host.isBrowser || !this.originalRect) return;

    this.host.renderer.setStyle(element, 'position', 'fixed');
    this.host.renderer.setStyle(element, 'z-index', String(options.zindex ?? DEFAULTS.ZINDEX));
    this.host.renderer.setStyle(element, 'left', `${this.originalRect.left}px`);
    this.host.renderer.setStyle(element, 'width', `${this.originalRect.width}px`);
  }

  private storePosition(element: HTMLElement): void {
    if (!this.host.isBrowser) return;

    const computedStyle = this.host.window!.getComputedStyle(element);
    this.stickyPosition = {
      top: computedStyle.top || '0px',
      left: computedStyle.left || '0px',
      width: computedStyle.width || 'auto',
    };
  }

  private disableSticky(): void {
    this.executeSafely(() => {
      const element = this.host.elementRef.nativeElement;

      this.disableTransitions(element);
      this.clearStyles(element);
      this.removePlaceholder();
      this.reenableTransitions(element);
      this.resetStickyState();
    }, 'Disable sticky failed');
  }

  private clearStyles(element: HTMLElement): void {
    if (!this.host.isBrowser) return;

    ['top', 'width', 'left', 'right', 'z-index', 'position'].forEach((style) =>
      this.host.renderer.removeStyle(element, style)
    );
    ['animation', 'animation-slide-in-down'].forEach((className) =>
      this.host.renderer.removeClass(element, className)
    );
  }

  private resetStickyState(): void {
    this.originalRect = null;
    this.stickyPosition = null;
    this.originalElementTop = null;
    this.cachedElementTop = null;
  }

  private applyAnimation(element: HTMLElement, options: StickyOptions): void {
    if (!this.host.isBrowser || !options.animation) return;
    this.host.renderer.setStyle(element, 'animation-duration', '0.3s');
    this.host.renderer.addClass(element, 'animation');
    this.host.renderer.addClass(element, 'animation-slide-in-down');
  }

  private applyPos(element: HTMLElement, options: StickyOptions): void {
    if (!this.host.isBrowser) return;

    const top = this.resolveResponsive(options.top);
    const left = this.resolveResponsive(options.left);

    const topValue =
      top === 'auto' || top === null || top === undefined
        ? '0px'
        : this.formatVal(top);
    this.host.renderer.setStyle(element, 'top', topValue);

    if (left !== null && left !== undefined) {
      if (String(left).toLowerCase() === 'auto') {
        const rect = element.getBoundingClientRect();
        if (rect.left > 0) {
          this.host.renderer.setStyle(element, 'left', `${rect.left}px`);
        }
      } else {
        this.host.renderer.setStyle(element, 'left', this.formatVal(left));
      }
    }
  }

  private applyDimensions(element: HTMLElement, options: StickyOptions): void {
    if (!this.host.isBrowser) return;

    const width = this.resolveResponsive(options.width);
    if (width === null || width === undefined) return;

    if (width === 'auto' && this.originalRect) {
      this.host.renderer.setStyle(element, 'width', `${this.originalRect.width}px`);
    } else {
      const resolvedWidth = this.resolveTargetWidth(width);
      this.host.renderer.setStyle(element, 'width', this.formatVal(resolvedWidth));
    }
  }

  private resolveTargetWidth(width: unknown): unknown {
    if (typeof width === 'object' && width !== null) {
      const targetSelector = (width as { target?: string }).target;
      if (targetSelector) {
        const target = this.host.document.querySelector(targetSelector);
        if (target) {
          return this.host.window!.getComputedStyle(target).width;
        }
      }
    }
    return width;
  }

  private shouldSetupRoute(name: string | undefined, updateOnRouteChange: boolean | undefined): boolean {
    return Boolean(updateOnRouteChange || name === 'header');
  }

  private applyAttr(element: HTMLElement, attrName: string, value: unknown): void {
    if (!this.host.isBrowser) return;

    const attrValue = this.formatAttrVal(value);
    if (!attrValue) {
      this.host.renderer.removeAttribute(element, attrName);
    } else {
      this.host.renderer.setAttribute(element, attrName, attrValue);
    }
  }

  private formatAttrVal(value: unknown): string {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'object') return JSON.stringify(value) || '';
    return String(value);
  }

  private formatVal(value: unknown): string {
    return typeof value === 'string' ? value : String(value);
  }

  private setBodyAttrs(): void {
    if (!this.host.isBrowser || !this.attributeName || !this.attributeName2) return;
    this.host.renderer.setAttribute(this.host.document.body, this.attributeName, 'on');
    this.host.renderer.setAttribute(this.host.document.body, this.attributeName2, 'on');
  }

  private removeBodyAttrs(): void {
    if (!this.host.isBrowser || !this.attributeName || !this.attributeName2) return;
    this.host.renderer.removeAttribute(this.host.document.body, this.attributeName);
    this.host.renderer.removeAttribute(this.host.document.body, this.attributeName2);
  }

  private parseResponsive(value: Exclude<StickyResponsiveValue, boolean | null | undefined>): unknown {
    if (typeof value === 'string' && (value.includes('{') || value.includes('['))) {
      return runSafely(() => DomUtil.getBreakpointValue(value), () => value) ?? value;
    }
    if (typeof value === 'object' && value !== null) {
      return runSafely(() => DomUtil.getBreakpointValue(value), () => value) ?? value;
    }
    return value;
  }

  private mergeOpts(options: StickyOptions): void {
    this.executeSafely(() => {
      mergeOptionsIfChanged(this.optionsManager, options, () => this.refresh());
    }, 'Update options failed');
  }

  protected override updateOption<K extends keyof StickyOptions>(key: K, value: StickyOptions[K]): boolean {
    const changed = setOptionIfChanged(this.optionsManager, key, value, () => this.refresh());
    return changed;
  }

  private refresh(): void {
    this.executeSafely(() => {
      if (!this.isBaseInitialized()) return;

      this.cleanup();
      if (this.canInit()) {
        this.initSticky();
      }
    }, 'Refresh failed');
  }

  private execMethod(methodName: string): void {
    this.executeSafely(() => {
      const method = this.instance?.[methodName];
      if (typeof method === 'function') method();
    }, 'Execute instance method failed');
  }

  private createPlaceholder(rect: DOMRect): void {
    if (!this.host.isBrowser || this.placeholder) return;

    const element = this.host.elementRef.nativeElement;
    const placeholder = this.buildPlaceholder(element, rect);
    const parent = element.parentNode;
    if (parent) {
      this.host.renderer.insertBefore(parent, placeholder, element);
    }
    this.placeholder = placeholder;
  }

  private buildPlaceholder(element: HTMLElement, rect: DOMRect): HTMLElement {
    const placeholder = this.host.renderer.createElement('div');
    const computedStyle = this.host.window!.getComputedStyle(element);

    const styles: [string, string][] = [
      ['height', `${rect.height}px`],
      ['width', `${rect.width}px`],
      ['margin-top', computedStyle.marginTop || '0'],
      ['margin-right', computedStyle.marginRight || '0'],
      ['margin-bottom', computedStyle.marginBottom || '0'],
      ['margin-left', computedStyle.marginLeft || '0'],
      ['visibility', 'hidden'],
      ['pointer-events', 'none'],
      ['padding', '0'],
      ['border', 'none'],
    ];

    styles.forEach(([prop, value]) => this.host.renderer.setStyle(placeholder, prop, value));
    return placeholder;
  }

  private removePlaceholder(): void {
    if (!this.host.isBrowser || !this.placeholder) return;
    this.host.renderer.removeChild(this.placeholder.parentNode, this.placeholder);
    this.placeholder = null;
  }

  private maintainPosition(): void {
    if (!this.host.isBrowser || !this.stickyPosition) return;

    const element = this.host.elementRef.nativeElement;
    const computedStyle = this.host.window!.getComputedStyle(element);

    if (
      computedStyle.top !== this.stickyPosition.top ||
      computedStyle.left !== this.stickyPosition.left ||
      computedStyle.width !== this.stickyPosition.width
    ) {
      this.host.renderer.setStyle(element, 'top', this.stickyPosition.top);
      this.host.renderer.setStyle(element, 'left', this.stickyPosition.left);
      this.host.renderer.setStyle(element, 'width', this.stickyPosition.width);
    }
  }

  private resolveResponsive(value: StickyResponsiveValue): unknown {
    if (typeof value === 'boolean' || value === null || value === undefined) {
      return value;
    }
    return this.parseResponsive(value);
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.execMethod('destroy');
      this.removeBodyAttrs();
      this.resetState();
      this.removePlaceholder();

      this.originalRect = null;
      this.cachedElementTop = null;
      this.stickyPosition = null;
      this.clearBaseDomListeners();
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
        this.routerSubscription = null;
      }
      this.originalElementTop = null;

      this.status.setError(null);
    }, 'Cleanup failed');
  }

  private createThrottledHandler(callback: () => void, frameMs = 16): EventListener {
    let ticking = false;
    return () => {
      if (ticking) return;
      ticking = true;
      const finalize = () => {
        ticking = false;
        callback();
      };
      if (this.host.window && typeof this.host.window!.requestAnimationFrame === 'function') {
        this.host.window!.requestAnimationFrame(finalize);
      } else {
        setTimeout(finalize, frameMs);
      }
    };
  }
}
