import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const NAVIGATOR = new InjectionToken<Navigator>(
  'Navigator',
  {
    factory: (): Navigator => inject(WINDOW).navigator
  }
);
