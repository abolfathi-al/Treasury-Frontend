import { Directive, OnInit, inject } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';
import { runSafely } from './shared/directive-helpers';

const CHECK_DELAYS_MS = [100, 500, 1000] as const;

@Directive({
  selector: '[vlSingleOption]',
  exportAs: 'vlSingleOption',
  standalone: true,
})
export class SingleOptionDirective
  extends BaseDirective<Record<string, never>, string>
  implements OnInit
{
  private readonly host = useDirectiveHost();
  private readonly ngSelectComponent = inject(NgSelectComponent);

  private readonly checkTimeouts = new Set<number>();

  constructor() {
    super(
      inject(LoggerService),
      'SingleOptionDirective',
      {} as Record<string, never>
    );
    this.host.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;

    this.executeSafely(() => {
      if (!this.ngSelectComponent) return;
      this.scheduleSingleOptionChecks();
      this.markBaseInitialized();
    }, 'Initialization failed');
  }

  private scheduleSingleOptionChecks(): void {
    const hostWindow = this.host.window ?? this.getHostWindow();
    if (!hostWindow) return;

    CHECK_DELAYS_MS.forEach((delay) => {
      const timeoutId = hostWindow.setTimeout(() => {
        this.checkSingleOption();
        this.checkTimeouts.delete(timeoutId);
      }, delay);
      this.checkTimeouts.add(timeoutId);
    });
  }

  private checkSingleOption(): void {
    if (!this.isBaseInitialized() || !this.ngSelectComponent) return;

    const items = this.getSelectItems();
    if (items.length === 1) {
      this.autoSelectSingleItem(items[0]);
    }
  }

  private getSelectItems(): unknown[] {
    return (
      runSafely(
        () => {
          const items = (this.ngSelectComponent as unknown as { items: unknown }).items;
          return Array.isArray(items) ? items : [];
        },
        (error) =>
          this.logger.error('Items retrieval failed', 'SingleOptionDirective', {
            error,
          })
      ) ?? []
    );
  }

  private autoSelectSingleItem(item: unknown): void {
    this.executeSafely(() => {
      if (this.isItemSelectable(item)) {
        this.ngSelectComponent.select(item as never);
      }
    }, 'Auto-selection failed');
  }

  private isItemSelectable(item: unknown): boolean {
    return !!item && (item as { disabled?: boolean }).disabled !== true;
  }

  private cleanup(): void {
    this.executeSafely(() => {
      this.checkTimeouts.forEach((id) => clearTimeout(id));
      this.checkTimeouts.clear();
      this.status.setError(null);
    }, 'Cleanup failed');
  }
}
