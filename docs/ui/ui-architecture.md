# UI Architecture

## Source Shape

Scanned source root: `apps/web/src/app`

Current UI source contains 408 TypeScript files, 50 templates, and 18 SCSS files under `apps/web/src/app`. The current app surface is intentionally small: auth routes, error routes, shell layout, a dashboard page, and a large shared UI foundation.

## Folder Boundaries

| Area | Path | Responsibility | Boundary Rule |
| --- | --- | --- | --- |
| App composition | `apps/web/src/app/app-routing.ts`, `app.config.ts`, `app.component.ts` | Providers, route tree, keyboard/focus event host, interceptors. | Keep app-level providers and global event bindings here. Do not put feature UI logic here. |
| Shell layout | `apps/web/src/app/shell` | Layout, header/sidebar/toolbar/footer, navigation, drawers, modal wrapper. | Shell owns chrome, not domain workflows. |
| Pages | `apps/web/src/app/pages` | Current standalone page entry points. | Page components assemble shared UI and feature state. |
| Auth module | `apps/web/src/app/modules/auth` | Login, registration, forgot password, logout shell. | Legacy auth UI exists, but shell route guard is intentionally disabled in `app-routing.ts`. |
| Errors module | `apps/web/src/app/modules/errors` | Error shells, 400/401/403/404/500/503 route data, retry/home/back actions. | Reuse `BaseErrorComponent` and route metadata instead of hand-building error pages. |
| i18n module | `apps/web/src/app/modules/i18n` | TypeScript locale modules and `TranslationService`. | Add keys in locale TS modules, not JSON assets. |
| Shared forms | `apps/web/src/app/shared/forms` | Standard form controls and validation feedback. | Reuse `StandardFormControl` descendants before creating a new control. |
| Shared directives | `apps/web/src/app/shared/directives` | DOM behavior wrappers for inputs, overlays, menus, sliders, tree, search, etc. | Use directives as behavior primitives; components should not duplicate their DOM state machines. |
| Shared charts | `apps/web/src/app/shared/charts` | D3 directives and chart components. | Components wrap D3 directives for domain-friendly chart reuse. |
| Shared UI | `apps/web/src/app/shared/ui` | Generic dropdowns, demo action modal, hierarchy components, action button. | Keep these domain-neutral and data-driven. |
| Utilities | `apps/web/src/app/utils` | DOM, event, responsive, form, date, async, error helpers. | Reuse utilities for cross-cutting behavior; do not add feature-specific helpers here. |

## Route And Layout Structure

Routes:

```ts
// apps/web/src/app/app-routing.ts
auth -> modules/auth/auth-routing
error -> modules/errors/errors-routing
'' -> shell/layout/shell-routing
** -> error/404
```

Shell routes:

```ts
// apps/web/src/app/shell/layout/shell-routing.ts
'' -> LayoutComponent
dashboard -> pages/dashboard/DashboardComponent
'' -> /dashboard
** -> error/404
```

Route metadata uses `titleKey`, `descriptionKey`, and optional `layout`. `ShellFacade` reads the deepest active route metadata and maps it into shell title/layout state.

## Shell State Pattern

Source reference: `apps/web/src/app/shell/layout/shell.facade.ts`

The shell uses Angular signals and computed values for:

- layout config from `LayoutService`
- route loading state from `NavigationStart`, `NavigationEnd`, `NavigationCancel`, `NavigationError`
- route metadata from deepest child route data
- active navigation item from `ShellNavigationFacade`
- sidebar collapsed and mobile sidebar open state
- layout-derived classes and attributes

Usage rule: shell components should bind to facade computed values. Do not re-read `LayoutService` from multiple nested components unless a local component owns the behavior.

## Navigation Pattern

Source references:

- `apps/web/src/app/shell/layout/navigation/shell-navigation.config.ts`
- `apps/web/src/app/shell/layout/navigation/shell-navigation.model.ts`
- `apps/web/src/app/shell/layout/navigation/shell-navigation.utils.ts`
- `apps/web/src/app/shell/layout/navigation/shell-navigation.facade.ts`

Current registered navigation item:

```ts
{
  id: 'dashboard',
  kind: 'link',
  labelKey: 'navigation.menu.dashboard',
  iconName: 'rocket',
  route: '/dashboard',
  activeMatch: 'exact',
}
```

Navigation supports `requiredPermissions`, child items, exact/prefix active matching, and translation of labels. The default resolver allows everything unless a `canAccess` matcher is passed.

Inferred rule: feature navigation should be added to `SHELL_NAVIGATION_ITEMS` and should use translation keys, not literal labels.

## Page vs Component vs Directive

- Page: assembles routes, facade data, domain copy, and shared UI.
- Shared component: renders a reusable visual/data block with explicit inputs and outputs.
- Directive: owns DOM behavior or third-party integration on an existing element.
- Utility: contains non-rendering reusable logic.

Anti-patterns:

- Do not put domain tables or wizards into shared components without a clear reusable API.
- Do not make directives responsible for business authorization or server decisions.
- Do not copy dashboard sample markup from `/Users/alirezaabolfathi/Projects/core` without adapting selectors and domain semantics.

## Dependency Rules

- Shared components may depend on shared directives, shared pipes, Angular common/forms, `@ngx-translate/core`, and focused core services such as CSS loader or logger.
- Shell may depend on shared UI and directives.
- Feature pages may depend on shell route metadata and shared UI, but shared UI should not import feature pages.
- Backend authorization must not depend on UI capability hints. See `actions-permissions.md`.
- Browser-only DOM behavior should guard with `IS_BROWSER_PLATFORM`, `isPlatformBrowser`, or directive host `isBrowser`.

