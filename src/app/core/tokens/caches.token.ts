import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const CACHES = new InjectionToken<CacheStorage>(
  'CacheStorage',
  {
    factory: (): CacheStorage => inject(WINDOW).caches
  }
);
