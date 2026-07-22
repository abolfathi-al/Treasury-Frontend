import { inject, InjectionToken } from '@angular/core';
import { NAVIGATOR } from './navigator.token';

export const MEDIA_DEVICES = new InjectionToken<MediaDevices>(
  'MediaDevices',
  {
    factory: (): MediaDevices => inject(NAVIGATOR).mediaDevices
  }
);
