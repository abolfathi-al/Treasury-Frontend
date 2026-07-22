# i18n And Formatting

Primary source references:

- `apps/web/src/app/modules/i18n/translation.service.ts`
- `apps/web/src/app/modules/i18n/locales/en.ts`
- `apps/web/src/app/modules/i18n/locales/fa.ts`
- `apps/web/src/app/core/services/app-initialization.service.ts`
- `apps/web/src/app/app.config.ts`
- `apps/web/src/app/shared/pipes`
- `apps/web/src/app/utils/format-date.ts`

## Translation Structure

Translations are TypeScript modules, not JSON assets.

Locale roots:

- `veloraShellEnLocale`
- `veloraShellFaLocale`

Locale data shape:

```ts
{
  LANG: 'fa' | 'en',
  DIRECTION: 'rtl' | 'ltr',
  ISO_LANG: 'fa-IR' | 'en-US',
  common,
  layout,
  navigation,
  validation,
  status,
  domain: { identity, access, tenant, organization, audit },
  workspace: { ... }
}
```

Runtime loading:

- `AppInitializationService` dynamically imports only selected runtime locale data.
- The non-selected runtime locale is registered as an empty placeholder so switching is possible.
- Supported runtime locale codes are currently `en` and `fa`.

`TranslationService` supported language config includes `fa`, `en`, `ar`, and `he`, but only `en` and `fa` runtime loaders were found. Treat `ar` and `he` as configured language metadata, not implemented locale payloads.

## Key Naming Rules

Existing key groups:

- `common.*`
- `layout.*`
- `navigation.*`
- `validation.*`
- `status.*`
- `domain.identity.*`
- `domain.access.*`
- `domain.tenant.*`
- `domain.organization.*`
- `domain.audit.*`
- `workspace.<workspaceName>.*`

Rules:

- Shared UI copy belongs in `common`, `layout`, `navigation`, `validation`, `status`, or `workspace` shared modules.
- Domain vocabulary belongs in `domain/*`.
- Workspace-specific copy belongs in `workspace/<workspace-name>`.
- Do not hardcode visible labels in shared controls unless the source currently lacks a translation key. Mark those gaps.

Known hardcoded copy:

- `vl-async-select-control` displays literal `Loading options...`.
- `vl-scope-selector-control` displays literal `Locked ScopeEnvelope dimensions only.`

## RTL/LTR

`TranslationService` resolves direction from translation key `DIRECTION` when translations are ready. It falls back to language code lists for RTL languages.

`languageDirectionSetup` sets document direction and loads either RTL or LTR theme CSS.

Utility:

- `createRtlSignals()` returns `isRtl`, `direction`, arrow icon signals, and `textDirection`.

Rules:

- Use direction-aware icons for previous/next arrows.
- Test overlay placement, sticky columns, drawers, and hierarchy visualizations in RTL and LTR.
- Do not assume left/right semantics in domain copy.

## Date Formatting

Pipe:

- `date` from `shared/pipes/extend-date.pipe.ts`

Utility:

- `formatDate(value, format, locale, timezone?)`
- `toDate(value, locale)`
- `isoStringToDate(match, locale)`
- `isDate(value)`

Behavior:

- Default locale is `fa`.
- Persian locale uses `native-date-adapter`.
- Named formats include Angular-style names such as `shortDate`, `mediumDate`, `longDate`, `fullDate`, `short`, `medium`, `long`, and `full`.
- `timezone === 'same'` preserves timezone suffix from input when possible.

Example:

```html
{{ row.createdAt | date:'mediumDate':'same' }}
```

## Number Formatting

Pipe:

- `localeNumber`

Helpers:

- `toPersian(value)`
- `toEnglish(value)`

Behavior:

- Converts digit shapes only.
- Does not add grouping, decimals, currency, or percent formatting.

Example:

```html
{{ count | localeNumber }}
```

## Currency And Percent

Existing form controls:

- `vl-currency-control` uses Inputmask alias `currency` and `currencySymbol`.
- `vl-percent-control` uses Inputmask alias `percentage`, min 0, max 100, suffix `%`.

Rules:

- Currency symbol is not a substitute for currency code.
- Validate whether percent values are stored as 0..100 or 0..1 before API integration.

## Headers And Culture

`header.interceptor.ts` sends `X-Ui-Culture` from `translate.instant('ISO_LANG')` when `translate.currentLang` exists.

Rule:

- Backend locale-sensitive endpoints should use `X-Ui-Culture` consistently.

## Anti-patterns

- Adding JSON translation assets when the app uses TS locale modules.
- Sorting by translated labels when raw sortable values exist.
- Hardcoded visible English/Persian text in shared components.
- Using `safe` pipe for translated HTML without validating the source.

