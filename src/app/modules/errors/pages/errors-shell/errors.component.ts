import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { WINDOW } from '@core/tokens';
import { ErrorInfo, isErrorCode } from '../../models/error.types';
import { ErrorService } from '../../data-access';

@Component({
  selector: 'vl-errors',
  templateUrl: './errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        height: 100%;
        margin: 0;
      }
    `,
  ],
  imports: [RouterOutlet],
  host: {
    class: 'd-flex flex-column flex-root',
  },
})
export class ErrorsComponent implements OnInit, OnDestroy {
  private readonly _currentError = signal<ErrorInfo | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _errorCode = signal<string>('404');

  readonly currentError = computed(() => this._currentError());
  readonly isLoading = computed(() => this._isLoading());
  readonly errorCode = computed(() => this._errorCode());
  readonly hasError = computed(() => this._currentError() !== null);

  private readonly window = inject(WINDOW);
  private readonly document = inject<Document>(DOCUMENT);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly errorService = inject(ErrorService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to sync with error service
    effect(() => {
      const error = this.errorService.currentError();
      this._currentError.set(error);
    });
  }

  ngOnInit(): void {
    // Add body classes
    const bodyClasses = [
      'bgi-size-cover',
      'bgi-position-center',
      'bgi-no-repeat',
    ];
    bodyClasses.forEach((c) => this.document.body.classList.add(c));

    // Get error code from route
    this.activatedRoute.firstChild?.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const errorCode = params['code'] || '404';
        this._errorCode.set(errorCode);

        // Load error configuration
        this.loadErrorConfiguration(errorCode);
      });

    // Set initial error if not already set
    if (!this._currentError()) {
      this.loadErrorConfiguration('404');
    }
  }

  ngOnDestroy(): void {
    // Remove body classes
    const bodyClasses = [
      'bgi-size-cover',
      'bgi-position-center',
      'bgi-no-repeat',
    ];
    bodyClasses.forEach((c) => this.document.body.classList.remove(c));
  }

  /**
   * Load error configuration based on error code
   */
  private loadErrorConfiguration(errorCode: string): void {
    if (!isErrorCode(errorCode)) {
      return;
    }

    const errorInfo = this.errorService.getErrorByCode(errorCode);
    if (errorInfo) {
      this._currentError.set(errorInfo);
    }
  }

  /**
   * Navigate to dashboard
   */
  routeToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Retry action
   */
  retry(): void {
    this.errorService.retry();
  }

  /**
   * Go back action
   */
  goBack(): void {
    this.window.history.back();
  }

  /**
   * Hide error
   */
  hideError(): void {
    this.errorService.hideError();
  }
}
