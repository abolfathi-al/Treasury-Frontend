import type { AuthUserSnapshot } from '@core/auth';
import { createDemoAuthFacadeState } from '@core/state/context';
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

describe('resolveShellProfile', () => {
  it('uses the legacy auth user when one is available', () => {
    const profile = resolveShellProfile(
      createLegacyUser(),
      createDemoAuthFacadeState(),
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
      createDemoAuthFacadeState(),
    );

    expect(profile).toEqual(
      jasmine.objectContaining({
        name: 'Alireza Abolfathi',
        email: 'alireza.abolfathi@velora.demo',
        companyName: 'Workspace Operations',
        companyCode: 'WORKSPACE_OPS',
        avatarText: 'AA',
        roleLabel: 'Workspace Operator',
      }),
    );
  });

  it('returns null when neither auth source has a profile', () => {
    expect(resolveShellProfile(undefined, undefined)).toBeNull();
  });
});
