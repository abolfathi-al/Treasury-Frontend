import { PageNavigationItem } from './page-navigation.model';

const DEFAULT_ACTIVE_MATCH = 'prefix';
const URL_PARTS_PATTERN = /[?#]/;

export function normalizePageNavigationUrl(url: string | undefined): string {
  const path = (url ?? '').split(URL_PARTS_PATTERN)[0] || '/';

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }

  return path;
}

export function isPageNavigationItemActive(
  item: PageNavigationItem,
  currentUrl: string
): boolean {
  if (item.kind !== 'link' || !item.route) {
    return false;
  }

  const current = normalizePageNavigationUrl(currentUrl);
  const target = normalizePageNavigationUrl(item.route);
  const activeMatch = item.activeMatch ?? DEFAULT_ACTIVE_MATCH;

  if (activeMatch === 'exact') {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
}

export function isPageNavigationItemCurrentPage(
  item: PageNavigationItem,
  currentUrl: string
): boolean {
  if (item.kind !== 'link' || !item.route) {
    return false;
  }

  return (
    normalizePageNavigationUrl(currentUrl) ===
    normalizePageNavigationUrl(item.route)
  );
}
