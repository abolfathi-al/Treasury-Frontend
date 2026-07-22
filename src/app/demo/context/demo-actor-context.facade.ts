// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ActorContext,
  ActorContextFacade,
  ActorMembership,
  ContextSwitchRequest,
  ContextSwitchResult,
} from '@core/state/context';
import { DemoContextStore } from './demo-context.store';

@Injectable()
export class DemoActorContextFacade extends ActorContextFacade {
  private readonly demoStore = inject(DemoContextStore);

  override readonly actorContext = computed(
    () => this.demoStore.state().actorContext
  );
  override readonly actorMemberships = computed(
    () => this.demoStore.state().actorMemberships
  );

  getActorMemberships(): readonly ActorMembership[] {
    return this.demoStore.getActorMemberships();
  }

  getActiveActorContext(): ActorContext | undefined {
    return this.demoStore.getActiveActorContext();
  }

  override listActorMemberships(
    _activeAccessContextId: string
  ): Observable<readonly ActorMembership[]> {
    return of(this.demoStore.listActorMembershipsForActiveContext());
  }

  override activateActor(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult> {
    return of(this.demoStore.switchActorContext(request));
  }

  switchActorContext(request: ContextSwitchRequest): ContextSwitchResult {
    return this.demoStore.switchActorContext(request);
  }

  override clearActorContext(): void {
    this.demoStore.clearLocalState();
  }
}
