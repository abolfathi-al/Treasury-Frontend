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
] as const satisfies readonly PageNavigationItem[];
