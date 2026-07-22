import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { HierarchyNodeDetail, HierarchyTone } from '../hierarchy.types';

@Component({
  selector: 'vl-hierarchy-node-card',
  standalone: true,
  imports: [NgClass, VeloraIconComponent, TranslateModule],
  templateUrl: './hierarchy-node-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyNodeCardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('folder');
  readonly tone = input<HierarchyTone>('primary');
  readonly statusKey = input<string>('workspace.badge.active');
  readonly levelBadge = input<string>('');
  readonly details = input<readonly HierarchyNodeDetail[]>([]);
}
