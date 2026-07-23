import type { AuthFacadeState } from '@core/state/context';
import type { AuthUserSnapshot } from '@core/auth';

export interface ShellProfile {
  readonly name: string;
  readonly email: string;
  readonly companyName: string;
  readonly companyCode: string;
  readonly avatarText: string;
  readonly pic?: string;
  readonly roleLabel?: string;
  readonly isAdmin: boolean;
}

export function resolveShellProfile(
  legacyUser: AuthUserSnapshot | undefined,
  contextState?: AuthFacadeState,
): ShellProfile | null {
  if (legacyUser) {
    const name =
      legacyUser.userDisplayName ||
      legacyUser.name ||
      legacyUser.fullname ||
      legacyUser.username ||
      legacyUser.email ||
      'User';

    return {
      name,
      email: legacyUser.email ?? '',
      companyName: legacyUser.companyName ?? '',
      companyCode: legacyUser.companyCode ?? '',
      avatarText:
        normalizeAvatarText(legacyUser.fourCharsFinancialYear) ||
        getInitials(name),
      pic: legacyUser.pic,
      roleLabel: legacyUser.role,
      isAdmin: legacyUser.isAdmin ?? false,
    };
  }

  if (contextState?.status !== 'authenticated' || !contextState.identity) {
    return null;
  }

  const identity = contextState.identity;
  const organization = contextState.organizationContext;
  const membership =
    contextState.selectedOrganizationMembership ??
    contextState.organizationMemberships[0];
  const name = identity.displayName.trim();

  if (!name) {
    return null;
  }

  return {
    name,
    email: identity.email ?? '',
    companyName: organization?.name ?? 'Velora Enterprise',
    companyCode: organization?.code ?? organization?.subdomain ?? '',
    avatarText: getInitials(name),
    pic: identity.avatarUrl,
    roleLabel: membership?.roleLabel,
    isAdmin: membership?.roleKey?.toLowerCase().includes('admin') ?? false,
  };
}

function normalizeAvatarText(value: string | undefined): string {
  return value?.trim().slice(0, 4) ?? '';
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || name.trim().slice(0, 2).toUpperCase() || 'U';
}
