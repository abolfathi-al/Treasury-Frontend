import {
  ShellNavigationItem,
  ShellNavigationPermissionMatcher,
  ShellNavigationViewItem,
} from './shell-navigation.model';

const DEFAULT_ACTIVE_MATCH = 'prefix';
const URL_PARTS_PATTERN = /[?#]/;

export function normalizeShellNavigationUrl(url: string | undefined): string {
  const path = (url ?? '').split(URL_PARTS_PATTERN)[0] || '/';

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }

  return path;
}

export function isShellNavigationItemActive(
  item: ShellNavigationItem,
  currentUrl: string,
): boolean {
  if (item.kind !== 'link' || !item.route) {
    return false;
  }

  const current = normalizeShellNavigationUrl(currentUrl);
  const target = normalizeShellNavigationUrl(item.route);

  if (item.activeMatch === 'exact') {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
}

export function isShellNavigationItemCurrentPage(
  item: ShellNavigationItem,
  currentUrl: string,
): boolean {
  if (item.kind !== 'link' || !item.route) {
    return false;
  }

  return (
    normalizeShellNavigationUrl(currentUrl) ===
    normalizeShellNavigationUrl(item.route)
  );
}

export function filterShellNavigationItems(
  items: readonly ShellNavigationItem[],
  canAccess: ShellNavigationPermissionMatcher = () => true,
): readonly ShellNavigationItem[] {
  return items.flatMap((item) => {
    if (!hasRequiredPermissions(item, canAccess)) {
      return [];
    }

    const children = item.children
      ? filterShellNavigationItems(item.children, canAccess)
      : [];

    if (item.kind === 'section' && item.children?.length && children.length === 0) {
      return [];
    }

    return [
      {
        ...item,
        children,
      },
    ];
  });
}

export function toShellNavigationViewItems(
  items: readonly ShellNavigationItem[],
  currentUrl: string,
): readonly ShellNavigationViewItem[] {
  return items.map((item) => {
    const children = item.children
      ? toShellNavigationViewItems(item.children, currentUrl)
      : [];
    const isActive =
      isShellNavigationItemActive(item, currentUrl) ||
      children.some((child) => child.isActive);

    return {
      ...item,
      activeMatch: item.activeMatch ?? DEFAULT_ACTIVE_MATCH,
      children,
      isActive,
      isCurrentPage: isShellNavigationItemCurrentPage(item, currentUrl),
      label: item.labelKey,
    };
  });
}

export function applyShellNavigationLabels(
  items: readonly ShellNavigationViewItem[],
  labels: Readonly<Record<string, string>>,
): readonly ShellNavigationViewItem[] {
  return items.map((item) => ({
    ...item,
    children: applyShellNavigationLabels(item.children, labels),
    label: labels[item.labelKey] || item.labelKey,
  }));
}

export function resolveShellNavigationViewItems(
  items: readonly ShellNavigationItem[],
  currentUrl: string,
  canAccess?: ShellNavigationPermissionMatcher,
): readonly ShellNavigationViewItem[] {
  return toShellNavigationViewItems(
    filterShellNavigationItems(items, canAccess),
    currentUrl,
  );
}

function hasRequiredPermissions(
  item: ShellNavigationItem,
  canAccess: ShellNavigationPermissionMatcher,
): boolean {
  return item.requiredPermissions?.every(canAccess) ?? true;
}
