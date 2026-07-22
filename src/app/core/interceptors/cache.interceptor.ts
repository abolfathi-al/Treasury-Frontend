import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap, of } from 'rxjs';

import { environment } from '@environments/environment';

const cache = new Map<string, HttpResponse<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const CACHE_PATHS = environment.interceptorsPaths.get('cache');

  if (!(CACHE_PATHS && CACHE_PATHS.test(req.url)) || req.method !== 'GET') {
    return next(req);
  }

  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event);
      }
    })
  );
};
