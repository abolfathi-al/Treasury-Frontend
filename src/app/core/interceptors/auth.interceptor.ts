import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AUTH_SESSION } from '@core/auth';
import { environment } from '@environments/environment';

const AUTH_PATHS = environment.interceptorsPaths.get('auth');
const AUTH_CONTROL_PATH_PREFIX = '/v1/auth/';

function requestPath(url: string): string {
  try {
    return new URL(url, 'http://treasury.local').pathname;
  } catch {
    return url.split(/[?#]/, 1)[0];
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AUTH_SESSION);

  if (
    !(AUTH_PATHS && AUTH_PATHS.test(req.url)) ||
    requestPath(req.url).startsWith(AUTH_CONTROL_PATH_PREFIX)
  ) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.status === 401) {
        authSession.invalidateSession();
      }
      return throwError(() => error);
    }),
  );
};
