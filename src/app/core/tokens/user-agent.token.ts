import { inject, InjectionToken } from '@angular/core';
import { NAVIGATOR } from './navigator.token';

export const USER_AGENT = new InjectionToken<string>(
  'UserAgent',
  {
    factory: (): string => inject(NAVIGATOR).userAgent
  }
);
