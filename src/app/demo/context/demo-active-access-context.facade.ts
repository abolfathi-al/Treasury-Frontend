// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ActiveAccessContext,
  ActiveAccessContextFacade,
  ContextSwitchRequest,
  ContextSwitchResult,
} from '@core/state/context';
import { DemoContextStore } from './demo-context.store';

@Injectable()
export class DemoActiveAccessContextFacade extends ActiveAccessContextFacade {
  private readonly demoStore = inject(DemoContextStore);

  override readonly activeContext = computed(
    () => this.demoStore.state().activeAccessContext
  );

  getActiveAccessContext(): ActiveAccessContext | undefined {
    return this.demoStore.getActiveAccessContext();
  }

  switchOrganizationContext(
    request: ContextSwitchRequest
  ): ContextSwitchResult {
    return this.demoStore.switchOrganizationContext(request);
  }

  override listAvailableContexts(): Observable<readonly ActiveAccessContext[]> {
    const activeContext = this.demoStore.getActiveAccessContext();
    return of(activeContext ? [activeContext] : []);
  }

  override createContext(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult> {
    return of(this.demoStore.switchOrganizationContext(request));
  }

  override switchContext(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult> {
    return of(this.demoStore.switchOrganizationContext(request));
  }

  override clearActiveContext(): void {
    this.demoStore.clearLocalState();
  }
}
