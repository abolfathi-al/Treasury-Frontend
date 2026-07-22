import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { AUTH_SESSION } from '@core/auth';
import { AuthFacade } from '@core/state/context';
import { MenuDirective } from '@shared/directives/menu.directive';
import { SearchDirective } from '@shared/directives/search.directive';
import { NotificationsInnerComponent } from '@shell/components/extras/dropdown-inner/notifications-inner/notifications-inner.component';
import { QuickLinksInnerComponent } from '@shell/components/extras/dropdown-inner/quick-links-inner/quick-links-inner.component';
import { SearchResultInnerComponent } from '@shell/components/extras/dropdown-inner/search-result-inner/search-result-inner.component';
import { UserInnerComponent } from '@shell/components/extras/dropdown-inner/user-inner/user-inner.component';
import { ThemeModeSwitcherComponent } from '@shell/components/theme-mode-switcher/theme-mode-switcher.component';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { resolveShellProfile } from '@shell/layout/shell-profile';
import { ShellContextDisplayFacade } from '../../../context/shell-context-display.facade';

@Component({
  selector: 'vl-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    TranslateModule,
    SearchDirective,
    MenuDirective,
    VeloraIconComponent,
    SearchResultInnerComponent,
    NotificationsInnerComponent,
    QuickLinksInnerComponent,
    ThemeModeSwitcherComponent,
    UserInnerComponent,
  ],
})
export class NavbarComponent {
  private readonly auth = inject(AUTH_SESSION);
  private readonly contextAuth = inject(AuthFacade, { optional: true });
  private readonly contextDisplay = inject(ShellContextDisplayFacade);
  private readonly legacyUser = toSignal(this.auth.getCurrentUserChanges(), {
    initialValue: this.auth.getCurrentUserSnapshot(),
  });

  readonly profile = computed(() =>
    resolveShellProfile(this.legacyUser(), this.contextAuth?.state()),
  );
  readonly appHeaderDefaultSearchDisplay = input<boolean>(false);
  readonly appHeaderDefaultQuickPanelDisplay = input<boolean>(false);
  readonly appHeaderDefaultQuickActionsDisplay = input<boolean>(false);
  readonly appHeaderDefaultNotificationsDisplay = input<boolean>(false);
  readonly appHeaderDefaultChatDisplay = input<boolean>(false);
  readonly appHeaderDefaultThemModeDisplay = input<boolean>(false);
  readonly appHeaderDefaultUserDisplay = input<boolean>(false);
  readonly appHeaderDefaultMenuDisplay = input<boolean>(false);
  readonly isRtl = input<boolean>(false);

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';
  readonly workspaceSwitcherVisible = this.contextDisplay.workspaceSwitcherVisible;
}
