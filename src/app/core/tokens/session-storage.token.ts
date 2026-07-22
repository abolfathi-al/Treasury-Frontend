import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const SESSION_STORAGE = new InjectionToken<Storage>(
  'SessionStorage',
  {
    factory: (): Storage => inject(WINDOW).sessionStorage
  }
);
