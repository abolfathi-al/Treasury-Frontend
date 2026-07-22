# Shared Components

This file documents reusable components under `apps/web/src/app/shared` plus shell overlay/chrome components that future UI work will reuse. Form controls are listed here for completeness and documented deeply in `forms-and-controls.md`.

## Shared Component Count

Reusable shared components scanned: 33.

Groups:

- 4 chart components
- 18 standard form controls
- 1 invalid feedback component
- 1 icon component
- 1 loading-state component
- 8 generic UI components

## Charts

| Selector | Path | Purpose | Inputs | Outputs | Usage Rules | Anti-patterns |
| --- | --- | --- | --- | --- | --- | --- |
| `vl-donut-chart` | `shared/charts/donut-chart/donut-chart.component.ts` | Donut summary with D3 directive and optional legend. | `segments`, `centerValue`, `centerLabel`, `size`, `thickness`, `gapAngle`, `cornerRadius`, `showLegend`, `ariaLabel` | None | Pass positive-valued `DonutChartSegment[]`; set `ariaLabel` for non-decorative charts. | Do not feed unfiltered domain objects directly; map to chart segment DTOs. |
| `vl-gauge-chart` | `shared/charts/gauge-chart/gauge-chart.component.ts` | Gauge/arc summary with D3. | `segments`, `centerValue`, `centerLabel`, `size`, `thickness`, `gapAngle`, `cornerRadius`, `sweepAngle`, `showLegend`, `ariaLabel` | None | Use for bounded status/progress summaries. | Do not use gauge for unbounded values or tables. |
| `vl-progress-breakdown` | `shared/charts/progress-breakdown/progress-breakdown.component.ts` | Horizontal progress distribution. | `items`, `compact`, `ariaLabel` | None | Component clamps percentages to `0..100`. | Do not pass already formatted percentages as strings. |
| `vl-waterfall-chart` | `shared/charts/waterfall-chart/waterfall-chart.component.ts` | Waterfall contribution chart. | `items`, `height`, `ariaLabel`, `showLegend` | None | Use for additive/subtractive contribution narratives. | Do not use for unrelated categorical comparisons. |

Example:

```html
<vl-donut-chart
  [segments]="statusSegments"
  [centerValue]="total"
  centerLabel="workspace.dashboard.total"
  ariaLabel="Workspace status distribution">
</vl-donut-chart>
```

## Forms

All selectors below extend `StandardFormControl` or one of its descendants. Shared inputs include `controlName`, `label`, `placeholder`, `helpText`, `required`, `disabled`, `readonly`, `validators`, `asyncValidators`, and `queryParamKey` where inherited from the base class.

| Selector | Path | Purpose | Extra Inputs | Outputs | Notes |
| --- | --- | --- | --- | --- | --- |
| `vl-text-control` | `shared/forms/form-controls/text-control/text-control.component.ts` | Text input with optional inputmask and projected button. | `minLength`, `maxLength`, `showCounter`, `trimOnBlur`, `autocomplete`, `maskOptions` | None | Uses `vlVeloraInputmask` only when `maskOptions` exist. |
| `vl-textarea-control` | `shared/forms/form-controls/textarea-control/textarea-control.component.ts` | Textarea with autosize and max-length counter. | textual inputs | None | Only standard control that applies `vlVeloraMaxlength`. |
| `vl-number-control` | `shared/forms/form-controls/number-control/number-control.component.ts` | Numeric text input with inputmask. | `min`, `max`, `step`, `decimals`, `prefix`, `suffix` | None | Uses `inputmode="decimal"` and numeric mask. |
| `vl-currency-control` | `shared/forms/form-controls/currency-control/currency-control.component.ts` | Currency numeric input. | numeric inputs, `currencySymbol` | None | Overrides mask alias to `currency`. |
| `vl-percent-control` | `shared/forms/form-controls/percent-control/percent-control.component.ts` | Percentage input. | numeric inputs | None | Adds default validators min 0 and max 100. |
| `vl-password-control` | `shared/forms/form-controls/password-control/password-control.component.ts` | Password input with anti-autocomplete and strength meter. | `minPasswordLength`, `minScore` | None | Emits score internally and validates with `PasswordMeter` error. |
| `vl-tags-control` | `shared/forms/form-controls/tags-control/tags-control.component.ts` | Tag/chip-like comma value using Tagify. | `whitelist`, `maxTags`, `enforceWhitelist`, `duplicates`, `trimTags`, `tagPlaceholder`, `dropdownEnabled` | `tagValueChange` | Stores current value as string. |
| `vl-dialer-control` | `shared/forms/form-controls/dialer-control/dialer-control.component.ts` | Increment/decrement numeric input. | numeric inputs | None | Buttons are disabled when readonly or disabled. |
| `vl-date-control` | `shared/forms/form-controls/date-control/date-control.component.ts` | Date picker. | `dateFormat`, `enableTime` | None | Uses Flatpickr directive. |
| `vl-datetime-control` | `shared/forms/form-controls/datetime-control/datetime-control.component.ts` | Date-time picker. | `dateFormat` | None | Defaults to `Y-m-d H:i`. |
| `vl-boolean-control` | `shared/forms/form-controls/boolean-control/boolean-control.component.ts` | Switch/checkbox. | base named inputs | None | `readonly` disables the checkbox. |
| `vl-single-select-control` | `shared/forms/form-controls/single-select-control/single-select-control.component.ts` | `ng-select` single choice. | `options`, `bindLabel`, `bindValue`, `clearable`, `searchable`, `loading`, `emptyText` | `valueChange` | Uses `vlSingleOption`. |
| `vl-multi-select-control` | `shared/forms/form-controls/multi-select-control/multi-select-control.component.ts` | Multi select. | select inputs | `valueChange` | Initial value is `[]`. |
| `vl-async-select-control` | `shared/forms/form-controls/async-select-control/async-select-control.component.ts` | Async/searching select. | select inputs | `valueChange`, `searchChange` | Shows loading/empty form text. |
| `vl-tenant-selector-control` | `shared/forms/form-controls/tenant-selector-control/tenant-selector-control.component.ts` | Tenant-specific single select wrapper. | select inputs | `valueChange` | Domain naming wrapper over select. |
| `vl-organization-selector-control` | `shared/forms/form-controls/organization-selector-control/organization-selector-control.component.ts` | Organization select wrapper. | select inputs | `valueChange` | Search forced true. |
| `vl-membership-selector-control` | `shared/forms/form-controls/membership-selector-control/membership-selector-control.component.ts` | Membership select wrapper. | select inputs | `valueChange` | Search forced true. |
| `vl-scope-selector-control` | `shared/forms/form-controls/scope-selector-control/scope-selector-control.component.ts` | Scope dimension select. | select inputs, `multi` | `valueChange` | Filters options to `LOCKED_SCOPE_DIMENSIONS`. |

Anti-patterns:

- Do not apply `vlVeloraMaxlength` to `vl-text-control`; it belongs to textarea controls in the current shared imports.
- Do not use a standard control outside a parent form with `[formGroup]`.
- Do not bypass `vl-invalid-feedback` unless a feature has a domain-specific error renderer.

## Validation Feedback

| Selector | Path | Purpose | Inputs | Outputs | Usage Rules |
| --- | --- | --- | --- | --- | --- |
| `vl-invalid-feedback` | `shared/forms/invalid-feedback/invalid-feedback.component.ts` | Shows highest-priority translated validation error after dirty/touched. | `control`, `ctrl`, `name` | None | Pass `name` as a translation key for field labels. |

Example:

```html
<vl-invalid-feedback control="username" name="workspace.auth.input.username"></vl-invalid-feedback>
```

## Icon And Loading

| Selector | Path | Purpose | Inputs | Outputs | Rules |
| --- | --- | --- | --- | --- | --- |
| `vl-velora-icon` | `shared/icons/velora-icon/velora-icon.component.ts` | Loads Velora icon CSS and renders icon paths. | `name`, `class`, `type` | None | Use `type` values `duotone`, `outline`, or `solid`; set `aria-hidden="true"` when decorative. |
| `vl-paragraph-skeleton` | `shared/loading-states/paragraph-skeleton/paragraph-skeleton.component.ts` | Random paragraph/line skeleton placeholder. | `minParagraphs`, `maxParagraphs`, `minLines`, `maxLines` | None | Use for text loading states, not final empty states. |

## Generic UI

| Selector | Path | Purpose | Inputs | Outputs | Usage Rules | Anti-patterns |
| --- | --- | --- | --- | --- | --- | --- |
| `vl-button-with-indicator` | `shared/ui/button-with-indicator/button-with-indicator.component.ts` | Button with loading indicator and optional icon/shortcut. | `icon`, `title`, `shortcut`, `waitDesc`, `classes`, `disabled`, `isLoading$$` | `clicked` | Use a `BehaviorSubject<boolean>` for loading. | Do not rely on it for authorization; disabled still needs a reason in action metadata. |
| `vl-demo-action-modal` | `shared/ui/demo-actions/demo-action-modal.component.ts` | Fixed card modal for demo-only actions. | `open`, `titleKey`, `descriptionKey`, `actionTypeKey`, `primaryLabelKey`, `secondaryLabelKey`, `demoOnlyNoteKey`, `confirmationKey`, `icon`, `tone`, `requiresConfirmation` | `closed`, `primarySelected` | Use only for local/demo flows. | Do not ship real destructive workflows with this demo-only copy. |
| `vl-more-filters-dropdown` | `shared/ui/dropdowns/more-filters-dropdown/more-filters-dropdown.component.ts` | Dropdown shell with static workspace filter controls. | `filters`, `buttonClass`, `disabled`, `buttonLabelKey` | `filtersApply`, `filtersReset` | Replace static select values when implementing real feature filters. | Do not mark a filter feature complete if controls do not affect data. |
| `vl-row-actions-dropdown` | `shared/ui/dropdowns/row-actions-dropdown/row-actions-dropdown.component.ts` | Permission/state-aware row action menu. | `actions`, `ariaLabelKey`, `buttonClass`, `placement` | `actionSelected` | Disabled actions do not emit; include `disabledReason`. | Do not hide why a disabled action is unavailable. |
| `vl-hierarchy-graph` | `shared/ui/hierarchy/hierarchy-graph/hierarchy-graph.component.ts` | Interactive D3 hierarchy graph with zoom, minimap, drag, RTL support. | `nodes`, `links`, `selectedNodeId`, `height`, `ariaLabel`, `showControls`, `showLegend`, `showMiniMap`, `dragEnabled`, `layoutDirection` | `nodeSelected` | Use for scope/tree semantics, not generic cards. | Do not pass cyclic graph data. |
| `vl-hierarchy-tree` | `shared/ui/hierarchy/hierarchy-tree/hierarchy-tree.component.ts` | D3 outline tree with search, collapse, keyboard selection, RTL support. | `nodes`, `selectedNodeId`, `searchPlaceholderKey`, `showSearch`, `treeMinHeight`, `layoutDirection` | `nodeSelected` | Use `HierarchyNode.children`; selected path is computed from hierarchy. | Do not use for flat tables. |
| `vl-hierarchy-node-card` | `shared/ui/hierarchy/hierarchy-node-card/hierarchy-node-card.component.ts` | Detail card for a selected hierarchy node. | `title`, `subtitle`, `icon`, `tone`, `statusKey`, `levelBadge`, `details` | None | Feed translated label keys for details. | Do not encode status as color only. |
| `vl-hierarchy-path-preview` | `shared/ui/hierarchy/hierarchy-path-preview/hierarchy-path-preview.component.ts` | Renders selected hierarchy path segments. | `titleKey`, `fullPathLabelKey`, `segments`, `fullPath` | None | Use when a path is a meaningful domain concept. | Do not show label-only compare flows as impact analysis. |

## Shell Reusable Components

Shell components under `apps/web/src/app/shell` are reusable within the shell chrome:

- `vl-layout`, `vl-content`, `vl-header`, `vl-navbar`, `vl-sidebar`, `vl-sidebar-menu`, `vl-toolbar`, `vl-footer`, `vl-page-title`
- extras: `vl-user-inner`, `vl-notifications-inner`, `vl-search-result-inner`, `vl-quick-links-inner`, `vl-theme-mode-switcher`
- overlays: `vl-modal`, `vl-messenger-drawer`, `vl-scroll-top`, `vl-splash-screen`

Usage rule: reuse these only as shell chrome. Feature pages should use shared UI components or their own feature components rather than importing shell internals.

