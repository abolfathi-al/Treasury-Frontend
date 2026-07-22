import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AUTH_SESSION } from '@core/auth';
import { environment } from '@environments/environment';

const HEADER_PATHS = environment.interceptorsPaths.get('header');
const DEVELOPER_EMAIL = 'abolfathi.al@gmail.com';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AUTH_SESSION);
  const translate = inject(TranslateService);

  if (!(HEADER_PATHS && HEADER_PATHS.test(req.url))) {
    return next(req);
  }

  const currentUser = auth.getCurrentUserSnapshot();
  const { companyCode, fourCharsFinancialYear } = currentUser ?? {};
  
  const headers: Record<string, string> = {
    'X-Developer': DEVELOPER_EMAIL
  };

  if (translate.currentLang) {
    headers['X-Ui-Culture'] = translate.instant('ISO_LANG');
  }

  if (companyCode && fourCharsFinancialYear) {
    headers['X-Company-Code'] = companyCode;
    headers['X-Financial-Year'] = fourCharsFinancialYear;
  }

  const modified = req.clone({ setHeaders: headers });
  return next(modified);
};
