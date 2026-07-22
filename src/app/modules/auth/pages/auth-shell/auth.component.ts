import { Component, OnInit, OnDestroy, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT, NgOptimizedImage, NgStyle, NgClass } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { APP_DEFAULT_TITLE } from '@core/config/brand.config';

type AuthRouteData = Record<string, unknown>;

function readRouteString(routeData: AuthRouteData, key: string): string | undefined {
  const value = routeData[key];
  return typeof value === 'string' ? value : undefined;
}

@Component({
  selector: 'vl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle,
    NgClass,
    NgOptimizedImage,
    RouterOutlet,
    RouterLink,
    TranslateModule,
  ]
})
export class AuthComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  private readonly _currentRoute = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _routeData = signal<AuthRouteData>({});

  // Computed values
  readonly currentRoute = computed(() => this._currentRoute());
  readonly isLoginPage = computed(() => this._currentRoute().includes('login'));
  readonly isRegistrationPage = computed(() => this._currentRoute().includes('registration'));
  readonly isForgotPasswordPage = computed(() => this._currentRoute().includes('forgot-password'));
  readonly isLogoutPage = computed(() => this._currentRoute().includes('logout'));

  // Background image based on current route
  readonly backgroundImage = computed(() => {
    const route = this._currentRoute();
    if (route.includes('login')) return 'url(./assets/media/misc/auth-bg.webp)';
    if (route.includes('registration')) return 'url(./assets/media/misc/bg-2.webp)';
    if (route.includes('forgot-password')) return 'url(./assets/media/misc/city.webp)';
    if (route.includes('logout')) return 'url(./assets/media/misc/outdoor.webp)';
    return 'url(./assets/media/misc/auth-bg.webp)';
  });

  // Page title from route data
  readonly pageTitle = computed(() => {
    return this.getRouteDataString('title') || 'احراز هویت';
  });

  // Page description from route data
  readonly pageDescription = computed(() => {
    return this.getRouteDataString('description') || 'یک نرم افزار حسابداری آنلاین و تحت وب است که امور مالی کسب و کار شما را مدیریت می کند';
  });

  // Injected dependencies
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to track route changes
    effect(() => {
      this._isLoading.set(false);
    });
  }

  ngOnInit(): void {
    // Track route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).url),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(url => {
        this._currentRoute.set(url);
        this._isLoading.set(true);
      });

    // Track route data changes
    this.activatedRoute.firstChild?.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        const routeData = data as AuthRouteData;
        this._routeData.set(routeData);
        this.setPageTitle(routeData);
      });

    // Set initial route and data
    this._currentRoute.set(this.router.url);
    const initialData = (this.activatedRoute.firstChild?.snapshot.data || {}) as AuthRouteData;
    this._routeData.set(initialData);
    this.setPageTitle(initialData);
  }

  ngOnDestroy(): void {
    // Cleanup handled by takeUntilDestroyed
  }

  // Method to handle loading state
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // Get additional route data properties
  getRouteData(property: string): unknown {
    const routeData = this._routeData();
    return routeData[property];
  }

  private getRouteDataString(property: string): string | undefined {
    return readRouteString(this._routeData(), property);
  }

  // Get breadcrumb from route data
  readonly breadcrumb = computed(() => {
    return this.getRouteDataString('breadcrumb') || '';
  });

  // Get keywords from route data
  readonly keywords = computed(() => {
    return this.getRouteDataString('keywords') || '';
  });

  /**
   * Set page title based on route data
   */
  private setPageTitle(routeData: AuthRouteData): void {
    const titleKey = readRouteString(routeData, 'titleKey') || readRouteString(routeData, 'title');

    if (titleKey && (titleKey.startsWith('workspace.errors.') || titleKey.startsWith('workspace.auth.'))) {
      this.translate.get(titleKey)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(translatedTitle => {
          this.title.setTitle(translatedTitle || titleKey);
        });
    } else {
      this.title.setTitle(APP_DEFAULT_TITLE);
    }
  }
}
