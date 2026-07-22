import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DrawerDirective } from '@shared/directives/drawer.directive';
import { MenuDirective } from '@shared/directives/menu.directive';
import { SwapperDirective } from '@shared/directives/swapper.directive';
import { ToggleDirective } from '@shared/directives/toggle.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { ShellFacade } from '../../shell.facade';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageTitleComponent } from './page-title/page-title.component';

@Component({
  selector: 'vl-header',
  templateUrl: './header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    NgOptimizedImage,
    TranslateModule,
    RouterLink,
    VeloraIconComponent,
    DrawerDirective,
    ToggleDirective,
    SwapperDirective,
    MenuDirective,
    HeaderMenuComponent,
    NavbarComponent,
    PageTitleComponent,
  ],
})
export class HeaderComponent {
  readonly shell = inject(ShellFacade);
}
