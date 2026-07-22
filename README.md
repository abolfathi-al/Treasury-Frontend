# Enterprise Dashboard Master Source

This Angular application is the source used to extract and validate the reusable
Enterprise Dashboard Master. Product-specific composition belongs in
`src/app/project/` and feature behavior belongs in `src/app/modules/`; reusable
infrastructure remains in `core`, `shared`, and `shell`.

Enterprise Treasury is the first planned consumer. Treasury domain behavior is
not implemented until the sibling Canon records implementation authorization.

## Prerequisites

- Node.js 22
- pnpm 10.33.0

## Quick start

```bash
pnpm install
pnpm start
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test:ci
pnpm build
```

See [`docs/FRONTEND_REFACTOR_PLAN.md`](docs/FRONTEND_REFACTOR_PLAN.md) for the
Master/consumer extraction plan.
