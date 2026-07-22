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
import { firstValueFrom, of } from 'rxjs';

import { AUTH_SESSION, AuthSessionPort } from '@core/auth';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  const authSession: AuthSessionPort = {
    initializeAuth: () => Promise.resolve(undefined),
    getAuthToken: () => ({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: new Date('2030-01-01T00:00:00.000Z'),
    }),
    refreshAccessToken: () => of(undefined),
    logout: () => undefined,
    getCurrentUserSnapshot: () => undefined,
    getCurrentUserChanges: () => of(undefined),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AUTH_SESSION, useValue: authSession },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('adds the bearer token from the core auth session contract', async () => {
    const response = firstValueFrom(http.get<{ ok: boolean }>('/api/orders'));

    const request = httpTesting.expectOne('/api/orders');
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer access-token'
    );
    request.flush({ ok: true });

    await expectAsync(response).toBeResolvedTo({ ok: true });
  });
});
