# Pipes

Scanned path: `apps/web/src/app/shared/pipes`

Pipe count: 4.

## Pipe Index

| Pipe | Path | Purpose | Input | Output | Locale/i18n Behavior | Example | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dueIn` | `shared/pipes/due-in.pipe.ts` | Relative time and countdown formatting. | `string`, `number`, `Date`, or `undefined`; optional format `relative`, `relativeNear`, `full`, `short`, `compact`, `digital`. | Localized string or empty string. | Uses `TranslateService.currentLang`, `formatNumber`, and translation keys under `common.timeAgo`, `common.timeLater`, `common.countdown`. | `{{ expiresAt | dueIn:'short' }}` | `pure: false`; it schedules updates and should not be used thousands of times in large tables without performance review. |
| `date` | `shared/pipes/extend-date.pipe.ts` | Locale-aware date formatting override. | `Date`, `string`, `number`, `null`, `undefined`; optional `format`, `timezone`, `locale`. | `string` or `null`. | Uses `TranslateService.currentLang` by default and `@utils/format-date`; default locale fallback is `fa`. | `{{ createdAt | date:'mediumDate':'same' }}` | Pipe name shadows Angular `date`; verify expected behavior in imports. Logs and returns `null` on formatting error. |
| `localeNumber` | `shared/pipes/locale-number.pipe.ts` | Persian/English digit conversion. | `string`, `number`, `null`; optional `locale`, `emptyValue`. | String with Persian digits for `fa*`, English digits otherwise. | Defaults to `TranslateService.currentLang`; exports helpers `toPersian` and `toEnglish`. | `{{ count | localeNumber }}` | Does not format decimals/grouping; it only converts digits. |
| `safe` | `shared/pipes/safe.pipe.ts` | Bypass Angular sanitization for trusted content. | `string | undefined`, type `html`, `style`, `script`, `url`, or `resourceUrl`. | Angular `SafeHtml`, `SafeStyle`, `SafeScript`, `SafeUrl`, `SafeResourceUrl`, or empty string. | No i18n behavior. | `<div [innerHTML]="trustedHtml | safe:'html'"></div>` | Security-sensitive. Use only for content already trusted by the application. |

## Formatting Rules

- Prefer `localeNumber` for digit conversion, not numeric formatting.
- Prefer `date` pipe for app date display because it uses Velora's custom `format-date` utility and Persian date handling.
- Use `dueIn` for live countdown/relative labels only where freshness matters.
- Use `safe` only after validating the source and context of the value.

## Anti-patterns

- Do not use `safe` to render arbitrary API/user HTML.
- Do not use `dueIn` as a sorting key; sort by raw dates.
- Do not rely on `localeNumber` to localize currency or percent; use a proper formatter or mask plus validation.

