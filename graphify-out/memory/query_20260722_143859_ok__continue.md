---
type: "query"
date: "2026-07-22T14:38:59.343618+00:00"
question: "ok, continue"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Project Composition Boundary", "app.config.ts", "AUTH_SESSION", "AuthService", "project-auth.provider.ts", "PROJECT_AUTH_PROVIDER"]
---

# Q: ok, continue

## Answer

Expanded from the original query via graph vocabulary: auth, session, provider, adapter, project, core, modules, token, route, permission, storage, service. AUTH_SESSION consumers already depend on the core AuthSessionPort and app.config.ts was the only concrete AuthService binding. Moved only that binding into PROJECT_AUTH_PROVIDER in project-auth.provider.ts; the existing port, service, interceptors, shell consumers, and auth behavior remain unchanged. The focused app composition suite passes 5 of 5 tests.

## Outcome

- Signal: useful

## Source Nodes

- Project Composition Boundary
- app.config.ts
- AUTH_SESSION
- AuthService
- project-auth.provider.ts
- PROJECT_AUTH_PROVIDER