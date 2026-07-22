import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

@Component({
  selector: 'vl-extended',
  templateUrl: './extended.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgOptimizedImage,
    TranslateModule,
    NgbTooltipModule,
    VeloraIconComponent,
  ]
})
export class ExtendedComponent {
}
