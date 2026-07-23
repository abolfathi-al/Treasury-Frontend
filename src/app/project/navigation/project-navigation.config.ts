import { PageNavigationItem } from '@core/navigation';

export const PROJECT_NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    kind: 'link',
    labelKey: 'navigation.menu.dashboard',
    iconName: 'rocket',
    route: '/dashboard',
    activeMatch: 'exact',
  },
  {
    id: 'foundation',
    kind: 'section',
    labelKey: 'navigation.menu.foundation',
    children: [
      {
        id: 'method-definitions',
        kind: 'link',
        labelKey: 'navigation.menu.methodDefinitions',
        iconName: 'setting-3',
        route: '/foundation/method-definitions',
        activeMatch: 'prefix',
        requiredPermissions: ['master-data.view'],
      },
    ],
  },
] as const satisfies readonly PageNavigationItem[];
