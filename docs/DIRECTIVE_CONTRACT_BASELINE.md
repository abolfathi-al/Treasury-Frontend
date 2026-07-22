# Directive Contract Baseline

Date: 2026-07-22

Status: `D0 COMPLETE`

This is the pre-refactor behavior baseline for
`docs/DIRECTIVE_REFACTOR_PLAN.md`. It records current production consumers,
catalog-only capabilities, focused characterization coverage, and build size.
Until M1 records the complete compatibility catalog, each directive's source,
barrel export, selector, `exportAs`, public inputs, outputs, methods, required
package, and plugin CSS remain part of the supported Master surface. Generated
Graphify output and selector substring matches are navigation evidence only.

## Inventory

| Measure | Baseline |
| --- | ---: |
| Production directives | 31 |
| Directives with selector consumers | 18 |
| Catalog-only directives in the current application | 13 |
| Production directive code | 19,831 lines |
| Catalog-only directive code | 9,388 lines |

The current catalog-only set is `TreeDirective`, `DropzoneDirective`,
`TinySliderDirective`, `CookieAlertDirective`, `AutocompleteDirective`,
`FullCalendarDirective`, `NoUiSliderDirective`, `DraggableDirective`,
`CountUpDirective`, `ClipboardDirective`, `TypedDirective`,
`ImageInputDirective`, and `IfIsBrowserDirective`. All remain supported Master
Admin capabilities.

No production template currently instantiates `AutocompleteDirective`.
Consumer count does not change its supported public Master contract.

## Active selector-to-owner map

| Directive | Production owner(s) | Used contract |
| --- | --- | --- |
| `AntiAutocompleteDirective` | password control | Selector only; native `autocomplete="new-password"` is also present. |
| `AutosizeDirective` | textarea control | Selector only. |
| `DialerDirective` | dialer control | Value, activate, step, min, max, decimals, prefix, and suffix inputs; `valueChange`. |
| `FlatpickrDirective` | date and datetime controls | Enable-time and date-format inputs. |
| `InputmaskDirective` | currency, number, percent, and text controls | One `inputmaskOptions` input. |
| `MaxlengthDirective` | textarea control | Always-show, show-on-ready, and append-to-parent inputs; native `maxlength` supplies the limit. |
| `PasswordMeterDirective` | password control | Activate, minimum length, three selectors, highlight class, and score-change output. |
| `SingleOptionDirective` | single-select and tenant-selector controls | Selector only. |
| `TagifyDirective` | tags control | Whitelist, max tags, enforce-whitelist, duplicates, trim, placeholder, dropdown, and readonly inputs; input, add, and remove events. |
| `SearchDirective` | navbar search | Activate, keypress, minimum length, Enter, and layout inputs; exported instance consumed by the result component. |
| `StepperDirective` | login | Data-attribute selector, exported instance, next/previous actions, nav/content state, and submit action. |
| `StickyDirective` | shell layout header | Activate, animation, name, offset, z-index, and reverse inputs. |
| `ScrollDirective` | sidebar menu | Activate, height, dependencies, wrappers, offset, and save-state inputs. |
| `ScrollTopDirective` | shell layout | Activate, reveal offset, and behavior inputs. |
| `SwapperDirective` | header menu wrapper | Activate, mode, and parents inputs. |
| `MenuDirective` | more-filters, row-actions, theme switcher, header, navbar, and sidebar menu | External/data triggers, attach, expand, outside click, exported `hide()`, and shown/hidden state. |
| `DrawerDirective` | messenger, mobile header menu, and mobile sidebar | Overlay, width, direction, name, activate, toggle selector, plus messenger Escape/close and sidebar `stateChange`. |
| `ToggleDirective` | header and sidebar-logo controls | Activate, target selector, state, name, and `toggleChange`. |

The owner paths are:

- Form controls: `src/app/shared/forms/form-controls/`.
- Login stepper: `src/app/modules/auth/pages/login/login.component.html`.
- Shell layout: `src/app/shell/layout/`.
- Shared dropdowns: `src/app/shared/ui/dropdowns/`.

`ScrollDirective` has one owner. The `vlVeloraScrollTop` selector contains the
text `vlVeloraScroll`, so substring searches can incorrectly report the layout
scroll-top host as a second scroll consumer.

## Characterization coverage

The active contract is protected by the following focused checks:

- `menu.directive.spec.ts`: external click trigger opens the current menu form;
  an outside click closes it and emits the settled events.
- `stepper.directive.spec.ts`: the login data-attribute form initializes at
  step zero and next/previous actions update classes, index, and typed outputs.
- Existing Drawer, Toggle, Scroll, ScrollTop, Search, and Inputmask directive
  specs remain green.
- `shared-form-controls.spec.ts` protects standard control registration,
  reactive values, disabled state, validators, select rendering, and the
  textarea-only maxlength boundary.
- The production build compiles the active Sticky and Swapper bindings. Their
  responsive, focus, RTL/LTR, and browser behaviors remain explicit M5 browser
  gates; their other public APIs remain supported catalog capabilities.

## Known mismatch to remove

The login template listens for `veloraStepperNext` and
`veloraStepperPrevious`, while `StepperDirective` exposes only `stepperNext`
and `stepperPrevious`. No code dispatches the two `velora*` DOM events, so the
template handlers do not run. `handleNextStep` is a no-op and wiring
`handlePrevStep` would duplicate the directive's own previous transition.

M5 must reconcile the mismatch through one compatible event path and protect
it with a migration test. The fix may remove only unreachable consumer wiring;
it must preserve the directive's selector, export alias, outputs, imperative
API, and reusable state-machine behavior.

## Production-size baseline

`pnpm build:prod` completed on 2026-07-22 with hash
`6b25d168d39f3c81`.

| Measure | Size |
| --- | ---: |
| Angular initial raw total | 993.91 kB |
| Angular initial estimated transfer | 241.22 kB |
| Emitted JavaScript, including lazy locales and workers | 2,197,788 bytes |
| CSS after PurgeCSS, including themes and fonts | 438,182 bytes |
| Five explicit plugin CSS files after PurgeCSS | 6,464 bytes |

Pre-purge plugin CSS reported by Angular:

| Bundle | Raw size | Master contract |
| --- | ---: | --- |
| `dropzone.css` | 4.65 kB | Retain for `DropzoneDirective`; optimize loading. |
| `nouislider.css` | 3.72 kB | Retain for `NoUiSliderDirective`; optimize loading. |
| `tiny-slider.css` | 1.63 kB | Retain for `TinySliderDirective`; optimize loading. |
| `flatpickr.css` | 13.15 kB | Retain for `FlatpickrDirective`; remeasure after refactor. |
| `tagify.css` | 11.99 kB | Retain for `TagifyDirective`; remeasure after refactor. |

Each relevant adapter slice must compare its production build against this
baseline. Optimization may defer inactive vendor loading, but it must not
remove the package, CSS, selector, API, or documented Master capability.
