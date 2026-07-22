import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActorContext,
  ActorMembership,
  ContextSwitchRequest,
  ContextSwitchResult,
} from './context.models';

// Contract only. One active session must never merge SUPPLIER and CONSUMER actors.
export abstract class ActorContextFacade {
  abstract readonly actorContext: Signal<ActorContext | undefined>;
  abstract readonly actorMemberships: Signal<readonly ActorMembership[]>;

  abstract listActorMemberships(
    activeAccessContextId: string
  ): Observable<readonly ActorMembership[]>;
  abstract activateActor(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult>;
  abstract clearActorContext(): void;
}

