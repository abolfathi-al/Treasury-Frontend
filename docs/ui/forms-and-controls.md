# Forms And Controls

Primary source paths:

- `apps/web/src/app/shared/forms/form-controls`
- `apps/web/src/app/shared/forms/invalid-feedback`
- `apps/web/src/app/modules/auth/pages/login`

Standard form control count: 18.

## Architecture

Source reference: `shared/forms/form-controls/standard-control-base.ts`

All standard controls inherit from `StandardFormControl<T>` or one of these descendants:

- `NamedFormControl<T>`
- `TextualFormControl`
- `NumericFormControl`
- `DateLikeControl`
- `SelectFormControl`
- `PasswordFormControl`
- `TagsFormControl`

Base behavior:

- Requires a parent `FormGroupDirective`.
- Uses `controlName` to find or create a form control.
- If the parent form does not contain the control, the component creates it and removes it on destroy.
- Supports initial values from query params through `queryParamKey`.
- Merges inherited validators, default validators, policy validators, input validators, runtime validators, and `Validators.required`.
- Maintains computed state: valid, invalid, dirty, touched, pending, disabled, readonly, errors.
- Shows errors only when invalid and dirty or touched.

Example:

```html
<form [formGroup]="form">
  <vl-text-control
    controlName="displayName"
    label="workspace.form.displayName"
    placeholder="workspace.form.displayName"
    [maxLength]="120">
  </vl-text-control>
</form>
```

## Shared Inputs And Outputs

Base inputs:

- `required`
- `disabled`
- `readonly`
- `queryParamKey`
- `validators`
- `asyncValidators`

Named control inputs:

- `controlName`
- `label`
- `placeholder`
- `helpText`

Select outputs:

- `valueChange`

Tags outputs:

- `tagValueChange`

Async select outputs:

- `searchChange`

## Control Catalog

| Control | Selector | Renderer/Directive | Validation Pattern | Disabled/Readonly | Loading | i18n | Accessibility Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Text input | `vl-text-control` | Native `input type="text"` with `vlVeloraInputmask` when `maskOptions` exist. | `minLength`, `maxLength`, required, custom validators. | `[readonly]`; disabled via base effect. | None. | Label, placeholder, help text translated. | Uses `id=controlName` and label `for`. |
| Textarea | `vl-textarea-control` | `textarea` with `vlVeloraAutosize` and `vlVeloraMaxlength`. | `minLength`, `maxLength`, required, custom validators. | `[readonly]`; disabled via base effect. | None. | Label, placeholder, help text translated. | Maxlength counter can always show via `showCounter`. |
| Number | `vl-number-control` | Text input with `inputmode="decimal"` and numeric `vlVeloraInputmask`. | `min`, `max`, required, custom validators. | `[readonly]`; disabled via mask options. | None. | Label/placeholder translated. | Ensure unmasked value is numeric. |
| Currency | `vl-currency-control` | Inputmask alias `currency`. | Numeric validators plus `currencySymbol`. | Same as number. | None. | Label/placeholder translated. | Currency symbol is visual; backend currency code still needs a field. |
| Percent | `vl-percent-control` | Inputmask alias `percentage`. | Default validators min 0 and max 100 plus custom validators. | Same as number. | None. | Label/placeholder translated. | Suffix is `%`; validate expected scale before API use. |
| Password | `vl-password-control` | Password input with `vlAntiAutocomplete` and `vlVeloraPasswordMeter`. | `minPasswordLength`, `minScore`, required, `PasswordMeter` error. | `[readonly]`; disabled via base effect. | None. | Labels and aria-label translated. | Visibility button has translated aria label. |
| Tags/chips | `vl-tags-control` | Input with `vlVeloraTagify`. | `maxTags`, required, whitelist policy if configured. | `tagifyReadOnly`; disabled via base effect. | None. | Placeholder and help text translated. | Decide storage format before backend use. |
| Dialer | `vl-dialer-control` | Input group with `vlVeloraDialer`. | Numeric validators: `min`, `max`, required. | Dialer disabled when readonly or disabled. | None. | Button aria labels translated. | Plus/minus buttons are explicit controls. |
| Date picker | `vl-date-control` | Input with `vlVeloraFlatpickr`. | Required/custom validators. | `[readonly]`; disabled via base effect. | None. | Label/placeholder translated. | Use consistent date format with API. |
| Date-time picker | `vl-datetime-control` | Input with `vlVeloraFlatpickr`, time enabled. | Required/custom validators. | Same as date. | None. | Label/placeholder translated. | Defaults to `Y-m-d H:i`. |
| Checkbox/switch | `vl-boolean-control` | Native checkbox styled as switch. | Required/requiredTrue if provided. | `readonly` disables the control. | None. | Label/help translated. | Label wraps checkbox for click target. |
| Single select | `vl-single-select-control` | `ng-select` with `vlSingleOption`. | Required/custom validators. | `readonly` and disabled via base effect. | `loading` input. | Placeholder and `emptyText` translated. | `labelForId=controlName`. |
| Multi select | `vl-multi-select-control` | `ng-select` multiple. | Required/custom validators. | `readonly` and disabled via base effect. | `loading` input. | Placeholder and `emptyText` translated. | Initial value is empty array. |
| Async select | `vl-async-select-control` | `ng-select` with search output. | Required/custom validators. | `readonly` and disabled via base effect. | `loading` input and text. | Empty text translated; loading text is currently literal `Loading options...`. | Wire `searchChange` to data load. |
| Tenant selector | `vl-tenant-selector-control` | `ng-select` single. | Select validators. | Select state inputs. | `loading`. | Translated. | Domain wrapper only; provide tenant options. |
| Organization selector | `vl-organization-selector-control` | `ng-select`, searchable. | Select validators. | Select state inputs. | `loading`. | Translated. | Domain wrapper only; provide organization options. |
| Membership selector | `vl-membership-selector-control` | `ng-select`, searchable. | Select validators. | Select state inputs. | `loading`. | Translated. | Domain wrapper only; provide membership options. |
| Scope selector | `vl-scope-selector-control` | `ng-select`; filters options to `LOCKED_SCOPE_DIMENSIONS`. | Select validators. | Select state inputs. | `loading`. | Translated plus literal form text. | Use only for ScopeEnvelope locked dimensions. |

## Required Control Types From Request

| Requested Type | Existing Source | Status |
| --- | --- | --- |
| Text input | `vl-text-control` | Exists. |
| Number input | `vl-number-control`, `vl-currency-control`, `vl-percent-control`, `vl-dialer-control` | Exists. |
| Select | `vl-single-select-control` and domain selector wrappers | Exists. |
| Multi-select | `vl-multi-select-control` | Exists. |
| Checkbox | `vl-boolean-control` | Exists. |
| Radio | No shared radio control found. | Missing implementation. |
| Date picker | `vl-date-control` | Exists. |
| Time picker | No time-only standard control found; Flatpickr supports time inputs. | Missing standard control. |
| File upload | `vlVeloraDropzone` directive exists; no standard form control found. | Missing standard control. |
| Autocomplete | `vlVeloraAutocomplete` directive and `vl-async-select-control` search select. | Exists as directive/select, not standard autocomplete control. |
| Chips input | `vl-tags-control` with Tagify. | Exists. |
| Nested form groups | Supported by Angular forms and `FormUtil`; no dedicated shared component. | Utility support only. |
| Form arrays | `FormUtil.flattenFormControls` supports `FormArray`; no dedicated shared component. | Utility support only. |

## Validation

Sync validators:

- Angular built-ins are used in auth and standard controls: `required`, `minLength`, `maxLength`, `min`, `max`.
- Standard controls accept `validators` input for custom `ValidatorFn | ValidatorFn[]`.
- Policy validators exist in base descendants:
  - `TextualFormControl`: min/max length.
  - `NumericFormControl`: min/max.
  - `PercentControlComponent`: default min 0 and max 100.
  - `PasswordFormControl`: `PasswordMeter` minimum score.
  - `TagsFormControl`: max tags validator.

Async validators:

- Standard controls accept `asyncValidators` and runtime async validators.
- No domain async validation pattern is implemented in shared controls beyond the input contract.

Cross-field validators:

- `InvalidFeedbackComponent` knows error keys such as `ConfirmPassword`, `matchRange`, `atLeastOne`, and `onlyOne`.
- No shared cross-field validator factory was found in `shared/forms`; add one only with a real domain use case.

Server-side validation display:

- No generic server-error-to-control mapper was found.
- Use `control.setErrors(...)` and `vl-invalid-feedback` for field errors until a shared mapper exists.

Form-level validation:

- `FormUtil.getFormValidationErrors`, `markFormGroupTouched`, `resetForm`, and `selectedFieldsValueChanges` support form-level workflows.

Wizard-step validation:

- `StepperDirective` does not validate steps. Pages must block navigation/submit and mark controls touched.
- Existing login stepper uses `FormGroup` and manual submit validation in `modules/auth/pages/login/login.component.ts`.

## Error Rendering

Source: `shared/forms/invalid-feedback/invalid-feedback.component.ts`

Error priority:

`required`, `requiredTrue`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `nullValidator`, `ConfirmPassword`, `PasswordMeter`, `matchRange`, `nationalCode`, `cardNumber`, `atLeastOne`, `onlyOne`.

Rendering rule:

- Show a single highest-priority error.
- Show only when dirty or touched.
- Translate message and field name.

## Inputmask Caveats

Current form-control usage:

- `vl-text-control`, `vl-number-control`, `vl-currency-control`, and `vl-percent-control` use `vlVeloraInputmask`.
- Numeric controls pass `autoUnmask: true` and `unmaskAsNumber: true` from `NumericFormControl.numericInputmaskOptions`.
- Disabled/readonly are copied into inputmask options.

Review checklist for inputmask controls:

- Verify form value type after masked input changes.
- Verify blur validation and `valueChange` output if using directive directly.
- Verify readonly and disabled propagate to both input element and mask instance.
- Verify min/max are enforced by both Angular validators and mask options.

## Maxlength Directive Rule

Current source rule:

- `TEXTAREA_INPUT_IMPORTS` includes `MaxlengthDirective`.
- `TEXT_INPUT_IMPORTS` does not include `MaxlengthDirective`.
- `vl-text-control` uses native `[attr.maxlength]`.
- `vl-textarea-control` uses `vlVeloraMaxlength`.

Required future rule:

- Use `vlVeloraMaxlength` only on textarea controls unless source architecture changes intentionally.
- Inputs do not need the visual maxlength directive.

## Anti-patterns

- Do not use standard controls outside a parent `[formGroup]`.
- Do not duplicate validation messages in feature templates if `vl-invalid-feedback` can render them.
- Do not create generic wizard forms with generic steps; see `modals-drawers-wizards.md`.
- Do not add a file/radio/time control without documenting its value format and validators.

