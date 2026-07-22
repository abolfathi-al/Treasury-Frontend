import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, of } from 'rxjs';

import { AUTH_SESSION, AuthSessionPort } from '@core/auth';
import { headerInterceptor } from './header.interceptor';

class TranslateServiceStub {
  readonly currentLang = 'fa';

  instant(key: string): string {
    return key === 'ISO_LANG' ? 'fa-IR' : key;
  }
}

describe('headerInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  const authSession: AuthSessionPort = {
    initializeAuth: () => Promise.resolve(undefined),
    getAuthToken: () => undefined,
    refreshAccessToken: () => of(undefined),
    logout: () => undefined,
    getCurrentUserSnapshot: () => ({
      companyCode: 'VL',
      fourCharsFinancialYear: '1404',
    }),
    getCurrentUserChanges: () =>
      of({
        companyCode: 'VL',
        fourCharsFinancialYear: '1404',
      }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([headerInterceptor])),
        provideHttpClientTesting(),
        { provide: AUTH_SESSION, useValue: authSession },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('adds culture and company headers from core contracts', async () => {
    const response = firstValueFrom(http.get<{ ok: boolean }>('/api/orders'));

    const request = httpTesting.expectOne('/api/orders');
    expect(request.request.headers.get('X-Developer')).toBe(
      'abolfathi.al@gmail.com'
    );
    expect(request.request.headers.get('X-Ui-Culture')).toBe('fa-IR');
    expect(request.request.headers.get('X-Company-Code')).toBe('VL');
    expect(request.request.headers.get('X-Financial-Year')).toBe('1404');
    request.flush({ ok: true });

    await expectAsync(response).toBeResolvedTo({ ok: true });
  });
});
