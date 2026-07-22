import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import {
  APP_RUNTIME_CONFIG,
  AppRuntimeConfig,
} from '@core/config/runtime.config';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';
import { SESSION_STORAGE } from '@core/tokens';
import { UserModel } from '@models/auth';
import { AuthService } from './auth.service';

describe('AuthService runtime config', () => {
  let httpTesting: HttpTestingController;
  let sessionStorage: jasmine.SpyObj<Storage>;

  const runtimeConfig: AppRuntimeConfig = {
    appVersion: 'future-dashboard-2.0.0',
    authStorageKey: 'future_auth',
    apiUrl: 'https://api.example.test',
  };

  beforeEach(() => {
    sessionStorage = jasmine.createSpyObj<Storage>('Storage', [
      'getItem',
      'setItem',
      'removeItem',
    ]);
    sessionStorage.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
        { provide: SESSION_STORAGE, useValue: sessionStorage },
        {
          provide: Router,
          useValue: jasmine.createSpyObj<Router>('Router', ['navigate']),
        },
        {
          provide: LoggerService,
          useValue: jasmine.createSpyObj<LoggerService>('LoggerService', [
            'error',
            'info',
          ]),
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj<NotificationService>(
            'NotificationService',
            ['toast'],
          ),
        },
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('uses an alternate runtime profile for auth storage and API calls', () => {
    const service = TestBed.inject(AuthService);

    expect(service.getAuthToken()).toBeUndefined();
    expect(sessionStorage.getItem).toHaveBeenCalledWith(
      'future-dashboard-2.0.0-future_auth',
    );

    service.registration({} as UserModel).subscribe();
    httpTesting.expectOne('https://api.example.test/api/auth').flush({});
  });
});
