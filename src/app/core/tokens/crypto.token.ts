import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const CRYPTO = new InjectionToken<Crypto>(
  'Crypto',
  {
    factory: (): Crypto => inject(WINDOW).crypto
  }
);
