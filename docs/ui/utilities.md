# Utilities

Primary utility path: `apps/web/src/app/utils`

This file documents reusable utility APIs and UI infrastructure services that future UI implementation can reuse. Utility APIs generally log with `LoggerService` and return safe fallbacks instead of throwing, except where noted.

## Utility Index

| Path | Public API | Purpose | Inputs | Outputs | Error Handling | Reuse Rules |
| --- | --- | --- | --- | --- | --- | --- |
| `utils/animation.util.ts` | `AnimationUtil` | Animate numeric values, classes, slide up/down, scroll. | DOM element, duration, callbacks. | `void` or `Promise<void>`. | Logs errors; slide promises reject on caught errors. | Use for directive-like DOM transitions, not Angular route animation. |
| `utils/async-resource.ts` | `ResourceStatus`, `AsyncResource<T>`, `trackResource` | Convert Observable results into loading/loaded/error state. | `NotificationService`, optional `isServer`. | RxJS `OperatorFunction<T, AsyncResource<T>>`. | Toasts parsed HTTP errors and returns `ERROR` state. | Use for panel/page async state when a full state machine is not needed. |
| `utils/core.util.ts` | `CoreUtil` | IDs, nested object access/mutation, clone/merge, search, sort, URL params, text width, coercion, random ints. | Generic objects, paths, values, predicates. | Typed values, booleans, arrays, strings. | Logs and returns fallback. | Reuse for generic object operations; avoid for domain rules that deserve typed functions. |
| `utils/data.util.ts` | `DataUtil` | In-memory element-key data store. | `HTMLElement`, key, data. | Stored value, arrays, count, void. | Warns/logs and returns fallback. | Use for directive instance metadata only. |
| `utils/deep-diff-mapper.ts` | `DeepDiffMapper`, `DiffType`, `DiffResult` | Compare nested objects. | old object, new object. | Diff map or diff result. | Throws on function arguments. | Use for impact/review UI only after filtering non-serializable values. |
| `utils/dom.util.ts` | `DomUtil` | CSS, viewport, offsets, visibility, DOM traversal, focus helpers, color helpers, wrappers for event/responsive/animation. | DOM elements/selectors/styles/events. | Strings, numbers, elements, booleans, promises. | Logs and returns fallback. | Use inside directives/services; avoid direct DOM utility calls in feature templates. |
| `utils/event.util.ts` | `EventUtil` | Add/remove event listeners and delegates, dispatch custom events. | Element, event name, callback/selector. | Handler ids or boolean. | Logs and returns fallback. | Use with cleanup via returned ids. |
| `utils/form.util.ts` | `FormUtil`, `FormFieldState`, `FieldValueChange` | Form traversal, validation errors, touched/reset, value streams, password helpers. | `FormGroup`, `FormArray`, field names. | Controls, error maps, Observables, booleans. | Logs and returns fallback/`EMPTY`. | Use for feature forms; verify `getFirstInvalidControl` before relying on it because it queries by object string. |
| `utils/format-date.ts` | `formatDate`, `toDate`, `isoStringToDate`, `isDate`, `ISO8601_DATE_REGEX` | Custom locale-aware date formatting. | Date-like value, format, locale, timezone. | Formatted string or Date. | Throws from `toDate` when conversion fails; pipe catches errors. | Use through `date` pipe in templates. |
| `utils/http-error.ts` | `parseErrorMessage`, `handleHttpError` | Parse HTTP error messages and pipe errors to notifications/logs. | `HttpErrorResponse`, context, fallback. | Error message or RxJS operator. | Returns fallback or rethrows wrapped `Error`; logs failures. | Use in data-access services, not components, when possible. |
| `utils/local-fa.ts` | `extraLocaleFa` | Persian extra locale data. | None. | Angular locale data array. | Generated file, no runtime handling. | Do not edit manually. |
| `utils/responsive.util.ts` | `ResponsiveUtil` | Bootstrap breakpoints, viewport, responsive values, item counts. | Breakpoint names, responsive value maps, `DestroyRef`. | Strings/numbers/Signals. | Logs and returns fallback. | Use for directive/layout responsive behavior. |
| `utils/rtl.util.ts` | `createRtlSignals`, `LanguageDirection`, `RtlSignals` | Direction-aware signal bundle. | Injected `TranslationService`. | Signals for direction and arrow icon names. | Depends on translation direction stream. | Use in components that need directional icons or layout. |
| `utils/style.util.ts` | `StyleUtil` | CSS property, class, and attribute helpers. | Element, property/class/attribute. | `void`, strings, booleans. | Logs and returns fallback. | Use in directives, not for ordinary Angular class binding. |
| `utils/to-camel.ts` | `toCamel` | Recursively lowercases first character of object keys. | Object or array. | Converted value. | No explicit error handling. | Use only when API shape requires this shallow Pascal-to-camel conversion. |

## Decorators

| Path | API | Purpose | Rules |
| --- | --- | --- | --- |
| `core/decorators/conditional-call.decorator.ts` | `ConditionalCall(conditionFn)` | Prevent method execution unless condition passes. | Used by `ButtonWithIndicatorComponent`; avoid hiding side effects behind decorators unless obvious. |
| `core/decorators/debounce.decorator.ts` | `Debounce(milliseconds)` | Debounce identical argument calls and attach hidden cancel function. | Prefer RxJS debounce in reactive flows; use decorator for local imperative handlers only. |

## UI Infrastructure Services

| Path | Service | Purpose | Reuse Rules |
| --- | --- | --- | --- |
| `core/services/app-initialization.service.ts` | `AppInitializationService` | Loads runtime translations, sets NgSelect defaults, wires overlay subscriptions. | App-level only. |
| `core/services/events.service.ts` | `GlobalEventsService` | Global keydown, notification, drawer, and router overlay state. | Use for global keyboard/overlay coordination. |
| `core/services/focus-management.service.ts` | `FocusManagementService` | Overlay and form focus movement. | Use for modals/drawers and Enter-to-next-input behavior. |
| `core/services/keyboard-event.service.ts` | `KeyboardEventService` | Handles global shortcuts, Escape overlay close, Enter focus behavior. | Keep feature keyboard shortcuts out of components unless they hook through this service. |
| `core/services/notification.service.ts` | `NotificationService` | SweetAlert toast/modal/confirm wrappers. | Use for toast and confirmation flows. |
| `core/services/css-loader.service.ts` | `CssLoaderService` | Runtime CSS loading, used by `VeloraIconComponent`. | Use for lazy CSS assets only. |
| `core/services/layout.service.ts` and `layout-init.service.ts` | `LayoutService`, `LayoutInitService` | Layout config, CSS classes, body attrs, stored layout. | Use through shell facade unless changing layout system. |

## Anti-patterns

- Adding a new utility for a single feature.
- Using DOM utilities where Angular binding is enough.
- Treating UI helper fallbacks as validation guarantees.
- Mutating domain DTOs through generic nested path utilities without tests.

