export type HierarchyTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary';

export interface HierarchyNode {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly level: number;
  readonly count?: number | string;
  readonly parentId?: string;
  readonly parentLabel?: string;
  readonly inheritance?: string;
  readonly path?: string;
  readonly icon?: string;
  readonly tone?: HierarchyTone;
  readonly selected?: boolean;
  readonly expanded?: boolean;
  readonly children?: readonly HierarchyNode[];
}

export interface HierarchyGraphNode {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly level: number;
  readonly count?: number | string;
  readonly tone?: HierarchyTone;
}

export interface HierarchyGraphLink {
  readonly source: string;
  readonly target: string;
}

export interface HierarchyPathSegment {
  readonly label: string;
  readonly tone?: HierarchyTone;
}

export interface HierarchyNodeDetail {
  readonly labelKey: string;
  readonly value: string;
  readonly badgeClass?: string;
}

export interface HierarchyResourceRow {
  readonly name: string;
  readonly detail?: string;
  readonly value?: string;
  readonly statusKey?: string;
  readonly badgeClass?: string;
}
