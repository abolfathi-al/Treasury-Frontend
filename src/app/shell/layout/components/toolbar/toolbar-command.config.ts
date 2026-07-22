import { IToolbar } from '@core/config/config';

import { ShellToolbarCommand } from './toolbar-command.model';

const DEFAULT_PRIMARY_MODAL_TARGET = '#velora_modal_create_app';

export function resolveClassicToolbarCommands(
  toolbar: Partial<IToolbar>,
): readonly ShellToolbarCommand[] {
  return [
    {
      id: 'filter',
      labelKey: 'common.actions.filter',
      iconName: 'filter',
      tone: 'secondary',
      visible: Boolean(toolbar.filterButton),
    },
    {
      id: 'date-range',
      labelKey: 'common.states.loadingDateRange',
      iconName: 'calendar-8',
      tone: 'secondary',
      visible: Boolean(toolbar.daterangepickerButton),
    },
    {
      id: 'secondary-filter',
      labelKey: 'common.actions.filter',
      tone: 'secondary',
      visible: true,
    },
    {
      id: 'primary-create',
      labelKey: 'common.actions.create',
      tone: 'primary',
      visible: toolbar.primaryButton ?? true,
      modalTarget: toolbar.primaryButtonModal
        ? `#velora_modal_${toolbar.primaryButtonModal.replace(/-/g, '_')}`
        : DEFAULT_PRIMARY_MODAL_TARGET,
    },
  ];
}
