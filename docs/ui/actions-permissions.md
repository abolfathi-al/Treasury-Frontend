# Actions And Permissions

Primary source references:

- `apps/web/src/app/core/state/context/context.models.ts`
- `apps/web/src/app/core/state/context/ui-capability.facade.ts`
- `apps/web/src/app/core/state/context/demo-ui-capability.facade.ts`
- `apps/web/src/app/core/state/context/demo-context.fixtures.ts`
- `apps/web/src/app/shell/layout/navigation/shell-navigation.model.ts`
- `apps/web/src/app/shell/layout/navigation/shell-navigation.utils.ts`
- `apps/web/src/app/shared/ui/dropdowns/dropdown.types.ts`
- `apps/web/src/app/shared/ui/dropdowns/row-actions-dropdown/row-actions-dropdown.component.ts`

## Permission Model In Source

Important: current permission/capability code is a UI display-hint contract only. Backend authorization is final.

Source comment:

```ts
// Contract only. UI capabilities are display hints; backend authorization is final.
```

Core types:

- `EffectivePermissionHint`
- `UiCapability`
- `UiCapabilityFacade`
- `PermissionHintEffect`: `ALLOW`, `DENY`, `CONDITIONAL`
- `UiCapabilitySource`: `EFFECTIVE_ACCESS_HINT`, `BACKEND_DECISION`, `DEMO_MODE`

`UiCapability` fields:

- `key`
- `visible`
- `enabled`
- `label`
- `reason`
- `permissionHintKeys`
- `riskTier`
- `requiresMfa`
- `source`

## Demo Capability Caveat

`demo-context.fixtures.ts` creates demo hints and capabilities such as:

- `dashboard.view`
- `memberships.view`
- `audit.metadata.view`
- `platform.settings.view`

These are demo-only and not an authorization source of truth.

## Navigation Permissions

`ShellNavigationItem` supports:

- `requiredPermissions?: readonly string[]`

`filterShellNavigationItems(items, canAccess)` removes items when not all required permissions pass. `resolveShellNavigationViewItems` accepts an optional matcher, but the current `ShellNavigationFacade` calls it without a matcher, so all configured navigation items are visible by default.

Rule:

- When real auth/capability is wired, pass a permission matcher into navigation resolution or adapt `ShellNavigationFacade`.

## Row Action Pattern

Type: `RowActionItem`

Fields:

- `id`
- `labelKey`
- `icon`
- `tone`
- `disabled`
- `disabledReason`
- `dividerBefore`

Component behavior:

- `vl-row-actions-dropdown` emits `actionSelected` only when `action.disabled` is false.
- Disabled actions set `disabled` and title/aria label from `disabledReason`.

Example:

```ts
const action: RowActionItem = {
  id: 'approve',
  labelKey: 'workspace.actions.approve',
  icon: 'check',
  tone: 'success',
  disabled: !capability.enabled,
  disabledReason: capability.reason,
};
```

## Disabled vs Hidden

Disable when:

- user can know action exists
- action is unavailable because of row state, validation, pending workflow, missing MFA, or conditional permission
- explanation helps the user fix the state

Hide when:

- action existence is sensitive
- navigation item should not be discoverable
- backend/security policy requires non-disclosure

Never rely on hiding or disabling as authorization.

## Destructive Actions

Rules:

- Use danger tone.
- Require confirmation with object identity and impact.
- Show downstream consumers for domain data.
- Log/audit intent when backend supports it.
- Keep action disabled while delete is in progress.

## Approval Actions

Rules:

- Show current status, target status, required role/capability, and risk.
- Require explicit user action.
- If disabled, show whether the blocker is permission, status, missing data, or MFA.

## Request Actions

Rules:

- Make request state visible: draft, submitted, pending, approved, rejected, expired.
- Prevent duplicate submissions while pending.
- Show retry/resubmit only when state allows it.

## Audit-sensitive Actions

Examples:

- permission grants
- membership changes
- scope changes
- pricing/contract publishing
- supplier visibility changes

Required UI:

- before/after values
- actor identity
- effective context
- timestamp or pending timestamp
- reason/comment when required
- impact analysis

## Global Admin And Elevated Actions

Rules:

- Elevated actions should not look like ordinary row actions.
- Include risk tier from `UiCapability.riskTier` when available.
- Require MFA indicators when `requiresMfa` is true.
- Use confirmation and impact view for critical actions.

## Anti-patterns

- Action menu items that emit but do nothing.
- Disabled actions without `disabledReason`.
- Generic destructive confirmation copy.
- Permission checks implemented only in UI.
- Demo capability strings treated as backend authorization.

