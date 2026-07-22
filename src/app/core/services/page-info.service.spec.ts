import { DOCUMENT } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

import { DEFAULT_APP_BRAND } from '@core/config/brand.config';
import { PAGE_NAVIGATION_ITEMS, PageNavigationItem } from '@core/navigation';
import { PageInfoService } from './page-info.service';

const translations: Record<string, string> = {
  'workspace.baseDataManagement.title': 'Base Data',
  'workspace.baseDataManagement.subtitle': 'Manage base reference data',
  'workspace.workspaceDashboard.title': 'Workspace',
};

const testNavigationItems = [
  {
    id: 'workspace',
    kind: 'link',
    labelKey: 'workspace.workspaceDashboard.title',
    route: '/workspace-management',
    activeMatch: 'prefix',
  },
] as const satisfies readonly PageNavigationItem[];

class TranslateServiceStub {
  instant(key: string): string {
    return translations[key] ?? key;
  }

  get(key: string) {
    return of(this.instant(key));
  }
}

describe('PageInfoService', () => {
  let service: PageInfoService;
  let routerEvents: Subject<unknown>;
  let router: {
    events: Subject<unknown>;
    url: string;
    routerState: { snapshot: { root: any } };
  };
  let title: Title;
  let documentRef: Document;
  let testHost: HTMLElement;

  beforeEach(() => {
    routerEvents = new Subject<unknown>();
    router = {
      events: routerEvents,
      url: '/workspace-management/base-data',
      routerState: {
        snapshot: {
          root: {
            data: {},
            firstChild: {
              data: {
                titleKey: 'workspace.baseDataManagement.title',
                descriptionKey: 'workspace.baseDataManagement.subtitle',
              },
              firstChild: null,
            },
          },
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PageInfoService,
        Title,
        { provide: Router, useValue: router },
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: PAGE_NAVIGATION_ITEMS, useValue: testNavigationItems },
      ],
    });

    service = TestBed.inject(PageInfoService);
    title = TestBed.inject(Title);
    documentRef = TestBed.inject(DOCUMENT);
    testHost = documentRef.createElement('div');
    testHost.id = 'unrelated-shell-node';
    documentRef.body.appendChild(testHost);
  });

  afterEach(() => {
    testHost.remove();
  });

  it('initializes title and description from shell route translation metadata', () => {
    service.init();

    expect(service.titleSubject.value).toBe(
      `Base Data${DEFAULT_APP_BRAND.titleSeparator}${DEFAULT_APP_BRAND.defaultTitle}`,
    );
    expect(service.descriptionSubject.value).toBe('Manage base reference data');
    expect(title.getTitle()).toBe(
      `Base Data${DEFAULT_APP_BRAND.titleSeparator}${DEFAULT_APP_BRAND.defaultTitle}`,
    );
  });

  it('derives breadcrumbs from typed shell navigation without menu DOM', () => {
    service.init();

    expect(service.breadcrumbsSubject.value).toEqual([
      {
        title: 'Workspace',
        path: '/workspace-management',
        isActive: false,
      },
    ]);
  });

  it('updates metadata on navigation end', () => {
    service.init();
    router.url = '/dashboard';
    router.routerState.snapshot.root.firstChild = {
      data: {
        titleKey: 'workspace.dashboard.title',
        descriptionKey: 'workspace.dashboard.description',
      },
      firstChild: null,
    };
    translations['workspace.dashboard.title'] = 'Dashboard';
    translations['workspace.dashboard.description'] = 'Workspace overview';

    routerEvents.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

    expect(service.titleSubject.value).toBe(
      `Dashboard${DEFAULT_APP_BRAND.titleSeparator}${DEFAULT_APP_BRAND.defaultTitle}`,
    );
    expect(service.descriptionSubject.value).toBe('Workspace overview');
    expect(service.breadcrumbsSubject.value).toEqual([]);
  });
});
