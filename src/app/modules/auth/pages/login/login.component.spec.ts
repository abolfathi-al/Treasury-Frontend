import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../data-access/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent Canon challenge flow', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['login', 'verifyTotp', 'handleError'],
      { currentUserValue: undefined },
    );
    router = jasmine.createSpyObj<Router>('Router', [
      'navigate',
      'navigateByUrl',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                returnUrl: '/foundation/method-definitions',
              }),
            },
          },
        },
      ],
    })
      .overrideComponent(LoginComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('moves from credentials to TOTP and navigates only after session establishment', () => {
    auth.login.and.returnValue(
      of({
        outcome: 'TOTP_REQUIRED',
        challengeId: 'challenge-1',
        expiresAt: '2026-07-24T08:05:00Z',
      }),
    );
    auth.verifyTotp.and.returnValue(
      of({
        outcome: 'SESSION_ESTABLISHED',
        session: {
          sessionId: 'session-1',
          authenticatedAt: '2026-07-24T08:00:00Z',
          idleExpiresAt: '2026-07-24T08:15:00Z',
          absoluteExpiresAt: '2026-07-24T16:00:00Z',
          assurance: 'PASSWORD_TOTP',
          userId: 'user-1',
          userDisplayName: 'Treasury Admin',
          effectivePermissions: ['master-data.view'],
        },
      }),
    );

    component.credentialsForm.setValue({
      login: 'admin',
      password: 'correct horse battery staple',
    });
    component.submitCredentials();

    expect(auth.login).toHaveBeenCalledWith({
      login: 'admin',
      password: 'correct horse battery staple',
    });
    expect(component.step()).toBe('totp');
    expect(component.credentialsForm.disabled).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    component.totpForm.setValue({ code: '123456' });
    component.submitTotp();

    expect(auth.verifyTotp).toHaveBeenCalledWith({
      challengeId: 'challenge-1',
      code: '123456',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/foundation/method-definitions',
    );
  });
});
