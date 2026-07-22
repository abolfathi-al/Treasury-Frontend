import {
  PageNavigationActiveMatch,
  PageNavigationItem,
  PageNavigationItemKind,
} from '@core/navigation';

export type ShellNavigationItemKind = PageNavigationItemKind;

export type ShellNavigationActiveMatch = PageNavigationActiveMatch;

export interface ShellNavigationItem extends PageNavigationItem {}

export interface ShellNavigationViewItem
  extends Omit<ShellNavigationItem, 'activeMatch' | 'children'> {
  readonly activeMatch: ShellNavigationActiveMatch;
  readonly children: readonly ShellNavigationViewItem[];
  readonly isActive: boolean;
  readonly isCurrentPage: boolean;
  readonly label: string;
}

export type ShellNavigationPermissionMatcher = (
  permission: string,
) => boolean;
