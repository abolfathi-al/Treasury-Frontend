import { InjectionToken } from '@angular/core';

import { PageNavigationItem } from './page-navigation.model';

export const PAGE_NAVIGATION_ITEMS = new InjectionToken<
  readonly PageNavigationItem[]
>('PAGE_NAVIGATION_ITEMS', {
  factory: () => [],
});
