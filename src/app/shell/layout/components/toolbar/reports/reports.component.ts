import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

const REPORTS_CONSTANTS = {
  DEFAULT_PAGE_TITLE_DISPLAY: false,
} as const;

@Component({
  selector: 'vl-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, NgbTooltipModule, VeloraIconComponent],
})
export class ReportsComponent {
  readonly appPageTitleDisplay = input<boolean>(
    REPORTS_CONSTANTS.DEFAULT_PAGE_TITLE_DISPLAY
  );
}
