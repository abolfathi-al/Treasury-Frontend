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
    invalidateSession: jasmine.createSpy('invalidateSession'),
    logout: () => undefined,
    getCurrentUserSnapshot: () => undefined,
    getCurrentUserChanges: () => of(undefined),
  };

  beforeEach(() => {
    (
      authSession.invalidateSession as jasmine.Spy
    ).calls.reset();

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

  it('does not add a bearer token to opaque cookie session requests', async () => {
    const response = firstValueFrom(http.get<{ ok: boolean }>('/api/orders'));

    const request = httpTesting.expectOne('/api/orders');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({ ok: true });

    await expectAsync(response).toBeResolvedTo({ ok: true });
  });

  it('invalidates local session state after a protected business HTTP 401', async () => {
    const response = firstValueFrom(http.get('/v1/method-definitions'));
    const request = httpTesting.expectOne('/v1/method-definitions');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });

    await expectAsync(response).toBeRejected();
    expect(authSession.invalidateSession).toHaveBeenCalled();
  });

  for (const requestCase of [
    { method: 'POST', url: '/v1/auth/sessions' },
    { method: 'POST', url: '/v1/auth/totp-verifications' },
    { method: 'POST', url: '/v1/auth/password-recoveries' },
    { method: 'GET', url: '/v1/auth/sessions/current' },
  ]) {
    it(`does not invalidate for an anonymous ${requestCase.method} ${requestCase.url} 401`, async () => {
      const response = firstValueFrom(
        http.request(requestCase.method, requestCase.url),
      );
      const request = httpTesting.expectOne(requestCase.url);
      request.flush({}, { status: 401, statusText: 'Unauthorized' });

      await expectAsync(response).toBeRejected();
      expect(authSession.invalidateSession).not.toHaveBeenCalled();
    });
  }
});
