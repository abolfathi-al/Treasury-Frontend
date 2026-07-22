# Tables And Grids

No reusable table/grid component was found under `apps/web/src/app/shared`. Existing table-related source is currently limited to action/filter building blocks and many future workspace translation keys.

## Existing Building Blocks

| Building Block | Path | Purpose |
| --- | --- | --- |
| `vl-row-actions-dropdown` | `shared/ui/dropdowns/row-actions-dropdown/row-actions-dropdown.component.ts` | Row action menu with disabled action support. |
| `RowActionItem` | `shared/ui/dropdowns/dropdown.types.ts` | Action metadata: `id`, `labelKey`, `icon`, `tone`, `disabled`, `disabledReason`, `dividerBefore`. |
| `vl-more-filters-dropdown` | `shared/ui/dropdowns/more-filters-dropdown/more-filters-dropdown.component.ts` | Static filter dropdown shell. |
| `WorkspaceFilterKey` | `shared/ui/dropdowns/dropdown.types.ts` | Filter key union: date range, organization, actor type, role, status, source, priority, access type, supplier visibility. |
| `vl-paragraph-skeleton` | `shared/loading-states/paragraph-skeleton/paragraph-skeleton.component.ts` | Loading placeholder that can be reused around tables. |

Example row action:

```ts
readonly actions: readonly RowActionItem[] = [
  {
    id: 'viewDetails',
    labelKey: 'workspace.scopeHierarchyExplorer.rowActions.viewDetails',
    icon: 'eye',
    tone: 'primary',
  },
  {
    id: 'deactivate',
    labelKey: 'workspace.actions.deactivate',
    icon: 'trash',
    tone: 'danger',
    disabled: !canDeactivate,
    disabledReason: 'Action unavailable for this row state.',
    dividerBefore: true,
  },
];
```

```html
<vl-row-actions-dropdown
  [actions]="actions"
  (actionSelected)="handleRowAction(row, $event)">
</vl-row-actions-dropdown>
```

## Required Future Table Pattern

Every domain table should define:

- domain-specific row model
- domain-specific column model
- sorting state
- filtering state
- pagination or load-more state
- selection state, if bulk actions exist
- row action metadata with disabled reasons
- loading, empty, error, and partial data states
- permission-aware action decisions

Recommended table state shape:

```ts
interface WorkspaceTableState<TRow> {
  readonly rows: readonly TRow[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly selectedIds: ReadonlySet<string>;
  readonly sort: { column: string; direction: 'asc' | 'desc' } | null;
  readonly filters: Record<string, unknown>;
  readonly page: { index: number; size: number; total?: number };
}
```

This is an inferred pattern, not an existing exported API.

## Columns

Rules:

- Columns must be domain-specific, not generic `name/status/actions` only.
- Column labels must be translation keys.
- A column that displays permission-sensitive data must also define how it behaves when the user lacks permission.
- Numeric/date columns should use locale-aware pipes or utilities from `pipes.md` and `i18n-and-formatting.md`.

Anti-patterns:

- Generic columns copied across unrelated workspaces.
- Column values that are labels only when the domain requires semantic comparison.
- Missing empty/null display rules.

## Sorting

Existing helper:

- `CoreUtil.createSortComparer(fields, order)` in `apps/web/src/app/utils/core.util.ts`.

Rules:

- Sort raw values, not translated labels.
- Keep sort state visible in header controls.
- Persist sort only if the workspace needs saved views.

## Filtering

Existing filter shell:

- `vl-more-filters-dropdown` renders static controls and emits apply/reset.

Rules:

- Feature filters must change table data.
- Applied filter state must be visible.
- Reset must clear all filter state and reload or recompute data.

Anti-pattern:

- A dropdown with static select options that emits events but does not affect data.

## Pagination

Existing implementation:

- No shared paginator component found.
- Translation keys exist under `workspace.shared.pagination`.

Rules:

- Use server pagination for large datasets.
- Use load-more only when ordering is stable.
- Always show loading state for page transitions.

## Selection And Bulk Actions

No reusable selection component was found.

Required rules:

- Bulk actions must require at least one selected row.
- Bulk actions must show count and impact.
- Destructive bulk actions require confirmation.
- Permission-disabled bulk actions must show a reason.

## Expandable Rows And Sticky Columns

No reusable pattern found.

Required rules:

- Expandable content must be row-specific and domain-specific.
- Sticky columns must not overlap content in RTL or LTR.
- Sticky action columns must remain keyboard reachable.

## Permission-aware Actions

Use `RowActionItem.disabled` and `disabledReason` for row state or UI capability restrictions. Use hiding only when the user should not discover the action exists. See `actions-permissions.md`.

## Table Acceptance Gate

A table is not complete unless:

- columns are domain-specific
- filters change actual data
- sort changes row order
- row actions are browser-visible and wired
- empty, loading, error, and partial states are visible
- selection and bulk actions are meaningful when present
- permission disabled states explain themselves

