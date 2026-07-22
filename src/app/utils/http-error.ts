import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { OperatorFunction, catchError, of, throwError } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';
import { LoggerService } from '@core/services/logger.service';

interface ApiErrorBody {
  message?: string;
  detail?: Array<{ msg?: string }>;
  error?: string;
  errors?: string[];
}

export function parseErrorMessage(error: HttpErrorResponse): string {
  try {
    const body = error.error as ApiErrorBody | undefined;

    if (body?.message) {
      return body.message;
    }

    if (body?.detail?.[0]?.msg) {
      return body.detail[0].msg;
    }

    if (body?.error) {
      return body.error;
    }

    if (body?.errors?.[0]) {
      return body.errors[0];
    }

    if (error.message) {
      return error.message;
    }

    return 'An unknown error occurred';
  } catch {
    return 'An unknown error occurred';
  }
}

export function handleHttpError<T>(
  context: string,
  fallback?: T
): OperatorFunction<T, T> {
  const notification = inject(NotificationService);

  return (source) =>
    source.pipe(
      catchError((error: HttpErrorResponse) => {
        try {
          const message = parseErrorMessage(error);

          notification.toast({
            text: `${message} - ${context}`,
            icon: 'error',
          });

          LoggerService.Error(message, context, {
            data: { status: error.status, url: error.url },
            error,
          });

          if (fallback !== undefined) {
            return of(fallback);
          }

          return throwError(() => new Error(message));
        } catch (e) {
          LoggerService.Error('Error handler failed', context, { error: e });
          return throwError(() => e);
        }
      })
    );
}
