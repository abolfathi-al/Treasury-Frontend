// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AuthFacade,
  AuthFacadeState,
  ContextSwitchResult,
} from '@core/state/context';
import { DemoContextStore } from './demo-context.store';

@Injectable()
export class DemoAuthFacade extends AuthFacade {
  private readonly demoStore = inject(DemoContextStore);

  override readonly state = this.demoStore.state;
  override readonly isAuthenticated = this.demoStore.isAuthenticated;

  getAuthState(): AuthFacadeState {
    return this.demoStore.getAuthState();
  }

  override bootstrapSession(): Observable<AuthFacadeState> {
    return of(this.demoStore.bootstrapSession());
  }

  override startSsoLogin(_returnUrl?: string): Observable<void> {
    this.demoStore.startSsoLogin();
    return of(undefined);
  }

  override completeSsoCallback(_callbackUrl: string): Observable<ContextSwitchResult> {
    return of(this.demoStore.completeSsoCallback());
  }

  override logout(_reason?: string): Observable<void> {
    this.demoStore.logout();
    return of(undefined);
  }

  override clearLocalState(): void {
    this.demoStore.clearLocalState();
  }
}
