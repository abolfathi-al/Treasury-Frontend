import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { APP_RUNTIME_CONFIG } from '@core/config/runtime.config';
import {
  CurrencyPage,
  MethodCreate,
  MethodPage,
  MethodView,
} from './method-definition.models';

const CREDENTIALS = { withCredentials: true } as const;

@Injectable({
  providedIn: 'root',
})
export class MethodDefinitionService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(APP_RUNTIME_CONFIG);
  private readonly apiUrl = this.runtimeConfig.apiUrl;
  private uncertainCreate:
    | { readonly payload: string; readonly idempotencyKey: string }
    | undefined;

  listCurrencies(): Observable<CurrencyPage> {
    return this.http.get<CurrencyPage>(`${this.apiUrl}/v1/currencies`, {
      ...CREDENTIALS,
      params: new HttpParams().set('limit', 500),
    });
  }

  listMethods(cursor?: string): Observable<MethodPage> {
    let params = new HttpParams().set('limit', 50);
    if (cursor) {
      params = params.set('cursor', cursor);
    }

    return this.http.get<MethodPage>(
      `${this.apiUrl}/v1/method-definitions`,
      {
        ...CREDENTIALS,
        params,
      },
    );
  }

  createMethod(request: MethodCreate): Observable<MethodView> {
    const payload = this.methodPayloadFingerprint(request);
    const idempotencyKey =
      this.uncertainCreate?.payload === payload
        ? this.uncertainCreate.idempotencyKey
        : globalThis.crypto.randomUUID();
    this.uncertainCreate = { payload, idempotencyKey };

    return this.http.post<MethodView>(
      `${this.apiUrl}/v1/method-definitions`,
      request,
      {
        ...CREDENTIALS,
        headers: new HttpHeaders({
          'X-Request-Id': globalThis.crypto.randomUUID(),
          'Idempotency-Key': idempotencyKey,
        }),
      },
    ).pipe(
      tap(() => this.clearUncertainCreate(idempotencyKey)),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 0 && error.status < 500) {
          this.clearUncertainCreate(idempotencyKey);
        }
        return throwError(() => error);
      }),
    );
  }

  private clearUncertainCreate(idempotencyKey: string): void {
    if (this.uncertainCreate?.idempotencyKey === idempotencyKey) {
      this.uncertainCreate = undefined;
    }
  }

  private methodPayloadFingerprint(request: MethodCreate): string {
    return JSON.stringify({
      code: request.code,
      name: request.name,
      direction: request.direction,
      behaviorCategory: request.behaviorCategory,
      requiredReferences: request.requiredReferences,
      createsFundsInTransit: request.createsFundsInTransit,
      requiresApproval: request.requiresApproval,
      allowedCurrencies: request.allowedCurrencies,
      amountLimits: request.amountLimits,
      debitMappingRef: request.debitMappingRef,
      creditMappingRef: request.creditMappingRef,
      feeMappingRef: request.feeMappingRef,
      discrepancyMappingRef: request.discrepancyMappingRef,
      templateMappingRef: request.templateMappingRef,
    });
  }
}
