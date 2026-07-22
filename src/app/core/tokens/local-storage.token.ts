import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'LocalStorage',
  {
    factory: (): Storage => inject(WINDOW).localStorage
  }
);
