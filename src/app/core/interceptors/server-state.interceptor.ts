import { inject, makeStateKey, TransferState } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '@environments/environment';

const STATE_PATHS = environment.interceptorsPaths.get('state');

export const serverStateInterceptor: HttpInterceptorFn = (req, next) => {
  const transferState = inject(TransferState);

  if (!(STATE_PATHS && STATE_PATHS.test(req.url))) {
    return next(req);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const stateKey = makeStateKey(req.url);
        transferState.set(stateKey, event.body);
      }
    })
  );
};
