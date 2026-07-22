import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';

type DashboardMetric = {
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly icon: string;
  readonly tone: 'primary' | 'success' | 'info';
};

type FoundationArea = {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
};

@Component({
  selector: 'vl-dashboard',
  standalone: true,
  imports: [RouterLink, TranslateModule, VeloraIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly metrics: readonly DashboardMetric[] = [
    {
      label: 'Shell readiness',
      value: 'Clean',
      note: 'Layout, navigation, forms, directives, and theme assets are loaded.',
      icon: 'abstract-26',
      tone: 'primary',
    },
    {
      label: 'Runtime surface',
      value: 'Neutral',
      note: 'No legacy business modules or domain routes are registered.',
      icon: 'shield-tick',
      tone: 'success',
    },
    {
      label: 'Next layer',
      value: 'Ready',
      note: 'Shared infrastructure is available for future Velora workspaces.',
      icon: 'rocket',
      tone: 'info',
    },
  ];

  readonly foundationAreas: readonly FoundationArea[] = [
    {
      title: 'Shared UI',
      description: 'Velora shell shell components, menus, drawers, dropdowns, modals, loading states, and layout helpers.',
      icon: 'category',
    },
    {
      title: 'Shared Forms',
      description: 'Reusable form controls, validation feedback, ng-select integration, and input directives.',
      icon: 'setting-3',
    },
    {
      title: 'Theme System',
      description: 'Sass assets, icon fonts, Bootstrap utilities, and Velora-branded environment wiring.',
      icon: 'color-swatch',
    },
  ];
}
