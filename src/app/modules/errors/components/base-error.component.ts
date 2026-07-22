import { Component, inject, signal, computed, effect, OnDestroy, OnInit, PLATFORM_ID, DOCUMENT, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { merge, startWith, zip } from 'rxjs';

import { APP_BRAND } from '@core/config/brand.config';
import { WINDOW } from '@core/tokens';
import { ThemeModeService } from '@core/services';
import { ErrorService, ErrorUtils } from '../data-access';
import { ErrorInfo } from '../models/error.types';

export type ErrorRouteData = Record<string, unknown>;

function readRouteString(routeData: ErrorRouteData, key: string): string | undefined {
  const value = routeData[key];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Base error component with common functionality
 * Provides shared logic for all error components
 */
@Component({
  template: '' // Abstract component
})
export abstract class BaseErrorComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  protected readonly document = inject<Document>(DOCUMENT);
  protected readonly _isDarkMode = signal<boolean>(false);
  protected readonly _errorInfo = signal<ErrorInfo | null>(null);

  // Computed values
  readonly isDarkMode = computed(() => this._isDarkMode());
  readonly errorInfo = computed(() => this._errorInfo());

  // Injected dependencies
  protected readonly window = inject(WINDOW);
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly modeService = inject(ThemeModeService);
  protected readonly errorService = inject(ErrorService);
  protected readonly translate = inject(TranslateService);
  protected readonly title = inject(Title);
  protected readonly brand = inject(APP_BRAND);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to update background image (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        if (typeof document !== 'undefined' && document.body) {
          document.body.style.backgroundImage = this.getBackgroundImage();
        }
      });
    }

    // Subscribe to theme mode changes
    this.modeService.mode
      .pipe(takeUntilDestroyed())
      .subscribe((mode) => {
        this._isDarkMode.set(mode === 'dark');
      });

        // Subscribe to route data changes
        // Merge both subscriptions using zip so both route data and translation changes are handled together
        // import { zip, startWith } from 'rxjs';

        zip(
          this.activatedRoute.data.pipe(startWith(this.activatedRoute.snapshot.data)),
          merge(
            this.translate.onLangChange,
            this.translate.onDefaultLangChange
          ).pipe(startWith(null))
        )
        .pipe(takeUntilDestroyed())
        .subscribe(([data, _]) => {
          const routeData = data as ErrorRouteData;
          const currentErrorInfo = this._errorInfo();
          const updatedErrorInfo = this.createErrorInfo(routeData, currentErrorInfo || undefined);
          this._errorInfo.set(updatedErrorInfo);

          // Set page title
          this.setPageTitle(routeData);
        });
  }

  ngOnInit(): void {
    // Load error configuration from route data
    this.loadErrorConfigurationFromRoute();
  }

  ngOnDestroy(): void {
    // Clean up background image (only in browser)
    if (isPlatformBrowser(this.platformId) && this.document?.body) {
      this.document.body.style.backgroundImage = 'none';
    }
  }

  /**
   * Load error configuration from route data
   */
  protected loadErrorConfigurationFromRoute(): void {
    const routeData = this.getRouteData();
    const errorInfo = this.createErrorInfo(routeData);
    this._errorInfo.set(errorInfo);
    
    // Set page title
    this.setPageTitle(routeData);
  }

  /**
   * Set page title based on route data
   */
  protected setPageTitle(routeData: ErrorRouteData): void {
    const titleKey = readRouteString(routeData, 'titleKey') || readRouteString(routeData, 'title');
    
    if (titleKey && (titleKey.startsWith('workspace.errors.') || titleKey.startsWith('workspace.auth.'))) {
      this.translate.get(titleKey)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(translatedTitle => {
          this.title.setTitle(translatedTitle || titleKey);
        });
    } else {
      this.title.setTitle(this.brand.defaultTitle);
    }
  }

  /**
   * Get route data from current or parent route
   */
  protected getRouteData(): ErrorRouteData {
    let routeData = this.activatedRoute.snapshot.data as ErrorRouteData;
    
    if (ErrorUtils.isEmpty(routeData)) {
      routeData = (this.activatedRoute.parent?.snapshot.data || {}) as ErrorRouteData;
    }
    
    return routeData;
  }

  /**
   * Create error info using utilities
   * Must be implemented by child components
   */
  protected abstract createErrorInfo(routeData: ErrorRouteData, fallbackInfo?: ErrorInfo): ErrorInfo;

  /**
   * Get background image for the error page
   * Must be implemented by child components
   */
  protected abstract getBackgroundImage(): string;

  /**
   * Navigate to dashboard
   */
  routeToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Go back to previous page
   */
  goBack(): void {
    this.window.history.back();
  }

  /**
   * Retry action
   */
  retry(): void {
    this.errorService.retry();
  }

  /**
   * Get illustration based on theme
   */
  protected getIllustration(lightImage: string, darkImage: string): string {
    return this.isDarkMode() ? darkImage : lightImage;
  }

  /**
   * Create error info with common properties
   */
  protected createBaseErrorInfo(
    code: string,
    titleKey: string,
    messageKey: string,
    icon: string,
    lightIllustration: string,
    darkIllustration: string,
    showRetry: boolean = false,
    showHome: boolean = true,
    showBack: boolean = true,
    routeData: ErrorRouteData = {},
    fallbackInfo?: ErrorInfo
  ): ErrorInfo {
    const routeErrorCode = readRouteString(routeData, 'errorCode');
    const routeTitle = readRouteString(routeData, 'title');
    const routeTitleKey = readRouteString(routeData, 'titleKey');
    const routeDescription = readRouteString(routeData, 'description');
    const routeDescriptionKey = readRouteString(routeData, 'descriptionKey');
    const defaultErrorInfo: ErrorInfo = {
      code,
      title: this.translate.instant(titleKey),
      message: this.translate.instant(messageKey),
      description: '',
      icon,
      illustration: lightIllustration,
      illustrationDark: darkIllustration,
      showRetry,
      showHome,
      showBack,
      homeAction: () => this.router.navigate(['/dashboard']),
      backAction: () => window.history.back(),
      retryAction: () => this.errorService.retry()
    };

    return {
      ...defaultErrorInfo,
      ...(fallbackInfo || {}),
      code: routeErrorCode || defaultErrorInfo.code,
      title: routeTitle || routeTitleKey ? this.translate.instant(routeTitleKey || routeTitle || titleKey) : this.translate.instant(titleKey),
      message: routeDescription || routeDescriptionKey ? this.translate.instant(routeDescriptionKey || routeDescription || messageKey) : this.translate.instant(messageKey),
      description: routeDescription || defaultErrorInfo.description,
      showRetry: ErrorUtils.getBooleanValue(routeData.showRetry, fallbackInfo?.showRetry ?? defaultErrorInfo.showRetry ?? false),
      showHome: ErrorUtils.getBooleanValue(routeData.showHome, fallbackInfo?.showHome ?? defaultErrorInfo.showHome ?? true),
      showBack: ErrorUtils.getBooleanValue(routeData.showBack, fallbackInfo?.showBack ?? defaultErrorInfo.showBack ?? true),
    };
  }
}
