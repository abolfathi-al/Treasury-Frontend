import { InjectionToken } from '@angular/core';

export interface AppRuntimeConfig {
  readonly appVersion: string;
  readonly authStorageKey: string;
  readonly apiUrl: string;
}

export const DEFAULT_APP_RUNTIME_CONFIG: AppRuntimeConfig = {
  appVersion: 'enterprise-dashboard-master',
  authStorageKey: 'auth',
  apiUrl: '',
};

export const APP_RUNTIME_CONFIG = new InjectionToken<AppRuntimeConfig>(
  'APP_RUNTIME_CONFIG',
  {
    providedIn: 'root',
    factory: () => DEFAULT_APP_RUNTIME_CONFIG,
  },
);
