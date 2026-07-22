import { inject } from '@angular/core';
import { HttpRequest, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ERROR_REPORTER, ErrorCode } from '@core/errors';
import { environment } from '@environments/environment';

const ERROR_PATHS = environment.interceptorsPaths.get('error');
const RETRY_COUNT = 2;
const CRITICAL_STATUS_CODES = [404, 500, 502, 503, 504] as const;

interface StackTraceSource {
  readonly stack?: string;
}

const readStackTrace = (value: unknown): string | undefined => {
  if (typeof value !== 'object' || value === null || !('stack' in value)) {
    return undefined;
  }

  const stackTrace = (value as StackTraceSource).stack;
  return typeof stackTrace === 'string' ? stackTrace : undefined;
};

export const getHttpErrorStackTrace = (
  error: HttpErrorResponse
): string | undefined => readStackTrace(error.error) ?? readStackTrace(error);

const mapHttpErrorToErrorCode = (status: number): ErrorCode => {
  const errorCodeMap: Record<number, ErrorCode> = {
    400: '400',
    401: '401',
    403: '403',
    404: '404',
    500: '500',
    502: '502',
    503: '503',
    504: '504'
  };

  return errorCodeMap[status] ?? 'unknown';
};

const shouldNavigateToErrorPage = (
  error: HttpErrorResponse,
  isCritical: boolean
): boolean => {
  return (
    isCritical ||
    CRITICAL_STATUS_CODES.includes(
      error.status as (typeof CRITICAL_STATUS_CODES)[number]
    )
  );
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const errorReporter = inject(ERROR_REPORTER);

  if (!(ERROR_PATHS && ERROR_PATHS.test(req.url))) {
    return next(req);
  }

  const handleError = (error: HttpErrorResponse, request: HttpRequest<unknown>): void => {
    const errorCode = mapHttpErrorToErrorCode(error.status);
    const isCritical = errorReporter.isCriticalError(error);
    const context = {
      url: request.url,
      method: request.method,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      stackTrace: getHttpErrorStackTrace(error)
    };

    if (!isCritical) {
      const userFriendlyMessage = errorReporter.getUserFriendlyMessage(error);
      toastr.error(userFriendlyMessage);
    }

    if (shouldNavigateToErrorPage(error, isCritical)) {
      errorReporter.navigateToError(errorCode, context);
    }
  };

  return next(req).pipe(
    retry(RETRY_COUNT),
    catchError((error: HttpErrorResponse) => {
      handleError(error, req);
      return throwError(() => error);
    })
  );
};
