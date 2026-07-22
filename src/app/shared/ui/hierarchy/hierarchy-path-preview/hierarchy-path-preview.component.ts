import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { HierarchyPathSegment } from '../hierarchy.types';

@Component({
  selector: 'vl-hierarchy-path-preview',
  standalone: true,
  imports: [NgClass, VeloraIconComponent, TranslateModule],
  templateUrl: './hierarchy-path-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyPathPreviewComponent {
  readonly titleKey = input<string>('workspace.scopeHierarchyExplorer.path.title');
  readonly fullPathLabelKey = input<string>('workspace.scopeHierarchyExplorer.path.fullPath');
  readonly segments = input<readonly HierarchyPathSegment[]>([]);
  readonly fullPath = input<string>('');
}
