import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

const HTTPS_PATHS = environment.interceptorsPaths.get('https');
const HTTP_PROTOCOL = 'http://';
const HTTPS_PROTOCOL = 'https://';

export const httpsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!(HTTPS_PATHS && HTTPS_PATHS.test(req.url))) {
    return next(req);
  }

  const httpsUrl = req.url.replace(HTTP_PROTOCOL, HTTPS_PROTOCOL);
  const httpsReq = req.clone({ url: httpsUrl });

  return next(httpsReq);
};
