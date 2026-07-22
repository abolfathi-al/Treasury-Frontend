import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OrganizationContext,
  OrganizationMembership,
} from './context.models';

// Contract only. Organization directories must list memberships, not identities.
export abstract class OrganizationContextFacade {
  abstract readonly organizationContext: Signal<OrganizationContext | undefined>;
  abstract readonly memberships: Signal<readonly OrganizationMembership[]>;

  abstract resolveFromHost(hostname: string): Observable<OrganizationContext | undefined>;
  abstract listMemberships(
    organizationId: string
  ): Observable<readonly OrganizationMembership[]>;
  abstract selectMembership(
    membershipId: string
  ): Observable<OrganizationMembership>;
  abstract clearOrganizationContext(): void;
}

