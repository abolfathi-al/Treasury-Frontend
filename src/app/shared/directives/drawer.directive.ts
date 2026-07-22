import {
  Directive,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';
import { WINDOW } from '@core/tokens';
import { CoreUtil } from '@utils/core.util';
import { DataUtil } from '@utils/data.util';
import { DomUtil } from '@utils/dom.util';
import { EventUtil } from '@utils/event.util';
import { ResponsiveUtil } from '@utils/responsive.util';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely } from './shared/directive-helpers';

export interface DrawerOptions {
  overlay: boolean;
  baseClass: string;
  overlayClass: string;
  direction: 'start' | 'end';
  width: string;
  name: string;
  activate: boolean | { [key: string]: boolean };
  toggle: string;
  close: string;
  escape: boolean;
  permanent: boolean;
}

export interface DrawerStateChangeEvent {
  isShown: boolean;
  previousIsShown: boolean;
  source: 'manual' | 'toggle' | 'overlay' | 'close';
}

const DEFAULT_OPTIONS: DrawerOptions = {
  overlay: true,
  baseClass: 'drawer',
  overlayClass: 'drawer-overlay',
  direction: 'end',
  width: '300px',
  name: '',
  activate: true,
  toggle: '',
  close: '',
  escape: true,
  permanent: false,
};

class DrawerStore {
  private static store: Map<string, DrawerDirective> = new Map();

  static set(instanceId: string, drawerDirectiveObj: DrawerDirective): void {
    if (DrawerStore.store.has(instanceId)) return;
    DrawerStore.store.set(instanceId, drawerDirectiveObj);
  }

  static get(instanceId: string): DrawerDirective | undefined {
    return DrawerStore.store.get(instanceId);
  }

  static remove(instanceId: string): void {
    DrawerStore.store.delete(instanceId);
  }

  static has(instanceId: string): boolean {
    return DrawerStore.store.has(instanceId);
  }

  static getAllInstances(): Map<string, DrawerDirective> {
    return DrawerStore.store;
  }
}

@Directive({
  selector: '[vlVeloraDrawer]',
  exportAs: 'vlVeloraDrawer',
  standalone: true,
})
export class DrawerDirective extends BaseDirective<DrawerOptions, string> implements OnInit {
  private readonly host = useDirectiveHost();
  private readonly router = inject(Router);
  private readonly window = this.host.isBrowser ? inject(WINDOW) : null;

  private overlayElement: HTMLElement | null = null;
  private toggleElement: HTMLElement | null = null;
  private toggleEventId: string | null = null;
  private closeEventId: string | null = null;
  private showEventId: string | null = null;
  private animationTimeout: number | null = null;
  private animationRestoreTimeout: number | null = null;
  private readonly settledEventTimeouts = new Set<number>();
  private _rawWidthConfig: string | { [key: string]: string } = DEFAULT_OPTIONS.width;
  private _isActive: boolean = true;

  private readonly _isShown = signal<boolean>(false);
  private readonly _previousIsShown = signal<boolean>(false);
  private routerSubscription: Subscription | null = null;
  private resizeTimeoutId: number | null = null;

  readonly isShown = computed(() => this._isShown());
  readonly isOverlayVisible = computed(() => this._isShown() && this.optionsManager.snapshot().overlay);
  readonly isResponsive = computed(() => this.resolveResponsiveValue(this.optionsManager.snapshot().activate));
  readonly drawerClasses = computed(() => {
    return (
      runSafely(
        () => {
          const opts = this.optionsManager.snapshot();
          return `${opts.baseClass} ${opts.baseClass}-${opts.direction}`;
        },
        () => {}
      ) ?? `drawer drawer-end`
    );
  });

  readonly drawerShownInput = input<boolean>(false, { alias: 'drawerShown' });
  readonly drawerOverlay = input<boolean>();
  readonly drawerDirection = input<'start' | 'end'>();
  readonly drawerWidth = input<string | { [key: string]: string }>();
  readonly drawerName = input<string>();
  readonly drawerBaseClass = input<string>();
  readonly drawerOverlayClass = input<string>();
  readonly drawerActivate = input<boolean | { [key: string]: boolean }>();
  readonly drawerToggleSelector = input<string>();
  readonly drawerClose = input<string>();
  readonly drawerEscape = input<boolean>();
  readonly drawerPermanent = input<boolean>();

  readonly drawerToggle = output<DrawerStateChangeEvent>();
  readonly drawerShow = output<DrawerStateChangeEvent>();
  readonly drawerHide = output<DrawerStateChangeEvent>();
  readonly drawerShownEvent = output<DrawerStateChangeEvent>();
  readonly drawerHiddenEvent = output<DrawerStateChangeEvent>();
  readonly stateChange = output<DrawerStateChangeEvent>();

  constructor() {
    super(inject(LoggerService), 'DrawerDirective', { ...DEFAULT_OPTIONS });

    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);

    if (!this.host.isBrowser) return;

    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    const bindings = [
      { input: this.drawerOverlay, key: 'overlay' as const },
      { input: this.drawerDirection, key: 'direction' as const },
      { input: this.drawerName, key: 'name' as const },
      { input: this.drawerBaseClass, key: 'baseClass' as const },
      { input: this.drawerOverlayClass, key: 'overlayClass' as const },
      { input: this.drawerToggleSelector, key: 'toggle' as const },
      { input: this.drawerClose, key: 'close' as const },
      { input: this.drawerEscape, key: 'escape' as const },
      { input: this.drawerPermanent, key: 'permanent' as const },
    ];
    this.bindInputs(bindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser || !this.shouldInitialize()) return;

    this.executeSafely(() => {
      this.syncInputs([
        { input: this.drawerOverlay, key: 'overlay' as const },
        { input: this.drawerDirection, key: 'direction' as const },
        { input: this.drawerName, key: 'name' as const },
        { input: this.drawerBaseClass, key: 'baseClass' as const },
        { input: this.drawerOverlayClass, key: 'overlayClass' as const },
        { input: this.drawerToggleSelector, key: 'toggle' as const },
        { input: this.drawerClose, key: 'close' as const },
        { input: this.drawerEscape, key: 'escape' as const },
        { input: this.drawerPermanent, key: 'permanent' as const },
      ]);

      const width = this.drawerWidth();
      if (width !== undefined) {
        this._rawWidthConfig = width;
        const resolved = this.resolveWidthFromRaw(width);
        this.updateOption('width', resolved);
      }

      const activate = this.drawerActivate();
      if (activate !== undefined) this.updateOption('activate', activate);

      this.initializeDrawer();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  toggle(source: 'manual' | 'toggle' | 'overlay' | 'close' = 'manual'): void {
    this.executeSafely(() => {
      this._previousIsShown.set(this._isShown());
      const newState = !this._isShown();
      this._isShown.set(newState);
      this.emitStateChange(source);
    }, 'Toggle failed');
  }

  show(source: 'manual' | 'toggle' | 'overlay' | 'close' = 'manual'): void {
    this.executeSafely(() => {
      if (this._isShown()) return;
      this._previousIsShown.set(this._isShown());
      this._isShown.set(true);
      this.emitStateChange(source);
    }, 'Show failed');
  }

  hide(source: 'manual' | 'toggle' | 'overlay' | 'close' = 'manual'): void {
    this.executeSafely(() => {
      if (!this._isShown()) return;
      this._previousIsShown.set(this._isShown());
      this._isShown.set(false);
      this.emitStateChange(source);
    }, 'Hide failed');
  }

  private shouldInitialize(): boolean {
    return runSafely(() => Boolean(this.host.elementRef.nativeElement), () => {}) ?? false;
  }

  private initializeDrawer(): void {
    this.suppressInitialAnimation();
    this.ensureElementId();
    this.setupDrawer();
    this.bindInstance();
    this.checkActivation();
    this.setupRoutingChanges();
    this.setupResizeListener();
    this.restoreAnimations();
  }

  private suppressInitialAnimation(): void {
    if (!this.host.isBrowser) return;
    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'transition', 'none', 1);
    this.host.renderer.setStyle(this.host.elementRef.nativeElement, 'animation', 'none', 1);
  }

  private restoreAnimations(): void {
    if (!this.host.isBrowser || !this.host.window || typeof this.host.window.setTimeout === 'undefined') return;

    this.clearAnimationRestoreTimeout();
    const hostWindow = this.host.window;
    this.animationRestoreTimeout = hostWindow.setTimeout(() => {
      this.animationRestoreTimeout = null;
      if (!this.host.isBrowser || !this.host.window) return;
      this.host.renderer.removeStyle(this.host.elementRef.nativeElement, 'transition');
      this.host.renderer.removeStyle(this.host.elementRef.nativeElement, 'animation');
    }, 0);
  }

  private ensureElementId(): void {
    if (!this.host.isBrowser) return;
    if (!this.host.elementRef.nativeElement.id) {
      this.host.renderer.setAttribute(this.host.elementRef.nativeElement, 'id', DomUtil.getUniqueIdWithPrefix('drawer'));
    }
  }

  private setupDrawer(): void {
    this.applyActivationClasses();
    this.setupEventHandlers();
  }

  private bindInstance(): void {
    DrawerStore.set(this.host.elementRef.nativeElement.id, this);
  }

  private resolveWidthFromRaw(width: string | { [key: string]: string }): string {
    if (typeof width === 'object') {
      const result = ResponsiveUtil.getAttributeValueByBreakpoint(width as unknown as string);
      return typeof result === 'string' ? result : String(result);
    }

    if (width && (width.trim().startsWith('{') || width.trim().startsWith('{"'))) {
      const result = ResponsiveUtil.getAttributeValueByBreakpoint(width);
      return typeof result === 'string' ? result : String(result);
    }

    return width;
  }

  private updateDrawerState(): void {
    if (this._isShown()) {
      this.showDrawer();
    } else {
      this.hideDrawer();
    }
  }

  private showDrawer(): void {
    if (!this._isActive) return;

    const options = this.optionsManager.snapshot();

    if (options.overlay) this.createOverlay();

    this.updateElementWidthFromConfig();
    this.setBodyAttrsOnShow();
    if (this.host.isBrowser) {
      this.host.renderer.addClass(this.hostElement, `${options.baseClass}-on`);
    }
    this.setToggleActive(true);
  }

  private hideDrawer(): void {
    const options = this.optionsManager.snapshot();

    this.removeOverlay();
    this.clearBodyAttrsOnHide();
    if (this.host.isBrowser) {
      this.host.renderer.removeClass(this.hostElement, `${options.baseClass}-on`);
    }
    this.setToggleActive(false);
  }

  private createOverlay(): void {
    if (!this.host.isBrowser || this.overlayElement) return;

    const options = this.optionsManager.snapshot();
    this.overlayElement = this.host.renderer.createElement('div');
    this.host.renderer.addClass(this.overlayElement, options.overlayClass);

    if (this.host.window) {
      const computedStyle = this.host.window.getComputedStyle(this.host.elementRef.nativeElement);
      const elementZIndex = computedStyle.zIndex;
      if (elementZIndex && elementZIndex !== 'auto') {
        const overlayZindex = CoreUtil.parseNumber(elementZIndex) - 1;
        this.host.renderer.setStyle(this.overlayElement, 'z-index', overlayZindex.toString());
      }
    }

    if (this.overlayElement) {
      this.addBaseDomListener(this.overlayElement, 'click', () => this.hide('overlay'));
    }
    this.host.renderer.appendChild(this.host.document.body, this.overlayElement);
  }

  private removeOverlay(): void {
    if (!this.host.isBrowser || !this.overlayElement || !this.overlayElement.parentNode) return;
    this.host.renderer.removeChild(this.overlayElement.parentNode, this.overlayElement);
    this.overlayElement = null;
  }

  private checkActivation(): void {
    const options = this.optionsManager.snapshot();

    let isActive = true;
    if (typeof options.activate === 'boolean') {
      isActive = options.activate;
    } else if (typeof options.activate === 'object') {
      isActive = this.checkResponsiveActivation(options.activate);
    }

    this._isActive = isActive;
    this.applyActivationClasses();

    if (!isActive && this._isShown()) {
      this.hide('manual');
    }
  }

  private checkResponsiveActivation(activateConfig: { [key: string]: boolean }): boolean {
    const configString = JSON.stringify(activateConfig);
    const result = ResponsiveUtil.getAttributeValueByBreakpoint(configString as unknown as string);

    if (typeof result === 'boolean') return result;
    if (typeof result === 'string') return result === 'true';

    return false;
  }

  private setupEventHandlers(): void {
    const options = this.optionsManager.snapshot();

    this.setupToggleHandlers(options);
    this.setupCloseHandlers(options);
    this.setupShowHandlers();
    this.setupEscapeHandler(options);
  }

  private setupToggleHandlers(options: DrawerOptions): void {
    if (options.toggle) {
      this.toggleEventId = this.attachDelegatedClick(options.toggle, (e: Event) => {
        e.preventDefault();
        this.toggleElement = e.target as HTMLElement;
        this.toggle('toggle');
      });
    }
  }

  private setupCloseHandlers(options: DrawerOptions): void {
    if (options.close) {
      this.closeEventId = this.attachDelegatedClick(options.close, (e: Event) => {
        e.preventDefault();
        this.hide('close');
      });
    }
  }

  private setupShowHandlers(): void {
    const showSelector = this.getShowSelectorForHost();
    this.showEventId = this.attachDelegatedClick(showSelector, (e: Event) => {
      e.preventDefault();
      this.toggleElement = e.target as HTMLElement;
      this.show('manual');
    });
  }

  private setupEscapeHandler(options: DrawerOptions): void {
    if (!options.escape) return;

    this.addBaseDomListener(this.host.document, 'keydown', (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Escape' && this._isShown()) {
        this.hide('manual');
      }
    });
  }

  private setupRoutingChanges(): void {
    if (this.routerSubscription) return;

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.hide('manual');
      }
    });
  }

  private setupResizeListener(): void {
    if (!this.host.isBrowser || !this.host.window) return;

    const handler = () => {
      if (this.resizeTimeoutId !== null) return;
      const fallbackWindow = this.host.window ?? window;
      this.resizeTimeoutId = fallbackWindow.setTimeout(() => {
        this.resizeTimeoutId = null;
        this.updateElementWidthFromConfig();
        this.checkActivation();
      }, 100);
    };

    this.addBaseDomListener('window', 'resize', handler);
  }

  private applyActivationClasses(): void {
    if (!this._isActive) {
      this.clearBaseClasses();
      return;
    }
    this.ensureBaseClasses();
  }

  private emitStateChange(source: 'manual' | 'toggle' | 'overlay' | 'close'): void {
    const event: DrawerStateChangeEvent = {
      isShown: this._isShown(),
      previousIsShown: this._previousIsShown(),
      source,
    };

    if (event.isShown !== event.previousIsShown) {
      this.updateDrawerState();

      if (event.isShown) {
        this.drawerShow.emit(event);
        if (this.host.isBrowser) {
          this.scheduleSettledEventEmit(() => this.drawerShownEvent.emit(event));
        } else {
          this.drawerShownEvent.emit(event);
        }
      } else {
        this.drawerHide.emit(event);
        if (this.host.isBrowser) {
          this.scheduleSettledEventEmit(() => this.drawerHiddenEvent.emit(event));
        } else {
          this.drawerHiddenEvent.emit(event);
        }
      }
    }

    this.drawerToggle.emit(event);
    this.stateChange.emit(event);
  }

  private scheduleSettledEventEmit(callback: () => void): void {
    if (!this.host.isBrowser || !this.host.window || typeof this.host.window.setTimeout === 'undefined') {
      callback();
      return;
    }

    const hostWindow = this.host.window;
    const timeoutId = hostWindow.setTimeout(() => {
      this.settledEventTimeouts.delete(timeoutId);
      callback();
    }, 10);
    this.settledEventTimeouts.add(timeoutId);
  }

  private clearAnimationRestoreTimeout(): void {
    if (this.animationRestoreTimeout === null) return;

    const hostWindow = this.host.window;
    if (hostWindow && typeof hostWindow.clearTimeout === 'function') {
      hostWindow.clearTimeout(this.animationRestoreTimeout);
    } else if (typeof clearTimeout !== 'undefined') {
      clearTimeout(this.animationRestoreTimeout);
    }
    this.animationRestoreTimeout = null;
  }

  private clearSettledEventTimeouts(): void {
    if (this.settledEventTimeouts.size === 0) return;

    const hostWindow = this.host.window;
    for (const timeoutId of this.settledEventTimeouts) {
      if (hostWindow && typeof hostWindow.clearTimeout === 'function') {
        hostWindow.clearTimeout(timeoutId);
      } else if (typeof clearTimeout !== 'undefined') {
        clearTimeout(timeoutId);
      }
    }
    this.settledEventTimeouts.clear();
  }

  private setBodyAttrsOnShow(): void {
    if (!this.host.isBrowser) return;

    this.executeSafely(() => {
      const options = this.optionsManager.snapshot();
      if (options.name) {
        this.host.renderer.setAttribute(this.host.document.body, `data-velora-drawer-${options.name}`, 'on');
      }
      this.host.renderer.setAttribute(this.host.document.body, 'data-velora-drawer', 'on');
    }, 'Set body attrs on show failed');
  }

  private clearBodyAttrsOnHide(): void {
    if (!this.host.isBrowser) return;

    this.executeSafely(() => {
      const options = this.optionsManager.snapshot();
      const openDrawers = Array.from(DrawerStore.getAllInstances().values()).filter(
        (drawer) => drawer.isShown()
      );
      const keepsNamedAttribute = openDrawers.some(
        (drawer) => drawer.optionsManager.snapshot().name === options.name
      );

      if (options.name && !keepsNamedAttribute) {
        this.host.renderer.removeAttribute(this.host.document.body, `data-velora-drawer-${options.name}`);
      }
      if (openDrawers.length === 0) {
        this.host.renderer.removeAttribute(this.host.document.body, 'data-velora-drawer');
      }
    }, 'Clear body attrs on hide failed');
  }

  private updateElementWidthFromConfig(): void {
    if (!this.host.isBrowser) return;

    this.executeSafely(() => {
      const resolvedWidth = this.resolveWidthFromRaw(this._rawWidthConfig);
      if (this._isActive) {
        this.host.renderer.setStyle(this.hostElement, 'width', resolvedWidth, 1);
      } else {
        this.host.renderer.removeStyle(this.hostElement, 'width');
      }
    }, 'Update element width from config failed');
  }

  private ensureBaseClasses(): void {
    if (!this.host.isBrowser) return;

    const options = this.optionsManager.snapshot();
    this.host.renderer.addClass(this.hostElement, options.baseClass);
    this.host.renderer.addClass(this.hostElement, `${options.baseClass}-${options.direction}`);
  }

  private clearBaseClasses(): void {
    if (!this.host.isBrowser) return;

    const options = this.optionsManager.snapshot();
    this.host.renderer.removeClass(this.hostElement, `${options.baseClass}-on`);
    this.host.renderer.removeClass(this.hostElement, options.baseClass);
    this.host.renderer.removeClass(this.hostElement, `${options.baseClass}-start`);
    this.host.renderer.removeClass(this.hostElement, `${options.baseClass}-end`);
  }

  private setToggleActive(isActive: boolean): void {
    if (!this.host.isBrowser || !this.toggleElement) return;

    if (isActive) {
      this.host.renderer.addClass(this.toggleElement, 'active');
    } else {
      this.host.renderer.removeClass(this.toggleElement, 'active');
    }
  }

  private attachDelegatedClick(selector: string, handler: (e: Event) => void): string {
    const eventId = DomUtil.getUniqueIdWithPrefix('event');

    const delegatedHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;

      if (target && target.matches(selector)) {
        handler(e);
        return;
      }

      let currentElement = target?.parentElement ?? null;
      while (currentElement && currentElement !== this.host.document.body) {
        if (currentElement.matches(selector)) {
          handler(e);
          return;
        }
        currentElement = currentElement.parentElement;
      }
    };

    const handlerId = EventUtil.addEventListener(this.host.document.body, 'click', delegatedHandler);
    DataUtil.set(this.host.document.body, `event_${eventId}`, handlerId);
    return eventId;
  }

  private detachDelegatedClick(eventId: string | null): void {
    if (!eventId) return;

    const handlerId = DataUtil.get<string>(this.host.document.body, `event_${eventId}`);
    if (handlerId) {
      EventUtil.removeEventListener(this.host.document.body, 'click', handlerId);
      DataUtil.remove(this.host.document.body, `event_${eventId}`);
    }
  }

  private getShowSelectorForHost(): string {
    return `[data-velora-drawer-target="#${this.hostElement.id}"]`;
  }

  protected override updateOption<K extends keyof DrawerOptions>(key: K, value: DrawerOptions[K]): boolean {
    return this.optionsManager.setOption(key, value);
  }

  private get hostElement(): HTMLElement {
    return this.host.elementRef.nativeElement;
  }

  private resolveResponsiveValue(value: unknown): boolean {
    return (
      runSafely(
        () => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'object') {
            return CoreUtil.coerceBooleanProperty(
              ResponsiveUtil.getBreakpointValue(value as { default: string | number; [key: string]: string | number })
            );
          }
          return true;
        },
        () => {}
      ) ?? true
    );
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.markBaseDestroyed();
      this.clearAnimationRestoreTimeout();
      this.clearSettledEventTimeouts();

      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
      }

      if (this._isShown()) {
        this._previousIsShown.set(true);
        this._isShown.set(false);
        this.hideDrawer();
      } else {
        this.removeOverlay();
      }
      this.detachDelegatedClick(this.toggleEventId);
      this.detachDelegatedClick(this.closeEventId);
      this.detachDelegatedClick(this.showEventId);
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
        this.routerSubscription = null;
      }
      this.clearBaseDomListeners();
      if (this.resizeTimeoutId !== null) {
        clearTimeout(this.resizeTimeoutId);
        this.resizeTimeoutId = null;
      }
      DrawerStore.remove(this.host.elementRef.nativeElement.id);
      this.baseCleanup();
      this.status.setError(null);
    }, 'Cleanup failed');
  }

  static hideAll(): void {
    runSafely(
      () => DrawerStore.getAllInstances().forEach((drawer) => drawer.hide('manual')),
      () => {}
    );
  }

  static updateAll(): void {
    runSafely(
      () => DrawerStore.getAllInstances().forEach((drawer) => drawer.updateDrawerState()),
      () => {}
    );
  }

  static getInstance(elementId: string): DrawerDirective | undefined {
    return runSafely(() => DrawerStore.get(elementId), () => {});
  }
}
