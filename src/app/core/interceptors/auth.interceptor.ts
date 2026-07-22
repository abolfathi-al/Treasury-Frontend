import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take, switchMap, first, finalize , throwError, BehaviorSubject, EMPTY } from 'rxjs';

import { AUTH_SESSION } from '@core/auth';
import { environment } from '@environments/environment';

const AUTH_PATHS = environment.interceptorsPaths.get('auth');
const AUTH_HEADER = 'Authorization';

let refreshTokenInProgress = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AUTH_SESSION);

  if (!(AUTH_PATHS && AUTH_PATHS.test(req.url))) {
    return next(req);
  }

  const addAuthenticationToken = (
    request: HttpRequest<unknown>
  ): HttpRequest<unknown> => {
    const { accessToken } = authSession.getAuthToken() ?? {};

    if (!accessToken) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(AUTH_HEADER, `Bearer ${accessToken}`)
    });
  };

  const refreshAccessToken = () => {
    return authSession.refreshAccessToken().pipe(
      first(),
      catchError(() => {
        authSession.logout();
        return EMPTY;
      }),
      finalize(() => {
        refreshTokenInProgress = false;
      })
    );
  };

  const handleTokenRefresh = (): ReturnType<typeof next> => {
    if (refreshTokenInProgress) {
      return refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => next(addAuthenticationToken(req)))
      );
    }

    refreshTokenInProgress = true;
    refreshTokenSubject.next(null);

    return refreshAccessToken().pipe(
      switchMap((authModel) => {
        const success = authModel !== undefined;
        refreshTokenSubject.next(success);
        return next(addAuthenticationToken(req));
      })
    );
  };

  const modifiedReq = addAuthenticationToken(req);

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.status === 401) {
        return handleTokenRefresh();
      }
      return throwError(() => error);
    })
  );
};
