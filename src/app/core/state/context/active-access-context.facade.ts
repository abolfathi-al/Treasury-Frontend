import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActiveAccessContext,
  ContextSwitchRequest,
  ContextSwitchResult,
} from './context.models';

// Contract only. The backend must validate and persist active access context.
export abstract class ActiveAccessContextFacade {
  abstract readonly activeContext: Signal<ActiveAccessContext | undefined>;

  abstract listAvailableContexts(): Observable<readonly ActiveAccessContext[]>;
  abstract createContext(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult>;
  abstract switchContext(
    request: ContextSwitchRequest
  ): Observable<ContextSwitchResult>;
  abstract clearActiveContext(): void;
}

