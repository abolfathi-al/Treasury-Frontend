import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const IS_BROWSER_PLATFORM = new InjectionToken<boolean>(
  'IsBrowserPlatform',
  {
    factory: (): boolean => isPlatformBrowser(inject(PLATFORM_ID))
  }
);
