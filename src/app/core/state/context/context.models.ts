export type ActorType = 'SUPPLIER' | 'CONSUMER';

export type ConsumerActorSubtype =
  | 'AGENCY'
  | 'ORGANIZATION'
  | 'PLATFORM'
  | 'API_CLIENT'
  | 'API_TOKEN'
  | 'MARKETPLACE_CHANNEL'
  | 'B2B_PARTNER';

export type OrganizationType =
  | 'AGENCY'
  | 'ORGANIZATION'
  | 'PLATFORM'
  | 'MARKETPLACE'
  | 'B2B_PARTNER'
  | 'SUPPLIER';

export type MembershipStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'EXPIRED';

export type ContextStatus =
  | 'ACTIVE'
  | 'PENDING_SELECTION'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'REVOKED';

export type AuthFacadeStatus =
  | 'idle'
  | 'unauthenticated'
  | 'sso_redirecting'
  | 'sso_callback'
  | 'selecting_organization'
  | 'selecting_actor'
  | 'creating_context'
  | 'authenticated'
  | 'logging_out'
  | 'error';

export type PermissionHintEffect = 'ALLOW' | 'DENY' | 'CONDITIONAL';

export type UiCapabilitySource =
  | 'EFFECTIVE_ACCESS_HINT'
  | 'BACKEND_DECISION'
  | 'DEMO_MODE';

export interface IdentitySummary {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly primaryIssuer?: string;
  readonly externalSubject?: string;
  readonly status: MembershipStatus;
  readonly mfaSatisfied?: boolean;
}

export interface OrganizationContext {
  readonly id: string;
  readonly type: OrganizationType;
  readonly name: string;
  readonly code?: string;
  readonly tenantId?: string;
  readonly parentOrganizationId?: string;
  readonly resolvedHost: string;
  readonly subdomain?: string;
  readonly customDomain?: string;
  readonly status: ContextStatus;
}

export interface OrganizationMembership {
  readonly id: string;
  readonly identityId: string;
  readonly organizationId: string;
  readonly tenantMembershipId?: string;
  readonly roleTemplateId?: string;
  readonly roleTemplateKey?: string;
  readonly roleKey?: string;
  readonly roleLabel?: string;
  readonly status: MembershipStatus;
  readonly source?: 'SSO' | 'INVITATION' | 'SCIM' | 'MANUAL' | 'MIGRATED';
  readonly visibleInDirectory: boolean;
  readonly createdAt?: string;
  readonly lastActiveAt?: string;
}

export interface ActiveAccessContext {
  readonly id: string;
  readonly identityId: string;
  readonly organizationId: string;
  readonly tenantId?: string;
  readonly organizationMembershipId: string;
  readonly tenantMembershipId?: string;
  readonly supplierMembershipId?: string;
  readonly customerMembershipId?: string;
  readonly channelId?: string;
  readonly resolvedHost: string;
  readonly contextVersion: number;
  readonly scopeHash?: string;
  readonly status: ContextStatus;
  readonly expiresAt?: string;
}

export interface ActorMembership {
  readonly id: string;
  readonly identityId: string;
  readonly organizationId: string;
  readonly organizationMembershipId: string;
  readonly actorType: ActorType;
  readonly consumerActorSubtype?: ConsumerActorSubtype;
  readonly supplierId?: string;
  readonly apiClientId?: string;
  readonly marketplaceChannelId?: string;
  readonly roleTemplateId?: string;
  readonly roleTemplateKey?: string;
  readonly roleKey?: string;
  readonly roleLabel?: string;
  readonly status: MembershipStatus;
  readonly displayName?: string;
}

export interface ActorContext {
  readonly id: string;
  readonly activeAccessContextId: string;
  readonly identityId: string;
  readonly actorMembershipId: string;
  readonly actorType: ActorType;
  readonly consumerActorSubtype?: ConsumerActorSubtype;
  readonly organizationId: string;
  readonly supplierId?: string;
  readonly apiClientId?: string;
  readonly marketplaceChannelId?: string;
  readonly contextVersion: number;
  readonly status: ContextStatus;
  readonly expiresAt?: string;
}

export interface ContextSwitchRequest {
  readonly targetOrganizationId?: string;
  readonly targetOrganizationMembershipId?: string;
  readonly targetActiveAccessContextId?: string;
  readonly targetActorMembershipId?: string;
  readonly actorType?: ActorType;
  readonly consumerActorSubtype?: ConsumerActorSubtype;
  readonly supplierId?: string;
  readonly returnUrl?: string;
  readonly reason?: string;
}

export interface ContextSwitchResult {
  readonly accepted: boolean;
  readonly state: AuthFacadeState;
  readonly redirectTo?: string;
  readonly denialReason?: string;
  readonly contextVersion?: number;
  readonly requiresSso?: boolean;
}

export interface EffectivePermissionHint {
  readonly key: string;
  readonly action?: string;
  readonly resource?: string;
  readonly effect: PermissionHintEffect;
  readonly scopeHash?: string;
  readonly reason?: string;
  readonly expiresAt?: string;
}

export interface UiCapability {
  readonly key: string;
  readonly visible: boolean;
  readonly enabled: boolean;
  readonly label?: string;
  readonly reason?: string;
  readonly permissionHintKeys?: readonly string[];
  readonly riskTier?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly requiresMfa?: boolean;
  readonly source: UiCapabilitySource;
}

export interface AuthFacadeState {
  readonly status: AuthFacadeStatus;
  readonly identity?: IdentitySummary;
  readonly organizationContext?: OrganizationContext;
  readonly organizationMemberships: readonly OrganizationMembership[];
  readonly selectedOrganizationMembership?: OrganizationMembership;
  readonly activeAccessContext?: ActiveAccessContext;
  readonly actorMemberships: readonly ActorMembership[];
  readonly actorContext?: ActorContext;
  readonly permissionHints: readonly EffectivePermissionHint[];
  readonly uiCapabilities: readonly UiCapability[];
  readonly contextVersion?: number;
  readonly isDemoMode: boolean;
  readonly lastError?: string;
}
