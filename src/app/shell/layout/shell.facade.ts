import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Data,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { ILayout, LayoutType, ToolbarLayout } from '@core/config/config';
import { LayoutInitService } from '@core/services/layout-init.service';
import { LayoutService } from '@core/services/layout.service';
import { filter, map, startWith } from 'rxjs';

import {
  ShellNavigationViewItem,
} from './navigation/shell-navigation.model';
import { ShellNavigationFacade } from './navigation/shell-navigation.facade';

const DEFAULT_TOOLBAR_LAYOUT = 'classic' satisfies ToolbarLayout;

const CONTAINER_CLASSES = {
  FIXED: 'container-fluid',
  FLUID: 'container',
} as const;

export interface ShellRouteMetadata {
  readonly titleKey?: string;
  readonly descriptionKey?: string;
  readonly layout?: LayoutType;
}

@Injectable()
export class ShellFacade {
  private readonly layout = inject(LayoutService);
  private readonly initService = inject(LayoutInitService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly navigation = inject(ShellNavigationFacade);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _sidebarCollapsed = signal(false);
  private readonly _mobileSidebarOpen = signal(false);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly layoutConfigSignal = toSignal(
    this.layout.layoutConfigSubject,
    { initialValue: this.layout.layoutConfigSubject.value },
  );
  private readonly currentLayoutTypeSignal = toSignal(
    this.layout.currentLayoutTypeSubject,
    { initialValue: this.layout.currentLayoutTypeSubject.value },
  );
  private readonly routeMetadataSignal = toSignal(
    this.router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError,
      ),
      map(() => this.readRouteMetadata()),
      startWith(this.readRouteMetadata()),
    ),
    { initialValue: this.readRouteMetadata() },
  );

  readonly headerStickyOffset = { default: '200px', lg: '0' } as const;
  readonly drawerActivateOnMobile = { default: true, lg: false } as const;
  readonly sidebarDrawerWidth = '225px';
  readonly sidebarDrawerDirection = 'start';
  readonly sidebarDrawerName = 'app-sidebar';
  readonly mobileSidebarToggleSelector = '#velora_app_sidebar_mobile_toggle';
  readonly headerMenuDrawerDirection = 'end';
  readonly headerMenuDrawerName = 'app-header-menu';
  readonly headerMenuToggleSelector = '#velora_app_header_menu_toggle';
  readonly headerMenuSwapperMode = { default: 'append', lg: 'prepend' } as const;
  readonly headerMenuSwapperParents = {
    default: '#velora_app_body',
    lg: '#velora_app_header_wrapper',
  } as const;

  readonly layoutConfig = computed(() => this.layoutConfigSignal());
  readonly currentLayoutType = computed(
    () => this.currentLayoutTypeSignal() ?? this.layout.defaultLayoutType,
  );
  readonly isInitialized = computed(() => Boolean(this.layoutConfig()));
  readonly error = computed(() => this._error());
  readonly isLoading = computed(() => this._isLoading());
  readonly currentUrl = computed(() => this.navigation.currentUrl());
  readonly menuItems = computed(() => this.navigation.menuItems());
  readonly routeMetadata = computed(() => this.routeMetadataSignal());
  readonly activeNavigationItem = computed(() =>
    findActiveNavigationItem(this.menuItems()),
  );
  readonly sidebarCollapsed = computed(() => this._sidebarCollapsed());
  readonly mobileSidebarOpen = computed(() => this._mobileSidebarOpen());

  readonly pageContainerCSSClasses = computed(() =>
    this.layout.getStringCSSClasses('pageContainer'),
  );

  readonly appHeaderDefaultClass = computed(
    () => this.layoutStringProp('app.header.default.class'),
  );
  readonly appHeaderDisplay = computed(() =>
    this.layoutBooleanProp('app.header.display'),
  );
  readonly appHeaderDefaultStickyEnabled = computed(() =>
    this.layoutBooleanProp('app.header.default.sticky.enabled'),
  );
  readonly appHeaderDefaultStickyAttributes = computed(() =>
    this.layoutRecordProp('app.header.default.sticky.attributes'),
  );
  readonly appHeaderDefaultMinimizeEnabled = computed(() =>
    this.layoutBooleanProp('app.header.default.minimize.enabled'),
  );
  readonly appHeaderDefaultMinimizeAttributes = computed(() =>
    this.layoutRecordProp('app.header.default.minimize.attributes'),
  );
  readonly appHeaderDefaultFixedDesktop = computed(() =>
    this.layoutBooleanProp('app.header.default.fixed.desktop'),
  );
  readonly appHeaderDefaultFixedMobile = computed(() =>
    this.layoutBooleanProp('app.header.default.fixed.mobile'),
  );
  readonly appHeaderDefaultContainer = computed(
    () =>
      this.layout.getProp('app.header.default.container', this.layoutConfig()) as
        | 'fixed'
        | 'fluid'
        | undefined,
  );
  readonly appHeaderDefaultContainerClass = computed(() =>
    this.layoutStringProp('app.header.default.containerClass'),
  );
  readonly headerContainerCssClass = computed(() => {
    const baseClass = this.appHeaderDefaultContainerClass();
    const container = this.appHeaderDefaultContainer();

    if (container === 'fixed') {
      return `${baseClass} container-xxl`.trim();
    }

    if (container === 'fluid') {
      return `${baseClass} container-fluid`.trim();
    }

    return baseClass;
  });
  readonly appHeaderDefaultStacked = computed(() =>
    this.layoutBooleanProp('app.header.default.stacked'),
  );
  readonly appHeaderDefaultLoginRegisterDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.loginRegister.display'),
  );
  readonly appHeaderDefaultContent = computed(() =>
    this.layoutStringProp('app.header.default.content'),
  );
  readonly appHeaderDefaultSearchDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.search.display'),
  );
  readonly appHeaderDefaultQuickPanelDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.quickPanel.display'),
  );
  readonly appHeaderDefaultQuickActionsDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.quickActions.display'),
  );
  readonly appHeaderDefaultNotificationsDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.notifications.display'),
  );
  readonly appHeaderDefaultChatDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.chat.display'),
  );
  readonly appHeaderDefaultThemModeDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.themMode.display'),
  );
  readonly appHeaderDefaultUserDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.user.display'),
  );
  readonly appHeaderDefaultMenuDisplay = computed(() =>
    this.layoutBooleanProp('app.header.default.menu.display'),
  );
  readonly appPageTitleDisplay = computed(() =>
    this.layoutBooleanProp('app.pageTitle.display'),
  );

  readonly appToolbarDisplay = computed(() =>
    this.layoutBooleanProp('app.toolbar.display'),
  );
  readonly appToolbarLayout = computed(
    () =>
      (this.layout.getProp(
        'app.toolbar.layout',
        this.layoutConfig(),
      ) as ToolbarLayout | undefined) ?? DEFAULT_TOOLBAR_LAYOUT,
  );
  readonly appToolbarCSSClass = computed(() =>
    this.layoutStringProp('app.toolbar.class'),
  );
  readonly appToolbarSwapEnabled = computed(() =>
    this.layoutBooleanProp('app.toolbar.swap.enabled'),
  );
  readonly appToolbarSwapAttributes = computed(() =>
    this.layoutRecordProp('app.toolbar.swap.attributes'),
  );
  readonly appToolbarStickyEnabled = computed(() =>
    this.layoutBooleanProp('app.toolbar.sticky.enabled'),
  );
  readonly appToolbarStickyAttributes = computed(() =>
    this.layoutRecordProp('app.toolbar.sticky.attributes'),
  );
  readonly appToolbarMinimizeEnabled = computed(() =>
    this.layoutBooleanProp('app.toolbar.minimize.enabled'),
  );
  readonly appToolbarMinimizeAttributes = computed(() =>
    this.layoutRecordProp('app.toolbar.minimize.attributes'),
  );

  readonly appContentContainer = computed(
    () =>
      this.layout.getProp('app.content.container', this.layoutConfig()) as
        | 'fixed'
        | 'fluid'
        | undefined,
  );
  readonly appContentContainerClass = computed(() =>
    this.layoutStringProp('app.content.containerClass'),
  );
  readonly contentCSSClasses = computed(() =>
    this.layoutStringProp('app.content.class'),
  );
  readonly contentContainerCSSClass = computed(() => {
    const container = this.appContentContainer();
    const containerClass = this.appContentContainerClass();

    if (container === 'fixed') {
      return containerClass || CONTAINER_CLASSES.FIXED;
    }

    return containerClass || CONTAINER_CLASSES.FLUID;
  });

  readonly appSidebarDefaultClass = computed(() =>
    this.layoutStringProp('app.sidebar.default.class'),
  );
  readonly appSidebarDefaultDrawerEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.drawer.enabled'),
  );
  readonly appSidebarDefaultDrawerAttributes = computed(() =>
    this.layoutRecordProp('app.sidebar.default.drawer.attributes'),
  );
  readonly appSidebarDisplay = computed(() =>
    this.layoutBooleanProp('app.sidebar.display'),
  );
  readonly appSidebarDefaultStickyEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.sticky.enabled'),
  );
  readonly appSidebarDefaultStickyAttributes = computed(() =>
    this.layoutRecordProp('app.sidebar.default.sticky.attributes'),
  );
  readonly appSidebarPanelDisplay = computed(() =>
    this.layoutBooleanProp('app.sidebar-panel.display'),
  );
  readonly appSidebarDefaultFixedDesktop = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.fixed.desktop'),
  );
  readonly appSidebarDefaultMinimizeDesktopEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.desktop.enabled'),
  );
  readonly appSidebarDefaultMinimizeDesktopDefault = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.desktop.default'),
  );
  readonly appSidebarDefaultMinimizeDesktopHoverable = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.desktop.hoverable'),
  );
  readonly appSidebarDefaultMinimizeMobileEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.mobile.enabled'),
  );
  readonly appSidebarDefaultMinimizeMobileDefault = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.mobile.default'),
  );
  readonly appSidebarDefaultMinimizeMobileHoverable = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.minimize.mobile.hoverable'),
  );
  readonly appSidebarDefaultCollapseDesktopEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.collapse.desktop.enabled'),
  );
  readonly appSidebarDefaultCollapseDesktopDefault = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.collapse.desktop.default'),
  );
  readonly appSidebarDefaultCollapseMobileEnabled = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.collapse.mobile.enabled'),
  );
  readonly appSidebarDefaultCollapseMobileDefault = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.collapse.mobile.default'),
  );
  readonly appSidebarDefaultPushHeader = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.push.header'),
  );
  readonly appSidebarDefaultPushToolbar = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.push.toolbar'),
  );
  readonly appSidebarDefaultPushFooter = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.push.footer'),
  );
  readonly appSidebarDefaultPush = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.push'),
  );
  readonly appSidebarDefaultStacked = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.stacked'),
  );
  readonly appSidebarDefaultMinimizeDefault = computed(() =>
    this.layoutBooleanProp('app.sidebar.default.desktop.default'),
  );
  readonly sidebarToggleButtonClass = computed(() =>
    this.appSidebarDefaultMinimizeDefault() ? 'active' : '',
  );
  readonly sidebarToggleEnabled = computed(
    () =>
      this.appSidebarDefaultMinimizeDesktopEnabled() ||
      this.appSidebarDefaultCollapseDesktopEnabled(),
  );
  readonly sidebarToggleType = computed(() => {
    if (this.appSidebarDefaultMinimizeDesktopEnabled()) {
      return 'minimize';
    }

    if (this.appSidebarDefaultCollapseDesktopEnabled()) {
      return 'collapse';
    }

    return '';
  });
  readonly sidebarToggleState = computed(() => {
    if (this.appSidebarDefaultMinimizeDesktopEnabled()) {
      return 'active';
    }

    if (this.appSidebarDefaultCollapseDesktopEnabled()) {
      return '';
    }

    return '';
  });

  readonly appFooterDisplay = computed(
    () => this.layout.getProp('app.footer.display', this.layoutConfig()) !== false,
  );
  readonly appFooterCSSClass = computed(() =>
    this.layoutStringProp('app.footer.class'),
  );
  readonly appFooterContainer = computed(() =>
    this.layoutStringProp('app.footer.container'),
  );
  readonly appFooterContainerCSSClass = computed(() => {
    const container = this.appFooterContainer() as 'fixed' | 'fluid';
    const containerClass = this.layoutStringProp('app.footer.containerClass');

    if (container === 'fixed') {
      return containerClass || CONTAINER_CLASSES.FIXED;
    }

    return containerClass || CONTAINER_CLASSES.FLUID;
  });
  readonly appFooterFixedDesktop = computed(() =>
    this.layoutBooleanProp('app.footer.fixed.desktop'),
  );
  readonly appFooterFixedMobile = computed(() =>
    this.layoutBooleanProp('app.footer.fixed.mobile'),
  );
  readonly scrolltopDisplay = computed(() =>
    this.layoutBooleanProp('scrolltop.display'),
  );

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this._isLoading.set(true);
          return;
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this._isLoading.set(false);
        }

        if (event instanceof NavigationEnd) {
          this.syncLayoutTypeFromCurrentRoute();
        }
      });

    this.destroyRef.onDestroy(() => this._isLoading.set(false));
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this._sidebarCollapsed.set(collapsed);
  }

  toggleSidebarCollapsed(): void {
    this._sidebarCollapsed.update((collapsed) => !collapsed);
  }

  setMobileSidebarOpen(open: boolean): void {
    this._mobileSidebarOpen.set(open);
  }

  openMobileSidebar(): void {
    this.setMobileSidebarOpen(true);
  }

  closeMobileSidebar(): void {
    this.setMobileSidebarOpen(false);
  }

  toggleMobileSidebar(): void {
    this._mobileSidebarOpen.update((open) => !open);
  }

  setError(message: string | null): void {
    this._error.set(message);
  }

  syncLayoutTypeFromCurrentRoute(): void {
    try {
      const currentLayoutType = this.layout.currentLayoutTypeSubject.value;
      const nextLayoutType =
        this.readRouteMetadata().layout ??
        this.layout.getBaseLayoutTypeFromLocalStorage();

      if (currentLayoutType !== nextLayoutType || !currentLayoutType) {
        this.layout.currentLayoutTypeSubject.next(nextLayoutType);
        this.initService.reInitProps(nextLayoutType);
      }
    } catch (error) {
      this._error.set(`Router event handling failed: ${error}`);
    }
  }

  private layoutBooleanProp(path: string): boolean {
    return Boolean(this.layout.getProp(path, this.layoutConfig()));
  }

  private layoutStringProp(path: string): string {
    return (this.layout.getProp(path, this.layoutConfig()) as string) || '';
  }

  private layoutRecordProp(path: string): { [attrName: string]: string } {
    return (
      (this.layout.getProp(path, this.layoutConfig()) as {
        [attrName: string]: string;
      }) || {}
    );
  }

  private readRouteMetadata(): ShellRouteMetadata {
    const data = this.readDeepestRouteData();

    return {
      titleKey: data['titleKey'] as string | undefined,
      descriptionKey: data['descriptionKey'] as string | undefined,
      layout: isLayoutType(data['layout']) ? data['layout'] : undefined,
    };
  }

  private readDeepestRouteData(): Data {
    let route = this.activatedRoute.firstChild;
    let data: Data = route?.snapshot?.data ?? {};

    while (route?.firstChild) {
      route = route.firstChild;
      data = route.snapshot?.data ?? data;
    }

    return data;
  }
}

function findActiveNavigationItem(
  items: readonly ShellNavigationViewItem[],
): ShellNavigationViewItem | null {
  for (const item of items) {
    const child = findActiveNavigationItem(item.children);

    if (child?.isCurrentPage) {
      return child;
    }

    if (item.isCurrentPage) {
      return item;
    }

    if (child?.isActive) {
      return child;
    }
  }

  return items.find((item) => item.isActive) ?? null;
}

function isLayoutType(value: unknown): value is LayoutType {
  return (
    value === 'dark-sidebar' ||
    value === 'light-sidebar' ||
    value === 'dark-header' ||
    value === 'light-header'
  );
}
