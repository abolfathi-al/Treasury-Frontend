# Modals, Drawers, And Wizards

Primary source references:

- `apps/web/src/app/shell/components/modals/modal/modal.component.ts`
- `apps/web/src/app/shared/ui/demo-actions/demo-action-modal.component.ts`
- `apps/web/src/app/shared/directives/drawer.directive.ts`
- `apps/web/src/app/shell/components/drawers/messenger-drawer/messenger-drawer.component.html`
- `apps/web/src/app/shared/directives/stepper.directive.ts`
- `apps/web/src/app/modules/auth/pages/login/login.component.html`
- `apps/web/src/app/core/services/notification.service.ts`
- `apps/web/src/app/core/services/keyboard-event.service.ts`
- `apps/web/src/app/core/services/focus-management.service.ts`

## Modal Patterns

### Ngb Modal Wrapper

Selector: `vl-modal`

Inputs:

- `modalConfig` required.

Behavior:

- Uses `NgbModal`.
- Content is projected through `ng-content`.
- `open()` returns `Promise<boolean>`.
- `close()` checks `modalConfig.shouldClose()` and calls `modalConfig.onClose()`.
- `dismiss()` checks `disableDismissButton`, `shouldDismiss()`, and `onDismiss()`.

Example:

```html
<vl-modal #confirmModal [modalConfig]="modalConfig">
  <p>{{ 'workspace.action.confirmBody' | translate }}</p>
</vl-modal>
```

Usage rules:

- Use this wrapper when the content is Angular UI and needs projected templates.
- Keep modal title and buttons domain-specific.
- Make `shouldClose` or `disableCloseButton` honest; do not enable terminal actions before validation passes.

### SweetAlert Notification/Confirmation

Source: `core/services/notification.service.ts`

Public methods:

- `toast(options?)`
- `modal(options?)`
- `confirmSubmit(options?)`
- `confirmDelete(options?)`

Rules:

- Use `confirmDelete` for destructive actions.
- Use `confirmSubmit` for high-impact submit confirmations.
- Use translated button labels from `common.actions`.
- Notification service updates `GlobalEventsService` so keyboard/focus logic knows an overlay is active.

### Demo Action Modal

Selector: `vl-demo-action-modal`

This is demo-only. It renders a fixed card modal with demo copy and optional confirmation note.

Use only for fixture/local demo workflows. Do not use it as the real modal pattern for destructive or audit-sensitive backend actions.

## Drawer Pattern

Directive: `vlVeloraDrawer`

Shell example:

```html
<div
  vlVeloraDrawer
  [drawerOverlay]="true"
  [drawerWidth]="{default:'300px', 'md': '500px'}"
  [drawerDirection]="'end'"
  [drawerName]="'chat'"
  [drawerActivate]="true"
  [drawerEscape]="true"
  [drawerToggleSelector]="'#velora_drawer_chat_toggle'"
  [drawerClose]="'#velora_drawer_chat_close'">
</div>
```

Drawer rules:

- Use drawers for contextual details, edit surfaces, and secondary workflows.
- Use `drawerName` to identify drawer instances.
- Provide a real close button and escape behavior unless the flow is intentionally blocking.
- Keep read-only detail drawers read-only; do not mix hidden edit forms into detail drawers.
- Edit drawers must validate and show unsaved state.

Keyboard/focus:

- `KeyboardEventService` closes all drawers through `DrawerDirective.hideAll()` on Escape.
- `FocusManagementService` selects `[data-velora-drawer="true"].drawer-on` when drawer focus is needed.

## Wizard Pattern

Directive: `vlVeloraStepper`

Existing example:

- `modules/auth/pages/login/login.component.html`
- Hidden nav with two step content panels.
- Next, previous, and submit buttons use `data-velora-stepper-action`.
- Submit validation is implemented by the page, not by the directive.

Stepper inputs:

- `stepperOptions`
- `stepperActivate`
- `stepperStartIndex`
- `stepperLoop`
- `stepperContentSelector`
- `stepperNavSelector`
- `stepperNextSelector`
- `stepperPrevSelector`
- `stepperCurrentClass`
- `stepperPendingClass`
- `stepperCompletedClass`
- `stepperStepActionSelector`
- `stepperSubmitSelector`

Stepper outputs:

- `stepperNext`
- `stepperPrevious`
- `stepperChange`
- `stepperChanged`
- `stepperClick`
- `stepperSubmit`

Wizard rules:

- Stepper controls visibility and current/completed/pending classes only.
- The page must own validation, persistence, submit disabled state, and review semantics.
- Every wizard must have domain-specific step names and domain-specific step meaning.
- Do not approve generic `Identity -> Values -> Validation -> Impact -> Review` unless the domain truly matches that flow.

Required wizard structure:

- Step definitions with ids, labels, and domain meaning.
- Step validation rules.
- Navigation rules for next/previous/direct step clicks.
- Review step that summarizes actual domain data.
- Honest-disabled terminal actions with visible reason.
- Draft/save behavior if work can be paused.
- Publish/review behavior if workflow requires approval.

## Confirmation And Destructive Actions

Rules:

- Destructive actions need a modal/confirmation with object identity and impact.
- Confirmation copy must include the domain object, not generic "Are you sure?" only.
- A disabled destructive action must show why it is disabled.
- Confirmation actions must not run if validation or permission checks fail.

## Read-only Detail Drawer

Required content:

- Object identity
- Status and effective state
- Audit-relevant metadata
- Related downstream consumers
- Available actions with disabled reasons

Anti-pattern:

- Reusing static drawer content across rows.

## Edit Drawer

Required behavior:

- Load row-specific data.
- Validate domain rules.
- Track dirty state.
- Show save loading and errors.
- Block close or warn when unsaved changes exist if the workflow requires it.

## Impact Analysis Modal

Required behavior:

- Show real downstream consumers.
- Show before/after effects.
- Show risk tier and required approvals.
- Do not use static explanatory copy as impact analysis.

## Honest-disabled Terminal Actions

A terminal action, such as submit, publish, approve, or delete, must be disabled when required data is missing or invalid. It must show a reason. Hidden terminal actions are acceptable only when the user should not discover the action exists.

