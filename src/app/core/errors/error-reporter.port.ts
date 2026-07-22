import { HttpErrorResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export type ErrorCode =
  | '404'
  | '500'
  | '403'
  | '401'
  | '400'
  | '503'
  | '502'
  | '504'
  | 'unknown';

export interface ErrorReporterContext {
  readonly url?: string;
  readonly method?: string;
  readonly status?: number;
  readonly statusText?: string;
  readonly message?: string;
  readonly stackTrace?: string;
}

export interface ErrorReporterPort {
  isCriticalError(error: HttpErrorResponse): boolean;
  getUserFriendlyMessage(error: HttpErrorResponse): string;
  navigateToError(
    errorCode: ErrorCode,
    context?: ErrorReporterContext
  ): void;
}

export const ERROR_REPORTER = new InjectionToken<ErrorReporterPort>(
  'ERROR_REPORTER'
);
