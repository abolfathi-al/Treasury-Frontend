import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, OperatorFunction, startWith } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';

export enum ResourceStatus {
  INITIAL,
  LOADING,
  LOADED,
  ERROR,
}

export interface AsyncResource<T> {
  status: ResourceStatus;
  isLoading: boolean;
  data: T | null;
  error?: HttpErrorResponse;
}

function parseError(error: HttpErrorResponse): string {
  try {
    const body = error?.error as
      | { message?: string; detail?: Array<{ msg?: string }> }
      | undefined;
    return (
      body?.message || body?.detail?.[0]?.msg || 'An unexpected error occurred'
    );
  } catch {
    return 'An unexpected error occurred';
  }
}

export function trackResource<T>(notification: NotificationService, isServer = false): OperatorFunction<T, AsyncResource<T>> {
  const loadingState: AsyncResource<T> = {
    status: ResourceStatus.LOADING,
    data: null,
    isLoading: true,
  };

  return (source) => {
    const mapped$ = source.pipe(
      map((data) => ({
        status: ResourceStatus.LOADED,
        data,
        isLoading: false,
      })),
      catchError((httpError: HttpErrorResponse) => {
        notification.toast({
          text: parseError(httpError),
          icon: 'error',
        });

        return of({
          status: ResourceStatus.ERROR,
          data: null,
          error: httpError,
          isLoading: false,
        });
      })
    );

    return isServer ? mapped$ : mapped$.pipe(startWith(loadingState));
  };
}
