import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthenticatedRequestUser {
  readonly companyCode?: string;
  readonly fourCharsFinancialYear?: string;
}

export interface AuthUserSnapshot extends AuthenticatedRequestUser {
  readonly sessionId?: string;
  readonly authenticatedAt?: string;
  readonly idleExpiresAt?: string;
  readonly absoluteExpiresAt?: string;
  readonly assurance?: string;
  readonly userId?: string;
  readonly userDisplayName?: string;
  readonly effectivePermissions?: readonly string[];
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
  invalidateSession(): void;
  logout(): void;
  getCurrentUserSnapshot(): AuthUserSnapshot | undefined;
  getCurrentUserChanges(): Observable<AuthUserSnapshot | undefined>;
}

export const AUTH_SESSION = new InjectionToken<AuthSessionPort>('AUTH_SESSION');
