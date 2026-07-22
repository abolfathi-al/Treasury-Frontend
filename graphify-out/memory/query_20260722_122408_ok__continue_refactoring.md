---
type: "query"
date: "2026-07-22T12:24:08.273593+00:00"
question: "ok, continue refactoring"
contributor: "graphify"
outcome: "useful"
source_nodes: ["APP_BRAND", "project-brand.config.ts", "app.config.ts", "Project Composition Boundary"]
---

# Q: ok, continue refactoring

## Answer

Expanded from original query via graph vocabulary: [brand, composition, config, consumer, logo, navigation, project, route, router, routing, shell, title]. After the route slice, repository imports showed six runtime consumers of product-specific brand constants. The refactor replaced those constants with the reusable AppBrandConfig contract and APP_BRAND injection token, moved Velora values to project/brand/project-brand.config.ts, and wired PROJECT_BRAND in app.config.ts. The neutral core fallback keeps isolated Master tests independent of consumer configuration.

## Outcome

- Signal: useful

## Source Nodes

- APP_BRAND
- project-brand.config.ts
- app.config.ts
- Project Composition Boundary
