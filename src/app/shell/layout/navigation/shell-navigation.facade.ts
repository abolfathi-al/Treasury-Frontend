import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

import { PAGE_NAVIGATION_ITEMS, PageNavigationItem } from '@core/navigation';
import {
  applyShellNavigationLabels,
  resolveShellNavigationViewItems,
} from './shell-navigation.utils';

@Injectable({
  providedIn: 'root',
})
export class ShellNavigationFacade {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly navigationItems = inject(PAGE_NAVIGATION_ITEMS);
  private readonly navigationLabelKeys = collectNavigationLabelKeys(
    this.navigationItems,
  );
  private readonly currentUrlSignal = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  private readonly translatedLabelsSignal = toSignal(
    this.translate.stream([...this.navigationLabelKeys]).pipe(
      map((labels) => labels as Record<string, string>),
      startWith(this.instantLabels()),
    ),
    { initialValue: this.instantLabels() },
  );

  readonly currentUrl = computed(() => this.currentUrlSignal());
  readonly menuItems = computed(() =>
    applyShellNavigationLabels(
      resolveShellNavigationViewItems(
        this.navigationItems,
        this.currentUrl(),
      ),
      this.translatedLabelsSignal(),
    ),
  );

  private instantLabels(): Record<string, string> {
    return Object.fromEntries(
      this.navigationLabelKeys.map((key) => [
        key,
        this.translate.instant(key),
      ]),
    );
  }
}

function collectNavigationLabelKeys(
  items: readonly PageNavigationItem[],
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
