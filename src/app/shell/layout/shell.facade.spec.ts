import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { ILayout, LayoutType, ToolbarLayout } from '@core/config/config';
import { LayoutInitService } from '@core/services/layout-init.service';
import { LayoutService } from '@core/services/layout.service';
import { BehaviorSubject, Subject } from 'rxjs';

import { ShellFacade } from './shell.facade';
import { ShellNavigationViewItem } from './navigation/shell-navigation.model';
import { ShellNavigationFacade } from './navigation/shell-navigation.facade';

interface ActivatedRouteStub {
  readonly snapshot?: { readonly data?: Record<string, unknown> };
  firstChild?: ActivatedRouteStub;
}

const layoutConfig: ILayout = {
  app: {
    header: {
      componentName: 'header',
      display: true,
      default: {
        class: 'header-class',
        container: 'fixed',
        containerClass: 'header-container-class',
        content: 'page-title',
        fixed: { desktop: true, mobile: false },
        sticky: {
          enabled: true,
          attributes: { 'data-header': 'sticky' },
        },
        search: { display: true },
        quickPanel: { display: false },
        quickActions: { display: true },
        notifications: { display: true },
        chat: { display: false },
        themMode: { display: true },
        user: { display: true },
        menu: { display: true },
      },
    },
    sidebar: {
      componentName: 'sidebar',
      display: true,
      default: {
        class: 'sidebar-class',
        drawer: {
          enabled: true,
          attributes: { 'data-drawer': 'true' },
        },
        fixed: { desktop: true },
        minimize: {
          desktop: {
            enabled: true,
            default: false,
            hoverable: true,
          },
        },
        push: {
          header: true,
          toolbar: false,
          footer: true,
        },
      },
    },
    sidebarPanel: {
      componentName: 'sidebar-panel',
      display: false,
    },
    toolbar: {
      componentName: 'toolbar',
      display: true,
      layout: 'classic',
      class: 'toolbar-class',
      fixed: { desktop: false, mobile: true },
    },
    content: {
      componentName: 'content',
      container: 'fixed',
    },
    footer: {
      componentName: 'footer',
      display: true,
      container: 'fluid',
      containerClass: 'footer-container-class',
      fixed: { desktop: true, mobile: false },
    },
    pageTitle: {
      componentName: 'page-title',
      display: true,
    },
  },
  scrolltop: {
    componentName: 'scrolltop',
    display: true,
  },
};

const dashboardItem: ShellNavigationViewItem = {
  id: 'dashboard',
  kind: 'link',
  labelKey: 'navigation.menu.dashboard',
  route: '/dashboard',
  activeMatch: 'prefix',
  children: [],
  isActive: true,
  isCurrentPage: true,
  label: 'Dashboard',
};

const managementItem: ShellNavigationViewItem = {
  id: 'management',
  kind: 'link',
  labelKey: 'navigation.menu.management',
  route: '/management',
  activeMatch: 'prefix',
  children: [],
  isActive: false,
  isCurrentPage: false,
  label: 'Management',
};

class LayoutServiceStub {
  readonly defaultLayoutType: LayoutType = 'light-header';
  readonly layoutConfigSubject = new BehaviorSubject<ILayout>(layoutConfig);
  readonly currentLayoutTypeSubject = new BehaviorSubject<LayoutType | null>(
    'dark-sidebar',
  );

  getProp(path: string, config: ILayout = layoutConfig): unknown {
    return path
      .split('.')
      .reduce<unknown>(
        (value, key) =>
          value && typeof value === 'object'
            ? (value as Record<string, unknown>)[key]
            : undefined,
        config,
      );
  }

  getStringCSSClasses(path: string): string {
    return path === 'pageContainer' ? 'page-container-class' : '';
  }

  getBaseLayoutTypeFromLocalStorage(): LayoutType {
    return 'dark-sidebar';
  }
}

describe('ShellFacade', () => {
  let facade: ShellFacade;
  let layout: LayoutServiceStub;
  let initService: jasmine.SpyObj<LayoutInitService>;
  let routerEvents: Subject<unknown>;
  let router: { events: Subject<unknown>; url: string };
  let activatedRoute: ActivatedRouteStub;
  let navigationItems: ReturnType<typeof signal<readonly ShellNavigationViewItem[]>>;

  beforeEach(() => {
    routerEvents = new Subject<unknown>();
    router = {
      events: routerEvents,
      url: '/dashboard',
    };
    activatedRoute = {
      firstChild: {
        snapshot: {
          data: {
            titleKey: 'navigation.menu.dashboard',
            descriptionKey: 'navigation.menu.management',
            layout: 'dark-sidebar',
          },
        },
      },
    };
    navigationItems = signal<readonly ShellNavigationViewItem[]>([
      dashboardItem,
      managementItem,
    ]);
    initService = jasmine.createSpyObj<LayoutInitService>('LayoutInitService', [
      'reInitProps',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ShellFacade,
        { provide: LayoutService, useClass: LayoutServiceStub },
        { provide: LayoutInitService, useValue: initService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: ShellNavigationFacade,
          useValue: {
            currentUrl: signal('/dashboard'),
            menuItems: navigationItems,
          },
        },
      ],
    });

    facade = TestBed.inject(ShellFacade);
    layout = TestBed.inject(LayoutService) as unknown as LayoutServiceStub;
  });

  it('exposes initial shell state from layout, route, and navigation sources', () => {
    expect(facade.isInitialized()).toBeTrue();
    expect(facade.currentLayoutType()).toBe('dark-sidebar');
    expect(facade.currentUrl()).toBe('/dashboard');
    expect(facade.routeMetadata()).toEqual({
      titleKey: 'navigation.menu.dashboard',
      descriptionKey: 'navigation.menu.management',
      layout: 'dark-sidebar',
    });
    expect(facade.appHeaderDisplay()).toBeTrue();
    expect(facade.appSidebarDisplay()).toBeTrue();
    expect(facade.appToolbarLayout()).toBe('classic' satisfies ToolbarLayout);
    expect(facade.mobileSidebarOpen()).toBeFalse();
    expect(facade.sidebarCollapsed()).toBeFalse();
    expect(facade.activeNavigationItem()?.id).toBe('dashboard');
  });

  it('uses the configured default while no current layout is available', () => {
    layout.currentLayoutTypeSubject.next(null);

    expect(facade.currentLayoutType()).toBe('light-header');
  });

  it('centralizes sidebar collapse state updates', () => {
    facade.setSidebarCollapsed(true);

    expect(facade.sidebarCollapsed()).toBeTrue();

    facade.toggleSidebarCollapsed();

    expect(facade.sidebarCollapsed()).toBeFalse();
  });

  it('centralizes mobile sidebar open state updates', () => {
    facade.openMobileSidebar();

    expect(facade.mobileSidebarOpen()).toBeTrue();

    facade.toggleMobileSidebar();

    expect(facade.mobileSidebarOpen()).toBeFalse();

    facade.setMobileSidebarOpen(true);
    facade.closeMobileSidebar();

    expect(facade.mobileSidebarOpen()).toBeFalse();
  });

  it('centralizes shell loading state from router navigation events', () => {
    expect(facade.isLoading()).toBeFalse();

    routerEvents.next(new NavigationStart(1, '/dashboard'));

    expect(facade.isLoading()).toBeTrue();

    routerEvents.next(new NavigationCancel(1, '/dashboard', 'guarded'));

    expect(facade.isLoading()).toBeFalse();

    routerEvents.next(new NavigationStart(2, '/dashboard'));
    routerEvents.next(
      new NavigationError(2, '/dashboard', new Error('failed navigation')),
    );

    expect(facade.isLoading()).toBeFalse();
  });

  it('keeps shell errors as facade-local state', () => {
    expect(facade.error()).toBeNull();

    facade.setError('Shell metadata failed');

    expect(facade.error()).toBe('Shell metadata failed');

    facade.setError(null);

    expect(facade.error()).toBeNull();
  });

  it('prefers the exact current navigation item over an active parent', () => {
    const childItem: ShellNavigationViewItem = {
      id: 'management-child',
      kind: 'link',
      labelKey: 'management.child',
      route: '/management/child',
      activeMatch: 'prefix',
      children: [],
      isActive: true,
      isCurrentPage: true,
      label: 'Management child',
    };
    navigationItems.set([
      {
        ...managementItem,
        isActive: true,
        children: [childItem],
      },
    ]);

    expect(facade.activeNavigationItem()?.id).toBe('management-child');
  });

  it('does not re-filter permission-aware navigation items', () => {
    navigationItems.set([managementItem]);

    expect(facade.menuItems()).toEqual([managementItem]);
  });

  it('syncs shell layout type from shell route metadata without changing routes', () => {
    activatedRoute.firstChild = {
      snapshot: {
        data: {
          layout: 'light-sidebar',
        },
      },
    };

    routerEvents.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

    expect(layout.currentLayoutTypeSubject.value).toBe('light-sidebar');
    expect(initService.reInitProps).toHaveBeenCalledOnceWith('light-sidebar');
  });
});

describe('ShellFacade route metadata startup edge cases', () => {
  it('constructs when an intermediate activated route has no snapshot yet', () => {
    const routerEvents = new Subject<unknown>();
    const initService = jasmine.createSpyObj<LayoutInitService>('LayoutInitService', [
      'reInitProps',
    ]);
    const navigationItems = signal<readonly ShellNavigationViewItem[]>([
      dashboardItem,
    ]);
    const activatedRoute: ActivatedRouteStub = {
      firstChild: {
        firstChild: {
          snapshot: {
            data: {
              titleKey: 'navigation.menu.dashboard',
              layout: 'dark-sidebar',
            },
          },
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ShellFacade,
        { provide: LayoutService, useClass: LayoutServiceStub },
        { provide: LayoutInitService, useValue: initService },
        { provide: Router, useValue: { events: routerEvents, url: '/dashboard' } },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: ShellNavigationFacade,
          useValue: {
            currentUrl: signal('/dashboard'),
            menuItems: navigationItems,
          },
        },
      ],
    });

    const facade = TestBed.inject(ShellFacade);

    expect(facade.routeMetadata()).toEqual({
      titleKey: 'navigation.menu.dashboard',
      descriptionKey: undefined,
      layout: 'dark-sidebar',
    });
  });
});
