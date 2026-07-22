import {
  createEnvironmentInjector,
  EnvironmentInjector,
  PLATFORM_ID,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AUTH_SESSION } from '@core/auth';
import { getUserByToken } from './auth.initializer';

describe('getUserByToken', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('initializes auth through the core auth session contract in the browser', async () => {
    const authSession = {
      initializeAuth: jasmine
        .createSpy('initializeAuth')
        .and.returnValue(Promise.resolve({ id: 1 })),
    };
    const childInjector = createEnvironmentInjector(
      [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AUTH_SESSION, useValue: authSession },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await runInInjectionContext(childInjector, () => getUserByToken());

    expect(authSession.initializeAuth).toHaveBeenCalled();
  });

  it('does not resolve the auth session on the server', async () => {
    const authSession = {
      initializeAuth: jasmine.createSpy('initializeAuth'),
    };
    const childInjector = createEnvironmentInjector(
      [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: AUTH_SESSION, useValue: authSession },
      ],
      TestBed.inject(EnvironmentInjector)
    );

    await expectAsync(
      runInInjectionContext(childInjector, () => getUserByToken())
    ).toBeResolvedTo(undefined);

    expect(authSession.initializeAuth).not.toHaveBeenCalled();
  });
});
