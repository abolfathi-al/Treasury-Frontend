import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
@Component({
  selector: 'vl-accounting',
  templateUrl: './accounting.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslateModule,
    NgbTooltipModule,
    VeloraIconComponent,
  ]
})
export class AccountingComponent {
}
