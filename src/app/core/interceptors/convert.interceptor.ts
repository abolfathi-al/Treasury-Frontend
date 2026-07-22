import { HttpInterceptorFn, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

export const convertInterceptor: HttpInterceptorFn = (req, next) => {
  const CONVERT_PATHS = environment.interceptorsPaths.get('convert');

  if (!(CONVERT_PATHS && CONVERT_PATHS.test(req.url)) || req.method !== 'GET') {
    return next(req);
  }

  const params = req.params.keys().reduce((newParams, key) => {
    const value = req.params.get(key);
    return newParams.set(key, value ?? '');
  }, new HttpParams());

  const modifiedReq = req.clone({ params });
  return next(modifiedReq);
};
