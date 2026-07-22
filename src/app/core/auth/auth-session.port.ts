import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthModel } from '@models/auth';

export interface AuthenticatedRequestUser {
  readonly companyCode?: string;
  readonly fourCharsFinancialYear?: string;
}

export interface AuthUserSnapshot extends AuthenticatedRequestUser {
  readonly name?: string;
  readonly fullname?: string;
  readonly username?: string;
  readonly email?: string;
  readonly companyName?: string;
  readonly pic?: string;
  readonly role?: string;
  readonly isAdmin?: boolean;
  readonly logoUrl?: string;
}

export interface AuthSessionPort {
  initializeAuth(): Promise<unknown>;
  getAuthToken(): AuthModel | undefined;
  refreshAccessToken(): Observable<AuthModel | undefined>;
  logout(): void;
  getCurrentUserSnapshot(): AuthUserSnapshot | undefined;
  getCurrentUserChanges(): Observable<AuthUserSnapshot | undefined>;
}

export const AUTH_SESSION = new InjectionToken<AuthSessionPort>('AUTH_SESSION');
