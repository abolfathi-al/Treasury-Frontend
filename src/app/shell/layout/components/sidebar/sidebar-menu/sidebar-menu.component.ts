import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShellNavigationFacade } from '@shell/layout/navigation/shell-navigation.facade';
import { MenuDirective } from '@shared/directives/menu.directive';
import { ScrollDirective } from '@shared/directives/scroll.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ScrollDirective,
    MenuDirective,
    VeloraIconComponent,
  ],
})
export class SidebarMenuComponent {
  private readonly navigation = inject(ShellNavigationFacade);

  readonly scrollDependencies: string[] = [
    '#velora_app_sidebar_logo',
    '#velora_app_sidebar_footer',
  ];
  readonly scrollWrappers: string[] = ['#velora_app_sidebar_menu'];

  readonly menuItems = this.navigation.menuItems;
}
