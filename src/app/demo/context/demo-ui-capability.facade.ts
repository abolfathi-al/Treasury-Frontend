// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UiCapability, UiCapabilityFacade } from '@core/state/context';
import { DemoContextStore } from './demo-context.store';

@Injectable()
export class DemoUiCapabilityFacade extends UiCapabilityFacade {
  private readonly demoStore = inject(DemoContextStore);

  override readonly capabilities = computed(
    () => this.demoStore.state().uiCapabilities
  );
  override readonly permissionHints = computed(
    () => this.demoStore.state().permissionHints
  );

  getUiCapabilities(): readonly UiCapability[] {
    return this.demoStore.getUiCapabilities();
  }

  override loadCapabilities(
    _activeAccessContextId: string,
    _actorContextId: string
  ): Observable<readonly UiCapability[]> {
    return of(this.demoStore.getUiCapabilities());
  }

  override canShow(capabilityKey: string): boolean {
    const capability = this.explain(capabilityKey);
    return !!capability?.visible;
  }

  override explain(capabilityKey: string): UiCapability | undefined {
    return this.demoStore
      .getUiCapabilities()
      .find((capability) => capability.key === capabilityKey);
  }
}
