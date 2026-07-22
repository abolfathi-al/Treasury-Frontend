import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

import {
  SHELL_NAVIGATION_ITEMS,
  SHELL_NAVIGATION_LABEL_KEYS,
} from './shell-navigation.config';
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
  private readonly currentUrlSignal = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  private readonly translatedLabelsSignal = toSignal(
    this.translate.stream([...SHELL_NAVIGATION_LABEL_KEYS]).pipe(
      map((labels) => labels as Record<string, string>),
      startWith(this.instantLabels()),
    ),
    { initialValue: this.instantLabels() },
  );

  readonly currentUrl = computed(() => this.currentUrlSignal());
  readonly menuItems = computed(() =>
    applyShellNavigationLabels(
      resolveShellNavigationViewItems(
        SHELL_NAVIGATION_ITEMS,
        this.currentUrl(),
      ),
      this.translatedLabelsSignal(),
    ),
  );

  private instantLabels(): Record<string, string> {
    return Object.fromEntries(
      SHELL_NAVIGATION_LABEL_KEYS.map((key) => [
        key,
        this.translate.instant(key),
      ]),
    );
  }
}
