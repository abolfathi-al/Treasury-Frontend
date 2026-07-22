import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { IS_SERVER_PLATFORM } from '@core/tokens';
import { mockApiInterceptor } from './mock-api.interceptor';

describe('mockApiInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
        { provide: IS_SERVER_PLATFORM, useValue: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('forwards non-mock API requests to the next handler', async () => {
    const responsePromise = firstValueFrom(http.get<{ ok: boolean }>('/real'));

    const request = httpTesting.expectOne('/real');
    request.flush({ ok: true });

    await expectAsync(responsePromise).toBeResolvedTo({ ok: true });
  });

  it('serves mock API requests without forwarding to the backend', async () => {
    const response = await firstValueFrom(http.get<{ companyName: string }>('api/basicInformation'));

    httpTesting.expectNone('api/basicInformation');
    expect(response.companyName).toBeTruthy();
  });
});
