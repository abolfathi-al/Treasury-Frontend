import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '@environments/environment';

const FAKE_PATHS = environment.interceptorsPaths.get('fake');
const MOCK_BODY = { firstName: 'Alireza', lastName: 'Abolfathi' };
const MOCK_STATUS = 200;

export const fakeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!(FAKE_PATHS && FAKE_PATHS.test(req.url))) {
    return next(req);
  }

  const response = new HttpResponse({ status: MOCK_STATUS, body: MOCK_BODY });
  return of(response);
};
