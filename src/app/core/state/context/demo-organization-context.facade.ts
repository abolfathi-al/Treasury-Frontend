// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  OrganizationContext,
  OrganizationMembership,
} from './context.models';
import { OrganizationContextFacade } from './organization-context.facade';
import { DemoContextStore } from './demo-context.store';

@Injectable()
export class DemoOrganizationContextFacade extends OrganizationContextFacade {
  private readonly demoStore = inject(DemoContextStore);

  override readonly organizationContext = computed(
    () => this.demoStore.state().organizationContext
  );
  override readonly memberships = computed(
    () => this.demoStore.state().organizationMemberships
  );

  getOrganizationContexts(): readonly OrganizationContext[] {
    return this.demoStore.getOrganizationContexts();
  }

  override resolveFromHost(
    hostname: string
  ): Observable<OrganizationContext | undefined> {
    return of(
      this.demoStore
        .getOrganizationContexts()
        .find((organization) => organization.resolvedHost === hostname)
    );
  }

  override listMemberships(
    organizationId: string
  ): Observable<readonly OrganizationMembership[]> {
    return of(
      this.demoStore
        .getAuthState()
        .organizationMemberships.filter(
          (membership) => membership.organizationId === organizationId
        )
    );
  }

  override selectMembership(
    membershipId: string
  ): Observable<OrganizationMembership> {
    const result = this.demoStore.switchOrganizationContext({
      targetOrganizationMembershipId: membershipId,
    });

    if (!result.accepted || !result.state.selectedOrganizationMembership) {
      throw new Error(result.denialReason ?? 'Demo membership selection failed.');
    }

    return of(result.state.selectedOrganizationMembership);
  }

  override clearOrganizationContext(): void {
    this.demoStore.clearLocalState();
  }
}
