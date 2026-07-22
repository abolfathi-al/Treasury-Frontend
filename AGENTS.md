# Enterprise Treasury Frontend agent contract

This repository contains the Enterprise Treasury Angular frontend. Keep changes
inside the frontend unless the user explicitly expands the scope.

## Semantic authority

- Treasury domain meaning comes from the sibling repository
  `../Enterprise-Treasury-Canon/canon-v3/`. Start with `canon.yaml` and
  `00-governance/authority.yaml`, then follow their active references.
- The frontend presents and orchestrates user interactions. It MUST NOT invent,
  override, or silently reinterpret Canon-owned truth, lifecycle, authorization,
  integration, or runtime claims.
- If frontend behavior conflicts with active Canon, stop and report the conflict.
  Canon changes belong in a governed Canon Change Pack, not in this repository.
- Existing Velora-branded identifiers and `docs/ui/` are inherited scaffold
  material. They may inform generic presentation patterns only. They are not
  Treasury semantic authority, and new Velora product semantics MUST NOT be
  introduced.

## Architecture

- `src/app/core/` owns singleton infrastructure, configuration, ports, services,
  initializers, logging, and cross-cutting state.
- `src/app/modules/` owns feature areas and their feature-local data access.
- `src/app/shared/` owns reusable UI, form controls, directives, charts, icons,
  and utilities. It MUST remain free of Treasury feature ownership.
- `src/app/shell/` owns application chrome, layout, navigation, and shell state.
- `src/app/pages/` contains application-level routed pages.
- Reuse existing shared mechanisms before adding new ones, especially
  `BaseDirective`, `runSafely()`, `LoggerService`, and `StandardFormControl`.
- Keep dependencies pointed from features toward shared/core contracts. Do not
  move feature decisions into shared components or shell infrastructure.

## UI rules

- Follow the existing Angular 20 and TypeScript patterns; keep the `vl` selector
  prefix configured in `angular.json`.
- Treat UI permissions as display and interaction hints only. Backend
  authorization remains final; hiding or disabling a control is not security.
- Preserve accessibility basics, keyboard behavior, loading/error/empty states,
  RTL/LTR behavior, and existing translation mechanisms.
- Use the relevant guidance in `docs/ui/` instead of duplicating it here.
- Prefer existing dependencies and the smallest working change. Add no package,
  abstraction, or configuration for speculative use.
- Do not hand-edit generated content under `graphify-out/`.

## Commands and verification

- Development: `pnpm start`
- Type checking: `pnpm typecheck`
- Lint: `pnpm lint`
- CI tests: `pnpm test:ci`
- Build: `pnpm build`
- Production build: `pnpm build:prod`

Run the smallest relevant check for a local edit. For non-trivial or cross-cutting
changes, run type checking, lint, CI tests, and a build. A lockfile is currently
absent; do not silently generate one or switch package managers.

After code changes, run `graphify update .`. Documentation changes require a full
semantic Graphify refresh rather than the AST-only update.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
