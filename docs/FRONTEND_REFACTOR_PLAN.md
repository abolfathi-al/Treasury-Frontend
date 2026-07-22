# Reusable Dashboard Master Refactor Plan

Status: `IN_PROGRESS`

## Outcome

Refactor the inherited Angular dashboard into a versioned, product-neutral
Dashboard Master that can seed future frontend projects.

The current Enterprise Treasury frontend is the source used to extract and
validate that Master. At cutover, the responsibilities separate:

1. `Enterprise-Dashboard-Master` owns reusable dashboard infrastructure.
2. `Enterprise-Treasury-Frontend` becomes a consumer of a tagged Master release.
3. Each later product starts from a tagged Master release and owns only its
   product composition and feature modules.

The Master is a repository template first, not an npm component platform. This
is the smallest delivery model that preserves the complete dashboard, build,
shell, styles, and assets. Extract packages only after multiple consumers need
independent upgrades of the same code.

## Governing constraint

The sibling Canon is semantic authority for Enterprise Treasury only:

- `../../Enterprise-Treasury-Canon/canon-v3/canon.yaml`
- `../../Enterprise-Treasury-Canon/canon-v3/00-governance/authority.yaml`

The current authority state records:

- `implementation_status: NOT_STARTED`
- `implementation_authorization: NONE`
- `runtime_activation: NOT_AUTHORIZED`
- `runtime_proof_status: UNPROVEN`

Generic Master extraction may proceed because it preserves scaffold behavior and
does not implement Treasury semantics. Treasury routes, workflows, policies, and
contracts remain blocked until a governed Delivery decision authorizes them.
Treasury decisions MUST NOT enter the Master.

## Implementation progress

As of 2026-07-22:

- Commit `72be53e` established the initial reusable Master boundary, made Node
  and pnpm explicit, and moved navigation composition into `project/`.
- The next slice added the authoritative pnpm lockfile, aligned browser and SSR
  output under `dist/web`, and restored the missing SSR runtime dependency.
- Frozen install, typecheck, lint, all 221 tests, i18n validation, production and
  SSR builds, and an HTTP 200 SSR smoke check pass.
- Phase 2 remains in progress. Route, navigation, brand, locale, theme, layout,
  public runtime configuration, and auth adapter wiring are consumer-owned.
  Demo context, the sample dashboard route, and placeholder content are isolated
  under `demo/`; fake HTTP data still requires a separate slice.

## Baseline

| Area | Current evidence |
| --- | --- |
| Framework | Angular 20.3.3, TypeScript 5.9, strict TypeScript and strict templates |
| Source | 452 TypeScript files, 50 HTML templates, 73 spec files under `src/app` |
| Current shape | `core`, `shared`, `shell`, plus `auth`, `errors`, and `i18n` modules |
| Reusable seams | `brand.config.ts`, shell navigation config, layout/theme services, `ShellFacade`, tokens, and adapters |
| Cross-cutting hubs | `LoggerService` (132 edges), `BaseDirective` (89), `runSafely()` (135) |
| Legacy surface | 243 files contain `Velora` references outside generated output |
| Repository bootstrap | pnpm 10.33.0, Node 22, committed lockfile, frozen install verified |
| Graph | No import cycles detected; Graphify edge diagnostics contain known dangling/collapsed edges |

Graph degree identifies refactor risk, not a reason to introduce interfaces or
split services by itself.

## Target ownership model

Keep the current folder shape where it already matches the target. Add only one
clear project-composition boundary; do not reorganize the repository for visual
symmetry.

| Layer | Owns | Must not own |
| --- | --- | --- |
| Master `core` | Runtime infrastructure, browser/SSR guards, logging, layout/theme state, generic tokens and utilities | Product workflows, product roles, domain contracts |
| Master `shared` | Product-neutral UI controls, directives, icons, accessibility behavior | Navigation policy, feature orchestration, domain validation |
| Master `shell` | Header, sidebar, toolbar, page frame, responsive layout, generic user/menu slots | Product menu items, product copy, feature permissions |
| Project composition | Brand, theme defaults, navigation, route assembly, locale selection, endpoints, auth wiring | Reusable UI implementation |
| Project `modules` | Product screens, feature state, route guards, API integration | Master infrastructure decisions |
| Demo/examples | Replaceable sample content used for visual and smoke validation | Production runtime dependencies |

The intended project-facing layout is:

```text
src/app/
  core/       # Master-owned infrastructure
  shared/     # Master-owned reusable UI
  shell/      # Master-owned dashboard frame
  project/    # Consumer-owned composition and configuration
  modules/    # Consumer-owned product features
  demo/       # Optional and removable examples
```

`project/` is the only new architectural boundary required by this plan. Existing
files move into it only when they are proven product-specific.

## Master contract

A future project should customize the dashboard through a small documented set
of seams instead of editing Master internals:

1. Product identity: application name, logo assets, favicon, and visible brand
   strings.
2. Theme: color tokens, typography, light/dark defaults, RTL/LTR, and layout
   defaults.
3. Navigation: menu tree, labels, icons, route targets, and UI capability hints.
4. Runtime configuration: API base URLs and environment-specific public values.
5. Authentication wiring: session source, login/logout routes, and UI permission
   lookup. Server authorization remains the trust boundary.
6. Localization: supported locales, default locale, and consumer translation
   dictionaries.
7. Feature composition: consumer routes and modules mounted into shell slots.

Reuse existing config objects, tokens, adapters, and `ShellFacade` before adding
new abstractions. Add an adapter interface only when a second real implementation
cannot use the existing seam.

## Refactor rules

- Preserve observable behavior before extracting reusable ownership.
- Keep product-neutral defaults in the Master and product choices in the
  consumer.
- Change one axis at a time: reproducibility, boundaries, configuration,
  branding, then deletion.
- Do not create a universal design system, state framework, microfrontend layer,
  plugin runtime, or schema-driven page builder.
- Do not perform blanket renames of selectors, storage keys, translation keys,
  or public APIs.
- Do not keep fake data in Master production paths.
- Every Master extension point needs one current consumer and one runnable check.
- A generated consumer may change `project/` and `modules/`; edits to `core`,
  `shared`, or `shell` indicate a missing Master seam or a deliberate fork.

## Phase 0 - Define the reusable baseline

Goal: identify what is genuinely common before changing ownership.

- Record `typecheck`, `lint`, `test:ci`, `build`, bundle size, and the visible
  auth/error/shell/dashboard flows once dependencies install reproducibly.
- Inventory routes and classify each as Master shell, demo, or product feature.
- Inventory configuration sources for brand, theme, navigation, locale, auth,
  endpoints, layout, selectors, storage, and assets.
- Mark the current generic dashboard route as a visual reference, not a Treasury
  feature.
- Preserve Graphify output as navigation evidence and record baseline failures
  without weakening checks.

Exit criteria:

- Every route and configuration source has an owner.
- Golden shell flows and screenshots are reproducible.
- Baseline failures are green or recorded as pre-existing.

## Phase 1 - Make the source repository reproducible

Goal: remove inherited monorepo and workstation assumptions.

- Select one package manager. Existing scripts imply `pnpm`; record its version
  and commit one lockfile.
- Make install, typecheck, lint, tests, build, SSR, i18n, accessibility, and
  analysis scripts run from the repository root.
- Replace active absolute workstation paths with repository-relative paths.
- Keep `dist`, `.angular`, `coverage`, and `node_modules` generated.
- Give the source repository a neutral temporary package identity; reserve final
  Master and consumer names for cutover.

Exit criteria:

- A clean checkout installs and passes the recorded baseline.
- No command depends on the former Velora monorepo.
- Exactly one lockfile and package manager are authoritative.

## Phase 2 - Establish the Master/consumer boundary

Goal: make project-specific edits predictable and small.

- Keep reusable implementation in the existing `core`, `shared`, and `shell`
  folders.
- Introduce `project/` for brand, navigation, route composition, runtime public
  configuration, locale selection, and auth wiring.
- Move product/demo decisions out of reusable services and components one slice
  at a time.
- Isolate sample routes, fake context, sample users, and placeholder dashboard
  cards under `demo/` or delete them when no test needs them.
- Keep feature modules lazy where the current router already supports it.
- Use existing ESLint capabilities to prevent `core`, `shared`, and `shell` from
  importing `project`, `modules`, or `demo`.

Allowed dependency direction:

```text
project/modules/demo -> shell/shared/core
shell                -> shared/core
shared               -> core
core                 -> Angular/platform only
```

Exit criteria:

- The Master layers have no product or demo imports.
- Consumer-owned configuration can be found under one boundary.
- Graphify still reports no import cycles.

## Phase 3 - Convert variation into configuration

Goal: allow a new project to adopt its identity without forking shell code.

- Route existing brand config, shell navigation config, layout defaults, theme
  state, and localization through the project-composition boundary.
- Replace visible product literals in Master templates with existing translation
  or configuration seams.
- Make shell menus consume project navigation data; keep capability checks as UI
  hints only.
- Keep environment-specific public values outside committed Master defaults.
- Define neutral fallbacks so the Master can run without Treasury data.
- Add focused tests proving two configuration profiles can render different
  brand, theme, locale, and navigation values without changes to Master files.

Exit criteria:

- A new product identity requires configuration/assets, not shell edits.
- No secret or backend authorization rule is accepted through frontend config.
- Default and alternate configuration profiles pass the shell smoke test.

## Phase 4 - Stabilize the reusable infrastructure

Goal: protect code that every generated project will inherit.

- Add characterization tests around `BaseDirective`, `runSafely()`,
  `LoggerService`, `PermissionService`, `ShellFacade`, layout/theme initialization,
  and directive-host cleanup before refactoring them.
- Reuse shared lifecycle, DOM cleanup, option-update, and safe-error helpers where
  duplicated behavior already exists.
- Verify SSR/browser guards, listener cleanup, responsive behavior, focus,
  keyboard navigation, and RTL/LTR.
- Keep `LoggerService` and other hubs intact unless a concrete responsibility
  split reduces code or enables a required second implementation.
- Treat authentication and permissions as consumer wiring; never claim that UI
  hiding provides authorization.

Exit criteria:

- Each changed hub has a focused regression test.
- The reusable shell passes desktop/mobile, light/dark, RTL/LTR, auth/error, and
  accessibility smoke checks.
- Duplicate infrastructure code decreases without adding a framework.

## Phase 5 - Neutralize and prune the Master

Goal: produce a product-neutral baseline with no accidental legacy contract.

- Classify Velora references into visible copy, private identifiers, selectors,
  storage keys, translation keys, configuration, assets, dependencies, and
  historical documentation.
- Remove visible Velora identity first, then rename private identifiers in small
  verified slices.
- Migrate persisted keys with read-old/write-new compatibility and a bounded
  removal point.
- Change public selectors and translation keys only through aliases or a declared
  breaking release.
- Retain the `vl` selector prefix until a separate Master naming decision; a
  prefix rename is not required for reusability.
- Remove unused packages and demo-only assets one at a time after build and
  browser verification.
- Add shared controls only after two current consumers need the same contract.

Exit criteria:

- Legacy references remain only on a reviewed compatibility/history allowlist.
- Every dependency and production asset has a verified consumer.
- The Master contains no Treasury or other product semantics.

## Phase 6 - Create the versioned Dashboard Master

Goal: make the reusable result safe to start from repeatedly.

- Create `Enterprise-Dashboard-Master` from the neutralized repository while
  preserving relevant history.
- Mark it as a template/source repository and publish SemVer tags.
- Include a short quick start: clone/use template, install, set project config,
  replace assets, add routes/modules, and run checks.
- Maintain `CHANGELOG.md` and one migration note per breaking Master release.
- Record the originating Master version in each generated consumer.
- Add a clean-room smoke check that creates a temporary consumer, applies a test
  configuration, and runs typecheck plus production build.
- Keep upgrades opt-in: consumers take a new tag using its migration note. Do not
  build automated cross-repository synchronization yet.

Exit criteria:

- A new dashboard project reaches a branded, navigable shell without editing
  Master-owned folders.
- A tagged release can generate and build a clean consumer.
- Breaking changes are versioned and have an upgrade path.

## Phase 7 - Recreate Enterprise Treasury as the first consumer

Goal: prove the boundary without implementing unauthorized Treasury behavior.

- Start `Enterprise-Treasury-Frontend` from the first stable Master tag.
- Add only Treasury project identity and generic composition that is authorized
  by repository-local evidence.
- Keep Treasury feature modules absent or scaffold-only while implementation
  authorization is `NONE`.
- When authorization exists, map each feature to its active Canon owner, journey,
  projection, AuthZ rows, error catalog, and approved API/event contracts.
- Put Treasury features in `modules/`; never move Treasury truth into Master
  `core`, `shared`, or `shell`.

Exit criteria:

- The Treasury consumer records its Master version.
- The Master has no Treasury imports, terms, rules, or evidence.
- Any delivered Treasury screen is authorized and traceable to active Canon.

## Future project adoption flow

For each new dashboard project:

1. Start from a chosen `Enterprise-Dashboard-Master` release tag.
2. Record that tag in the consumer.
3. Replace project configuration, public runtime values, brand assets, and
   translations.
4. Define navigation and application routes.
5. Add product behavior only under `modules/`.
6. Run the full Master verification matrix.
7. Upgrade later only through a newer tag and its migration note.

If three or more consumers repeatedly cherry-pick the same Master fixes, evaluate
extracting only those independently versioned pieces into Angular libraries. Do
not package the whole application preemptively.

## Change-set order

Use independently verifiable changes in this order:

1. Reproducible repository and baseline.
2. Route/configuration ownership inventory.
3. `project/` and `demo/` boundary.
4. Brand, theme, navigation, locale, and runtime configuration seams.
5. Shared hub characterization tests and hardening.
6. Legacy neutralization and dependency deletion.
7. Master clean-room generation check and first release tag.
8. Treasury consumer recreation and, only when authorized, feature delivery.

Do not combine a public selector rename, storage migration, folder move, and
behavior change in one change set.

## Verification matrix

| Change | Minimum verification |
| --- | --- |
| Docs/config only | Link/path check and affected JSON/config validation |
| Master boundary | Import-boundary check, `pnpm typecheck`, focused specs, Graphify cycle check |
| Brand/theme/navigation | Default and alternate profile browser smoke tests |
| Shared hub/directive | `pnpm typecheck`, `pnpm lint`, `pnpm test:ci`, `pnpm build` |
| Template/style | Focused specs, responsive, accessibility, RTL/LTR, light/dark checks |
| Dependency removal | Full checks, production build, and affected browser flow |
| Naming/storage migration | Full checks plus old-state upgrade and clean-state tests |
| Master release | Clean-room consumer install, typecheck, test, and production build |
| Canon-linked feature | Canon verification plus all frontend and contract checks |

After code changes, run `graphify update .`. After documentation changes, perform
a semantic Graphify refresh. Treat graph metrics as diagnostics, not acceptance
criteria.

## Definition of done

The refactor is complete when:

- `Enterprise-Dashboard-Master` has a stable tagged release;
- a clean consumer can install, brand, configure, typecheck, test, and build;
- future projects normally edit only `project/`, `modules/`, public config, and
  assets;
- Master `core`, `shared`, and `shell` are product-neutral and enforce inward-only
  dependency boundaries;
- inherited hubs have regression coverage;
- legacy identity remains only on a reviewed compatibility/history allowlist;
- accessibility, responsive layout, i18n, RTL/LTR, SSR/browser guards, loading,
  error, and empty states are preserved; and
- Enterprise Treasury remains a consumer whose domain implementation is gated by
  Canon authority.

## Explicit non-goals

- No backend, database, infrastructure, deployment, or runtime activation work.
- No speculative Treasury workflow, provider integration, or authorization rule.
- No microfrontend platform, plugin system, page builder, or mandatory state
  library.
- No npm-package split until consumer upgrade evidence justifies it.
- No automatic synchronization across generated repositories in the first
  release.
- No Canon edits from the frontend or Master repositories.
