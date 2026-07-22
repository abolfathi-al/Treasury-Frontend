import { SHELL_NAVIGATION_ITEMS } from './shell-navigation.config';
import {
  applyShellNavigationLabels,
  filterShellNavigationItems,
  isShellNavigationItemActive,
  isShellNavigationItemCurrentPage,
  normalizeShellNavigationUrl,
  resolveShellNavigationViewItems,
} from './shell-navigation.utils';

describe('shell navigation utilities', () => {
  it('normalizes query strings, fragments, empty values, and trailing slashes', () => {
    expect(normalizeShellNavigationUrl('/dashboard?tab=1')).toBe(
      '/dashboard',
    );
    expect(normalizeShellNavigationUrl('/dashboard#main')).toBe(
      '/dashboard',
    );
    expect(normalizeShellNavigationUrl('/dashboard/')).toBe('/dashboard');
    expect(normalizeShellNavigationUrl(undefined)).toBe('/');
  });

  it('matches active routes with route-boundary aware prefix matching', () => {
    const workspaceItem = {
      id: 'workspace',
      kind: 'link',
      labelKey: 'workspace.workspaceDashboard.title',
      route: '/workspace-management',
    } as const;

    expect(
      isShellNavigationItemActive(
        workspaceItem,
        '/workspace-management/base-data?mode=edit',
      ),
    ).toBeTrue();
    expect(
      isShellNavigationItemActive(
        workspaceItem,
        '/workspace-management-archive',
      ),
    ).toBeFalse();
  });

  it('honors exact route matching when configured', () => {
    const exactItem = {
      id: 'dashboard',
      kind: 'link',
      labelKey: 'navigation.menu.dashboard',
      route: '/dashboard',
      activeMatch: 'exact',
    } as const;

    expect(isShellNavigationItemActive(exactItem, '/dashboard')).toBeTrue();
    expect(
      isShellNavigationItemActive(exactItem, '/dashboard/analytics'),
    ).toBeFalse();
  });

  it('reserves current-page state for exact current routes', () => {
    const workspaceItem = {
      id: 'workspace',
      kind: 'link',
      labelKey: 'workspace.workspaceDashboard.title',
      route: '/workspace-management',
    } as const;

    expect(
      isShellNavigationItemCurrentPage(
        workspaceItem,
        '/workspace-management/base-data',
      ),
    ).toBeFalse();
    expect(
      isShellNavigationItemCurrentPage(
        workspaceItem,
        '/workspace-management/',
      ),
    ).toBeTrue();
  });

  it('filters permission-protected items without inventing authorization behavior', () => {
    const items = [
      {
        id: 'allowed',
        kind: 'link',
        labelKey: 'allowed',
        route: '/allowed',
        requiredPermissions: ['workspace.read'],
      },
      {
        id: 'blocked',
        kind: 'link',
        labelKey: 'blocked',
        route: '/blocked',
        requiredPermissions: ['workspace.admin'],
      },
    ] as const;

    const visibleItems = filterShellNavigationItems(
      items,
      (permission) => permission === 'workspace.read',
    );

    expect(visibleItems.map((item) => item.id)).toEqual(['allowed']);
  });

  it('keeps permitted link parents when every child is filtered out', () => {
    const items = [
      {
        id: 'reports',
        kind: 'link',
        labelKey: 'reports',
        route: '/reports',
        requiredPermissions: ['reports.read'],
        children: [
          {
            id: 'admin-report',
            kind: 'link',
            labelKey: 'adminReport',
            route: '/reports/admin',
            requiredPermissions: ['reports.admin'],
          },
        ],
      },
    ] as const;

    const visibleItems = filterShellNavigationItems(
      items,
      (permission) => permission === 'reports.read',
    );

    expect(visibleItems.map((item) => item.id)).toEqual(['reports']);
    expect(visibleItems[0].children).toEqual([]);
  });

  it('resolves stable sidebar items without legacy auth or error destinations', () => {
    const viewItems = resolveShellNavigationViewItems(
      SHELL_NAVIGATION_ITEMS,
      '/dashboard',
    );
    const ids = viewItems.map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(viewItems.length).toBe(SHELL_NAVIGATION_ITEMS.length);
    expect(ids).not.toContain('auth');
    expect(ids).not.toContain('errors');
    expect(
      viewItems.some((item) => item.id === 'dashboard' && item.isActive),
    ).toBeTrue();
    expect(
      viewItems.some((item) => item.route === '/auth/login'),
    ).toBeFalse();
    expect(
      viewItems.some((item) => item.route === '/error/404'),
    ).toBeFalse();
  });

  it('applies translated labels with key fallbacks', () => {
    const viewItems = resolveShellNavigationViewItems([
      {
        id: 'dashboard',
        kind: 'link',
        labelKey: 'navigation.menu.dashboard',
        route: '/dashboard',
      },
      {
        id: 'settings',
        kind: 'link',
        labelKey: 'navigation.menu.settings',
        route: '/settings',
      },
    ], '/dashboard');

    const labeledItems = applyShellNavigationLabels(viewItems, {
      'navigation.menu.dashboard': 'Dashboard',
    });

    expect(labeledItems[0].label).toBe('Dashboard');
    expect(labeledItems[1].label).toBe('navigation.menu.settings');
  });
});
