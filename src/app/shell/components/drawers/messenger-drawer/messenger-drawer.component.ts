import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DrawerDirective } from '@shared/directives/drawer.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-messenger-drawer',
  templateUrl: './messenger-drawer.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    TranslateModule,
    DrawerDirective,
    VeloraIconComponent,
  ]
})
export class MessengerDrawerComponent {
}
