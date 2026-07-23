import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  first,
  firstValueFrom,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';

import { AuthSessionPort } from '@core/auth';
import { APP_RUNTIME_CONFIG } from '@core/config/runtime.config';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';
import { PermissionService } from './permission.service';
import {
  LoginRequest,
  LoginResponse,
  PasswordRecoveryCompleted,
  PasswordRecoveryRequest,
  SessionEstablished,
  SessionView,
  TotpProof,
  TotpResponse,
  TreasuryProblem,
} from './auth-contracts';

export type UserType = SessionView | undefined;
export type AuthState =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

const CREDENTIALS = { withCredentials: true } as const;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthSessionPort {
  private readonly runtimeConfig = inject(APP_RUNTIME_CONFIG);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly apiUrl = this.runtimeConfig.apiUrl;

  private readonly _currentUser = signal<UserType>(undefined);
  private readonly _isLoading = signal(false);
  private readonly _authState = signal<AuthState>('idle');

  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly authState = computed(() => this._authState());
  readonly isAuthenticated = computed(
    () => this._authState() === 'authenticated',
  );
  readonly permissions = computed(() => this.permissionService.permissions());
  readonly hasPermissions = computed(() =>
    this.permissionService.hasPermissions(),
  );

  readonly currentUserSubject = new BehaviorSubject<UserType>(undefined);
  private readonly isLoadingSubject = new BehaviorSubject(false);
  private readonly authStateSubject = new BehaviorSubject<AuthState>('idle');

  readonly currentUser$ = this.currentUserSubject
    .asObservable()
    .pipe(shareReplay(1));
  readonly isLoading$ = this.isLoadingSubject
    .asObservable()
    .pipe(shareReplay(1));
  readonly authState$ = this.authStateSubject
    .asObservable()
    .pipe(shareReplay(1));

  get currentUserValue(): UserType {
    return this._currentUser();
  }

  initializeAuth(): Promise<UserType> {
    return firstValueFrom(
      this.getCurrentSession().pipe(
        catchError(() => {
          this.setUnauthenticated();
          return of(undefined);
        }),
      ),
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    this.setLoading();

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/v1/auth/sessions`, request, {
        ...CREDENTIALS,
        headers: this.requestHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.outcome === 'SESSION_ESTABLISHED') {
            this.acceptSession(response);
          } else {
            this._authState.set('unauthenticated');
            this.authStateSubject.next('unauthenticated');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this._authState.set('error');
          this.authStateSubject.next('error');
          return throwError(() => error);
        }),
        finalize(() => this.finishLoading()),
      );
  }

  verifyTotp(proof: TotpProof): Observable<TotpResponse> {
    this.setLoading();

    return this.http
      .post<TotpResponse>(
        `${this.apiUrl}/v1/auth/totp-verifications`,
        proof,
        {
          ...CREDENTIALS,
          headers: this.requestHeaders(),
        },
      )
      .pipe(
        tap((response) => {
          if (response.outcome === 'SESSION_ESTABLISHED') {
            this.acceptSession(response);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this._authState.set('error');
          this.authStateSubject.next('error');
          return throwError(() => error);
        }),
        finalize(() => this.finishLoading()),
      );
  }

  getCurrentSession(): Observable<UserType> {
    this.setLoading();

    return this.http
      .get<SessionView>(`${this.apiUrl}/v1/auth/sessions/current`, CREDENTIALS)
      .pipe(
        tap((session) => this.acceptSessionView(session)),
        catchError((error: HttpErrorResponse) => {
          this.setUnauthenticated();
          return throwError(() => error);
        }),
        finalize(() => this.finishLoading()),
      );
  }

  recoverPassword(
    request: PasswordRecoveryRequest,
  ): Observable<PasswordRecoveryCompleted> {
    this.setLoading(false);

    return this.http
      .post<PasswordRecoveryCompleted>(
        `${this.apiUrl}/v1/auth/password-recoveries`,
        request,
        {
          ...CREDENTIALS,
          headers: this.requestHeaders(),
        },
      )
      .pipe(finalize(() => this.finishLoading()));
  }

  logout(): void {
    const sessionId = this._currentUser()?.sessionId;
    if (!sessionId) {
      this.invalidateSession();
      return;
    }

    this.setLoading(false);
    this.http
      .delete<void>(
        `${this.apiUrl}/v1/auth/sessions/${encodeURIComponent(sessionId)}`,
        {
          ...CREDENTIALS,
          headers: this.requestHeaders(),
        },
      )
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.invalidateSession()),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Logout API error', 'AuthService', { error });
          if (error.status === 401) {
            this.invalidateSession();
            return of(undefined);
          }

          this.notifyError(error, 'logout');
          return of(undefined);
        }),
        finalize(() => this.finishLoading()),
      )
      .subscribe();
  }

  invalidateSession(): void {
    this.setUnauthenticated();
    void this.router.navigate(['/auth/login']);
  }

  getCurrentUserSnapshot(): UserType {
    return this.currentUserSubject.getValue();
  }

  getCurrentUserChanges(): Observable<UserType> {
    return this.currentUser$;
  }

  hasPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return this.permissionService.hasAnyPermission(permissions);
  }

  hasAllPermissions(permissions: string[]): boolean {
    return this.permissionService.hasAllPermissions(permissions);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.notifyError(error, operation);

      if (result !== undefined) {
        return of(result);
      }

      return throwError(() => error);
    };
  }

  private requestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Request-Id': globalThis.crypto.randomUUID(),
    });
  }

  private acceptSession(response: SessionEstablished): void {
    this.acceptSessionView(response.session);
  }

  private acceptSessionView(session: SessionView): void {
    this._currentUser.set(session);
    this.currentUserSubject.next(session);
    this.permissionService.loadPermissions([...session.effectivePermissions]);
    this._authState.set('authenticated');
    this.authStateSubject.next('authenticated');
  }

  private setUnauthenticated(): void {
    this._currentUser.set(undefined);
    this.currentUserSubject.next(undefined);
    this.permissionService.clearAll();
    this._authState.set('unauthenticated');
    this.authStateSubject.next('unauthenticated');
  }

  private setLoading(updateAuthState = true): void {
    this._isLoading.set(true);
    this.isLoadingSubject.next(true);
    if (updateAuthState) {
      this._authState.set('loading');
      this.authStateSubject.next('loading');
    }
  }

  private finishLoading(): void {
    this._isLoading.set(false);
    this.isLoadingSubject.next(false);
  }

  private notifyError(error: HttpErrorResponse, operation: string): void {
    const problem = this.readProblem(error);
    const fieldDetails = problem?.fieldErrors
      ?.map((fieldError) => fieldError.message)
      .join('\n');

    void this.notificationService.toast({
      title: problem?.title,
      text:
        fieldDetails ||
        problem?.detail ||
        problem?.title ||
        `${error.statusText || 'Request failed'} - ${operation}`,
      icon: 'error',
    });
  }

  private readProblem(error: HttpErrorResponse): TreasuryProblem | undefined {
    const value: unknown = error.error;
    if (!value || typeof value !== 'object' || !('code' in value)) {
      return undefined;
    }
    return value as TreasuryProblem;
  }
}
