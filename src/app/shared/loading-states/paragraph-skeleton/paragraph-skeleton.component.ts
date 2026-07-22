import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CoreUtil } from '@utils/core.util';

@Component({
  selector: 'vl-paragraph-skeleton',
  templateUrl: './paragraph-skeleton.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-flex flex-column gap-1',
  },
})
export class ParagraphSkeletonComponent {
  minParagraphs = input<number>(2);
  maxParagraphs = input<number>(4);
  minLines = input<number>(2);
  maxLines = input<number>(4);

  readonly randomInt = CoreUtil.randomInt;
}
