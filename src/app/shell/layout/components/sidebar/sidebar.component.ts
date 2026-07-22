import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  inject,
} from '@angular/core';
import { LoggerService } from '@core/services/logger.service';

import { ShellFacade } from '../../shell.facade';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'vl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SidebarLogoComponent,
    SidebarFooterComponent,
    SidebarMenuComponent,
  ],
})
export class SidebarComponent {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly logger = inject(LoggerService);

  readonly shell = inject(ShellFacade);

  constructor() {
    effect(() => {
      try {
        if (this.shell.layoutConfig()) {
          this.updateSidebarAttributes();
        }
      } catch (error) {
        this.logger.error('Sidebar config effect error', 'SidebarComponent', {
          error,
        });
        this.shell.setError('Failed to update sidebar configuration');
      }
    });
  }

  private updateSidebarAttributes(): void {
    try {
      this.updateMinimizeAttributes();
      this.updateCollapseAttributes();
      this.updatePushAttributes();
      this.updateStackedAttributes();
      this.updateFixedAttributes();
    } catch (error) {
      this.logger.error('Update sidebar attributes error', 'SidebarComponent', {
        error,
      });
      this.shell.setError('Failed to update sidebar attributes');
    }
  }

  private updateMinimizeAttributes(): void {
    try {
      if (this.shell.appSidebarDefaultMinimizeDesktopEnabled()) {
        if (this.shell.appSidebarDefaultMinimizeDesktopDefault()) {
          this.document.body.setAttribute('data-velora-app-sidebar-minimize', 'on');
        }
        if (this.shell.appSidebarDefaultMinimizeDesktopHoverable()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-hoverable',
            'true',
          );
        }
      }

      if (this.shell.appSidebarDefaultMinimizeMobileEnabled()) {
        if (this.shell.appSidebarDefaultMinimizeMobileDefault()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-minimize-mobile',
            'on',
          );
        }
        if (this.shell.appSidebarDefaultMinimizeMobileHoverable()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-hoverable-mobile',
            'true',
          );
        }
      }
    } catch (error) {
      this.logger.error('Update minimize attributes error', 'SidebarComponent', {
        error,
      });
    }
  }

  private updateCollapseAttributes(): void {
    try {
      if (this.shell.appSidebarDefaultCollapseDesktopEnabled()) {
        if (this.shell.appSidebarDefaultCollapseDesktopDefault()) {
          this.document.body.setAttribute('data-velora-app-sidebar-collapse', 'on');
        }
      }

      if (this.shell.appSidebarDefaultCollapseMobileEnabled()) {
        if (this.shell.appSidebarDefaultCollapseMobileDefault()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-collapse-mobile',
            'on',
          );
        }
      }
    } catch (error) {
      this.logger.error('Update collapse attributes error', 'SidebarComponent', {
        error,
      });
    }
  }

  private updatePushAttributes(): void {
    try {
      if (this.shell.appSidebarDefaultPush()) {
        if (this.shell.appSidebarDefaultPushHeader()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-push-header',
            'true',
          );
        }
        if (this.shell.appSidebarDefaultPushToolbar()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-push-toolbar',
            'true',
          );
        }
        if (this.shell.appSidebarDefaultPushFooter()) {
          this.document.body.setAttribute(
            'data-velora-app-sidebar-push-footer',
            'true',
          );
        }
      }
    } catch (error) {
      this.logger.error('Update push attributes error', 'SidebarComponent', {
        error,
      });
    }
  }

  private updateStackedAttributes(): void {
    try {
      if (this.shell.appSidebarDefaultStacked()) {
        this.document.body.setAttribute('app-sidebar-stacked', 'true');
      }
    } catch (error) {
      this.logger.error('Update stacked attributes error', 'SidebarComponent', {
        error,
      });
    }
  }

  private updateFixedAttributes(): void {
    try {
      this.document.body.setAttribute('data-velora-app-sidebar-enabled', 'true');
      this.document.body.setAttribute(
        'data-velora-app-sidebar-fixed',
        this.shell.appSidebarDefaultFixedDesktop().toString(),
      );
    } catch (error) {
      this.logger.error('Update fixed attributes error', 'SidebarComponent', {
        error,
      });
    }
  }
}
