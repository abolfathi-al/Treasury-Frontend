// Demo only. Not an authorization source of truth. Backend must enforce real access.
import { Injectable, computed, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ActiveAccessContext,
  ActorContext,
  ActorMembership,
  AuthFacadeState,
  ContextSwitchRequest,
  ContextSwitchResult,
  OrganizationContext,
  OrganizationMembership,
  UiCapability,
} from './context.models';
import {
  DEMO_ACTOR_MEMBERSHIPS,
  DEMO_IDENTITY,
  DEMO_ORGANIZATION_CONTEXTS,
  DEMO_ORGANIZATION_MEMBERSHIPS,
  buildDemoActiveAccessContext,
  buildDemoActorContext,
  buildDemoPermissionHints,
  buildDemoUiCapabilities,
  createDemoAuthFacadeState,
  createDisabledDemoAuthFacadeState,
} from './demo-context.fixtures';

@Injectable({ providedIn: 'root' })
export class DemoContextStore {
  private readonly demoModeEnabled = environment.contextDemoMode === true;
  private contextVersion = 1;
  private readonly _state = signal<AuthFacadeState>(
    this.demoModeEnabled
      ? createDemoAuthFacadeState()
      : createDisabledDemoAuthFacadeState()
  );

  readonly state = this._state.asReadonly();
  readonly isAuthenticated = computed(
    () => this._state().status === 'authenticated' && !!this._state().identity
  );

  getAuthState(): AuthFacadeState {
    this.assertDemoModeEnabled();
    return this._state();
  }

  getOrganizationContexts(): readonly OrganizationContext[] {
    this.assertDemoModeEnabled();
    return DEMO_ORGANIZATION_CONTEXTS;
  }

  getActorMemberships(): readonly ActorMembership[] {
    this.assertDemoModeEnabled();
    return DEMO_ACTOR_MEMBERSHIPS;
  }

  getActiveAccessContext(): ActiveAccessContext | undefined {
    this.assertDemoModeEnabled();
    return this._state().activeAccessContext;
  }

  getActiveActorContext(): ActorContext | undefined {
    this.assertDemoModeEnabled();
    return this._state().actorContext;
  }

  getUiCapabilities(): readonly UiCapability[] {
    this.assertDemoModeEnabled();
    return this._state().uiCapabilities;
  }

  bootstrapSession(): AuthFacadeState {
    this.assertDemoModeEnabled();
    const state = createDemoAuthFacadeState();
    this.contextVersion = state.contextVersion ?? 1;
    this._state.set(state);
    return state;
  }

  startSsoLogin(): void {
    this.assertDemoModeEnabled();
    this.patchState({ status: 'sso_redirecting' });
  }

  completeSsoCallback(): ContextSwitchResult {
    this.assertDemoModeEnabled();
    const state = this.bootstrapSession();
    return {
      accepted: true,
      state,
      redirectTo: '/',
      contextVersion: state.contextVersion,
    };
  }

  logout(): void {
    this.assertDemoModeEnabled();
    this._state.set({
      status: 'unauthenticated',
      organizationMemberships: [],
      actorMemberships: [],
      permissionHints: [],
      uiCapabilities: [],
      isDemoMode: true,
    });
  }

  clearLocalState(): void {
    this.logout();
  }

  listActorMembershipsForActiveContext(): readonly ActorMembership[] {
    this.assertDemoModeEnabled();
    const activeContext = this._state().activeAccessContext;

    if (!activeContext) {
      return [];
    }

    return DEMO_ACTOR_MEMBERSHIPS.filter(
      (membership) => membership.organizationId === activeContext.organizationId
    );
  }

  switchOrganizationContext(
    request: ContextSwitchRequest
  ): ContextSwitchResult {
    this.assertDemoModeEnabled();

    const membership = this.findOrganizationMembership(request);
    if (!membership) {
      return this.deny('Demo organization membership was not found.');
    }

    const organization = this.findOrganizationById(membership.organizationId);
    if (!organization) {
      return this.deny('Demo organization context was not found.');
    }

    const contextVersion = this.nextContextVersion();
    const activeAccessContext = buildDemoActiveAccessContext(
      organization,
      membership,
      contextVersion
    );
    const actorMembership =
      this.findDefaultActorMembership(membership.id) ??
      this.findAnyActorMembership(membership.id);
    const actorContext = actorMembership
      ? buildDemoActorContext(activeAccessContext, actorMembership, contextVersion)
      : undefined;

    this.applyContextState({
      organization,
      membership,
      activeAccessContext,
      actorContext,
      contextVersion,
      redirectTo: request.returnUrl,
    });

    return {
      accepted: true,
      state: this._state(),
      redirectTo: request.returnUrl,
      contextVersion,
    };
  }

  switchActorContext(request: ContextSwitchRequest): ContextSwitchResult {
    this.assertDemoModeEnabled();

    const actorMembership = this.findActorMembership(request);
    if (!actorMembership) {
      return this.deny('Demo actor membership was not found.');
    }

    const organization = this.findOrganizationById(actorMembership.organizationId);
    const membership = this.findOrganizationMembershipById(
      actorMembership.organizationMembershipId
    );

    if (!organization || !membership) {
      return this.deny('Demo actor context cannot resolve organization state.');
    }

    const contextVersion = this.nextContextVersion();
    const activeAccessContext = buildDemoActiveAccessContext(
      organization,
      membership,
      contextVersion
    );
    const actorContext = buildDemoActorContext(
      activeAccessContext,
      actorMembership,
      contextVersion
    );

    this.applyContextState({
      organization,
      membership,
      activeAccessContext,
      actorContext,
      contextVersion,
      redirectTo: request.returnUrl,
    });

    return {
      accepted: true,
      state: this._state(),
      redirectTo: request.returnUrl,
      contextVersion,
    };
  }

  private applyContextState({
    organization,
    membership,
    activeAccessContext,
    actorContext,
    contextVersion,
  }: {
    organization: OrganizationContext;
    membership: OrganizationMembership;
    activeAccessContext: ActiveAccessContext;
    actorContext?: ActorContext;
    contextVersion: number;
    redirectTo?: string;
  }): void {
    const permissionHints = buildDemoPermissionHints(actorContext);
    const uiCapabilities = buildDemoUiCapabilities(actorContext);

    this._state.set({
      status: actorContext ? 'authenticated' : 'selecting_actor',
      identity: DEMO_IDENTITY,
      organizationContext: organization,
      organizationMemberships: DEMO_ORGANIZATION_MEMBERSHIPS,
      selectedOrganizationMembership: membership,
      activeAccessContext,
      actorMemberships: DEMO_ACTOR_MEMBERSHIPS,
      actorContext,
      permissionHints,
      uiCapabilities,
      contextVersion,
      isDemoMode: true,
    });
  }

  private findOrganizationMembership(
    request: ContextSwitchRequest
  ): OrganizationMembership | undefined {
    if (request.targetOrganizationMembershipId) {
      return this.findOrganizationMembershipById(
        request.targetOrganizationMembershipId
      );
    }

    if (request.targetOrganizationId) {
      return DEMO_ORGANIZATION_MEMBERSHIPS.find(
        (membership) => membership.organizationId === request.targetOrganizationId
      );
    }

    return undefined;
  }

  private findOrganizationMembershipById(
    membershipId: string
  ): OrganizationMembership | undefined {
    return DEMO_ORGANIZATION_MEMBERSHIPS.find(
      (membership) => membership.id === membershipId
    );
  }

  private findOrganizationById(
    organizationId: string
  ): OrganizationContext | undefined {
    return DEMO_ORGANIZATION_CONTEXTS.find(
      (organization) => organization.id === organizationId
    );
  }

  private findActorMembership(
    request: ContextSwitchRequest
  ): ActorMembership | undefined {
    if (request.targetActorMembershipId) {
      return DEMO_ACTOR_MEMBERSHIPS.find(
        (membership) => membership.id === request.targetActorMembershipId
      );
    }

    return DEMO_ACTOR_MEMBERSHIPS.find((membership) => {
      const actorTypeMatches =
        !request.actorType || membership.actorType === request.actorType;
      const subtypeMatches =
        !request.consumerActorSubtype ||
        membership.consumerActorSubtype === request.consumerActorSubtype;
      const supplierMatches =
        !request.supplierId || membership.supplierId === request.supplierId;
      return actorTypeMatches && subtypeMatches && supplierMatches;
    });
  }

  private findDefaultActorMembership(
    organizationMembershipId: string
  ): ActorMembership | undefined {
    return DEMO_ACTOR_MEMBERSHIPS.find(
      (membership) =>
        membership.organizationMembershipId === organizationMembershipId &&
        membership.actorType === 'CONSUMER'
    );
  }

  private findAnyActorMembership(
    organizationMembershipId: string
  ): ActorMembership | undefined {
    return DEMO_ACTOR_MEMBERSHIPS.find(
      (membership) =>
        membership.organizationMembershipId === organizationMembershipId
    );
  }

  private patchState(patch: Partial<AuthFacadeState>): void {
    this._state.set({
      ...this._state(),
      ...patch,
    });
  }

  private deny(denialReason: string): ContextSwitchResult {
    this.patchState({
      lastError: denialReason,
    });

    return {
      accepted: false,
      state: this._state(),
      denialReason,
      contextVersion: this._state().contextVersion,
    };
  }

  private nextContextVersion(): number {
    this.contextVersion += 1;
    return this.contextVersion;
  }

  private assertDemoModeEnabled(): void {
    if (!this.demoModeEnabled) {
      throw new Error(
        'Context demo mode is disabled. Enable environment.contextDemoMode only for demo shell development.'
      );
    }
  }
}

