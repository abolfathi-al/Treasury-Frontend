import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

const SIDEBAR_FOOTER_CONSTANTS = {
  CHANGELOG_URL: 'https://velora.app/'
} as const;
@Component({
    selector: 'vl-sidebar-footer',
    templateUrl: './sidebar-footer.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        VeloraIconComponent,
    ]
})
export class SidebarFooterComponent {
  readonly appChangelogUrl: string = SIDEBAR_FOOTER_CONSTANTS.CHANGELOG_URL;
}
