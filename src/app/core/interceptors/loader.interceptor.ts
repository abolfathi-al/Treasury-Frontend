import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { LoaderService } from '@core/services/loader.service';

const LOADER_PATHS = environment.interceptorsPaths.get('loader');

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  if (!(LOADER_PATHS && LOADER_PATHS.test(req.url))) {
    return next(req);
  }

  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
