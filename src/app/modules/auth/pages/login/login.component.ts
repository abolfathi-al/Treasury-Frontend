import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, catchError, finalize, first, tap } from 'rxjs';

import { StepperDirective } from '@shared/directives/stepper.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { InvalidFeedbackComponent } from '@shared/forms/invalid-feedback/invalid-feedback.component';
import { environment } from '@environments/environment';
import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'vl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TranslateModule,
    StepperDirective,
    VeloraIconComponent,
    InvalidFeedbackComponent,
  ]
})
export class LoginComponent implements OnInit {
  // Signals for reactive state management
  private readonly _hasError = signal<boolean>(false);
  private readonly _isSubmitting = signal<boolean>(false);

  // Computed values
  readonly hasError = computed(() => this._hasError());
  readonly isSubmitting = computed(() => this._isSubmitting());
  readonly isProd = computed(() => environment.production);

  // Form and navigation
  form: FormGroup;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // Default auth values for development
  private readonly defaultAuth = {
    username: this.isProd() ? null : 'admin',
    password: this.isProd() ? null : '123456',
  };

  // Injected dependencies
  private readonly document = inject(DOCUMENT);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
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
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      username: [
        this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  handleNextStep({ instance }: StepperDirective): void {
    // Handle next step logic if needed
  }

  handlePrevStep({ instance }: StepperDirective): void {
    instance.goPrev();
  }

  handleSubmit(): void {
    this._hasError.set(false);

    if (this.form.valid) {
      this._isSubmitting.set(true);
      const { username, password } = this.form.value || {};

      this.authService.login('', '', username, password).pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.router.navigate([this.returnUrl])),
        catchError((error) => {
          this._hasError.set(true);
          return this.authService.handleError('login', [])(error);
        }),
        finalize(() => this._isSubmitting.set(false))
      ).subscribe();
    } else {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.form.controls).forEach(controlName =>
        this.form.controls[controlName].markAsTouched()
      );
    }
  }
}
