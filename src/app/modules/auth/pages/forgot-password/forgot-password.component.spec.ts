import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../data-access/auth.service';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', [
      'recoverPassword',
      'handleError',
    ]);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: auth },
      ],
    })
      .overrideComponent(ForgotPasswordComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the replacement recovery code only in the successful component instance', () => {
    auth.recoverPassword.and.returnValue(
      of({
        outcome: 'PASSWORD_RESET',
        replacementRecoveryCode: 'replacement-code',
      }),
    );
    const request = {
      login: 'admin',
      newPassword: 'correct horse battery staple',
      recoveryCode: 'saved-recovery-code',
      totpCode: '123456',
    };
    component.form.setValue(request);

    component.submit();

    expect(auth.recoverPassword).toHaveBeenCalledWith(request);
    expect(component.replacementRecoveryCode()).toBe('replacement-code');
    expect(component.form.disabled).toBeTrue();

    fixture.destroy();
    const nextFixture = TestBed.createComponent(ForgotPasswordComponent);
    nextFixture.detectChanges();
    expect(
      nextFixture.componentInstance.replacementRecoveryCode(),
    ).toBeNull();
    nextFixture.destroy();
  });
});
