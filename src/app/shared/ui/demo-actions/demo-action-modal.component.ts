import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { ChartTone } from '@shared/charts';

export interface DemoActionModalState {
  readonly titleKey: string;
  readonly descriptionKey?: string;
  readonly actionTypeKey?: string;
  readonly primaryLabelKey?: string;
  readonly secondaryLabelKey?: string;
  readonly icon?: string;
  readonly tone?: ChartTone;
  readonly requiresConfirmation?: boolean;
}

@Component({
  selector: 'vl-demo-action-modal',
  standalone: true,
  imports: [NgClass, TranslateModule, VeloraIconComponent],
  templateUrl: './demo-action-modal.component.html',
  styleUrls: ['./demo-action-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoActionModalComponent {
  readonly open = input(false);
  readonly titleKey = input('workspace.demoActions.title');
  readonly descriptionKey = input('workspace.demoActions.genericDescription');
  readonly actionTypeKey = input('workspace.demoActions.types.inMemoryDemoAction');
  readonly primaryLabelKey = input('workspace.demoActions.primaryLabel');
  readonly secondaryLabelKey = input('workspace.demoActions.secondaryLabel');
  readonly demoOnlyNoteKey = input('workspace.demoActions.demoOnlyNote');
  readonly confirmationKey = input('workspace.demoActions.confirmationRequired');
  readonly icon = input('information');
  readonly tone = input<ChartTone>('primary');
  readonly requiresConfirmation = input(false);

  readonly closed = output<void>();
  readonly primarySelected = output<void>();
}
