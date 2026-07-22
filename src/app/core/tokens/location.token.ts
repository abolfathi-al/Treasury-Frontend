import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const LOCATION = new InjectionToken<Location>(
  'Location',
  {
    factory: (): Location => inject(WINDOW).location
  }
);
