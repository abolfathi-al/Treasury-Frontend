import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, first, tap } from 'rxjs';

import { InvalidFeedbackComponent } from '@shared/forms/invalid-feedback/invalid-feedback.component';
import { AuthService } from '../../data-access/auth.service';
import { passwordCodePointLengthValidator } from '../../data-access/auth.validators';

@Component({
  selector: 'vl-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    InvalidFeedbackComponent,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  private readonly _hasError = signal(false);
  private readonly _isSubmitting = signal(false);
  private readonly _replacementRecoveryCode = signal<string | null>(null);

  readonly hasError = computed(() => this._hasError());
  readonly isSubmitting = computed(() => this._isSubmitting());
  readonly replacementRecoveryCode = computed(() =>
    this._replacementRecoveryCode(),
  );

  form: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.form = this.fb.group({
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(254),
        ],
      ],
      newPassword: [
        '',
        [Validators.required, passwordCodePointLengthValidator],
      ],
      recoveryCode: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      totpCode: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
      ],
    });
  }

  submit(): void {
    this._hasError.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._isSubmitting.set(true);
    this.authService
      .recoverPassword(this.form.getRawValue())
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          this._replacementRecoveryCode.set(result.replacementRecoveryCode);
          this.form.reset();
          this.form.disable({ emitEvent: false });
        }),
        catchError((error) => {
          this._hasError.set(true);
          return this.authService.handleError('recover password', null)(error);
        }),
        finalize(() => this._isSubmitting.set(false)),
      )
      .subscribe();
  }
}
