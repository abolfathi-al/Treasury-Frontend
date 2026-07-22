import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

const QUICK_LINKS_INNER_CONSTANTS = {
  MENU_CLASS: 'menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px',
} as const;

@Component({
  selector: 'vl-quick-links-inner',
  templateUrl: './quick-links-inner.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslateModule,
    VeloraIconComponent,
  ],
  host: {
    class: QUICK_LINKS_INNER_CONSTANTS.MENU_CLASS,
  },
})
export class QuickLinksInnerComponent {}
