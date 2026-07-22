# Directive Refactor and Hardening Plan

Status: `IN PROGRESS` (`D0 COMPLETE`; D1 is next)

Parent plan: `docs/FRONTEND_REFACTOR_PLAN.md`, Phase 4.

Execution priority: immediate. Complete D0-D6 before resuming unfinished work
in the parent plan.

## Outcome

Reduce the inherited directive layer to the smallest reusable surface that the
Dashboard Master currently needs, while preserving the behavior of every active
consumer.

The unit of preservation is user-visible behavior, not the existing directive
class. Each current directive must end in exactly one state:

1. deleted because it has no production consumer;
2. replaced by native HTML, CSS, Angular, or an already-installed dependency;
3. moved beside its only component or feature owner as a private implementation
   detail; or
4. retained as a small shared directive because multiple current consumers need
   the same low-level DOM behavior.

No directive remains public merely because a future project might need it.

## Baseline

The 2026-07-22 source audit records:

| Measure | Baseline |
| --- | ---: |
| Production directives | 31 |
| Production directive code | 19,831 lines |
| Angular signal inputs | 529 |
| Angular signal outputs | 242 |
| Signal API members with no external production reference | at least 624 |
| Directives with no production consumer | 13 |
| Code in zero-consumer directives | 9,388 lines |
| `TreeDirective` | 2,823 lines, 114 methods, 291 branch points, zero consumers |
| `MenuDirective` | 1,559 lines, 108 methods, 241 branch points, six consumer files |

Graphify identifies `BaseDirective`, `MenuDirective`, `TreeDirective`,
`LoggerService`, `CoreUtil`, and the directive helper layer as the principal
cross-cutting nodes. Graph evidence guides navigation; source bytes and active
consumer templates decide behavior.

## Constraints

- Preserve current active selectors until their consumers migrate in the same
  change set. Do not perform a blanket selector-prefix rename.
- Add no package, directive framework, compatibility registry, generic plugin
  system, or speculative configuration surface.
- Do not retain unused inputs, outputs, imperative methods, DOM events, styles,
  or dependencies as a future Master contract.
- Prefer native HTML and CSS, then Angular and installed dependencies, before
  custom code.
- Preserve SSR/hydration safety, RTL/LTR behavior, accessibility, focus,
  keyboard paths, form state, and responsive behavior.
- UI validation and permission behavior remain presentation concerns; backend
  validation and authorization stay authoritative.

## Directive disposition

### Delete: zero production consumers

Remove the directive, its specs, barrel export, package references, allowed
CommonJS entries, plugin styles, patches, and documentation together.

| Directive | Current lines | Dependency consequence |
| --- | ---: | --- |
| `TreeDirective` | 2,823 | Remove its unconsumed tree implementation and styles. |
| `DropzoneDirective` | 946 | Remove `dropzone` and `@types/dropzone`. |
| `TinySliderDirective` | 882 | Remove `tiny-slider`, its patch, and `patch-package` if no patch remains. |
| `CookieAlertDirective` | 695 | Remove the unconsumed custom behavior. |
| `AutocompleteDirective` | 650 | Remove `awesomplete` and its type/style surface. |
| `FullCalendarDirective` | 636 | Remove the six `@fullcalendar/*` packages and styles. |
| `NoUiSliderDirective` | 624 | Remove `nouislider` and styles. |
| `DraggableDirective` | 519 | Remove the unconsumed custom behavior. |
| `CountUpDirective` | 422 | Remove `countup.js`. |
| `ClipboardDirective` | 418 | Remove `clipboard`. |
| `TypedDirective` | 396 | Remove `typed.js`. |
| `ImageInputDirective` | 333 | Remove the unconsumed custom behavior. |
| `IfIsBrowserDirective` | 44 | Remove it; current browser guards do not consume it. |

### Internalize: reusable controls own the behavior

These behaviors are used only through standard form controls. Keep only the
contract required by those controls and stop exporting a general-purpose vendor
API from the directive barrel.

| Current directive | Current consumers | Target |
| --- | ---: | --- |
| `AntiAutocompleteDirective` | 1 | Use native autocomplete attributes or private password-control behavior. |
| `AutosizeDirective` | 1 | Prefer native CSS; otherwise keep the smallest private textarea adapter. |
| `DialerDirective` | 1 | Move behavior into `DialerControlComponent`. |
| `FlatpickrDirective` | 2 | Keep one internal date adapter with only time/date-format options currently used. |
| `InputmaskDirective` | 4 | Keep one narrow internal mask adapter driven by a single typed options input. |
| `MaxlengthDirective` | 1 | Replace with native `maxlength` and a small accessible textarea counter. |
| `PasswordMeterDirective` | 1 | Move the score and visibility behavior into the password control. |
| `SingleOptionDirective` | 2 | Configure the two `ng-select` controls directly unless shared code is shorter. |
| `TagifyDirective` | 1 | Move the required Tagify adapter into the tags control; retain only its eight used options and three used events. |

### Localize or replace: single-owner application behavior

| Current directive | Owner | Target |
| --- | --- | --- |
| `SearchDirective` | Navbar search | Move state and events into the existing search component. |
| `StepperDirective` | Login | Keep the state machine module-local; remove duplicate Angular-output and custom-DOM-event channels. |
| `StickyDirective` | Shell layout | Prefer `position: sticky`; keep JavaScript only for behavior CSS cannot express. |
| `ScrollDirective` | Sidebar menu | Prefer native overflow and CSS sizing; preserve scroll state only if the active consumer proves it. |
| `ScrollTopDirective` | Shell layout | Use a small shell-owned button with native smooth scrolling. |
| `SwapperDirective` | Header | Prefer responsive CSS ordering; any DOM move must preserve focus and reading order. |

### Retain and rewrite: shared shell primitives

Only these directives currently have enough distinct consumers to justify a
shared public behavior.

| Directive | Current consumers | Required contract |
| --- | ---: | --- |
| `MenuDirective` | 6 | Accessible dropdown/accordion behavior, outside click, Escape, focus return, RTL placement, and responsive sidebar handling. Use ng-bootstrap where it covers the behavior; custom code handles only the remaining sidebar case. |
| `DrawerDirective` | 3 | Open/close state, overlay, focus trap/return, Escape, scroll lock, and responsive width. Prefer existing ng-bootstrap offcanvas behavior. |
| `ToggleDirective` | 2 | Target state, `aria-expanded`/`aria-controls`, keyboard activation, and one change event. |

## Required directive contract

Every retained or internal directive must satisfy all applicable rules:

### API

- Every public input, output, and imperative method has a current production
  consumer or a documented Master contract.
- A vendor wrapper accepts one typed options object unless a small explicit
  input is required for Angular forms or accessibility.
- One event has one channel. Do not emit both an Angular output and a custom DOM
  event for the same transition.
- Public callbacks use precise types. No `Function`, `any`, or duplicated event
  aliases.

### Lifecycle

- Initialization is idempotent.
- Input changes either update the live instance safely or perform one explicit
  destroy-and-recreate cycle.
- Destroy removes every listener, timer, observer, overlay, Popper instance,
  dynamically created element, global class, and third-party instance.
- A lazy import that resolves after destruction cannot recreate the behavior.
- Repeated route entry and exit leaves no global state behind.

### Browser and SSR

- Module evaluation and construction do not touch browser globals.
- Browser-only work runs behind the existing platform tokens or render hooks.
- Server rendering returns stable markup without fake browser polyfills.
- Hydration does not initialize the same third-party instance twice.

### Accessibility

- Interactive hosts are keyboard reachable and expose correct roles, names,
  state attributes, and relationships.
- Escape closes transient UI and returns focus to its trigger.
- Enter, Space, and arrow-key behavior follows the relevant control pattern.
- Focus is not lost after responsive DOM changes.
- Reduced-motion preferences disable nonessential animation.

### Forms

- Form value, touched, dirty, disabled, readonly, and validation states remain
  synchronized.
- A mask or tag adapter does not emit duplicate changes.
- Display formatting does not silently change the value persisted by the form.
- Client validation remains advisory and never claims backend enforcement.

### Failure behavior

- Missing optional markup disables only the affected behavior.
- Dynamic import failure leaves usable native UI and reports one actionable
  error.
- Cleanup is safe after partial initialization.
- No catch-and-ignore layer hides a broken required interaction.

## Execution phases

### D0 - Freeze active behavior

Completed on 2026-07-22. The selector/owner contract, characterization
coverage, known Stepper mismatch, and production-size baseline are recorded in
`docs/DIRECTIVE_CONTRACT_BASELINE.md`.

1. Record the active selector-to-consumer map.
2. Add characterization checks only for behavior those consumers use.
3. Capture shell flows for menu, drawer, toggle, sticky/scroll, search, and
   scroll-to-top.
4. Capture form flows for masked, date, datetime, tags, password, textarea,
   dialer, and select controls.
5. Record production bundle and plugin CSS sizes.

Exit gate: the active behavior and current owners are explicit; no unused API is
promoted into the contract.

### D1 - Delete dead directives and dependencies

1. Remove all 13 zero-consumer directives and their tests/exports.
2. Remove the corresponding 16 direct and development packages.
3. Remove obsolete allowed-CommonJS entries, Sass imports, CSS bundles, and the
   Tiny Slider patch.
4. Remove `@types/bootstrap-maxlength` when native maxlength replaces the custom
   implementation.
5. Verify that no production selector, import, asset, or documentation reference
   remains.

Exit gate: at least 9,388 production TypeScript lines are gone, no removed plugin
ships CSS or JavaScript, and all current flows still build.

### D2 - Internalize form-control behavior

Work from the smallest behavior to the highest-risk vendor adapter:

1. anti-autocomplete and single-option;
2. native maxlength and textarea autosize;
3. dialer and password meter;
4. Flatpickr;
5. Inputmask;
6. Tagify.

For each slice, migrate its current consumer, delete unused API immediately, add
one focused lifecycle/form check, and remove the public barrel export when no
external consumer remains.

Exit gate: each form adapter is private to the reusable control layer, has no
unused public member, and passes value/disabled/readonly/cleanup checks.

### D3 - Replace single-owner shell behavior

1. Replace sticky, scroll, scroll-top, and swapper behavior with CSS/native APIs
   where possible.
2. Move search behavior into the navbar search component.
3. Move stepper behavior beside login and expose one typed state transition
   channel.
4. Delete the former shared directive after its owner passes characterization
   and browser checks.

Exit gate: these behaviors no longer enlarge the shared Master API and preserve
keyboard, focus, responsive, RTL/LTR, and route-reentry behavior.

### D4 - Rewrite retained shell primitives

1. Refactor `ToggleDirective` to the minimal target-state contract.
2. Replace covered `DrawerDirective` behavior with ng-bootstrap offcanvas and
   keep custom code only for proven gaps.
3. Split the current menu behavior by responsibility at its consumer boundary:
   ng-bootstrap dropdowns for header/action menus and one small sidebar
   accordion implementation.
4. Preserve current selectors during migration, then remove obsolete option and
   event aliases in the declared breaking Master release.

Exit gate: menu, drawer, and toggle have no global singleton registry, restore
focus correctly, support keyboard operation, clean up completely, and pass
desktop/mobile plus RTL/LTR browser checks.

### D5 - Collapse directive infrastructure

Do this after consumer migrations reveal what is still shared:

1. Remove unused `BaseDirective` state, options, safe-executor, and listener
   layers.
2. Delete `BaseDirective` entirely if direct Angular lifecycle code is shorter
   across the three retained primitives.
3. Keep a helper only when at least two retained implementations need identical
   behavior and the helper reduces total code.
4. Prune `CoreUtil`, `DomUtil`, `ResponsiveUtil`, `DataUtil`, `EventUtil`, and
   Logger calls that existed only for removed directives.

Exit gate: there is no directive mini-framework and no helper retained for a
single implementation.

### D6 - Final verification and documentation

1. Run `pnpm typecheck`.
2. Run `pnpm lint`.
3. Run `pnpm test:ci`.
4. Run `pnpm build` and `pnpm build:prod`.
5. Run SSR and hydration smoke checks.
6. Run browser checks for desktop/mobile, light/dark, RTL/LTR, keyboard, focus,
   reduced motion, and route re-entry.
7. Update `docs/ui/directives.md` to describe only the surviving public API.
8. Refresh Graphify after each code slice and perform the required semantic
   refresh after documentation changes.

Exit gate: the complete verification matrix is green and a clean Master consumer
uses the active controls without editing Master-owned directive internals.

## Commit and continuation policy

Use meaningful vertical commits, not one commit per tiny method:

1. dead directive and dependency deletion;
2. form-control internalization;
3. native/single-owner shell migration;
4. retained menu/drawer/toggle rewrite;
5. directive infrastructure deletion;
6. final documentation and Graphify refresh.

After a green commit, continue automatically to the next slice. Stop only for a
real regression, an ambiguous active behavior that changes the user contract, or
a dependency limitation that cannot be resolved within the existing stack.

## Completion metrics

- 13 zero-consumer directives and their assets are absent.
- At least 9,388 production directive lines are deleted in D1.
- Up to 17 packages become removable across dead-plugin and native-maxlength
  work.
- The shared public directive surface contains only behavior with multiple
  current consumers.
- No public directive member lacks a production consumer or documented Master
  contract.
- No listener, timer, observer, overlay, or third-party instance survives
  destruction.
- Current form and shell flows pass SSR, browser, accessibility, RTL/LTR,
  responsive, test, lint, typecheck, and production-build gates.

The target is not a cleaner version of 31 directives. The target is the smallest
robust behavior set that future Dashboard Master consumers actually inherit.
