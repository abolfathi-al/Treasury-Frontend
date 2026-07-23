import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { APP_RUNTIME_CONFIG } from '@core/config/runtime.config';
import { MethodCreate } from './method-definition.models';
import { MethodDefinitionService } from './method-definition.service';

describe('MethodDefinitionService', () => {
  let httpTesting: HttpTestingController;
  let service: MethodDefinitionService;
  const payload: MethodCreate = {
    code: 'WIRE',
    name: 'Wire transfer',
    direction: 'BOTH',
    behaviorCategory: 'BANK_TRANSFER',
    requiredReferences: ['BANK_ACCOUNT', 'TRACKING_NUMBER'],
    createsFundsInTransit: true,
    requiresApproval: true,
    allowedCurrencies: ['IRR'],
    amountLimits: [{ currency: 'IRR', amount: '1000' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_RUNTIME_CONFIG,
          useValue: {
            appVersion: 'treasury-test',
            authStorageKey: 'unused',
            apiUrl: 'https://api.example.test',
          },
        },
      ],
    });

    service = TestBed.inject(MethodDefinitionService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('lists active-currency input and Method Definition pages with credentials', async () => {
    const currencies = firstValueFrom(service.listCurrencies());
    const currencyRequest = httpTesting.expectOne(
      (request) =>
        request.url === 'https://api.example.test/v1/currencies' &&
        request.params.get('limit') === '500',
    );
    expect(currencyRequest.request.withCredentials).toBeTrue();
    currencyRequest.flush({
      items: [],
      page: { limit: 500, hasMore: false },
    });

    const methods = firstValueFrom(service.listMethods('cursor-1'));
    const methodRequest = httpTesting.expectOne(
      (request) =>
        request.url === 'https://api.example.test/v1/method-definitions' &&
        request.params.get('limit') === '50' &&
        request.params.get('cursor') === 'cursor-1',
    );
    expect(methodRequest.request.withCredentials).toBeTrue();
    methodRequest.flush({
      items: [],
      page: { limit: 50, hasMore: false },
    });

    await currencies;
    await methods;
  });

  it('creates with the exact Canon payload plus request and idempotency headers', async () => {
    const response = firstValueFrom(service.createMethod(payload));

    const request = httpTesting.expectOne(
      'https://api.example.test/v1/method-definitions',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.body).toEqual(payload);
    expect(request.request.headers.get('X-Request-Id')).toBeTruthy();
    expect(request.request.headers.get('Idempotency-Key')).toBeTruthy();
    request.flush({
      ...payload,
      id: 'method-1',
      state: 'ACTIVE',
      version: 0,
    });

    await expectAsync(response).toBeResolvedTo(
      jasmine.objectContaining({ id: 'method-1', state: 'ACTIVE' }),
    );
  });

  for (const uncertainFailure of [0, 500]) {
    it(`reuses the Idempotency-Key after an uncertain status ${uncertainFailure}`, async () => {
      const firstResponse = firstValueFrom(service.createMethod(payload));
      const firstRequest = httpTesting.expectOne(
        'https://api.example.test/v1/method-definitions',
      );
      const firstKey = firstRequest.request.headers.get('Idempotency-Key');
      if (uncertainFailure === 0) {
        firstRequest.error(new ProgressEvent('network error'));
      } else {
        firstRequest.flush(
          {},
          { status: 500, statusText: 'Server Error' },
        );
      }
      await expectAsync(firstResponse).toBeRejected();

      const retryResponse = firstValueFrom(service.createMethod({ ...payload }));
      const retryRequest = httpTesting.expectOne(
        'https://api.example.test/v1/method-definitions',
      );
      expect(retryRequest.request.headers.get('Idempotency-Key')).toBe(
        firstKey,
      );
      retryRequest.flush({
        ...payload,
        id: 'method-1',
        state: 'ACTIVE',
        version: 0,
      });
      await retryResponse;

      const afterSuccess = firstValueFrom(service.createMethod({ ...payload }));
      const afterSuccessRequest = httpTesting.expectOne(
        'https://api.example.test/v1/method-definitions',
      );
      expect(
        afterSuccessRequest.request.headers.get('Idempotency-Key'),
      ).not.toBe(firstKey);
      afterSuccessRequest.flush({
        ...payload,
        id: 'method-2',
        state: 'ACTIVE',
        version: 0,
      });
      await afterSuccess;
    });
  }

  it('generates a new Idempotency-Key when the payload changes after an uncertain failure', async () => {
    const firstResponse = firstValueFrom(service.createMethod(payload));
    const firstRequest = httpTesting.expectOne(
      'https://api.example.test/v1/method-definitions',
    );
    const firstKey = firstRequest.request.headers.get('Idempotency-Key');
    firstRequest.flush({}, { status: 503, statusText: 'Unavailable' });
    await expectAsync(firstResponse).toBeRejected();

    const changedPayload = { ...payload, name: 'Changed name' };
    const changedResponse = firstValueFrom(
      service.createMethod(changedPayload),
    );
    const changedRequest = httpTesting.expectOne(
      'https://api.example.test/v1/method-definitions',
    );
    expect(changedRequest.request.headers.get('Idempotency-Key')).not.toBe(
      firstKey,
    );
    changedRequest.flush({
      ...changedPayload,
      id: 'method-2',
      state: 'ACTIVE',
      version: 0,
    });
    await changedResponse;
  });
});
