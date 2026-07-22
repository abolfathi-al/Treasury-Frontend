---
type: "architecture"
date: "2026-07-22T23:07:56.393215+00:00"
question: "How should TagifyDirective coordinate async bootstrap, reinitialization, and destruction?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TagifyDirective", ".scheduleBootstrap()", ".loadTagify()", ".bootstrap()", ".destroyTagify()", "tagify.directive.spec.ts"]
---

# Q: How should TagifyDirective coordinate async bootstrap, reinitialization, and destruction?

## Answer

Graphify vocabulary: tagify, load, library, initialize, reinitialize, destroy, instance, error, options, promise, cleanup, loading. TagifyDirective.scheduleBootstrap owns requestAnimationFrame or timer cancellation; loadTagify caches only in-flight work and clears the promise after settlement; bootstrap and initTagify skip destroyed directives and existing instances; destroyTagify clears pending work and base state before vendor destruction. tagify.directive.spec.ts locks concurrent bootstrap and scheduled-destroy behavior.

## Outcome

- Signal: useful

## Source Nodes

- TagifyDirective
- .scheduleBootstrap()
- .loadTagify()
- .bootstrap()
- .destroyTagify()
- tagify.directive.spec.ts