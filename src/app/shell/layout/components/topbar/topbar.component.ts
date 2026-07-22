import { Component, OnInit, ViewEncapsulation, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

import { LayoutService } from '@core/services/layout.service';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { SearchResultInnerComponent } from '@shell/components/extras/dropdown-inner/search-result-inner/search-result-inner.component';
import { NotificationsInnerComponent } from '@shell/components/extras/dropdown-inner/notifications-inner/notifications-inner.component';
import { QuickLinksInnerComponent } from '@shell/components/extras/dropdown-inner/quick-links-inner/quick-links-inner.component';
import { ThemeModeSwitcherComponent } from '@shell/components/theme-mode-switcher/theme-mode-switcher.component';
import { UserInnerComponent } from '@shell/components/extras/dropdown-inner/user-inner/user-inner.component';

const TOPBAR_CONSTANTS = {
  CSS_CLASSES: {
    TOOLBAR_BUTTON_MARGIN: 'ms-1 ms-lg-3',
    TOOLBAR_BUTTON_HEIGHT: 'w-30px h-30px w-md-40px h-md-40px',
    TOOLBAR_USER_AVATAR_HEIGHT: 'symbol-30px symbol-md-40px',
    TOOLBAR_BUTTON_ICON_SIZE: 'svg-icon-1'
  },
  DEFAULT_HEADER_LEFT: 'menu',
  PROP_PATH: 'header.left'
} as const;
@Component({
  selector: 'vl-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    VeloraIconComponent,
    SearchResultInnerComponent,
    NotificationsInnerComponent,
    QuickLinksInnerComponent,
    ThemeModeSwitcherComponent,
    UserInnerComponent,
  ]
})
export class TopbarComponent implements OnInit {
  private readonly layout = inject(LayoutService);

  readonly toolbarButtonMarginClass = TOPBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_BUTTON_MARGIN;
  readonly toolbarButtonHeightClass = TOPBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_BUTTON_HEIGHT;
  readonly toolbarUserAvatarHeightClass = TOPBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_USER_AVATAR_HEIGHT;
  readonly toolbarButtonIconSizeClass = TOPBAR_CONSTANTS.CSS_CLASSES.TOOLBAR_BUTTON_ICON_SIZE;

  private readonly _headerLeft = signal<string>(TOPBAR_CONSTANTS.DEFAULT_HEADER_LEFT);

  readonly headerLeft = computed(() => this._headerLeft());

  ngOnInit(): void {
    this._headerLeft.set(this.layout.getProp(TOPBAR_CONSTANTS.PROP_PATH) as string);
  }
}
