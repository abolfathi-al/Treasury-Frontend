# Implementation Checklist

Use this checklist before and after future UI implementation work.

## Before Implementing A Feature

- Read `ui-architecture.md`.
- Identify route, shell, page, shared UI, and domain boundaries.
- Confirm whether the feature already has translation keys.
- Confirm whether required components/directives/pipes/utilities already exist.
- Define loading, error, empty, partial, and validation states.
- Define permission/capability behavior.

## Before Creating A Component

- Check `shared-components.md`.
- Prefer existing shared components where the API fits.
- Keep feature-specific components inside the feature/page boundary.
- Define inputs, outputs, accessibility, states, and examples.
- Do not create shared components for one feature unless reuse is real.

## Before Adding A Directive

- Check `directives.md`.
- Reuse existing directive behavior if possible.
- Define selector, inputs, outputs, lifecycle, host/listener cleanup, accessibility, and caveats.
- Guard browser-only behavior.
- Add tests for listener cleanup and input changes.

## Before Adding A Pipe

- Check `pipes.md`.
- Do not duplicate date, relative time, digit conversion, or safe rendering.
- Define input/output, pure/impure behavior, locale behavior, and error handling.
- Avoid impure pipes in large repeated lists unless necessary.

## Before Creating A Form

- Read `forms-and-controls.md`.
- Reuse standard controls where possible.
- Define typed form model when feasible.
- Define sync, async, cross-field, server-side, and form-level validation.
- Use `vl-invalid-feedback`.
- Verify disabled, readonly, pending/loading, and i18n behavior.
- For inputmask controls, verify masked/unmasked value type.
- Use `vlVeloraMaxlength` only for textarea unless source architecture intentionally changes.

## Before Creating A Table

- Read `tables-and-grids.md`.
- Define domain row model and domain columns.
- Define sort, filter, pagination, selection, bulk actions, row actions.
- Include loading, empty, error, and partial states.
- Add permission-aware action state and disabled reasons.

## Before Creating A Modal Or Drawer

- Read `modals-drawers-wizards.md`.
- Choose modal, SweetAlert confirmation, drawer, or demo-only modal intentionally.
- Include object identity and domain-specific data.
- Define close/dismiss/save behavior.
- Include focus and Escape behavior.
- For destructive actions, include impact and confirmation.

## Before Creating A Wizard

- Define domain-specific step names and meanings.
- Define per-step validation.
- Define next/previous/direct navigation behavior.
- Define draft/save/publish/review behavior if applicable.
- Define honest-disabled terminal actions and reasons.
- Add a review step with actual data.

## Before Marking A Workspace Complete

- Apply `domain-workspace-design-rules.md`.
- Verify tabs change meaningful content.
- Verify every action is browser-visible and wired.
- Verify every modal/drawer has domain-specific data.
- Verify every table has domain-specific columns.
- Verify create/edit forms validate domain rules.
- Verify compare flows compare domain semantics.
- Verify impact panels show downstream consumers.
- Verify permissions and disabled reasons are visible.
- Verify loading, error, empty, partial, and validation states.
- Verify i18n and RTL/LTR behavior.

