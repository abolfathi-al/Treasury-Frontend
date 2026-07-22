import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

const SAAS_CONSTANTS = {
  DEFAULT_PAGE_TITLE_DISPLAY: false,
} as const;

@Component({
  selector: 'vl-saas',
  templateUrl: './saas.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, NgbTooltipModule, VeloraIconComponent],
})
export class SaasComponent {
  readonly appPageTitleDisplay = input<boolean>(
    SAAS_CONSTANTS.DEFAULT_PAGE_TITLE_DISPLAY
  );
}
