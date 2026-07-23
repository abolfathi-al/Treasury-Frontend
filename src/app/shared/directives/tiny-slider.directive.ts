import {
  Directive,
  OnChanges,
  OnDestroy,
  OnInit,
  OutputEmitterRef,
  SimpleChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type {
  TinySliderInfo,
  TinySliderInstance,
  TinySliderSettings,
} from 'tiny-slider';
type TinySliderModule = typeof import('tiny-slider');

import { CssLoaderService } from '@core/services/css-loader.service';
import { LoggerService } from '@core/services/logger.service';

import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import {
  type InputEffectBinding,
  runSafely,
  setOptionIfChanged,
} from './shared/directive-helpers';

export interface TinySliderOptions {
  container?: HTMLElement | string;
  mode?: 'carousel' | 'gallery';
  axis?: 'horizontal' | 'vertical';
  items?: number;
  gutter?: number;
  edgePadding?: number;
  fixedWidth?: number | false;
  autoWidth?: boolean;
  viewportMax?: number | false;
  slideBy?: number | 'page';
  center?: boolean;
  controls?: boolean;
  controlsText?: string[];
  controlsContainer?: HTMLElement | string | false;
  controlsPosition?: 'top' | 'bottom';
  prevButton?: HTMLElement | string | false;
  nextButton?: HTMLElement | string | false;
  nav?: boolean;
  navContainer?: HTMLElement | string | false;
  navPosition?: 'top' | 'bottom';
  navAsThumbnails?: boolean;
  arrowKeys?: boolean;
  speed?: number;
  autoplay?: boolean;
  autoplayPosition?: 'top' | 'bottom';
  autoplayTimeout?: number;
  autoplayDirection?: 'forward' | 'backward';
  autoplayHoverPause?: boolean;
  autoplayButton?: HTMLElement | string | false;
  autoplayButtonOutput?: boolean;
  autoplayText?: string[];
  autoplayResetOnVisibility?: boolean;
  loop?: boolean;
  rewind?: boolean;
  autoHeight?: boolean;
  responsive?: { [key: number]: Partial<TinySliderOptions> };
  lazyload?: boolean;
  lazyloadSelector?: string;
  touch?: boolean;
  mouseDrag?: boolean;
  swipeAngle?: number | boolean;
  preventActionWhenRunning?: boolean;
  preventScrollOnTouch?: boolean | 'auto';
  nested?: boolean | 'inner' | 'outer';
  freezable?: boolean;
  disable?: boolean;
  startIndex?: number;
  useLocalStorage?: boolean;
  nonce?: string | false;
  textDirection?: 'ltr' | 'rtl';
  onInit?: () => void;
  onDestroy?: () => void;
  onIndexChanged?: (info: TinySliderInfo) => void;
  onTransitionStart?: (info: TinySliderInfo) => void;
  onTransitionEnd?: (info: TinySliderInfo) => void;
  onTouchStart?: (info: TinySliderInfo) => void;
  onTouchMove?: (info: TinySliderInfo) => void;
  onTouchEnd?: (info: TinySliderInfo) => void;
  onDragStart?: (info: TinySliderInfo) => void;
  onDragMove?: (info: TinySliderInfo) => void;
  onDragEnd?: (info: TinySliderInfo) => void;
  onNewBreakpointStart?: (info: TinySliderInfo) => void;
  onNewBreakpointEnd?: (info: TinySliderInfo) => void;
}

export interface TinySliderError {
  code: string;
  message: string;
  details?: unknown;
}

export interface TinySliderValidationResult {
  isValid: boolean;
  currentIndex: number;
  slideCount: number;
  errors: string[];
}

const DEFAULT_OPTIONS: Partial<TinySliderOptions> = {
  mode: 'carousel',
  axis: 'horizontal',
  items: 1,
  gutter: 0,
  controls: true,
  nav: false,
  navAsThumbnails: false,
  speed: 300,
  autoplay: false,
  autoplayTimeout: 5000,
  autoplayHoverPause: false,
  loop: true,
  touch: true,
  mouseDrag: true,
  arrowKeys: false,
  center: false,
  autoHeight: false,
  rewind: false,
  useLocalStorage: false,
  textDirection: 'ltr',
};

const MAX_CHILDREN_WAIT_ATTEMPTS = 10;
const CHILDREN_WAIT_INTERVAL = 100;

@Directive({
  selector: '[vlVeloraTinySlider]',
  exportAs: 'vlVeloraTinySlider',
  standalone: true,
})
export class TinySliderDirective
  extends BaseDirective<TinySliderOptions, TinySliderError>
  implements OnInit, OnChanges, OnDestroy
{
  private readonly host = useDirectiveHost();
  private readonly cssLoader = inject(CssLoaderService);

  private instance: TinySliderInstance | null = null;
  private tnsCtor: TinySliderModule['tns'] | null = null;
  private tnsLoader: Promise<void> | null = null;
  private bootstrapFrameId: number | null = null;
  private bootstrapFrameCanceler: ((frameId: number) => void) | null = null;
  private bootstrapTimeoutId: number | null = null;
  private initializationTimeout: number | null = null;
  private childrenObserver: MutationObserver | null = null;
  private childrenWaitTimeout: number | null = null;
  private readonly timeoutClearers = new Map<number, (timeoutId: number) => void>();

  private readonly _currentIndex = signal<number>(0);
  private readonly _slideCount = signal<number>(0);
  private readonly _isValid = signal<boolean>(true);

  readonly isActive = this.status.isActive;
  readonly isLoading = this.status.isLoading;
  readonly error = this.status.error;
  readonly currentIndex = computed(() => this._currentIndex());
  readonly slideCount = computed(() => this._slideCount());
  readonly isValid = computed(() => this._isValid());

  readonly tinySliderMode = input<'carousel' | 'gallery'>();
  readonly tinySliderAxis = input<'horizontal' | 'vertical'>();
  readonly tinySliderItems = input<number>();
  readonly tinySliderGutter = input<number>();
  readonly tinySliderControls = input<boolean>();
  readonly tinySliderNav = input<boolean>();
  readonly tinySliderNavAsThumbnails = input<boolean>();
  readonly tinySliderSpeed = input<number>();
  readonly tinySliderAutoplay = input<boolean>();
  readonly tinySliderAutoplayTimeout = input<number>();
  readonly tinySliderAutoplayHoverPause = input<boolean>();
  readonly tinySliderLoop = input<boolean>();
  readonly tinySliderTouch = input<boolean>();
  readonly tinySliderMouseDrag = input<boolean>();
  readonly tinySliderEdgePadding = input<number>();
  readonly tinySliderFixedWidth = input<number | false>();
  readonly tinySliderAutoWidth = input<boolean>();
  readonly tinySliderViewportMax = input<number | false>();
  readonly tinySliderSlideBy = input<number | 'page'>();
  readonly tinySliderCenter = input<boolean>();
  readonly tinySliderControlsText = input<string[]>();
  readonly tinySliderControlsContainer = input<HTMLElement | string | false>();
  readonly tinySliderControlsPosition = input<'top' | 'bottom'>();
  readonly tinySliderPrevButton = input<HTMLElement | string | false>();
  readonly tinySliderNextButton = input<HTMLElement | string | false>();
  readonly tinySliderNavContainer = input<HTMLElement | string | false>();
  readonly tinySliderNavPosition = input<'top' | 'bottom'>();
  readonly tinySliderArrowKeys = input<boolean>();
  readonly tinySliderAutoplayPosition = input<'top' | 'bottom'>();
  readonly tinySliderAutoplayDirection = input<'forward' | 'backward'>();
  readonly tinySliderAutoplayButton = input<HTMLElement | string | false>();
  readonly tinySliderAutoplayButtonOutput = input<boolean>();
  readonly tinySliderAutoplayText = input<string[]>();
  readonly tinySliderAutoplayResetOnVisibility = input<boolean>();
  readonly tinySliderRewind = input<boolean>();
  readonly tinySliderAutoHeight = input<boolean>();
  readonly tinySliderLazyload = input<boolean>();
  readonly tinySliderLazyloadSelector = input<string>();
  readonly tinySliderSwipeAngle = input<number | boolean>();
  readonly tinySliderPreventActionWhenRunning = input<boolean>();
  readonly tinySliderPreventScrollOnTouch = input<boolean | 'auto'>();
  readonly tinySliderNested = input<boolean | 'inner' | 'outer'>();
  readonly tinySliderFreezable = input<boolean>();
  readonly tinySliderDisable = input<boolean>();
  readonly tinySliderStartIndex = input<number>();
  readonly tinySliderUseLocalStorage = input<boolean>();
  readonly tinySliderNonce = input<string | false>();
  readonly tinySliderTextDirection = input<'ltr' | 'rtl'>();
  readonly tinySliderResponsive = input<{
    [key: number]: Partial<TinySliderOptions>;
  }>();

  readonly init = output<void>();
  readonly destroy = output<void>();
  readonly indexChanged = output<TinySliderInfo>();
  readonly transitionStart = output<TinySliderInfo>();
  readonly transitionEnd = output<TinySliderInfo>();
  readonly touchStart = output<TinySliderInfo>();
  readonly touchMove = output<TinySliderInfo>();
  readonly touchEnd = output<TinySliderInfo>();
  readonly dragStart = output<TinySliderInfo>();
  readonly dragMove = output<TinySliderInfo>();
  readonly dragEnd = output<TinySliderInfo>();
  readonly newBreakpointStart = output<TinySliderInfo>();
  readonly newBreakpointEnd = output<TinySliderInfo>();
  readonly validationChange = output<TinySliderValidationResult>();

  constructor() {
    super(inject(LoggerService), 'TinySliderDirective', { ...DEFAULT_OPTIONS });
    this.host.destroyRef.onDestroy(() => {
      this.markBaseDestroyed();
      this.destroyTinySlider();
    });
    this.bindInputs(this.inputBindings);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.applyPreInitStyles();

    this.cssLoader
      .loadCss('tiny-slider.css')
      .then(() => {
        if (!this.isBaseDestroyed()) this.scheduleBootstrap();
      })
      .catch(() => {
        if (!this.isBaseDestroyed()) this.scheduleBootstrap();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.host.isBrowser || !this.isBaseInitialized()) return;

    this.syncInputs(this.inputBindings);

    const requiresReinit =
      changes['tinySliderMode'] ||
      changes['tinySliderAxis'] ||
      changes['tinySliderItems'] ||
      changes['tinySliderTextDirection'];

    if (requiresReinit) {
      this.reinitialize();
    } else {
      this.updateInstance();
      this.updateValidation();
    }
  }

  ngOnDestroy(): void {
    this.markBaseDestroyed();
    this.cleanup();
  }

  getCurrentIndex(): number {
    return this._currentIndex();
  }

  getSlideCount(): number {
    return this._slideCount();
  }

  isValidSlider(): boolean {
    return this._isValid();
  }

  goTo(index: number): void {
    this.withInstance((inst) => inst.goTo(index));
  }

  next(): void {
    this.withInstance((inst) => inst.goTo('next'));
  }

  prev(): void {
    this.withInstance((inst) => inst.goTo('prev'));
  }

  play(): void {
    this.withInstance((inst) => inst.play());
  }

  pause(): void {
    this.withInstance((inst) => inst.pause());
  }

  refresh(): void {
    this.withInstance((inst) => inst.refresh());
  }

  rebuild(): void {
    this.runOperation(() => this.reinitialize(), 'Rebuild failed');
  }

  destroyTinySlider(): void {
    if (!this.instance) return;

    runSafely(
      () => {
        this.instance?.destroy();
        this.instance = null;
        this.baseCleanup();
        this.status.setActive(false);
        this._isValid.set(false);

        const element = this.host.elementRef.nativeElement;
        if (element) this.removeTnsClasses(element);
      },
      (error) => this.handleError('Destroy failed', error)
    );
  }

  getInfo(): TinySliderInfo | null {
    if (!this.instance) return null;

    return (
      runSafely(
        () => this.instance!.getInfo(),
        (error) => this.handleError('Get info failed', error)
      ) ?? null
    );
  }

  private readonly inputBindings: InputEffectBinding<TinySliderOptions>[] = [
      { input: this.tinySliderMode, key: 'mode' },
      { input: this.tinySliderAxis, key: 'axis' },
      { input: this.tinySliderItems, key: 'items' },
      { input: this.tinySliderGutter, key: 'gutter' },
      { input: this.tinySliderControls, key: 'controls' },
      { input: this.tinySliderNav, key: 'nav' },
      { input: this.tinySliderNavAsThumbnails, key: 'navAsThumbnails' },
      { input: this.tinySliderSpeed, key: 'speed' },
      { input: this.tinySliderAutoplay, key: 'autoplay' },
      { input: this.tinySliderAutoplayTimeout, key: 'autoplayTimeout' },
      { input: this.tinySliderAutoplayHoverPause, key: 'autoplayHoverPause' },
      { input: this.tinySliderLoop, key: 'loop' },
      { input: this.tinySliderTouch, key: 'touch' },
      { input: this.tinySliderMouseDrag, key: 'mouseDrag' },
      { input: this.tinySliderEdgePadding, key: 'edgePadding' },
      { input: this.tinySliderFixedWidth, key: 'fixedWidth' },
      { input: this.tinySliderAutoWidth, key: 'autoWidth' },
      { input: this.tinySliderViewportMax, key: 'viewportMax' },
      { input: this.tinySliderSlideBy, key: 'slideBy' },
      { input: this.tinySliderCenter, key: 'center' },
      { input: this.tinySliderControlsText, key: 'controlsText' },
      { input: this.tinySliderControlsContainer, key: 'controlsContainer' },
      { input: this.tinySliderControlsPosition, key: 'controlsPosition' },
      { input: this.tinySliderPrevButton, key: 'prevButton' },
      { input: this.tinySliderNextButton, key: 'nextButton' },
      { input: this.tinySliderNavContainer, key: 'navContainer' },
      { input: this.tinySliderNavPosition, key: 'navPosition' },
      { input: this.tinySliderArrowKeys, key: 'arrowKeys' },
      { input: this.tinySliderAutoplayPosition, key: 'autoplayPosition' },
      { input: this.tinySliderAutoplayDirection, key: 'autoplayDirection' },
      { input: this.tinySliderAutoplayButton, key: 'autoplayButton' },
      { input: this.tinySliderAutoplayButtonOutput, key: 'autoplayButtonOutput' },
      { input: this.tinySliderAutoplayText, key: 'autoplayText' },
      { input: this.tinySliderAutoplayResetOnVisibility, key: 'autoplayResetOnVisibility' },
      { input: this.tinySliderRewind, key: 'rewind' },
      { input: this.tinySliderAutoHeight, key: 'autoHeight' },
      { input: this.tinySliderLazyload, key: 'lazyload' },
      { input: this.tinySliderLazyloadSelector, key: 'lazyloadSelector' },
      { input: this.tinySliderSwipeAngle, key: 'swipeAngle' },
      { input: this.tinySliderPreventActionWhenRunning, key: 'preventActionWhenRunning' },
      { input: this.tinySliderPreventScrollOnTouch, key: 'preventScrollOnTouch' },
      { input: this.tinySliderNested, key: 'nested' },
      { input: this.tinySliderFreezable, key: 'freezable' },
      { input: this.tinySliderDisable, key: 'disable' },
      { input: this.tinySliderStartIndex, key: 'startIndex' },
      { input: this.tinySliderUseLocalStorage, key: 'useLocalStorage' },
      { input: this.tinySliderNonce, key: 'nonce' },
      { input: this.tinySliderTextDirection, key: 'textDirection' },
      { input: this.tinySliderResponsive, key: 'responsive' },
    ];

  private scheduleBootstrap(): void {
    this.clearBootstrapSchedule();

    const hostWindow = this.host.window ?? this.getHostWindow();
    const runBootstrap = () => {
      this.bootstrapFrameId = null;
      this.bootstrapFrameCanceler = null;
      this.bootstrapTimeoutId = null;
      if (!this.isBaseDestroyed()) this.bootstrap();
    };

    if (hostWindow?.requestAnimationFrame && hostWindow.cancelAnimationFrame) {
      this.bootstrapFrameCanceler = hostWindow.cancelAnimationFrame.bind(hostWindow);
      this.bootstrapFrameId = hostWindow.requestAnimationFrame(runBootstrap);
      return;
    }

    if (hostWindow?.setTimeout) {
      let timeoutId = 0;
      timeoutId = hostWindow.setTimeout(() => {
        this.timeoutClearers.delete(timeoutId);
        runBootstrap();
      }, 16);
      this.bootstrapTimeoutId = timeoutId;
      this.storeTimeoutClearer(timeoutId, hostWindow);
      return;
    }

    runBootstrap();
  }

  private bootstrap(): void {
    this.loadLibrary()
      .then(() => {
        if (!this.isBaseDestroyed() && this.host.isBrowser) {
          this.scheduleInit();
        }
      })
      .catch((error) => this.handleError('Failed to load library', error));
  }

  private loadLibrary(): Promise<void> {
    if (this.tnsLoader) return this.tnsLoader;

    this.tnsLoader = import('tiny-slider').then((module: TinySliderModule) => {
      this.tnsCtor =
        ((module as unknown as { default?: TinySliderModule['tns'] }).default ??
          (module as unknown as { tns?: TinySliderModule['tns'] }).tns ??
          module) as TinySliderModule['tns'];
    });

    return this.tnsLoader;
  }

  private scheduleInit(): void {
    this.clearInitializationTimeout();

    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow?.setTimeout) {
      if (!this.isBaseDestroyed()) this.initSlider();
      return;
    }

    let timeoutId = 0;
    timeoutId = hostWindow.setTimeout(() => {
      this.timeoutClearers.delete(timeoutId);
      if (this.initializationTimeout === timeoutId) {
        this.initializationTimeout = null;
      }
      if (this.isBaseDestroyed()) return;
      this.runOperation(() => this.initSlider(), 'Initialization failed');
    }, 0);
    this.initializationTimeout = timeoutId;
    this.storeTimeoutClearer(timeoutId, hostWindow);
  }

  private initSlider(): void {
    if (!this.host.isBrowser || !this.tnsCtor) return;

    const element = this.host.elementRef.nativeElement;
    if (!element) {
      this.handleError('Initialization failed', new Error('Element not found'));
      return;
    }

    if (!element.children?.length) {
      this.waitForChildren(element);
      return;
    }

    this.createInstance(element);
  }

  private waitForChildren(element: HTMLElement, attempt = 0): void {
    if (this.isBaseDestroyed()) return;

    if (attempt >= MAX_CHILDREN_WAIT_ATTEMPTS) {
      this.logger.error(
        'TinySlider element has no children after waiting',
        'TinySliderDirective'
      );
      return;
    }

    if (element.children?.length) {
      this.cleanupChildrenWait();
      this.createInstance(element);
      return;
    }

    if (!this.childrenObserver) {
      this.childrenObserver = new MutationObserver(() => {
        if (element.children?.length) {
          this.cleanupChildrenWait();
          if (!this.isBaseDestroyed() && this.tnsCtor) {
            this.createInstance(element);
          }
        }
      });

      this.childrenObserver.observe(element, { childList: true, subtree: false });
    }

    this.clearChildrenWaitTimeout();

    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow?.setTimeout) return;

    let timeoutId = 0;
    timeoutId = hostWindow.setTimeout(() => {
      this.timeoutClearers.delete(timeoutId);
      if (this.childrenWaitTimeout === timeoutId) {
        this.childrenWaitTimeout = null;
      }
      if (!this.isBaseDestroyed()) {
        this.waitForChildren(element, attempt + 1);
      }
    }, CHILDREN_WAIT_INTERVAL);
    this.childrenWaitTimeout = timeoutId;
    this.storeTimeoutClearer(timeoutId, hostWindow);
  }

  private cleanupChildrenWait(): void {
    if (this.childrenObserver) {
      this.childrenObserver.disconnect();
      this.childrenObserver = null;
    }
    this.clearChildrenWaitTimeout();
  }

  private createInstance(element: HTMLElement): void {
    this.status.setLoading(true);
    this.status.setError(null);

    this.clearPreInitStyles();
    this.addTnsClasses(element);

    const instance = runSafely(
      () => this.buildInstance(element),
      (error) => this.handleError('Instance creation failed', error)
    );

    if (!instance) {
      this.status.setLoading(false);
      return;
    }

    this.instance = instance;
    this.host.renderer.addClass(element, 'tns-initialized');
    this.fixClonedSlidesFocus(element);
    this.updateState();
    this.status.setActive(true);
    this.status.setLoading(false);
    this.markBaseInitialized();
  }

  private fixClonedSlidesFocus(container: HTMLElement): void {
    const parent = container.closest('.tns-outer') ?? container.parentElement;
    if (!parent) return;

    const clonedSlides = parent.querySelectorAll('.tns-slide-cloned[aria-hidden="true"], .tns-item[aria-hidden="true"]');
    clonedSlides.forEach((slide) => {
      const focusableElements = slide.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusableElements.forEach((el) => {
        this.host.renderer.setAttribute(el, 'tabindex', '-1');
        this.host.renderer.setAttribute(el, 'aria-hidden', 'true');
      });
    });
  }

  private buildInstance(element: HTMLElement): TinySliderInstance {
    if (!this.tnsCtor) throw new Error('Library not loaded');

    const options = this.optionsManager.snapshot();
    const config: TinySliderSettings = {
      ...(options as TinySliderSettings),
      container: element,
    };

    this.attachCallbacks(config, options);
    return this.tnsCtor(config);
  }

  private attachCallbacks(config: TinySliderSettings, options: TinySliderOptions): void {
    const emit = <T>(emitter: OutputEmitterRef<T>, payload?: T) => {
      runSafely(() => emitter.emit(payload as T), () => {});
    };

    const extended = config as TinySliderSettings & {
      onInit?: () => void;
      onDestroy?: () => void;
      onIndexChanged?: (info: TinySliderInfo) => void;
      onTransitionStart?: (info: TinySliderInfo) => void;
      onTransitionEnd?: (info: TinySliderInfo) => void;
      onTouchStart?: (info: TinySliderInfo) => void;
      onTouchMove?: (info: TinySliderInfo) => void;
      onTouchEnd?: (info: TinySliderInfo) => void;
      onDragStart?: (info: TinySliderInfo) => void;
      onDragMove?: (info: TinySliderInfo) => void;
      onDragEnd?: (info: TinySliderInfo) => void;
      onNewBreakpointStart?: (info: TinySliderInfo) => void;
      onNewBreakpointEnd?: (info: TinySliderInfo) => void;
    };

    extended.onInit = () => {
      emit(this.init);
      this.updateState();
      options.onInit?.();
    };

    extended.onDestroy = () => {
      emit(this.destroy);
      options.onDestroy?.();
    };

    extended.onIndexChanged = (info) => {
      emit(this.indexChanged, info);
      this.updateState();
      options.onIndexChanged?.(info);
    };

    extended.onTransitionStart = (info) => {
      emit(this.transitionStart, info);
      options.onTransitionStart?.(info);
    };

    extended.onTransitionEnd = (info) => {
      emit(this.transitionEnd, info);
      options.onTransitionEnd?.(info);
    };

    extended.onTouchStart = (info) => {
      emit(this.touchStart, info);
      options.onTouchStart?.(info);
    };

    extended.onTouchMove = (info) => {
      emit(this.touchMove, info);
      options.onTouchMove?.(info);
    };

    extended.onTouchEnd = (info) => {
      emit(this.touchEnd, info);
      options.onTouchEnd?.(info);
    };

    extended.onDragStart = (info) => {
      emit(this.dragStart, info);
      options.onDragStart?.(info);
    };

    extended.onDragMove = (info) => {
      emit(this.dragMove, info);
      options.onDragMove?.(info);
    };

    extended.onDragEnd = (info) => {
      emit(this.dragEnd, info);
      options.onDragEnd?.(info);
    };

    extended.onNewBreakpointStart = (info) => {
      emit(this.newBreakpointStart, info);
      options.onNewBreakpointStart?.(info);
    };

    extended.onNewBreakpointEnd = (info) => {
      emit(this.newBreakpointEnd, info);
      options.onNewBreakpointEnd?.(info);
    };
  }

  private reinitialize(): void {
    if (!this.host.isBrowser) return;

    if (!this.tnsCtor) {
      this.bootstrap();
      return;
    }

    this.destroyTinySlider();
    this.initSlider();
  }

  private updateInstance(): void {
    if (!this.instance) return;

    runSafely(
      () => {
        const options = this.optionsManager.snapshot();
        Object.entries(options).forEach(([key, value]) => {
          if (key !== 'container') {
            (this.instance as unknown as { settings: Record<string, unknown> }).settings[key] =
              value;
          }
        });
      },
      (error) => this.handleError('Update failed', error)
    );
  }

  private withInstance(action: (instance: TinySliderInstance) => void): void {
    if (!this.instance) return;
    runSafely(() => action(this.instance!), (error) => this.handleError('Operation failed', error));
  }

  protected override updateOption<K extends keyof TinySliderOptions>(
    key: K,
    value: TinySliderOptions[K]
  ): boolean {
    if (value === undefined) return false;
    return setOptionIfChanged(this.optionsManager, key, value);
  }

  private updateState(): void {
    if (!this.instance) return;

    const info = this.instance.getInfo();
    this._currentIndex.set(info.index);
    this._slideCount.set(info.slideItems?.length || 0);
    this.updateValidation();
  }

  private updateValidation(): void {
    const isValid = !!this.instance?.getInfo().slideItems?.length;
    this._isValid.set(isValid);

    this.validationChange.emit({
      isValid,
      currentIndex: this._currentIndex(),
      slideCount: this._slideCount(),
      errors: isValid ? [] : ['Slider validation failed'],
    });
  }

  private handleError(message: string, error: unknown): void {
    const normalized = error instanceof Error ? error : new Error(String(error));
    this.status.setError({
      code: 'TINY_SLIDER_ERROR',
      message,
      details: normalized.message,
    });
    this.logger.error(message, 'TinySliderDirective', { error: normalized });
  }

  protected override runOperation(action: () => void, message: string): void {
    runSafely(action, (error) => this.handleError(message, error));
  }

  private cleanup(): void {
    this.clearBootstrapSchedule();
    this.clearInitializationTimeout();
    this.cleanupChildrenWait();
    this.destroyTinySlider();
    this.baseCleanup();
    this._currentIndex.set(0);
    this._slideCount.set(0);
    this._isValid.set(false);
  }

  private clearBootstrapSchedule(): void {
    if (this.bootstrapFrameId !== null) {
      this.bootstrapFrameCanceler?.(this.bootstrapFrameId);
      this.bootstrapFrameId = null;
      this.bootstrapFrameCanceler = null;
    }

    if (this.bootstrapTimeoutId !== null) {
      this.clearOwnedTimeout(this.bootstrapTimeoutId);
      this.bootstrapTimeoutId = null;
    }
  }

  private clearInitializationTimeout(): void {
    if (this.initializationTimeout === null) return;
    this.clearOwnedTimeout(this.initializationTimeout);
    this.initializationTimeout = null;
  }

  private clearChildrenWaitTimeout(): void {
    if (this.childrenWaitTimeout === null) return;
    this.clearOwnedTimeout(this.childrenWaitTimeout);
    this.childrenWaitTimeout = null;
  }

  private storeTimeoutClearer(timeoutId: number, hostWindow: Window): void {
    if (!hostWindow.clearTimeout) return;
    this.timeoutClearers.set(timeoutId, hostWindow.clearTimeout.bind(hostWindow));
  }

  private clearOwnedTimeout(timeoutId: number): void {
    const clearer = this.timeoutClearers.get(timeoutId);
    if (!clearer) return;
    clearer(timeoutId);
    this.timeoutClearers.delete(timeoutId);
  }

  private applyPreInitStyles(): void {
    const element = this.host.elementRef.nativeElement;
    if (!element) return;

    const options = this.optionsManager.snapshot();
    const gutter = options.gutter ?? 12;
    this.host.renderer.setStyle(element, '--tns-gutter', `${gutter}px`);

    if (options.fixedWidth) {
      this.host.renderer.setStyle(element, '--tns-fixed-width', `${options.fixedWidth}px`);
      const children = element.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        this.host.renderer.setStyle(child, 'width', `${options.fixedWidth}px`);
        this.host.renderer.setStyle(child, 'flex', `0 0 ${options.fixedWidth}px`);
      }
    }

    const parent = element.parentElement;
    if (parent) {
      this.host.renderer.addClass(parent, 'tns');
    }
  }

  private clearPreInitStyles(): void {
    const element = this.host.elementRef.nativeElement;
    if (!element) return;

    this.host.renderer.removeStyle(element, '--tns-gutter');
    this.host.renderer.removeStyle(element, '--tns-fixed-width');

    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.host.renderer.removeStyle(child, 'width');
      this.host.renderer.removeStyle(child, 'flex');
    }
  }

  private addTnsClasses(element: HTMLElement): void {
    if (!this.host.isBrowser) return;

    const parent = element.parentElement;
    if (parent) {
      this.host.renderer.addClass(parent, 'tns');
      this.host.renderer.addClass(parent, 'tns-initialized');
    }
  }

  private removeTnsClasses(element: HTMLElement): void {
    if (!this.host.isBrowser) return;

    const parent = element.parentElement;
    if (parent) {
      this.host.renderer.removeClass(parent, 'tns');
      this.host.renderer.removeClass(parent, 'tns-initialized');
    }
  }
}
