export type PageNavigationItemKind = 'link' | 'section';

export type PageNavigationActiveMatch = 'exact' | 'prefix';

export interface PageNavigationItem {
  readonly id: string;
  readonly kind: PageNavigationItemKind;
  readonly labelKey: string;
  readonly iconName?: string;
  readonly route?: string;
  readonly activeMatch?: PageNavigationActiveMatch;
  readonly requiredPermissions?: readonly string[];
  readonly children?: readonly PageNavigationItem[];
}
