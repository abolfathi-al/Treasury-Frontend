export type WorkspaceFilterKey =
  | 'dateRange'
  | 'organization'
  | 'actorType'
  | 'role'
  | 'status'
  | 'source'
  | 'priority'
  | 'accessType'
  | 'supplierVisibility';

export type RowActionTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary';

export interface RowActionItem {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: string;
  readonly tone?: RowActionTone;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  readonly dividerBefore?: boolean;
}
