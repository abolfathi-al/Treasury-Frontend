import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MenuDirective } from '@shared/directives/menu.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { RowActionItem } from '../dropdown.types';

type RowActionsDropdownPlacement = 'bottom-end' | 'top-end';

@Component({
  selector: 'vl-row-actions-dropdown',
  standalone: true,
  imports: [NgClass, TranslateModule, MenuDirective, VeloraIconComponent],
  templateUrl: './row-actions-dropdown.component.html',
  styleUrls: ['./row-actions-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsDropdownComponent {
  readonly actions = input<readonly RowActionItem[]>([]);
  readonly ariaLabelKey = input<string>('workspace.dropdown.rowActions');
  readonly buttonClass = input<string>('btn btn-light btn-icon btn-sm border border-gray-300');
  readonly placement = input<RowActionsDropdownPlacement>('bottom-end');
  readonly actionSelected = output<RowActionItem>();

  selectAction(action: RowActionItem): void {
    if (action.disabled) {
      return;
    }

    this.actionSelected.emit(action);
  }
}
