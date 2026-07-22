import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { DrawerDirective } from '@shared/directives/drawer.directive';
import { ScrollTopDirective } from '@shared/directives/scroll-top.directive';
import { StickyDirective } from '@shared/directives/sticky.directive';
import { StyleUtil } from '@utils/style.util';
import { MessengerDrawerComponent } from '@shell/components/drawers/messenger-drawer/messenger-drawer.component';
import { LayoutScrollTopComponent } from '@shell/components/extras/scroll-top/scroll-top.component';

import { ShellFacade } from './shell.facade';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

const LAYOUT_CONSTANTS = {
  CSS_CLASSES: {
    FOOTER_FIXED_DESKTOP: 'footer-fixed-desktop',
    FOOTER_FIXED_MOBILE: 'footer-fixed-mobile',
  },
  DATA_ATTRIBUTES: {
    FOOTER: 'data-velora-app-footer',
  },
  ATTRIBUTE_VALUES: {
    TRUE: 'true',
  },
  DISPLAY_VALUES: {
    BLOCK: 'block',
    NONE: 'none',
  },
} as const;

@Component({
  selector: 'vl-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShellFacade],
  imports: [
    NgClass,
    DrawerDirective,
    ScrollTopDirective,
    StickyDirective,
    ContentComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ToolbarComponent,
    LayoutScrollTopComponent,
    MessengerDrawerComponent,
  ],
})
export class LayoutComponent {
  private readonly document = inject<Document>(DOCUMENT);

  readonly shell = inject(ShellFacade);

  readonly veloraSidebar = viewChild<ElementRef>('veloraSidebar');
  readonly veloraAside = viewChild<ElementRef>('veloraAside');
  readonly veloraHeaderMobile = viewChild<ElementRef>('veloraHeaderMobile');
  readonly veloraHeader = viewChild<ElementRef>('veloraHeader');
  readonly veloraToolbar = viewChild<ElementRef>('veloraToolbar');

  constructor() {
    effect(() => {
      try {
        if (this.shell.layoutConfig()) {
          this.updateLayoutAttributes();
        }
      } catch (error) {
        this.shell.setError(`Layout effect failed: ${error}`);
      }
    });
  }

  private updateLayoutAttributes(): void {
    try {
      if (!this.shell.layoutConfig()) return;

      if (this.shell.appFooterDisplay()) this.updateFooterAttributes();
      if (this.shell.appSidebarDisplay()) this.updateSidebarAttributes();
      if (this.shell.appHeaderDisplay()) this.updateHeaderAttributes();
      if (this.shell.appToolbarDisplay()) this.updateToolbarAttributes();
    } catch (error) {
      this.shell.setError(`Update layout attributes failed: ${error}`);
    }
  }

  private updateSidebarAttributes(): void {
    try {
      const element = this.veloraSidebar()?.nativeElement;
      if (!element) return;

      if (this.shell.appSidebarDisplay()) {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.BLOCK,
        );
      } else {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.NONE,
        );
      }

      if (this.shell.appSidebarDefaultDrawerEnabled()) {
        const drawerAttrs = this.shell.appSidebarDefaultDrawerAttributes();
        Object.entries(drawerAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }

      if (this.shell.appSidebarDefaultStickyEnabled()) {
        const stickyAttrs = this.shell.appSidebarDefaultStickyAttributes();
        Object.entries(stickyAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }
    } catch (error) {
      this.shell.setError(`Update sidebar attributes failed: ${error}`);
    }
  }

  private updateHeaderAttributes(): void {
    try {
      const element = this.veloraHeader()?.nativeElement;
      if (!element) return;

      if (this.shell.appHeaderDisplay()) {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.BLOCK,
        );
      } else {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.NONE,
        );
      }

      if (this.shell.appHeaderDefaultStickyEnabled()) {
        const stickyAttrs = this.shell.appHeaderDefaultStickyAttributes();
        Object.entries(stickyAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }

      if (this.shell.appHeaderDefaultMinimizeEnabled()) {
        const minimizeAttrs = this.shell.appHeaderDefaultMinimizeAttributes();
        Object.entries(minimizeAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }
    } catch (error) {
      this.shell.setError(`Update header attributes failed: ${error}`);
    }
  }

  private updateFooterAttributes(): void {
    try {
      if (this.shell.appFooterFixedDesktop()) {
        StyleUtil.addClass(
          this.document.body,
          LAYOUT_CONSTANTS.CSS_CLASSES.FOOTER_FIXED_DESKTOP,
        );
      } else {
        StyleUtil.removeClass(
          this.document.body,
          LAYOUT_CONSTANTS.CSS_CLASSES.FOOTER_FIXED_DESKTOP,
        );
      }

      if (this.shell.appFooterFixedMobile()) {
        StyleUtil.addClass(
          this.document.body,
          LAYOUT_CONSTANTS.CSS_CLASSES.FOOTER_FIXED_MOBILE,
        );
      } else {
        StyleUtil.removeClass(
          this.document.body,
          LAYOUT_CONSTANTS.CSS_CLASSES.FOOTER_FIXED_MOBILE,
        );
      }

      StyleUtil.setAttribute(
        this.document.body,
        LAYOUT_CONSTANTS.DATA_ATTRIBUTES.FOOTER,
        LAYOUT_CONSTANTS.ATTRIBUTE_VALUES.TRUE,
      );
    } catch (error) {
      this.shell.setError(`Update footer attributes failed: ${error}`);
    }
  }

  private updateToolbarAttributes(): void {
    try {
      const element = this.veloraToolbar()?.nativeElement;
      if (!element) return;

      if (this.shell.appToolbarDisplay()) {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.BLOCK,
        );
      } else {
        StyleUtil.setProperty(
          element,
          'display',
          LAYOUT_CONSTANTS.DISPLAY_VALUES.NONE,
        );
      }

      if (this.shell.appToolbarSwapEnabled()) {
        const swapAttrs = this.shell.appToolbarSwapAttributes();
        Object.entries(swapAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }

      if (this.shell.appToolbarStickyEnabled()) {
        const stickyAttrs = this.shell.appToolbarStickyAttributes();
        Object.entries(stickyAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }

      if (this.shell.appToolbarMinimizeEnabled()) {
        const minimizeAttrs = this.shell.appToolbarMinimizeAttributes();
        Object.entries(minimizeAttrs).forEach(([key, value]) => {
          StyleUtil.setAttribute(element, key, value);
        });
      }
    } catch (error) {
      this.shell.setError(`Update toolbar attributes failed: ${error}`);
    }
  }
}
