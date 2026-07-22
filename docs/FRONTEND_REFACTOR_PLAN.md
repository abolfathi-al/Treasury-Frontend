# Enterprise Treasury Frontend Refactor Plan

Status: `PROPOSED`

## Outcome

Turn the inherited Angular 20 scaffold into a reproducible, maintainable,
Treasury-ready frontend foundation without inventing Treasury domain behavior or
runtime claims.

This plan separates two concerns:

1. Generic frontend refactoring that can proceed without domain implementation.
2. Treasury feature delivery, which remains blocked until Canon explicitly
   authorizes implementation.

## Governing constraint

The sibling Canon is the semantic authority:

- `../../Enterprise-Treasury-Canon/canon-v3/canon.yaml`
- `../../Enterprise-Treasury-Canon/canon-v3/00-governance/authority.yaml`

The current authority state records:

- `implementation_status: NOT_STARTED`
- `implementation_authorization: NONE`
- `runtime_activation: NOT_AUTHORIZED`
- `runtime_proof_status: UNPROVEN`

Phases 0-5 below are limited to behavior-preserving scaffold refactoring and
generic UI quality. Phase 6 is blocked until a governed Delivery decision changes
that authority state.

## Baseline

| Area | Current evidence |
| --- | --- |
| Framework | Angular 20.3.3, TypeScript 5.9, strict TypeScript and strict templates |
| Source | 452 TypeScript files, 50 HTML templates, 73 spec files under `src/app` |
| Feature modules | `auth`, `errors`, and `i18n`; the rest is shell/shared foundation |
| Graph | 4,133 nodes, 9,270 edges, 217 communities; no import cycles detected |
| Cross-cutting hubs | `LoggerService` (132 edges), `BaseDirective` (89), `runSafely()` (135) |
| Legacy surface | 243 files contain `Velora` references outside generated output |
| Repository bootstrap | No dependency lockfile and no local `node_modules` |
| Known UI gaps | No reusable table/grid, paginator, shared empty state, or stable server-validation mapper |

Graph edge diagnostics also reported dangling and collapsed edges. Treat these as
Graphify extraction limitations until source inspection proves a code defect.

## Refactor rules

- Preserve observable behavior before simplifying it.
- Change one axis at a time: bootstrap, boundaries, shared infrastructure,
  naming, then dependency removal.
- Reuse existing helpers before adding abstractions.
- Add characterization tests around shared hubs before changing them.
- Do not treat UI permission checks as backend authorization.
- Do not perform a repository-wide search-and-replace for selectors, storage
  keys, translation keys, or public APIs.
- Do not add a state library, design system, microfrontend framework, or generic
  table framework without a demonstrated requirement.

## Phase 0 - Freeze a trustworthy baseline

Goal: make later changes attributable and reversible.

- Record the current results of `typecheck`, `lint`, `test:ci`, and `build` once
  dependencies can be installed reproducibly.
- Classify each existing route as scaffold, generic infrastructure, or authorized
  product behavior. Today, auth, errors, shell, and dashboard are scaffold only.
- Capture current bundle size and the browser-visible auth, error, shell, and
  dashboard flows.
- Preserve the current Graphify report as navigation evidence, not authority.
- Create a short failure ledger for baseline failures instead of weakening checks.

Exit criteria:

- Every baseline command is green or has one documented pre-existing failure.
- The current route and ownership map is recorded.
- No product behavior has changed.

## Phase 1 - Make the frontend repository reproducible

Goal: remove assumptions inherited from the former monorepo layout.

- Select the package manager explicitly. The existing scripts imply `pnpm`; add
  its version and one committed lockfile after that decision.
- Rename package metadata from the generic `web` identity to the approved
  Enterprise Treasury frontend identity.
- Update docs that still refer to `apps/web/` so paths resolve from this repo.
- Review build, SSR, production, i18n, accessibility, and analysis scripts for
  missing monorepo-relative inputs.
- Keep generated directories (`dist`, `.angular`, `coverage`, `node_modules`) out
  of source control.
- Replace absolute workstation paths in documentation with repository-relative
  references or clearly marked historical evidence.

Exit criteria:

- A clean checkout can install and run the baseline commands.
- Exactly one package manager and lockfile are authoritative.
- No command depends on the former Velora monorepo root.

## Phase 2 - Enforce existing architecture boundaries

Goal: strengthen the current shape without moving everything.

- Keep app composition and global providers in `src/app/app.config.ts` and route
  composition in the app/shell routing files.
- Keep `core` limited to singleton infrastructure, ports, configuration,
  initializers, logging, and cross-cutting state.
- Keep `shared` domain-neutral; move feature-specific decisions back to their
  feature boundary.
- Keep shell components bound to `ShellFacade` state instead of reading layout
  services independently in nested components.
- Isolate `_fake`, demo actions, sample navigation, and placeholder dashboard
  content behind an explicit scaffold boundary; delete them when no active test or
  migration needs them.
- Use existing ESLint capabilities for boundary checks before adding tooling.

Exit criteria:

- Shared and shell code do not own Treasury feature policy.
- Feature code does not leak into generic utilities or directives.
- Route ownership is obvious from the folder and route configuration.
- The graph still reports no import cycles.

## Phase 3 - Harden cross-cutting hubs

Goal: reduce refactor risk where many callers converge.

- Add focused characterization tests for `BaseDirective`, `runSafely()`,
  `LoggerService`, `PermissionService`, `ShellFacade`, and directive-host cleanup.
- Route repeated browser guards, teardown, option updates, and safe error handling
  through the helpers that already exist.
- Keep `LoggerService` as one service unless a concrete responsibility split
  reduces callers; high graph degree alone is not a reason to create interfaces.
- Keep UI capability and role checks presentation-only. Do not model authorization
  policy in directives or shared components.
- Verify listener cleanup, SSR/browser guards, input changes, and error paths for
  DOM-heavy directives before simplifying them.

Exit criteria:

- Each changed hub has a runnable regression test.
- Duplicate lifecycle/error-handling code decreases without a new abstraction
  layer.
- Auth and permission behavior makes no security claim beyond UI state.

## Phase 4 - Neutralize inherited product branding safely

Goal: remove foreign product identity without a big-bang compatibility break.

- Inventory the 243 affected files into visible copy, TypeScript identifiers,
  selectors, storage keys, translation keys, configuration, assets, scripts, and
  historical documentation.
- Remove visible Velora product copy first.
- Rename private identifiers next, in small behavior-preserving slices.
- Migrate persisted keys with read-old/write-new compatibility and a bounded
  cleanup path; never strand existing browser state.
- Migrate public selectors and translation keys only with explicit aliases or a
  coordinated breaking change.
- Keep the configured `vl` selector prefix during this refactor unless a separate
  governed naming decision replaces it.
- Remove external sample references after their generic lessons are captured in
  repository-local docs.

Exit criteria:

- `rg -i velora` returns only entries on a reviewed compatibility or historical
  allowlist.
- No Treasury semantics were inferred from legacy names or samples.
- Existing routes and saved browser state still work through the migration.

## Phase 5 - Prune and complete the generic UI foundation

Goal: leave a smaller foundation that is ready for authorized feature work.

- Audit third-party packages against imports and runtime usage; remove one unused
  dependency at a time with build and browser verification.
- Replace untranslated literals already identified in shared controls.
- Verify accessibility, keyboard behavior, focus management, RTL/LTR, loading,
  error, and empty states on the existing routes.
- Add a shared primitive only when at least two current consumers need the same
  contract.
- Do not build a generic table, paginator, wizard framework, server validation
  mapper, radio control, time-only control, or upload control speculatively.
- Update the relevant files under `docs/ui/` whenever a shared API changes.

Exit criteria:

- Every dependency has a verified current consumer.
- Existing pages pass accessibility and responsive smoke checks.
- Shared APIs have real reuse and documented behavior.
- Demo-only UI is removed or visibly isolated.

## Phase 6 - Treasury domain delivery

Status: `BLOCKED_BY_CANON_IMPLEMENTATION_AUTHORIZATION`

Start this phase only after repository-local evidence records implementation
authorization and an applicable Delivery scope.

When unblocked:

- Map each feature to its active Canon owner, journey, projection, AuthZ rows,
  error catalog, and approved API/event contracts.
- Implement feature slices inside `src/app/modules/`; do not encode domain truth
  in `shared` or `shell`.
- Keep projections read-only and journeys orchestration-only.
- Treat capability hints as UI behavior backed by server authorization.
- Add loading, error, empty, partial, validation, audit-sensitive, and disabled
  reason states for every delivered flow.
- Record conformance evidence without claiming runtime proof that was not run.

Exit criteria:

- Every delivered screen traces to active Canon and authorized Delivery scope.
- Server contracts and authorization are tested at their actual trust boundary.
- Runtime claims are backed by runtime evidence.

## Change-set order

Use small, independently verifiable changes in this order:

1. Documentation and repository bootstrap.
2. Baseline checks and characterization tests.
3. Folder-boundary corrections.
4. Cross-cutting directive/logging/shell hardening.
5. Legacy naming and persisted-state migration.
6. Dependency and demo-code deletion.
7. Authorized Treasury feature slices.

Do not mix a public selector rename, storage migration, architecture move, and
behavior change in the same change set.

## Verification matrix

| Change | Minimum verification |
| --- | --- |
| Docs/config only | Links/path check and affected JSON/config validation |
| TypeScript implementation | `pnpm typecheck` and focused specs |
| Template/style | `pnpm lint`, focused specs, responsive and accessibility smoke check |
| Shared hub/directive | `pnpm typecheck`, `pnpm lint`, `pnpm test:ci`, `pnpm build` |
| Dependency removal | Full checks plus production build and affected browser flow |
| Naming/storage migration | Full checks plus old-state upgrade and clean-state browser tests |
| Canon-linked feature | Canon verification plus all frontend checks and contract evidence |

After code changes, run `graphify update .`. After documentation changes, perform
a semantic Graphify refresh. Compare the new graph for import cycles, unexplained
hub growth, and disconnected feature nodes; graph metrics are diagnostics, not
acceptance criteria by themselves.

## Definition of done

The refactor is complete when:

- a clean checkout installs and passes type checking, lint, CI tests, and build;
- the architecture boundaries in `AGENTS.md` are enforced by code organization;
- legacy product references are removed except for a reviewed allowlist;
- shared hubs have regression coverage and no duplicated lifecycle machinery;
- dependencies and demo code have verified consumers or are deleted;
- accessibility, i18n, RTL/LTR, SSR/browser guards, and UI states are preserved;
- no Treasury domain behavior was implemented before authorization; and
- docs and Graphify output describe the resulting code accurately.

## Explicit non-goals

- No backend, database, infrastructure, deployment, or runtime activation work.
- No speculative Treasury workflow or provider integration.
- No blanket rewrite to another frontend framework or state library.
- No replacement design system unless separately requested and justified.
- No Canon edits from this repository.
