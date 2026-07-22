# Directive Contract Baseline

Date: 2026-07-22

Status: `D0 COMPLETE`

This is the pre-refactor behavior baseline for
`docs/DIRECTIVE_REFACTOR_PLAN.md`. It records only production behavior with a
current owner. Source templates are authoritative; selector substring matches,
barrel imports, generated Graphify output, and unused public members are not
contracts.

## Inventory

| Measure | Baseline |
| --- | ---: |
| Production directives | 31 |
| Directives with selector consumers | 18 |
| Directives without selector consumers | 13 |
| Production directive code | 19,831 lines |
| Zero-consumer directive code | 9,388 lines |

The zero-consumer set is `TreeDirective`, `DropzoneDirective`,
`TinySliderDirective`, `CookieAlertDirective`, `AutocompleteDirective`,
`FullCalendarDirective`, `NoUiSliderDirective`, `DraggableDirective`,
`CountUpDirective`, `ClipboardDirective`, `TypedDirective`,
`ImageInputDirective`, and `IfIsBrowserDirective`.

`AutocompleteDirective` is imported by `standard-control-imports.ts`, but no
production template instantiates its selector. An import-only path does not
promote it into the active contract.

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
  responsive, focus, RTL/LTR, and browser behaviors remain explicit D3/D4
  browser gates; D0 does not promote their unused public APIs.

## Known mismatch to remove

The login template listens for `veloraStepperNext` and
`veloraStepperPrevious`, while `StepperDirective` exposes only `stepperNext`
and `stepperPrevious`. No code dispatches the two `velora*` DOM events, so the
template handlers do not run. `handleNextStep` is a no-op and wiring
`handlePrevStep` would duplicate the directive's own previous transition.

D3 must remove these dead bindings and handlers while moving the state machine
beside login. They are not part of the preserved Master contract.

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

| Bundle | Raw size | D1 disposition |
| --- | ---: | --- |
| `dropzone.css` | 4.65 kB | Remove. |
| `nouislider.css` | 3.72 kB | Remove. |
| `tiny-slider.css` | 1.63 kB | Remove. |
| `flatpickr.css` | 13.15 kB | Retain through D2, then remeasure. |
| `tagify.css` | 11.99 kB | Retain through D2, then remeasure. |

D1 must compare its production build against this baseline. A successful D1
removes the first three CSS bundles and all JavaScript reachable only through
the 13 zero-consumer directives without regressing the active checks above.
