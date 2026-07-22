import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EffectivePermissionHint,
  UiCapability,
} from './context.models';

// Contract only. UI capabilities are display hints; backend authorization is final.
export abstract class UiCapabilityFacade {
  abstract readonly capabilities: Signal<readonly UiCapability[]>;
  abstract readonly permissionHints: Signal<readonly EffectivePermissionHint[]>;

  abstract loadCapabilities(
    activeAccessContextId: string,
    actorContextId: string
  ): Observable<readonly UiCapability[]>;
  abstract canShow(capabilityKey: string): boolean;
  abstract explain(capabilityKey: string): UiCapability | undefined;
}

