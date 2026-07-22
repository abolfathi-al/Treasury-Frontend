# Velora UI Knowledge Index

This directory is a documentation and knowledge-extraction pass for future UI implementation work. It records what exists in `apps/web/src/app`, what is only represented as fixtures or translation copy, and what patterns future Codex/Cursor work should follow.

## How To Use These Docs

- Start with `ui-architecture.md` before changing routes, layout, shell navigation, or feature boundaries.
- Use `shared-components.md`, `directives.md`, `pipes.md`, and `utilities.md` before creating any new reusable UI API.
- Use `forms-and-controls.md` before building or repairing any form. It includes the current `StandardFormControl` contract and the rule that `vlVeloraMaxlength` belongs to textarea controls only.
- Use `tables-and-grids.md`, `modals-drawers-wizards.md`, and `actions-permissions.md` before implementing domain workspaces.
- Use `domain-workspace-design-rules.md` and `implementation-checklist.md` as acceptance gates before marking a workspace complete.
- Use `UI_KNOWLEDGE_GENERATION_REPORT.md` to see scan coverage, counts, gaps, and final classification.

## File Map

| File | Contains | Use When |
| --- | --- | --- |
| `ui-architecture.md` | Angular source layout, route/layout structure, ownership boundaries, dependency rules. | Adding pages, shell behavior, or feature routes. |
| `shared-components.md` | Reusable shared components, selectors, inputs, outputs, examples, rules. | Reusing or extending shared UI. |
| `directives.md` | All 41 directives, public inputs/outputs, lifecycle, caveats, and external dashboard sample analysis. | Using or changing directive behavior. |
| `pipes.md` | All 4 pipes, input/output, examples, locale behavior, security caveats. | Formatting values in templates. |
| `forms-and-controls.md` | Form architecture, all 18 standard controls, validators, states, error rendering. | Creating feature forms or repairing controls. |
| `tables-and-grids.md` | Existing row action/filter pieces and required future table patterns. | Building grids, row actions, bulk actions, or table states. |
| `modals-drawers-wizards.md` | Ngb modal wrapper, SweetAlert confirmations, Velora drawer, stepper wizard rules. | Building overlays, drawers, and multi-step flows. |
| `states-loading-error-empty.md` | Loading, skeleton, error, retry, validation, empty and partial-state rules. | Implementing async or failure states. |
| `actions-permissions.md` | UI capability hints, navigation permissions, action visibility/disabled rules. | Building permission-aware actions. |
| `i18n-and-formatting.md` | Translation module layout, locale loading, RTL/LTR, dates, numbers. | Adding display text or formatting. |
| `utilities.md` | Reusable utility APIs and UI infrastructure services. | Reusing helpers instead of inventing new ones. |
| `domain-workspace-design-rules.md` | Anti-template rule and acceptance gate for real domain UI. | Reviewing workspace completeness. |
| `implementation-checklist.md` | Pre-implementation and completion checklist. | Before implementation and before final review. |
| `UI_KNOWLEDGE_GENERATION_REPORT.md` | Coverage, counts, gaps, risks, recommendations, classification. | Auditing this pass. |

## Ground Rules For Future Agents

- Do not invent APIs. If a method, input, output, or selector is not documented here, verify the source before using it.
- Treat inferred rules as inferred. They are called out explicitly in the docs.
- Treat demo-only code and fixture-only strings as non-authoritative for real backend behavior.
- Do not copy selectors from `/Users/alirezaabolfathi/Projects/core/src/app/pages/dashboard`; those samples use `appDs...` selectors. Use the Velora selectors documented in `directives.md`.

