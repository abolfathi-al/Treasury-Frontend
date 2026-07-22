---
type: "query"
date: "2026-07-22T11:00:22.657277+00:00"
question: "Start the reusable frontend Master refactor and use subagents if needed"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ShellNavigationFacade", "project-navigation.config.ts", "app.config.ts"]
---

# Q: Start the reusable frontend Master refactor and use subagents if needed

## Answer

Expanded vocabulary: bootstrap, package manager, build config, project, consumer, master, core, shared, shell, route. First slice made Node and pnpm explicit, moved product navigation configuration into the project consumer layer, changed ShellNavigationFacade to consume PAGE_NAVIGATION_ITEMS through dependency injection, added facade tests, fixed standalone repository script paths, and refreshed the scoped graph. Dependency installation and full checks remain blocked by registry package availability; no lockfile was fabricated.

## Outcome

- Signal: useful

## Source Nodes

- ShellNavigationFacade
- project-navigation.config.ts
- app.config.ts