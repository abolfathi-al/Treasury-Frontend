// Demo only. Not an authorization source of truth. Backend must enforce real access.
import {
  ActiveAccessContext,
  ActorContext,
  ActorMembership,
  AuthFacadeState,
  EffectivePermissionHint,
  IdentitySummary,
  OrganizationContext,
  OrganizationMembership,
  UiCapability,
} from './context.models';

export const DEMO_CONTEXT_EXPIRES_AT = '2026-12-31T23:59:59.000Z';
export const DEMO_INITIAL_CONTEXT_VERSION = 1;

export const DEMO_IDENTITY: IdentitySummary = {
  id: 'demo_identity_alireza_abolfathi',
  displayName: 'Alireza Abolfathi',
  email: 'alireza.abolfathi@velora.demo',
  primaryIssuer: 'demo-sso',
  externalSubject: 'demo-sso|alireza-abolfathi',
  status: 'ACTIVE',
  mfaSatisfied: true,
};

export const DEMO_ORGANIZATION_CONTEXTS: readonly OrganizationContext[] = [
  {
    id: 'demo_org_platform',
    type: 'PLATFORM',
    name: 'Velora Platform',
    code: 'PLATFORM',
    tenantId: 'demo_tenant_platform',
    resolvedHost: 'platform.velora.local',
    subdomain: 'platform',
    status: 'ACTIVE',
  },
  {
    id: 'demo_org_workspace_ops',
    type: 'ORGANIZATION',
    name: 'Workspace Operations',
    code: 'WORKSPACE_OPS',
    tenantId: 'demo_tenant_workspace_ops',
    resolvedHost: 'workspace.velora.local',
    subdomain: 'workspace',
    status: 'ACTIVE',
  },
  {
    id: 'demo_org_access_governance',
    type: 'ORGANIZATION',
    name: 'Access Governance',
    code: 'ACCESS_GOV',
    tenantId: 'demo_tenant_access_governance',
    resolvedHost: 'access.velora.local',
    subdomain: 'access',
    status: 'ACTIVE',
  },
];

export const DEMO_ORGANIZATION_MEMBERSHIPS: readonly OrganizationMembership[] = [
  {
    id: 'demo_org_membership_platform',
    identityId: DEMO_IDENTITY.id,
    organizationId: 'demo_org_platform',
    tenantMembershipId: 'demo_tenant_membership_platform',
    roleTemplateId: 'demo_role_template_platform_operator',
    roleTemplateKey: 'platform.operator',
    roleKey: 'platform.operator',
    roleLabel: 'Platform Operator',
    status: 'ACTIVE',
    source: 'SSO',
    visibleInDirectory: true,
    createdAt: '2026-01-15T08:00:00.000Z',
    lastActiveAt: '2026-06-02T08:30:00.000Z',
  },
  {
    id: 'demo_org_membership_workspace_ops',
    identityId: DEMO_IDENTITY.id,
    organizationId: 'demo_org_workspace_ops',
    tenantMembershipId: 'demo_tenant_membership_workspace_ops',
    roleTemplateId: 'demo_role_template_workspace_operator',
    roleTemplateKey: 'workspace.operator',
    roleKey: 'workspace.operator',
    roleLabel: 'Workspace Operator',
    status: 'ACTIVE',
    source: 'SSO',
    visibleInDirectory: true,
    createdAt: '2026-02-10T08:00:00.000Z',
    lastActiveAt: '2026-06-02T08:30:00.000Z',
  },
  {
    id: 'demo_org_membership_access_governance',
    identityId: DEMO_IDENTITY.id,
    organizationId: 'demo_org_access_governance',
    tenantMembershipId: 'demo_tenant_membership_access_governance',
    roleTemplateId: 'demo_role_template_access_reviewer',
    roleTemplateKey: 'access.reviewer',
    roleKey: 'access.reviewer',
    roleLabel: 'Access Reviewer',
    status: 'ACTIVE',
    source: 'SSO',
    visibleInDirectory: true,
    createdAt: '2026-03-01T08:00:00.000Z',
    lastActiveAt: '2026-06-02T08:15:00.000Z',
  },
];

export const DEMO_ACTOR_MEMBERSHIPS: readonly ActorMembership[] = [
  {
    id: 'demo_actor_membership_workspace_ops',
    identityId: DEMO_IDENTITY.id,
    organizationId: 'demo_org_workspace_ops',
    organizationMembershipId: 'demo_org_membership_workspace_ops',
    actorType: 'CONSUMER',
    consumerActorSubtype: 'ORGANIZATION',
    roleTemplateId: 'demo_role_template_workspace_operator',
    roleTemplateKey: 'workspace.operator',
    roleKey: 'workspace.operator',
    roleLabel: 'Workspace Operator',
    status: 'ACTIVE',
    displayName: 'Workspace Operations',
  },
  {
    id: 'demo_actor_membership_access_governance',
    identityId: DEMO_IDENTITY.id,
    organizationId: 'demo_org_access_governance',
    organizationMembershipId: 'demo_org_membership_access_governance',
    actorType: 'CONSUMER',
    consumerActorSubtype: 'ORGANIZATION',
    roleTemplateId: 'demo_role_template_access_reviewer',
    roleTemplateKey: 'access.reviewer',
    roleKey: 'access.reviewer',
    roleLabel: 'Access Reviewer',
    status: 'ACTIVE',
    displayName: 'Access Governance',
  },
];

export const DEMO_ACTIVE_ACCESS_CONTEXT: ActiveAccessContext = {
  id: 'demo_active_access_context_workspace_ops',
  identityId: DEMO_IDENTITY.id,
  organizationId: 'demo_org_workspace_ops',
  tenantId: 'demo_tenant_workspace_ops',
  organizationMembershipId: 'demo_org_membership_workspace_ops',
  tenantMembershipId: 'demo_tenant_membership_workspace_ops',
  resolvedHost: 'workspace.velora.local',
  contextVersion: DEMO_INITIAL_CONTEXT_VERSION,
  scopeHash: 'demo_scope_workspace_ops',
  status: 'ACTIVE',
  expiresAt: DEMO_CONTEXT_EXPIRES_AT,
};

export const DEMO_ACTIVE_ACTOR_CONTEXT: ActorContext = {
  id: 'demo_actor_context_workspace_ops',
  activeAccessContextId: DEMO_ACTIVE_ACCESS_CONTEXT.id,
  identityId: DEMO_IDENTITY.id,
  actorMembershipId: 'demo_actor_membership_workspace_ops',
  actorType: 'CONSUMER',
  consumerActorSubtype: 'ORGANIZATION',
  organizationId: 'demo_org_workspace_ops',
  contextVersion: DEMO_INITIAL_CONTEXT_VERSION,
  status: 'ACTIVE',
  expiresAt: DEMO_CONTEXT_EXPIRES_AT,
};

export function buildDemoActiveAccessContext(
  organization: OrganizationContext,
  membership: OrganizationMembership,
  contextVersion: number
): ActiveAccessContext {
  return {
    id: `demo_active_access_context_${membership.id}`,
    identityId: DEMO_IDENTITY.id,
    organizationId: organization.id,
    tenantId: organization.tenantId,
    organizationMembershipId: membership.id,
    tenantMembershipId: membership.tenantMembershipId,
    resolvedHost: organization.resolvedHost,
    contextVersion,
    scopeHash: `demo_scope_${organization.code?.toLowerCase() ?? organization.id}`,
    status: 'ACTIVE',
    expiresAt: DEMO_CONTEXT_EXPIRES_AT,
  };
}

export function buildDemoActorContext(
  activeAccessContext: ActiveAccessContext,
  actorMembership: ActorMembership,
  contextVersion: number
): ActorContext {
  return {
    id: `demo_actor_context_${actorMembership.id}`,
    activeAccessContextId: activeAccessContext.id,
    identityId: DEMO_IDENTITY.id,
    actorMembershipId: actorMembership.id,
    actorType: actorMembership.actorType,
    consumerActorSubtype: actorMembership.consumerActorSubtype,
    organizationId: actorMembership.organizationId,
    supplierId: actorMembership.supplierId,
    apiClientId: actorMembership.apiClientId,
    marketplaceChannelId: actorMembership.marketplaceChannelId,
    contextVersion,
    status: 'ACTIVE',
    expiresAt: DEMO_CONTEXT_EXPIRES_AT,
  };
}

export function buildDemoPermissionHints(_actorContext?: ActorContext): readonly EffectivePermissionHint[] {
  return [
    {
      key: 'dashboard.view',
      action: 'view',
      resource: 'dashboard',
      effect: 'ALLOW',
      reason: 'Demo shell dashboard visibility hint.',
    },
    {
      key: 'memberships.view',
      action: 'read',
      resource: 'organization_membership',
      effect: 'ALLOW',
      reason: 'Demo shell membership directory visibility hint.',
    },
    {
      key: 'audit.metadata.view',
      action: 'read',
      resource: 'audit_metadata',
      effect: 'ALLOW',
      reason: 'Demo shell audit metadata visibility hint.',
    },
    {
      key: 'platform.settings.view',
      action: 'read',
      resource: 'platform_settings',
      effect: 'ALLOW',
      reason: 'Demo shell platform settings visibility hint.',
    },
  ];
}

export function buildDemoUiCapabilities(_actorContext?: ActorContext): readonly UiCapability[] {
  const permissionHints = buildDemoPermissionHints();
  const hasAllowedHint = (key: string): boolean =>
    permissionHints.some((hint) => hint.key === key && hint.effect === 'ALLOW');

  return [
    {
      key: 'nav.dashboard',
      visible: true,
      enabled: hasAllowedHint('dashboard.view'),
      label: 'Dashboard',
      permissionHintKeys: ['dashboard.view'],
      source: 'DEMO_MODE',
    },
    {
      key: 'nav.memberships',
      visible: true,
      enabled: hasAllowedHint('memberships.view'),
      label: 'Memberships',
      permissionHintKeys: ['memberships.view'],
      source: 'DEMO_MODE',
    },
    {
      key: 'nav.auditMetadata',
      visible: true,
      enabled: hasAllowedHint('audit.metadata.view'),
      label: 'Audit Metadata',
      permissionHintKeys: ['audit.metadata.view'],
      source: 'DEMO_MODE',
    },
    {
      key: 'nav.platformSettings',
      visible: true,
      enabled: hasAllowedHint('platform.settings.view'),
      label: 'Platform Settings',
      permissionHintKeys: ['platform.settings.view'],
      source: 'DEMO_MODE',
    },
  ];
}

export function createDemoAuthFacadeState(): AuthFacadeState {
  const permissionHints = buildDemoPermissionHints();
  const uiCapabilities = buildDemoUiCapabilities();

  return {
    status: 'authenticated',
    identity: DEMO_IDENTITY,
    organizationContext: DEMO_ORGANIZATION_CONTEXTS[1],
    organizationMemberships: DEMO_ORGANIZATION_MEMBERSHIPS,
    selectedOrganizationMembership: DEMO_ORGANIZATION_MEMBERSHIPS[1],
    activeAccessContext: DEMO_ACTIVE_ACCESS_CONTEXT,
    actorMemberships: DEMO_ACTOR_MEMBERSHIPS,
    actorContext: DEMO_ACTIVE_ACTOR_CONTEXT,
    permissionHints,
    uiCapabilities,
    contextVersion: DEMO_INITIAL_CONTEXT_VERSION,
    isDemoMode: true,
  };
}

export function createDisabledDemoAuthFacadeState(): AuthFacadeState {
  return {
    status: 'idle',
    organizationMemberships: [],
    actorMemberships: [],
    permissionHints: [],
    uiCapabilities: [],
    isDemoMode: false,
  };
}
