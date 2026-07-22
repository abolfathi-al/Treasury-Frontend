import { AppRuntimeConfig } from '@core/config/runtime.config';

export const PROJECT_RUNTIME_CONFIG = {
  appVersion: 'velora-enterprise-0.1.2',
  authStorageKey: 'velora_auth',
  apiUrl: '',
} as const satisfies AppRuntimeConfig;
