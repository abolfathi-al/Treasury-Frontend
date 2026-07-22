import type { AuthUserSnapshot } from '@core/auth';
import type { AuthFacadeState } from '@core/state/context';
import { resolveShellProfile } from './shell-profile';

const createLegacyUser = (): AuthUserSnapshot =>
  ({
    name: 'Mina User',
    email: 'mina@example.com',
    companyName: 'Acme',
    companyCode: 'AC01',
    fourCharsFinancialYear: '1403',
    role: 'admin',
    isAdmin: true,
  });

const createContextState = (): AuthFacadeState => ({
  status: 'authenticated',
  identity: {
    id: 'identity-1',
    displayName: 'Alex Morgan',
    email: 'alex@example.com',
    status: 'ACTIVE',
  },
  organizationContext: {
    id: 'organization-1',
    type: 'ORGANIZATION',
    name: 'Workspace Operations',
    code: 'WORKSPACE_OPS',
    resolvedHost: 'app.example.com',
    status: 'ACTIVE',
  },
  organizationMemberships: [
    {
      id: 'membership-1',
      identityId: 'identity-1',
      organizationId: 'organization-1',
      roleKey: 'workspace-operator',
      roleLabel: 'Workspace Operator',
      status: 'ACTIVE',
      visibleInDirectory: true,
    },
  ],
  actorMemberships: [],
  permissionHints: [],
  uiCapabilities: [],
  isDemoMode: false,
});

describe('resolveShellProfile', () => {
  it('uses the legacy auth user when one is available', () => {
    const profile = resolveShellProfile(
      createLegacyUser(),
      createContextState(),
    );

    expect(profile).toEqual(
      jasmine.objectContaining({
        name: 'Mina User',
        email: 'mina@example.com',
        companyName: 'Acme',
        companyCode: 'AC01',
        avatarText: '1403',
        isAdmin: true,
      }),
    );
  });

  it('falls back to the authenticated context identity when legacy auth is empty', () => {
    const profile = resolveShellProfile(
      undefined,
      createContextState(),
    );

    expect(profile).toEqual(
      jasmine.objectContaining({
        name: 'Alex Morgan',
        email: 'alex@example.com',
        companyName: 'Workspace Operations',
        companyCode: 'WORKSPACE_OPS',
        avatarText: 'AM',
        roleLabel: 'Workspace Operator',
      }),
    );
  });

  it('returns null when neither auth source has a profile', () => {
    expect(resolveShellProfile(undefined, undefined)).toBeNull();
  });
});
