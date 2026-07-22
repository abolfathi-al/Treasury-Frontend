export type ShellToolbarCommandId =
  | 'filter'
  | 'date-range'
  | 'secondary-filter'
  | 'primary-create';

export type ShellToolbarCommandTone = 'secondary' | 'primary';

export interface ShellToolbarCommand {
  readonly id: ShellToolbarCommandId;
  readonly labelKey: string;
  readonly iconName?: string;
  readonly tone: ShellToolbarCommandTone;
  readonly visible: boolean;
  readonly modalTarget?: string;
}
