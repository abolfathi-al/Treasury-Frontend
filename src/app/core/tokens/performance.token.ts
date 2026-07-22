import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const PERFORMANCE = new InjectionToken<Performance>(
  'Performance',
  {
    factory: (): Performance => inject(WINDOW).performance
  }
);
