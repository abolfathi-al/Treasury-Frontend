import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const HISTORY = new InjectionToken<History>(
  'History',
  {
    factory: (): History => inject(WINDOW).history
  }
);
