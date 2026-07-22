import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacadeState, ContextSwitchResult } from './context.models';

// Contract only. Do not add HTTP calls, token persistence, or legacy auth wiring here.
export abstract class AuthFacade {
  abstract readonly state: Signal<AuthFacadeState>;
  abstract readonly isAuthenticated: Signal<boolean>;

  abstract bootstrapSession(): Observable<AuthFacadeState>;
  abstract startSsoLogin(returnUrl?: string): Observable<void>;
  abstract completeSsoCallback(callbackUrl: string): Observable<ContextSwitchResult>;
  abstract logout(reason?: string): Observable<void>;
  abstract clearLocalState(): void;
}

