import { NgClass, AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal, computed, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, finalize, tap, catchError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../data-access/auth.service';
import { InvalidFeedbackComponent } from '@shared/forms/invalid-feedback/invalid-feedback.component';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'vl-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
export class ForgotPasswordComponent implements OnInit {
  // Signals for reactive state management
  private readonly _errorState = signal<ErrorStates>(ErrorStates.NotSubmitted);
  private readonly _isSubmitting = signal<boolean>(false);

  // Computed values
  readonly errorState = computed(() => this._errorState());
  readonly isSubmitting = computed(() => this._isSubmitting());
  readonly errorStates = ErrorStates;

  // Form and loading state
  form: FormGroup;
  isLoading$: Observable<boolean>;

  // Injected dependencies
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: [
        'admin@demo.com',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit(): void {
    this._errorState.set(ErrorStates.NotSubmitted);

    if (this.form.valid) {
      this._isSubmitting.set(true);

      this.authService
        .forgotPassword(this.form.value.email)
        .pipe(
          first(),
          takeUntilDestroyed(this.destroyRef),
          tap((result: boolean) => {
            this._errorState.set(result ? ErrorStates.NoError : ErrorStates.HasError);
          }),
          catchError((error) => {
            this._errorState.set(ErrorStates.HasError);
            return this.authService.handleError('forgot password', false)(error);
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
