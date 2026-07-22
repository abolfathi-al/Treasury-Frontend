import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from '@environments/environment';

const NOTIFY_PATHS = environment.interceptorsPaths.get('notify');
const CREATED_STATUS = 201;
const SUCCESS_MESSAGE = 'Object created.';

export const notifyInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  if (!(NOTIFY_PATHS && NOTIFY_PATHS.test(req.url))) {
    return next(req);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === CREATED_STATUS) {
        toastr.success(SUCCESS_MESSAGE);
      }
    })
  );
};
