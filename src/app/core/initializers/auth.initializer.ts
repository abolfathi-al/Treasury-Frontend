import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AUTH_SESSION } from '@core/auth';

export const getUserByToken = () => {
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return Promise.resolve(undefined);
  }
  
  const authSession = inject(AUTH_SESSION);
  return authSession.initializeAuth();
};
