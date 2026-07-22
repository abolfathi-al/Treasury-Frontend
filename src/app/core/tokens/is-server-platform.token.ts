import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const IS_SERVER_PLATFORM = new InjectionToken<boolean>(
  'IsServerPlatform',
  {
    factory: (): boolean => isPlatformServer(inject(PLATFORM_ID))
  }
);
