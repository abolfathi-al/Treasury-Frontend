import { ShellNavigationItem } from './shell-navigation.model';

export const SHELL_NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    kind: 'link',
    labelKey: 'navigation.menu.dashboard',
    iconName: 'rocket',
    route: '/dashboard',
    activeMatch: 'exact',
  },
] as const satisfies readonly ShellNavigationItem[];

export const SHELL_NAVIGATION_LABEL_KEYS = collectNavigationLabelKeys(
  SHELL_NAVIGATION_ITEMS,
);

function collectNavigationLabelKeys(
  items: readonly ShellNavigationItem[],
): readonly string[] {
  return Array.from(
    new Set(
      items.flatMap((item) => [
        item.labelKey,
        ...collectNavigationLabelKeys(item.children ?? []),
      ]),
    ),
  );
}
