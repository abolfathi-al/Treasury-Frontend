# Directive Refactor and Hardening Plan

Status: `IN PROGRESS` (`M0 COMPLETE`; M1 is next)

Parent plan: `docs/FRONTEND_REFACTOR_PLAN.md`, Phase 4.

## Outcome

Turn the complete directive catalog into a robust, reusable Master Admin
capability layer. Every current directive remains available for future
projects, including directives that the current demo application does not
instantiate.

Refactoring changes implementation quality, not product capability. It must
improve lifecycle safety, type precision, SSR/hydration behavior,
accessibility, performance, failure handling, and maintainability while
preserving the public facade.

## Non-negotiable Master contract

- Keep all 31 shared directive classes and selectors.
- Keep barrel exports, package dependencies, plugin CSS, and patches required
  to instantiate those directives.
- Preserve existing inputs, outputs, `exportAs` names, imperative methods, data
  attributes, and documented examples.
- Treat both active and catalog-only directives as supported Master
  capabilities. Zero consumers in this repository is an audit fact, not a
  deletion signal.
- Do not require a current application page to justify a reusable dashboard
  capability.
- Do not rename or remove a public member without a separately approved,
  versioned deprecation and migration path.
- Add no replacement framework around the directives. Reuse the existing
  Angular, browser, and shared directive infrastructure when it is sound.

## Baseline

The 2026-07-22 audit records:

| Measure | Baseline |
| --- | ---: |
| Shared directives | 31 |
| Production directive code | 19,831 lines |
| Angular signal inputs | 529 |
| Angular signal outputs | 242 |
| Directives instantiated by the current application | 18 |
| Catalog-only directives in the current application | 13 |
| `TreeDirective` | 2,823 lines, 114 methods, 291 branch points |
| `MenuDirective` | 1,559 lines, 108 methods, 241 branch points |

These numbers identify refactor risk and test priority. They do not authorize
capability removal.

The active selector/owner map, known Stepper mismatch, characterization
coverage, and production-size baseline are recorded in
`docs/DIRECTIVE_CONTRACT_BASELINE.md`.

## Required implementation contract

### Compatibility

- Existing Angular templates compile without consumer migrations.
- Public inputs keep their aliases, accepted value shapes, defaults, and
  responsive semantics.
- Public outputs keep their payload types and emission order.
- Existing imperative methods and static lookup APIs remain callable.
- Existing plugin styles and dynamic imports remain available.

### Lifecycle

- Initialization is idempotent.
- Input changes update the live instance or perform one explicit
  destroy-and-recreate cycle.
- Destroy removes every listener, timer, observer, overlay, Popper instance,
  dynamically created element, global class, and third-party instance.
- A lazy import that resolves after destruction cannot recreate behavior.
- Repeated route entry and exit leaves no global state behind.

### Browser and SSR

- Module evaluation and construction do not touch browser globals.
- Browser-only work uses the existing platform tokens and directive host.
- Server rendering returns stable markup.
- Hydration does not initialize a third-party instance twice.

### Accessibility

- Interactive hosts expose the correct role, name, state, and relationship
  attributes.
- Keyboard operation matches the relevant control pattern.
- Escape closes transient UI and returns focus when applicable.
- Responsive DOM changes preserve focus and reading order.
- Reduced-motion preferences disable nonessential animation.

### Types and failure behavior

- No public callback uses `Function` or `any` when a precise type is possible.
- Third-party imports are wrapped by narrow internal types without shrinking
  their public directive facade.
- Missing optional markup disables only the affected behavior.
- Dynamic import failure keeps usable native markup and reports one actionable
  error.
- Cleanup remains safe after partial initialization.

### Performance

- Global listeners are shared or scoped and are removed when no longer needed.
- Repeated DOM queries are cached only when invalidation is explicit.
- Scroll, resize, drag, and input hot paths avoid layout thrashing and duplicate
  work.
- A directive does not initialize or import its vendor library before
  activation.

## Refactor order

### M0 - Freeze behavior and production baseline

Completed on 2026-07-22.

- Recorded the current owner map without treating catalog-only directives as
  dead code.
- Added focused Menu and Stepper characterization tests.
- Captured package/CSS and production build sizes.
- Verified typecheck, lint, 223 tests, and production build.

Exit gate: complete.

### M1 - Lock the Master compatibility catalog

1. Reconcile `docs/ui/directives.md` with all 31 directive source files.
2. Record selector, `exportAs`, inputs, outputs, imperative API, vendor package,
   CSS bundle, browser globals, and cleanup obligations for every directive.
3. Add a small static contract test that fails when a directive disappears
   from the barrel or loses its selector/export alias unintentionally.
4. Classify tests as active-consumer, catalog-capability, lifecycle, SSR, and
   accessibility coverage.

Exit gate: every directive has an explicit compatibility contract and an owner
for its verification, whether or not the demo currently instantiates it.

### M2 - Harden shared directive infrastructure

Refactor `BaseDirective`, `directive-host`, `directive-helpers`, and the emitter
before changing large adapters.

1. Trace all callers before modifying shared behavior.
2. Consolidate duplicate listener, timer, destroy, option-update, and safe-run
   behavior only where the existing implementation is truly identical.
3. Make destroy state and late async completion behavior deterministic.
4. Remove unsafe casts and broad callback types without changing public APIs.
5. Keep helpers only when at least two directives use them and total code is
   smaller.

Exit gate: shared lifecycle primitives have focused tests and every directive
still typechecks without public contract changes.

### M3 - Refactor high-complexity adapters

Work one directive per commit in this order:

1. `TreeDirective`;
2. `MenuDirective`;
3. `DropzoneDirective`;
4. `TinySliderDirective`;
5. `FullCalendarDirective`;
6. `NoUiSliderDirective`;
7. `AutocompleteDirective`.

For each adapter:

- preserve the full public facade;
- separate option normalization, DOM state, vendor lifecycle, and event
  forwarding only when the split reduces total complexity;
- remove duplicate branches and repeated queries;
- make lazy-load cancellation and cleanup explicit;
- add focused initialization, update, destroy, and failure checks;
- retain its package, CSS, selector, and documentation.

Exit gate: each adapter is independently testable, cleans up completely, and
has lower measured complexity without losing capability.

### M4 - Refactor form and input directives

Refactor without internalizing or deleting their reusable facade:

1. `AntiAutocompleteDirective`, `AutosizeDirective`, and
   `SingleOptionDirective`;
2. `DialerDirective`, `MaxlengthDirective`, and `PasswordMeterDirective`;
3. `FlatpickrDirective`, `InputmaskDirective`, and `TagifyDirective`;
4. `ClipboardDirective`, `ImageInputDirective`, and `TypedDirective`.

Verify Angular form value, touched, dirty, disabled, readonly, validation,
duplicate emission, vendor cleanup, and server-render behavior.

Exit gate: each directive remains reusable outside the current standard form
controls and has a precise, stable Master contract.

### M5 - Refactor shell behavior directives

Refactor `DrawerDirective`, `ToggleDirective`, `SearchDirective`,
`StepperDirective`, `StickyDirective`, `ScrollDirective`,
`ScrollTopDirective`, and `SwapperDirective` while keeping their shared public
selectors and APIs.

Prefer CSS or native browser behavior inside the implementation where it is
equivalent, but do not remove the directive facade. Fix the known login Stepper
event mismatch through one compatible event path and a migration test.

Exit gate: desktop/mobile, RTL/LTR, keyboard, focus, Escape, responsive, and
route-reentry flows remain stable.

### M6 - Refactor remaining catalog capabilities

Refactor `CookieAlertDirective`, `CountUpDirective`, `DraggableDirective`, and
`IfIsBrowserDirective` with the same compatibility and lifecycle gates.

Exit gate: all 31 directives have completed a reviewed refactor slice.

### M7 - Master verification and documentation

1. Run `pnpm typecheck`.
2. Run `pnpm lint`.
3. Run `pnpm test:ci`.
4. Run `pnpm build` and `pnpm build:prod`.
5. Run SSR smoke and browser accessibility/responsive checks.
6. Compare bundle, CSS, initialization, and route-reentry results with M0.
7. Refresh Graphify and the directive documentation.

Exit gate: the Master Admin retains all 31 directive capabilities, has no
unapproved breaking change, and passes the complete verification matrix.

## Slice workflow

Every implementation slice follows the same small loop:

1. query Graphify and read the source plus all callers;
2. state the public contract being preserved;
3. add or tighten the smallest relevant characterization check;
4. refactor one lifecycle or complexity concern;
5. run the focused check, typecheck, and lint;
6. run the full suite/build when shared infrastructure or vendor loading
   changes;
7. update Graphify and commit the green slice.

Do not combine unrelated directives in one implementation commit.

## Completion criteria

- All 31 directives, selectors, barrel exports, and required dependencies
  remain present.
- All documented public inputs, outputs, aliases, and methods remain compatible
  unless a separate versioned deprecation was approved.
- Every directive has initialization, update, destroy, and error-path evidence
  appropriate to its complexity.
- Browser-only libraries are SSR/hydration safe.
- Keyboard, focus, reduced-motion, and responsive behavior are verified where
  applicable.
- Complexity and duplication decrease without introducing another framework.
- Typecheck, lint, full tests, production build, SSR smoke, Graphify, and
  documentation are green.
