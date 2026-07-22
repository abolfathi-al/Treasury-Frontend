import { Component, OnInit, inject, signal, computed, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { first, finalize, tap, catchError, Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import md5 from 'md5';

import { AuthService } from '../../data-access/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '@models/auth/user.model';
import { InvalidFeedbackComponent } from '@shared/forms/invalid-feedback/invalid-feedback.component';

@Component({
  selector: 'vl-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    TranslateModule,
    InvalidFeedbackComponent,
  ]
})
export class RegistrationComponent implements OnInit {
  // Signals for reactive state management
  private readonly _hasError = signal<boolean>(false);
  private readonly _isSubmitting = signal<boolean>(false);

  // Computed values
  readonly hasError = computed(() => this._hasError());
  readonly isSubmitting = computed(() => this._isSubmitting());

  // Form and loading state
  form: FormGroup;
  isLoading$: Observable<boolean>;

  // Injected dependencies
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.isLoading$ = this.authService.isLoading$;
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          'qwe@qwe.qwe',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit(): void {
    this._hasError.set(false);

    if (this.form.valid) {
      this._isSubmitting.set(true);

      const formValue = this.form.value;
      const newUser: Partial<UserModel> = {
        ...formValue,
        password: md5(formValue.password),
      };

      this.authService
        .registration(newUser as UserModel)
        .pipe(
          first(),
          takeUntilDestroyed(this.destroyRef),
          tap(() => {
            // Registration successful, redirect to login
            this.router.navigate(['/auth/login']);
          }),
          catchError((error) => {
            this._hasError.set(true);
            return this.authService.handleError('registration', [])(error);
          }),
          finalize(() => this._isSubmitting.set(false))
        )
        .subscribe();
    } else {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.form.controls).forEach(controlName =>
        this.form.controls[controlName].markAsTouched()
      );
    }
  }
}
