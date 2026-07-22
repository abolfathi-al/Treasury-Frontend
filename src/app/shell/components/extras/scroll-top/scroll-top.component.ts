import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

const SCROLL_TOP_CONSTANTS = {
  CSS_CLASS: 'velora_scrolltop',
  ID: 'scrolltop',
  DATA_ATTRIBUTE: 'data-velora-scrolltop',
  DATA_ATTRIBUTE_VALUE: 'true',
  ICON_NAME: 'arrow-up',
} as const;

@Component({
  selector: 'vl-scroll-top',
  template: `
    <i class="d-flex">
      <vl-velora-icon
        [name]="SCROLL_TOP_CONSTANTS.ICON_NAME"
        class=""
      ></vl-velora-icon>
    </i>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VeloraIconComponent],
  host: {
    class: SCROLL_TOP_CONSTANTS.CSS_CLASS,
    id: SCROLL_TOP_CONSTANTS.ID,
    '[attr.data-velora-scrolltop]': '"true"',
  },
})
export class LayoutScrollTopComponent {
  readonly SCROLL_TOP_CONSTANTS = SCROLL_TOP_CONSTANTS;
}
