import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { LANGUAGE_SERVICE } from '@core/i18n';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
export type NotificationsTabsType =
  | 'velora_topbar_notifications_1'
  | 'velora_topbar_notifications_2'
  | 'velora_topbar_notifications_3';

const NOTIFICATIONS_INNER_CONSTANTS = {
  MENU_CLASS: 'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px',
  DEFAULT_TAB_ID: 'velora_topbar_notifications_2' as NotificationsTabsType,
} as const;

@Component({
  selector: 'vl-notifications-inner',
  templateUrl: './notifications-inner.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    NgOptimizedImage,
    RouterLink,
    InlineSVGModule,
    TranslatePipe,
    VeloraIconComponent,
  ],
  host: {
    class: NOTIFICATIONS_INNER_CONSTANTS.MENU_CLASS,
  },
})
export class NotificationsInnerComponent {
  private readonly languageService = inject(LANGUAGE_SERVICE);
  private readonly isRTL = computed(() => this.languageService.isLanguageRTL());

  readonly activeTabId = signal<NotificationsTabsType>(
    NOTIFICATIONS_INNER_CONSTANTS.DEFAULT_TAB_ID
  );
  readonly arrowIcon = computed(() =>
    this.isRTL() ? 'arrow-left' : 'arrow-right'
  );
  readonly alertsTabPaneClasses = computed(() => ({
    'show active': this.activeTabId() === 'velora_topbar_notifications_1',
  }));
  readonly updatesTabPaneClasses = computed(() => ({
    'show active': this.activeTabId() === 'velora_topbar_notifications_2',
  }));
  readonly logsTabPaneClasses = computed(() => ({
    'show active': this.activeTabId() === 'velora_topbar_notifications_3',
  }));
  readonly alerts = signal<Array<AlertModel>>(defaultAlerts);
  readonly logs = signal<Array<LogModel>>(defaultLogs);

  setActiveTabId(tabId: NotificationsTabsType): void {
    this.activeTabId.set(tabId);
  }
}

interface AlertModel {
  title: string;
  description: string;
  time: string;
  icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
}

const defaultAlerts: Array<AlertModel> = [
  {
    title: 'Project Alice',
    description: 'Phase 1 development',
    time: '1 hr',
    icon: 'icons/duotune/technology/teh008.svg',
    state: 'primary',
  },
  {
    title: 'HR Confidential',
    description: 'Confidential staff documents',
    time: '2 hrs',
    icon: 'icons/duotune/general/gen044.svg',
    state: 'danger',
  },
  {
    title: 'Company HR',
    description: 'Corporeate staff profiles',
    time: '5 hrs',
    icon: 'icons/duotune/finance/fin006.svg',
    state: 'warning',
  },
  {
    title: 'Project Redux',
    description: 'New frontend admin theme',
    time: '2 days',
    icon: 'icons/duotune/files/fil023.svg',
    state: 'success',
  },
  {
    title: 'Project Breafing',
    description: 'Product launch status update',
    time: '21 Jan',
    icon: 'icons/duotune/maps/map001.svg',
    state: 'primary',
  },
  {
    title: 'Banner Assets',
    description: 'Collection of banner images',
    time: '21 Jan',
    icon: 'icons/duotune/general/gen006.svg',
    state: 'info',
  },
  {
    title: 'Icon Assets',
    description: 'Collection of SVG icons',
    time: '20 March',
    icon: 'icons/duotune/art/art002.svg',
    state: 'warning',
  },
];

interface LogModel {
  id: string;
  code: string;
  state: 'success' | 'danger' | 'warning';
  message: string;
  time: string;
}

const defaultLogs: Array<LogModel> = [
  {
    id: 'new-order',
    code: '200 OK',
    state: 'success',
    message: 'New order',
    time: 'Just now',
  },
  {
    id: 'new-customer',
    code: '500 ERR',
    state: 'danger',
    message: 'New customer',
    time: '2 hrs',
  },
  {
    id: 'payment-process',
    code: '200 OK',
    state: 'success',
    message: 'Payment process',
    time: '5 hrs',
  },
  {
    id: 'search-query',
    code: '300 WRN',
    state: 'warning',
    message: 'Search query',
    time: '2 days',
  },
  {
    id: 'api-connection',
    code: '200 OK',
    state: 'success',
    message: 'API connection',
    time: '1 week',
  },
  {
    id: 'database-restore',
    code: '200 OK',
    state: 'success',
    message: 'Database restore',
    time: 'Mar 5',
  },
  {
    id: 'system-update',
    code: '300 WRN',
    state: 'warning',
    message: 'System update',
    time: 'May 15',
  },
  {
    id: 'server-os-update',
    code: '300 WRN',
    state: 'warning',
    message: 'Server OS update',
    time: 'Apr 3',
  },
  {
    id: 'api-rollback',
    code: '300 WRN',
    state: 'warning',
    message: 'API rollback',
    time: 'Jun 30',
  },
  {
    id: 'refund-process',
    code: '500 ERR',
    state: 'danger',
    message: 'Refund process',
    time: 'Jul 10',
  },
  {
    id: 'withdrawal-process',
    code: '500 ERR',
    state: 'danger',
    message: 'Withdrawal process',
    time: 'Sep 10',
  },
  {
    id: 'mail-tasks',
    code: '500 ERR',
    state: 'danger',
    message: 'Mail tasks',
    time: 'Dec 10',
  },
];
