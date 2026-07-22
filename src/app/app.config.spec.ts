import { LOCALE_ID, Provider, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { withInterceptors } from '@angular/common/http';

import {
  ActiveAccessContextFacade,
  ActorContextFacade,
  AuthFacade,
  CONTEXT_DEMO_MODE_ENABLED,
  demoContextProviders,
  OrganizationContextFacade,
  UiCapabilityFacade,
} from '@core/state/context';
import { APP_BRAND } from '@core/config/brand.config';
import { LayoutService } from '@core/services/layout.service';
import { THEME_MODE_CONFIG } from '@core/services/theme-mode.model';
import { PROJECT_BRAND } from './project/brand/project-brand.config';
import { PROJECT_LOCALE } from './project/locale/project-locale.config';
import { PROJECT_THEME_MODE } from './project/theme/project-theme.config';
import { getAppProviders, layoutStorageSetup } from './app.config';

interface ClassProviderRecord {
  readonly provide: unknown;
  readonly useClass: unknown;
}

function classProviderRecords(
  providers: readonly (Provider | unknown)[],
): ClassProviderRecord[] {
  return providers.filter(
    (provider): provider is ClassProviderRecord =>
      typeof provider === 'object' &&
      provider !== null &&
      'provide' in provider &&
      'useClass' in provider,
  );
}

class LayoutServiceProbe {
  static constructed = 0;

  constructor() {
    LayoutServiceProbe.constructed += 1;
  }
}

describe('getAppProviders shell context providers', () => {
  it('includes the demo context providers selected by the shell context config', () => {
    const appProviders = getAppProviders({
      isServer: true,
      includeBrowserOnlyInitializers: false,
      includeClientHydration: false,
      includeServiceWorker: false,
    });
    const appClassProviders = classProviderRecords(appProviders);
    const demoClassProviders = classProviderRecords(demoContextProviders);

    expect(demoClassProviders.length).toBe(
      CONTEXT_DEMO_MODE_ENABLED ? 5 : 0,
    );

    for (const demoProvider of demoClassProviders) {
      expect(appClassProviders).toContain(
        jasmine.objectContaining({
          provide: demoProvider.provide,
          useClass: demoProvider.useClass,
        }),
      );
    }
  });

  it('initializes layout storage through the browser startup hook', async () => {
    LayoutServiceProbe.constructed = 0;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: LayoutService, useClass: LayoutServiceProbe },
      ],
    });

    await TestBed.runInInjectionContext(layoutStorageSetup);

    expect(LayoutServiceProbe.constructed).toBe(1);
  });

  it('keeps context provider tokens limited to shell demo context facades', () => {
    const providerTokens = classProviderRecords(demoContextProviders).map(
      (provider) => provider.provide,
    );

    expect(providerTokens).toEqual(
      CONTEXT_DEMO_MODE_ENABLED
        ? [
            AuthFacade,
            OrganizationContextFacade,
            ActiveAccessContextFacade,
            ActorContextFacade,
            UiCapabilityFacade,
          ]
        : [],
    );
  });

  it('provides consumer-owned application configuration', () => {
    const appProviders = getAppProviders({
      isServer: true,
      includeBrowserOnlyInitializers: false,
      includeClientHydration: false,
      includeServiceWorker: false,
    });

    expect(appProviders).toContain(
      jasmine.objectContaining({
        provide: APP_BRAND,
        useValue: PROJECT_BRAND,
      }),
    );
    expect(appProviders).toContain(
      jasmine.objectContaining({
        provide: LOCALE_ID,
        useValue: PROJECT_LOCALE.id,
      }),
    );
    expect(appProviders).toContain(
      jasmine.objectContaining({
        provide: THEME_MODE_CONFIG,
        useValue: PROJECT_THEME_MODE,
      }),
    );
  });

  it('accepts typed HTTP client features supplied by app composition tests', () => {
    const providers = getAppProviders({
      isServer: true,
      includeBrowserOnlyInitializers: false,
      includeClientHydration: false,
      includeServiceWorker: false,
      httpClientFeatures: [withInterceptors([])],
    });

    expect(providers.length).toBeGreaterThan(0);
  });
});
