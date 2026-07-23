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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, first, tap } from 'rxjs';

import { InvalidFeedbackComponent } from '@shared/forms/invalid-feedback/invalid-feedback.component';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { LoginChallenge } from '../../data-access/auth-contracts';
import { AuthService } from '../../data-access/auth.service';
import { passwordCodePointLengthValidator } from '../../data-access/auth.validators';

type LoginStep = 'credentials' | 'totp';

@Component({
  selector: 'vl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    VeloraIconComponent,
    InvalidFeedbackComponent,
  ],
})
export class LoginComponent implements OnInit {
  private readonly _hasError = signal(false);
  private readonly _isSubmitting = signal(false);
  private readonly _step = signal<LoginStep>('credentials');
  private readonly _challenge = signal<LoginChallenge | null>(null);

  readonly hasError = computed(() => this._hasError());
  readonly isSubmitting = computed(() => this._isSubmitting());
  readonly step = computed(() => this._step());
  readonly challenge = computed(() => this._challenge());

  credentialsForm: FormGroup;
  totpForm: FormGroup;
  returnUrl = '/dashboard';

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (this.authService.currentUserValue) {
      void this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.credentialsForm = this.formBuilder.group({
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(254),
        ],
      ],
      password: [
        '',
        [Validators.required, passwordCodePointLengthValidator],
      ],
    });
    this.totpForm = this.formBuilder.group({
      code: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
      ],
    });

    const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//')) {
      this.returnUrl = requestedUrl;
    }
  }

  submitCredentials(): void {
    this._hasError.set(false);
    if (this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      return;
    }

    this._isSubmitting.set(true);
    const { login, password } = this.credentialsForm.getRawValue();
    this.authService
      .login({ login, password })
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          if (response.outcome === 'TOTP_REQUIRED') {
            this._challenge.set(response);
            this._step.set('totp');
            this.credentialsForm.disable({ emitEvent: false });
            return;
          }
          void this.router.navigateByUrl(this.returnUrl);
        }),
        catchError((error) => {
          this._hasError.set(true);
          return this.authService.handleError('login', null)(error);
        }),
        finalize(() => this._isSubmitting.set(false)),
      )
      .subscribe();
  }

  submitTotp(): void {
    this._hasError.set(false);
    const challenge = this._challenge();
    if (!challenge || this.totpForm.invalid) {
      this.totpForm.markAllAsTouched();
      return;
    }

    this._isSubmitting.set(true);
    this.authService
      .verifyTotp({
        challengeId: challenge.challengeId,
        code: this.totpForm.getRawValue().code,
      })
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          if (response.outcome !== 'SESSION_ESTABLISHED') {
            throw new Error('A login TOTP challenge did not establish a session.');
          }
          void this.router.navigateByUrl(this.returnUrl);
        }),
        catchError((error) => {
          this._hasError.set(true);
          return this.authService.handleError('verify TOTP', null)(error);
        }),
        finalize(() => this._isSubmitting.set(false)),
      )
      .subscribe();
  }

  restart(): void {
    this._challenge.set(null);
    this._step.set('credentials');
    this._hasError.set(false);
    this.credentialsForm.enable({ emitEvent: false });
    this.totpForm.reset();
  }
}
