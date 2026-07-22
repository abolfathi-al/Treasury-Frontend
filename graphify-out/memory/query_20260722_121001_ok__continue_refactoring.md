---
type: "query"
date: "2026-07-22T12:10:01.363037+00:00"
question: "ok, continue refactoring"
contributor: "graphify"
outcome: "useful"
source_nodes: ["app.config.ts", "Project Composition Boundary", "brand.config.ts"]
---

# Q: ok, continue refactoring

## Answer

Expanded from original query via graph vocabulary: [brand, composition, config, consumer, logo, navigation, project, route, router, routing, shell, title]. Graphify and repository imports showed root route composition was isolated between app-routing.ts and app.config.ts, while brand config had seven runtime consumers. The lowest-risk Phase 2 slice moved unchanged root route assembly to project/routing/project.routes.ts as PROJECT_ROUTES and wired app.config.ts to it; brand injection remains a separate slice.

## Outcome

- Signal: useful

## Source Nodes

- app.config.ts
- Project Composition Boundary
- brand.config.ts