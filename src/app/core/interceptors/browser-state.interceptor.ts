import { inject, makeStateKey, TransferState } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '@environments/environment';

const STATE_PATHS = environment.interceptorsPaths.get('state');
const SUCCESS_STATUS = 200;

export const browserStateInterceptor: HttpInterceptorFn = (req, next) => {
  const transferState = inject(TransferState);

  if (!(STATE_PATHS && STATE_PATHS.test(req.url)) || req.method !== 'GET') {
    return next(req);
  }

  const stateKey = makeStateKey(req.url);
  const storedResponse = transferState.get(stateKey, null);

  if (storedResponse !== null) {
    const response = new HttpResponse({ body: storedResponse, status: SUCCESS_STATUS });
    return of(response);
  }

  return next(req);
};
