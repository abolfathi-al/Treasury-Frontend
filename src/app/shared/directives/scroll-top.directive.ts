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
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { setOptionIfChanged } from './shared/directive-helpers';

export interface ScrollTopOptions {
  activate?: boolean;
  revealOffset: number;
  behavior: ScrollBehavior;
  targetSelector?: string;
}

const DEFAULT_SCROLL_TOP_OPTIONS: Required<ScrollTopOptions> = {
  activate: true,
  revealOffset: 300,
  behavior: 'smooth',
  targetSelector: '',
} as const;

@Directive({
  selector: '[vlVeloraScrollTop]',
  exportAs: 'vlVeloraScrollTop',
  standalone: true,
})
export class ScrollTopDirective
  extends BaseDirective<ScrollTopOptions, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  private readonly router = inject(Router);

  private scrollContainer: HTMLElement | Window | null = null;
  private scrollTimeout: number | null = null;
  private routeVisibilityTimeout: number | null = null;
  private routerSubscription: Subscription | null = null;

  private readonly _isVisible = signal<boolean>(false);
  private readonly _isScrolling = signal<boolean>(false);
  readonly isVisible = computed(() => this._isVisible());
  readonly isScrolling = computed(() => this._isScrolling());

  readonly scrollTopActivate = input<boolean>();
  readonly scrollTopRevealOffset = input<number>();
  readonly scrollTopBehavior = input<ScrollBehavior>();
  readonly scrollTopTargetSelector = input<string>();

  readonly scrollTopShown = output<void>();
  readonly scrollTopHidden = output<void>();
  readonly scrolledToTop = output<void>();

  constructor() {
    super(inject(LoggerService), 'ScrollTopDirective', {
      ...DEFAULT_SCROLL_TOP_OPTIONS,
    });
    this.host.destroyRef.onDestroy(() => this.cleanup());
    this.initBaseDomListeners(this.host.renderer, this.host.isBrowser);
    this.bindInputs([
      { input: this.scrollTopActivate, key: 'activate' },
      { input: this.scrollTopRevealOffset, key: 'revealOffset' },
      { input: this.scrollTopBehavior, key: 'behavior' },
      { input: this.scrollTopTargetSelector, key: 'targetSelector' },
    ]);
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    if (!this.shouldInitialize()) return;

    this.executeSafely(() => {
      this.syncInputs([
        { input: this.scrollTopActivate, key: 'activate' },
        { input: this.scrollTopRevealOffset, key: 'revealOffset' },
        { input: this.scrollTopBehavior, key: 'behavior' },
        { input: this.scrollTopTargetSelector, key: 'targetSelector' },
      ]);
      this.setupScrollContainer();
      this.updateVisibility();
      this.setupEventListeners();
      this.setupRouterListener();
    }, 'Initialization failed');
  }

  scrollToTop(): void {
    if (this._isScrolling()) return;

    this.executeSafely(() => {
      this._isScrolling.set(true);
      this.performScroll();
    }, 'Scroll to top failed');
  }

  private shouldInitialize(): boolean {
    return Boolean(this.host.elementRef.nativeElement) && this.isActivateOn();
  }

  private setupScrollContainer(): void {
    const { targetSelector } = this.optionsManager.snapshot();
    if (targetSelector) {
      const target = this.host.document.querySelector<HTMLElement>(targetSelector);
      if (target) {
        this.scrollContainer = target;
        return;
      }
    }
    this.scrollContainer = this.host.window;
  }

  private setupEventListeners(): void {
    if (this.scrollContainer && this.scrollContainer !== this.host.window) {
      this.addBaseDomListener(
        this.scrollContainer as HTMLElement,
        'scroll',
        () => this.handleScroll()
      );
    } else {
      this.addBaseDomListener('window', 'scroll', () => this.handleScroll());
    }

    this.addBaseDomListener(this.host.elementRef.nativeElement, 'click', (event) =>
      this.handleClick(event)
    );
  }

  private setupRouterListener(): void {
    if (this.routerSubscription) return;
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.handleRouteChange();
      }
    });
  }

  private handleScroll(): void {
    this.updateVisibility();
  }

  private handleClick(event: Event): void {
    event.preventDefault();
    this.scrollToTop();
  }

  private handleRouteChange(): void {
    this.clearRouteVisibilityTimeout();
    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow || typeof hostWindow.setTimeout !== 'function') {
      this.updateVisibility();
      return;
    }

    this.routeVisibilityTimeout = hostWindow.setTimeout(() => {
      this.routeVisibilityTimeout = null;
      this.updateVisibility();
    }, 100);
  }

  private updateVisibility(): void {
    const shouldShow = this.shouldShowScrollTop();
    if (shouldShow === this._isVisible()) return;

    this._isVisible.set(shouldShow);
    this.updateElementVisibility(shouldShow);
    if (shouldShow) this.scrollTopShown.emit();
    else this.scrollTopHidden.emit();
  }

  private updateElementVisibility(isVisible: boolean): void {
    if (!this.host.isBrowser) return;
    this.setDataAttr(
      this.host.renderer,
      this.host.document.body,
      'data-velora-scrolltop',
      isVisible ? 'on' : null
    );
  }

  private shouldShowScrollTop(): boolean {
    const { revealOffset } = this.optionsManager.snapshot();
    return this.getScrollPosition() > revealOffset;
  }

  private getScrollPosition(): number {
    if (!this.scrollContainer || this.scrollContainer === this.host.window) {
      const hostWindow = this.host.window ?? this.getHostWindow();
      if (!hostWindow) return 0;
      return hostWindow.pageYOffset || this.host.document.documentElement.scrollTop;
    }
    return (this.scrollContainer as HTMLElement).scrollTop;
  }

  private performScroll(): void {
    const { behavior } = this.optionsManager.snapshot();

    if (!this.scrollContainer || this.scrollContainer === this.host.window) {
      this.host.window?.scrollTo({ top: 0, behavior });
    } else {
      (this.scrollContainer as HTMLElement).scrollTo({ top: 0, behavior });
    }

    this.handleScrollComplete();
  }

  private handleScrollComplete(): void {
    this.clearScrollTimeout();
    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow) return;

    this.scrollTimeout = hostWindow.setTimeout(() => {
      this._isScrolling.set(false);
      this.scrolledToTop.emit();
      this.scrollTimeout = null;
    }, 300);
  }

  protected override updateOption<K extends keyof ScrollTopOptions>(
    key: K,
    value: ScrollTopOptions[K]
  ): boolean {
    return Boolean(
      this.executeSafely<boolean>(
        () =>
          setOptionIfChanged(this.optionsManager, key, value, () => {
            if (key === 'targetSelector') this.setupScrollContainer();
            this.updateVisibility();
          }),
        'Option update failed'
      )
    );
  }

  private clearScrollTimeout(): void {
    if (this.scrollTimeout === null) return;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = null;
  }

  private clearRouteVisibilityTimeout(): void {
    if (this.routeVisibilityTimeout === null) return;
    const hostWindow = this.host.window ?? this.getHostWindow();
    if (hostWindow && typeof hostWindow.clearTimeout === 'function') {
      hostWindow.clearTimeout(this.routeVisibilityTimeout);
    } else {
      clearTimeout(this.routeVisibilityTimeout);
    }
    this.routeVisibilityTimeout = null;
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.clearRouteVisibilityTimeout();
      this.clearScrollTimeout();
      this.updateElementVisibility(false);
      this.clearBaseDomListeners();
      this.scrollContainer = this.host.window;
      this.routerSubscription?.unsubscribe();
      this.routerSubscription = null;
      this.baseCleanup();
    }, 'Cleanup failed');
  }
}
