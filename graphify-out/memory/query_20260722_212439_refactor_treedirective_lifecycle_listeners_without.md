---
type: "query"
date: "2026-07-22T21:24:39.168153+00:00"
question: "Refactor TreeDirective lifecycle listeners without changing its Master Admin public facade"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TreeDirective", "BaseDirective", ".setupEventListeners()", ".recreateTree()", ".destroyTree()"]
---

# Q: Refactor TreeDirective lifecycle listeners without changing its Master Admin public facade

## Answer

Expanded via vocabulary: TreeDirective, BaseDirective DOM listener manager, recreateTree, destroyTree, context-menu timer. TreeDirective now registers host, document, mouse, and touch listeners through the shared lifecycle manager, so recreate clears the old set before installing one new set and destroy removes all listeners. Delayed context-menu registration is window-token based and canceled on destroy. Selector, exportAs, inputs, outputs, and public methods are unchanged. Focused 3/3 and full 258/258 tests, typecheck, lint, and the unchanged 993.76 kB production build pass.

## Outcome

- Signal: useful

## Source Nodes

- TreeDirective
- BaseDirective
- .setupEventListeners()
- .recreateTree()
- .destroyTree()