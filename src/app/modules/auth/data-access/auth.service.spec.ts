import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  APP_RUNTIME_CONFIG,
  AppRuntimeConfig,
} from '@core/config/runtime.config';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from './auth.service';

describe('AuthService Canon cookie session', () => {
  let httpTesting: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let notification: jasmine.SpyObj<NotificationService>;

  const runtimeConfig: AppRuntimeConfig = {
    appVersion: 'treasury-1.0.0',
    authStorageKey: 'unused-by-cookie-session',
    apiUrl: 'https://api.example.test',
  };

  const session = {
    sessionId: 'session-1',
    authenticatedAt: '2026-07-24T08:00:00Z',
    idleExpiresAt: '2026-07-24T08:15:00Z',
    absoluteExpiresAt: '2026-07-24T16:00:00Z',
    assurance: 'PASSWORD_TOTP' as const,
    userId: 'user-1',
    userDisplayName: 'Treasury Admin',
    effectivePermissions: ['master-data.view', 'master-data.manage'],
  };

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    notification = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['toast'],
    );

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
        { provide: Router, useValue: router },
        {
          provide: LoggerService,
          useValue: jasmine.createSpyObj<LoggerService>('LoggerService', [
            'error',
            'info',
          ]),
        },
        {
          provide: NotificationService,
          useValue: notification,
        },
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('submits the exact login request with credentials and accepts a TOTP challenge', async () => {
    const service = TestBed.inject(AuthService);
    const response = firstValueFrom(
      service.login({
        login: 'admin',
        password: 'correct horse battery staple',
      }),
    );

    const request = httpTesting.expectOne(
      'https://api.example.test/v1/auth/sessions',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.headers.get('X-Request-Id')).toBeTruthy();
    expect(request.request.body).toEqual({
      login: 'admin',
      password: 'correct horse battery staple',
    });
    request.flush(
      {
        outcome: 'TOTP_REQUIRED',
        challengeId: 'challenge-1',
        expiresAt: '2026-07-24T08:05:00Z',
      },
      { status: 202, statusText: 'Accepted' },
    );

    await expectAsync(response).toBeResolvedTo(
      jasmine.objectContaining({ outcome: 'TOTP_REQUIRED' }),
    );
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('exchanges a six-digit TOTP proof for the opaque current session', async () => {
    const service = TestBed.inject(AuthService);
    const response = firstValueFrom(
      service.verifyTotp({ challengeId: 'challenge-1', code: '123456' }),
    );

    const request = httpTesting.expectOne(
      'https://api.example.test/v1/auth/totp-verifications',
    );
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.body).toEqual({
      challengeId: 'challenge-1',
      code: '123456',
    });
    request.flush(
      { outcome: 'SESSION_ESTABLISHED', session },
      { status: 201, statusText: 'Created' },
    );

    await response;
    expect(service.currentUserValue).toEqual(session);
    expect(service.permissions()).toEqual([
      'master-data.view',
      'master-data.manage',
    ]);
  });

  it('reads and revokes the current cookie session without token storage', async () => {
    const service = TestBed.inject(AuthService);
    const current = firstValueFrom(service.getCurrentSession());
    const currentRequest = httpTesting.expectOne(
      'https://api.example.test/v1/auth/sessions/current',
    );
    expect(currentRequest.request.withCredentials).toBeTrue();
    currentRequest.flush(session);
    await current;

    service.logout();
    const logoutRequest = httpTesting.expectOne(
      'https://api.example.test/v1/auth/sessions/session-1',
    );
    expect(logoutRequest.request.method).toBe('DELETE');
    expect(logoutRequest.request.withCredentials).toBeTrue();
    expect(logoutRequest.request.headers.get('X-Request-Id')).toBeTruthy();
    logoutRequest.flush(null, { status: 204, statusText: 'No Content' });

    expect(service.currentUserValue).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('clears local state when logout confirms the session is already invalid', async () => {
    const service = TestBed.inject(AuthService);
    const current = firstValueFrom(service.getCurrentSession());
    httpTesting
      .expectOne('https://api.example.test/v1/auth/sessions/current')
      .flush(session);
    await current;

    service.logout();
    httpTesting
      .expectOne('https://api.example.test/v1/auth/sessions/session-1')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.currentUserValue).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(notification.toast).not.toHaveBeenCalled();
  });

  for (const failure of [
    { status: 0, statusText: 'Unknown Error' },
    { status: 403, statusText: 'Forbidden' },
    { status: 500, statusText: 'Server Error' },
  ]) {
    it(`keeps the authenticated session and surfaces logout status ${failure.status}`, async () => {
      const service = TestBed.inject(AuthService);
      const current = firstValueFrom(service.getCurrentSession());
      httpTesting
        .expectOne('https://api.example.test/v1/auth/sessions/current')
        .flush(session);
      await current;

      service.logout();
      const request = httpTesting.expectOne(
        'https://api.example.test/v1/auth/sessions/session-1',
      );
      if (failure.status === 0) {
        request.error(new ProgressEvent('network error'));
      } else {
        request.flush(
          {},
          { status: failure.status, statusText: failure.statusText },
        );
      }

      expect(service.currentUserValue).toEqual(session);
      expect(service.isAuthenticated()).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(notification.toast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: jasmine.any(String),
          icon: 'error',
        }),
      );
    });
  }

  it('submits exactly the four Canon password recovery fields', async () => {
    const service = TestBed.inject(AuthService);
    const payload = {
      login: 'admin',
      newPassword: 'correct horse battery staple',
      recoveryCode: 'saved-recovery-code',
      totpCode: '123456',
    };
    const response = firstValueFrom(service.recoverPassword(payload));

    const request = httpTesting.expectOne(
      'https://api.example.test/v1/auth/password-recoveries',
    );
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.body).toEqual(payload);
    request.flush({
      outcome: 'PASSWORD_RESET',
      replacementRecoveryCode: 'replacement-code',
    });

    await expectAsync(response).toBeResolvedTo({
      outcome: 'PASSWORD_RESET',
      replacementRecoveryCode: 'replacement-code',
    });
  });

  it('renders Treasury Problem field messages as text, never SweetAlert HTML', async () => {
    const service = TestBed.inject(AuthService);
    const maliciousMessage = '<img src=x onerror=alert(1)>';
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {
        type: 'about:blank',
        title: 'Invalid request',
        status: 400,
        code: 'TRS-GEN-001',
        requestId: 'request-1',
        retryable: false,
        fieldErrors: [
          { path: '/name', message: maliciousMessage },
          { path: '/code', message: 'Code is invalid' },
        ],
      },
    });

    await firstValueFrom(service.handleError('create method', null)(error));

    const options = notification.toast.calls.mostRecent().args[0];
    expect(options?.text).toBe(`${maliciousMessage}\nCode is invalid`);
    expect(options?.html).toBeUndefined();
  });
});
