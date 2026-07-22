import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MenuDirective } from '@shared/directives/menu.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { WorkspaceFilterKey } from '../dropdown.types';

interface FilterControl {
  readonly key: WorkspaceFilterKey;
  readonly labelKey: string;
  readonly optionKey: string;
  readonly icon: string;
}

const FILTER_CONTROLS: readonly FilterControl[] = [
  {
    key: 'dateRange',
    labelKey: 'workspace.filters.dateRange',
    optionKey: 'workspace.filters.last30Days',
    icon: 'calendar',
  },
  {
    key: 'organization',
    labelKey: 'workspace.filters.organization',
    optionKey: 'workspace.filters.allOrganizations',
    icon: 'office-bag',
  },
  {
    key: 'actorType',
    labelKey: 'workspace.filters.actorType',
    optionKey: 'workspace.filters.allActorTypes',
    icon: 'profile-user',
  },
  {
    key: 'role',
    labelKey: 'workspace.filters.role',
    optionKey: 'workspace.filters.allRoles',
    icon: 'shield-tick',
  },
  {
    key: 'status',
    labelKey: 'workspace.filters.status',
    optionKey: 'workspace.filters.allStatuses',
    icon: 'abstract-26',
  },
  {
    key: 'source',
    labelKey: 'workspace.filters.source',
    optionKey: 'workspace.filters.allSources',
    icon: 'route',
  },
  {
    key: 'priority',
    labelKey: 'workspace.filters.priority',
    optionKey: 'workspace.filters.allPriorities',
    icon: 'flag',
  },
  {
    key: 'accessType',
    labelKey: 'workspace.filters.accessType',
    optionKey: 'workspace.filters.allAccessTypes',
    icon: 'file-right',
  },
  {
    key: 'supplierVisibility',
    labelKey: 'workspace.filters.supplierVisibility',
    optionKey: 'workspace.filters.allVisibility',
    icon: 'eye',
  },
];

@Component({
  selector: 'vl-more-filters-dropdown',
  standalone: true,
  imports: [NgClass, TranslateModule, MenuDirective, VeloraIconComponent],
  templateUrl: './more-filters-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreFiltersDropdownComponent {
  readonly filters = input<readonly WorkspaceFilterKey[]>([
    'dateRange',
    'organization',
    'actorType',
    'role',
    'status',
    'source',
  ]);
  readonly buttonClass = input<string>('btn btn-light-primary w-100');
  readonly disabled = input<boolean>(false);
  readonly buttonLabelKey = input<string>('workspace.filters.moreFilters');
  readonly filtersApply = output<void>();
  readonly filtersReset = output<void>();

  get visibleControls(): readonly FilterControl[] {
    const enabled = new Set(this.filters());
    return FILTER_CONTROLS.filter((control) => enabled.has(control.key));
  }
}
