import { Directive, OnInit, TemplateRef, ViewContainerRef, inject, signal } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { BaseDirective } from './shared/base-directive';
import { useDirectiveHost } from './shared/directive-host';

@Directive({
  selector: '[vlIfIsBrowser]',
  exportAs: 'vlIfIsBrowser',
  standalone: true,
})
export class IfIsBrowserDirective extends BaseDirective<Record<string, never>, string> implements OnInit {
  private readonly host = useDirectiveHost();
  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private readonly _isViewCreated = signal<boolean>(false);

  constructor() {
    super(inject(LoggerService), 'IfIsBrowserDirective', {});
    this.host.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnInit(): void {
    if (!this.host.isBrowser) return;
    this.createView();
  }

  private createView(): void {
    if (this._isViewCreated()) return;
    this.executeSafely(() => {
      this.viewContainerRef.createEmbeddedView(this.template);
      this._isViewCreated.set(true);
    }, 'Failed to create embedded view');
  }

  private cleanup(): void {
    if (!this._isViewCreated()) return;
    this.executeSafely(() => {
      this.viewContainerRef.clear();
      this._isViewCreated.set(false);
    }, 'Cleanup failed');
  }
}
