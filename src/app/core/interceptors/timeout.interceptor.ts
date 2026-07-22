import { inject, InjectionToken } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

import { environment } from '@environments/environment';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

const TIMEOUT_PATHS = environment.interceptorsPaths.get('timeout');
const TIMEOUT_HEADER = 'timeout';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const defaultTimeout = inject(DEFAULT_TIMEOUT);

  if (!(TIMEOUT_PATHS && TIMEOUT_PATHS.test(req.url))) {
    return next(req);
  }

  const timeoutHeader = req.headers.get(TIMEOUT_HEADER);
  const timeoutDuration = timeoutHeader ? Number(timeoutHeader) : defaultTimeout;

  return next(req).pipe(timeout(timeoutDuration));
};
