import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError, map, catchError, switchMap, finalize, tap, first, shareReplay, lastValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import md5 from 'md5';

import { environment } from 'src/environments/environment';
import { AuthSessionPort } from '@core/auth';
import { SESSION_STORAGE } from '@core/tokens';
import { LoggerService } from '@core/services/logger.service';
import { AuthModel, UserModel } from '@models/auth';
import { PermissionService } from './permission.service';
import { NotificationService } from '@core/services/notification.service';
import { runSafely } from '@shared/directives/shared/directive-helpers';

export type UserType = UserModel | undefined;
export type AuthState = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

const API_USERS_URL = `${environment.apiUrl}/api/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthSessionPort {
  // Injected dependencies
  private readonly sessionStorage = inject<Storage>(SESSION_STORAGE, { optional: true });
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  // Private fields
  private readonly authLocalSessionToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // Signals for reactive state management
  private readonly _currentUser = signal<UserType>(undefined);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _authState = signal<AuthState>('idle');

  // Computed values
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly authState = computed(() => this._authState());
  readonly isAuthenticated = computed(() => this._authState() === 'authenticated');
  
  // Permission-related computed values (delegated to PermissionService)
  readonly permissions = computed(() => this.permissionService.permissions());
  readonly hasPermissions = computed(() => this.permissionService.hasPermissions());

  // Observable streams for backward compatibility
  readonly currentUser$: Observable<UserType>;
  readonly isLoading$: Observable<boolean>;
  readonly authState$: Observable<AuthState>;

  // Behavior subjects for observables
  readonly currentUserSubject = new BehaviorSubject<UserType>(undefined);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  private readonly authStateSubject = new BehaviorSubject<AuthState>('idle');

  constructor() {
    // Initialize observables
    this.currentUser$ = this.currentUserSubject.asObservable().pipe(shareReplay(1));
    this.isLoading$ = this.isLoadingSubject.asObservable().pipe(shareReplay(1));
    this.authState$ = this.authStateSubject.asObservable().pipe(shareReplay(1));
  }

  // Getters for backward compatibility
  get currentUserValue(): UserType {
    return this._currentUser();
  }

  set currentUserValue(user: UserType) {
    this._currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  get getAuthTokenFromSessionStorage(): AuthModel | undefined {
    return this.getAuthFromSessionStorage();
  }

  getAuthToken(): AuthModel | undefined {
    return this.getAuthFromSessionStorage();
  }

  getCurrentUserSnapshot(): UserType {
    return this.currentUserSubject.getValue();
  }

  getCurrentUserChanges(): Observable<UserType> {
    return this.currentUser$;
  }

  // Public method for APP_INITIALIZER to use
  initializeAuth(): Promise<UserType> {
    const auth = this.getAuthFromSessionStorage();
    if (!auth || !auth.accessToken) {
      this._authState.set('unauthenticated');
      return Promise.resolve(undefined);
    }
    
    this._authState.set('authenticated');
    return lastValueFrom(this.getUserByToken());
  }

  // Permission management methods (delegated to PermissionService)
  hasPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return this.permissionService.hasAnyPermission(permissions);
  }

  hasAllPermissions(permissions: string[]): boolean {
    return this.permissionService.hasAllPermissions(permissions);
  }

  private updatePermissions(permissions: string[]): void {
    this.permissionService.loadPermissions(permissions);
  }

  login(companyCode: string, twoCharsFiscalYear: string, username?: string, password?: string): Observable<UserType> {
    const request = {
      ...(username ? { username } : {}),
      ...(password ? { mD5Password: md5(password) } : {}),
      companyCode,
      twoCharsFiscalYear,
    };

    this._isLoading.set(true);
    this._authState.set('loading');
    this.isLoadingSubject.next(true);

    return this.http.post<AuthModel>(`${API_USERS_URL}/getToken`, request).pipe(
      map((data) => {
        this.setAuthFromSessionStorage(data);
        return data;
      }),
      switchMap(() => this.getUserByToken()),
      tap((user) => {
        if (user) {
          this._authState.set('authenticated');
          this._currentUser.set(user);
          this.currentUserSubject.next(user);
        }
      }),
      catchError((err) => {
        this.logger.error('Login error', 'AuthService', { error: err });
        this._authState.set('error');
        return this.handleError('login', undefined)(err);
      }),
      finalize(() => {
        this._isLoading.set(false);
        this.isLoadingSubject.next(false);
      })
    );
  }

  logout(): void {
    const auth = this.getAuthFromSessionStorage();

    // Clear all state
    this._currentUser.set(undefined);
    this._authState.set('unauthenticated');
    this._isLoading.set(false);

    // Update observables
    this.currentUserSubject.next(undefined);
    this.authStateSubject.next('unauthenticated');

    // Clear storage and permissions
    this.sessionStorage?.removeItem(this.authLocalSessionToken);
    
    this.permissionService.clearAll();

    // Navigate to login
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });

    // Call logout API if refresh token exists
    if (auth?.refreshToken) {
      this.http.post<void>(`${API_USERS_URL}/logout`, {
        refreshToken: auth.refreshToken
      }).pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.logger.error('Logout API error', 'AuthService', { error: err });
          return of(undefined);
        })
      ).subscribe();
    }
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromSessionStorage();
    if (!auth || !auth.accessToken) {
      this._authState.set('unauthenticated');
      return of(undefined);
    }

    this._isLoading.set(true);
    this.isLoadingSubject.next(true);

    return this.http.get<UserModel>(`${API_USERS_URL}/me`).pipe(
      map((user: UserType) => {
        if (user) {
          // Update permissions
          this.updatePermissions(user.accessList || []);
          
          // Update user state
          this._currentUser.set(user);
          this._authState.set('authenticated');
          this.currentUserSubject.next(user);
          this.authStateSubject.next('authenticated');
        } else {
          this.logout();
        }
        return user;
      }),
      catchError((err) => {
        this.logger.error('Get user by token error', 'AuthService', { error: err });
        this._authState.set('error');
        this.logout();
        return of(undefined);
      }),
      finalize(() => {
        this._isLoading.set(false);
        this.isLoadingSubject.next(false);
      })
    );
  }

  // Registration
  registration(user: UserModel): Observable<UserModel> {
    this._isLoading.set(true);
    this.isLoadingSubject.next(true);

    return this.http.post<UserModel>(API_USERS_URL, user).pipe(
      tap((registeredUser) => {
        this.logger.info('User registered successfully', 'AuthService', { user: registeredUser });
      }),
      catchError((err) => {
        this.logger.error('Registration error', 'AuthService', { error: err });
        return this.handleError('registration', user)(err);
      }),
      finalize(() => {
        this._isLoading.set(false);
        this.isLoadingSubject.next(false);
      })
    );
  }

  // Forgot password
  forgotPassword(email: string): Observable<boolean> {
    this._isLoading.set(true);
    this.isLoadingSubject.next(true);

    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, { email }).pipe(
      tap((success) => {
        if (success) {
          this.logger.info('Password reset email sent successfully', 'AuthService');
        }
      }),
      catchError((err) => {
        this.logger.error('Forgot password error', 'AuthService', { error: err });
        return this.handleError('forgot password', false)(err);
      }),
      finalize(() => {
        this._isLoading.set(false);
        this.isLoadingSubject.next(false);
      })
    );
  }

  // Refresh access token
  refreshAccessToken(): Observable<AuthModel | undefined> {
    const auth = this.getAuthFromSessionStorage();
    if (!auth || !auth.refreshToken) {
      return of(undefined);
    }

    return this.http.post<AuthModel>(`${API_USERS_URL}/refresh`, {
      refreshToken: auth.refreshToken
    }).pipe(
      map((data) => {
        this.setAuthFromSessionStorage(data);
        return data;
      }),
      catchError((err) => {
        this.logger.error('Token refresh error', 'AuthService', { error: err });
        this.logout();
        return of(undefined);
      })
    );
  }
  // Private methods
  private setAuthFromSessionStorage(auth: AuthModel) {
    runSafely(() => {
      if (!this.sessionStorage) return;
      this.sessionStorage.setItem(this.authLocalSessionToken, JSON.stringify(auth));
    }, (error) => this.logger.error('Failed to set auth from session storage', 'AuthService', { error }));
  }

  private getAuthFromSessionStorage(): AuthModel | undefined {
    return runSafely(() => {
      if (!this.sessionStorage) return undefined;
      const lsValue = this.sessionStorage.getItem(this.authLocalSessionToken);
      if (!lsValue) return undefined;
      return JSON.parse(lsValue);
    }, (error) => this.logger.error('Failed to get auth from session storage', 'AuthService', { error }));
  }

  // Error handling
  handleError<T>(operation = 'operation', result?: T) {
    return ({ error: { errors, title } = {} }: HttpErrorResponse): Observable<T> => {
      this.notificationService.toast({
        ...(Array.isArray(errors) ? {
          title: undefined,
          html: errors.map(({ errorMessage }: { errorMessage: string }) => errorMessage).join('<br/>'),
        } : {
          text: `${title || errors} - ${operation}`,
        }),
        icon: 'error',
      });

      if (result) {
        return of(result);
      }

      return throwError(() => new Error(errors));
    };
  }

}
