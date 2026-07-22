import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ProfilerService } from '@core/services/profiler.service';

const PROFILER_PATHS = environment.interceptorsPaths.get('profiler');

export const profilerInterceptor: HttpInterceptorFn = (req, next) => {
  const profilerService = inject(ProfilerService);

  if (!(PROFILER_PATHS && PROFILER_PATHS.test(req.url))) {
    return next(req);
  }

  const started = Date.now();
  let status = 'unknown';

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          status = 'succeeded';
        }
      },
      error: () => {
        status = 'failed';
      }
    }),
    finalize(() => {
      const elapsed = Date.now() - started;
      const message = `${req.method} '${req.urlWithParams}' ${status} in ${elapsed} ms.`;
      profilerService.add(message);
    })
  );
};
