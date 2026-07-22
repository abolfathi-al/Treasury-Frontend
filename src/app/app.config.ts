import { registerLocaleData } from '@angular/common';
import {
  HttpFeature,
  HttpFeatureKind,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  Provider,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { AUTH_SESSION } from '@core/auth';
import { APP_BRAND } from '@core/config/brand.config';
import { APP_DEFAULT_LAYOUT_TYPE } from '@core/config/config';
import { ERROR_REPORTER, ErrorReporterPort } from '@core/errors';
import { LANGUAGE_SERVICE } from '@core/i18n';
import {
  backForwardCacheSetup,
  getUserByToken,
  languageDirectionSetup,
  legacyStorageCleanupSetup,
  swCheckForUpdate,
  themeModeSetup,
} from '@core/initializers';
import { LayoutService } from '@core/services/layout.service';
import { THEME_MODE_CONFIG } from '@core/services/theme-mode.model';
import { demoContextProviders } from '@core/state/context';
import {
  authInterceptor,
  browserStateInterceptor,
  cacheInterceptor,
  convertInterceptor,
  errorInterceptor,
  headerInterceptor,
  httpsInterceptor,
  loaderInterceptor,
  mockApiInterceptor,
  notifyInterceptor,
  profilerInterceptor,
  serverStateInterceptor,
  timeoutInterceptor,
} from '@core/interceptors';
import { PAGE_NAVIGATION_ITEMS } from '@core/navigation';
import { CustomTitleStrategy } from '@core/strategies';
import { PROJECT_BRAND } from './project/brand/project-brand.config';
import { PROJECT_LOCALE } from './project/locale/project-locale.config';
import { PROJECT_DEFAULT_LAYOUT_TYPE } from './project/layout/project-layout.config';
import { PROJECT_NAVIGATION_ITEMS } from './project/navigation/project-navigation.config';
import { PROJECT_ROUTES } from './project/routing/project.routes';
import { PROJECT_THEME_MODE } from './project/theme/project-theme.config';
import { AuthService } from './modules/auth/data-access/auth.service';
import { ErrorService } from './modules/errors/data-access/error.service';
import { ErrorUtils } from './modules/errors/data-access/error.utils';
import { ErrorCode as FeatureErrorCode } from './modules/errors/models/error.types';
import { TranslationService } from './modules/i18n/translation.service';
import { environment } from '../environments/environment';

const APP_CONFIG_CONSTANTS = {
  SERVICE_WORKER_SCRIPT: 'ngsw-worker.js',
  SERVICE_WORKER_REGISTRATION_STRATEGY: 'registerWhenStable' as const,
  ROUTER_CONFIG: {
    URL_UPDATE_STRATEGY: 'deferred' as const,
    ON_SAME_URL_NAVIGATION: 'ignore' as const,
    SCROLL_POSITION_RESTORATION: 'enabled' as const,
    ANCHOR_SCROLLING: 'enabled' as const,
  },
  INTERCEPTOR_KEYS: {
    HTTPS: 'https',
    CONVERT: 'convert',
    CACHE: 'cache',
    HEADER: 'header',
    AUTH: 'auth',
    LOADER: 'loader',
    NOTIFY: 'notify',
  },
} as const;

export interface AppProvidersConfig {
  isServer?: boolean;
  includeServiceWorker?: boolean;
  includeBrowserOnlyInitializers?: boolean;
  includeClientHydration?: boolean;
  httpClientFeatures?: HttpFeature<HttpFeatureKind>[];
}

let hasRegisteredLocale = false;

function ensureLocaleData(): void {
  if (hasRegisteredLocale) {
    return;
  }

  registerLocaleData(PROJECT_LOCALE.data, PROJECT_LOCALE.id);
  hasRegisteredLocale = true;
}

function buildInterceptors(
  includeBrowserOnlyInitializers: boolean
): HttpInterceptorFn[] {
  const interceptors: HttpInterceptorFn[] = [];

  // if (isDevMode()) {
  interceptors.push(mockApiInterceptor);
  // }

  if (includeBrowserOnlyInitializers) {
    interceptors.push(browserStateInterceptor);
  }
  interceptors.push(serverStateInterceptor);

  const interceptorMap = new Map<string, HttpInterceptorFn>([
    [APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.HTTPS, httpsInterceptor],
    [APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.CONVERT, convertInterceptor],
    [APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.CACHE, cacheInterceptor],
    [APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.HEADER, headerInterceptor],
    [APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.AUTH, authInterceptor],
  ]);

  for (const [key, interceptor] of interceptorMap) {
    if (environment.interceptorsPaths?.get(key)) {
      interceptors.push(interceptor);
    }
  }

  if (
    environment.interceptorsPaths?.get(
      APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.LOADER
    )
  ) {
    interceptors.push(loaderInterceptor);
  }

  interceptors.push(timeoutInterceptor);

  if (!environment.production) {
    interceptors.push(profilerInterceptor);
  }

  if (
    environment.interceptorsPaths?.get(
      APP_CONFIG_CONSTANTS.INTERCEPTOR_KEYS.NOTIFY
    )
  ) {
    interceptors.push(notifyInterceptor);
  }

  interceptors.push(errorInterceptor);

  return interceptors;
}

export function layoutStorageSetup(): Promise<string> {
  inject(LayoutService);
  return Promise.resolve('Layout storage ready');
}

function buildInitializers(
  includeBrowserOnlyInitializers: boolean,
  includeServiceWorker: boolean
): (Provider | EnvironmentProviders)[] {
  const initializers: (Provider | EnvironmentProviders)[] = [
    provideAppInitializer(legacyStorageCleanupSetup),
    provideAppInitializer(languageDirectionSetup),
  ];

  if (!includeBrowserOnlyInitializers) {
    return initializers;
  }

  initializers.push(provideAppInitializer(layoutStorageSetup));
  initializers.push(provideAppInitializer(themeModeSetup));

  initializers.push(
    provideAppInitializer(() => {
      getUserByToken();
      return Promise.resolve();
    })
  );

  if (includeServiceWorker) {
    initializers.push(
      provideAppInitializer(() => {
        swCheckForUpdate();
        return Promise.resolve();
      })
    );
  }

  initializers.push(
    provideAppInitializer(() => {
      backForwardCacheSetup();
      return Promise.resolve();
    })
  );

  return initializers;
}

function buildRouterProviders(): Provider | EnvironmentProviders {
  return provideRouter(
    PROJECT_ROUTES,
    withRouterConfig({
      urlUpdateStrategy: APP_CONFIG_CONSTANTS.ROUTER_CONFIG.URL_UPDATE_STRATEGY,
      onSameUrlNavigation:
        APP_CONFIG_CONSTANTS.ROUTER_CONFIG.ON_SAME_URL_NAVIGATION,
    }),
    withInMemoryScrolling({
      scrollPositionRestoration:
        APP_CONFIG_CONSTANTS.ROUTER_CONFIG.SCROLL_POSITION_RESTORATION,
      anchorScrolling: APP_CONFIG_CONSTANTS.ROUTER_CONFIG.ANCHOR_SCROLLING,
    })
  );
}

function buildModuleProviders(): (Provider | EnvironmentProviders)[] {
  return [
    importProvidersFrom(TranslateModule.forRoot()),
    importProvidersFrom(ToastrModule.forRoot()),
  ];
}

function buildServiceWorkerProvider(
  includeServiceWorker: boolean
): (Provider | EnvironmentProviders)[] {
  if (!includeServiceWorker) {
    return [];
  }

  return [
    importProvidersFrom(
      ServiceWorkerModule.register(APP_CONFIG_CONSTANTS.SERVICE_WORKER_SCRIPT, {
        enabled: environment.production,
        registrationStrategy:
          APP_CONFIG_CONSTANTS.SERVICE_WORKER_REGISTRATION_STRATEGY,
      })
    ),
  ];
}

function buildErrorReporter(): ErrorReporterPort {
  const errorService = inject(ErrorService);

  return {
    isCriticalError: (error) => ErrorUtils.isCriticalError(error),
    getUserFriendlyMessage: (error) => ErrorUtils.getUserFriendlyMessage(error),
    navigateToError: (errorCode, context) =>
      errorService.navigateToError(errorCode as FeatureErrorCode, context),
  };
}

export function getAppProviders(
  config: AppProvidersConfig = {}
): (Provider | EnvironmentProviders)[] {
  ensureLocaleData();

  const {
    isServer = false,
    includeServiceWorker = !isServer && environment.production,
    includeBrowserOnlyInitializers = !isServer,
    includeClientHydration = !isServer && environment.production,
    httpClientFeatures = [],
  } = config;

  const interceptors = buildInterceptors(includeBrowserOnlyInitializers);
  const initializers = buildInitializers(
    includeBrowserOnlyInitializers,
    includeServiceWorker
  );

  return [
    provideZonelessChangeDetection(),
    buildRouterProviders(),
    provideHttpClient(...httpClientFeatures, withInterceptors(interceptors)),
    ...(!isServer ? [importProvidersFrom(BrowserModule)] : []),
    ...(includeClientHydration
      ? [provideClientHydration(withIncrementalHydration())]
      : []),
    ...buildModuleProviders(),
    ...demoContextProviders,
    {
      provide: AUTH_SESSION,
      useExisting: AuthService,
    },
    {
      provide: APP_BRAND,
      useValue: PROJECT_BRAND,
    },
    {
      provide: APP_DEFAULT_LAYOUT_TYPE,
      useValue: PROJECT_DEFAULT_LAYOUT_TYPE,
    },
    {
      provide: PAGE_NAVIGATION_ITEMS,
      useValue: PROJECT_NAVIGATION_ITEMS,
    },
    {
      provide: THEME_MODE_CONFIG,
      useValue: PROJECT_THEME_MODE,
    },
    {
      provide: ERROR_REPORTER,
      useFactory: buildErrorReporter,
    },
    {
      provide: LANGUAGE_SERVICE,
      useExisting: TranslationService,
    },
    ...buildServiceWorkerProvider(includeServiceWorker),
    {
      provide: LOCALE_ID,
      useValue: PROJECT_LOCALE.id,
    },
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
    ...initializers,
  ];
}
