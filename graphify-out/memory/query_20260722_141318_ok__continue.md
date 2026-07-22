---
type: "query"
date: "2026-07-22T14:13:18.323507+00:00"
question: "ok. continue"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Project Composition Boundary", "APP_RUNTIME_CONFIG", "project-runtime.config.ts", "LayoutService", "AuthService"]
---

# Q: ok. continue

## Answer

Expanded from the original query via graph vocabulary: runtime, config, project, auth, storage, layout, api, version, environment, consumer, token, provider. Moved appVersion, authStorageKey, and apiUrl behind APP_RUNTIME_CONFIG with a neutral Master fallback and project-runtime.config.ts as the consumer value. LayoutService and AuthService now inject the token; environment files retain only build, interceptor, and demo settings. Alternate profile tests verify the layout namespace, auth session key, and auth API URL.

## Outcome

- Signal: useful

## Source Nodes

- Project Composition Boundary
- APP_RUNTIME_CONFIG
- project-runtime.config.ts
- LayoutService
- AuthService