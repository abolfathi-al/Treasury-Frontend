---
type: "query"
date: "2026-07-22T21:18:06.135054+00:00"
question: "Lock all 31 selectors, exports, and aliases in a compatibility catalog/test"
contributor: "graphify"
outcome: "useful"
source_nodes: ["All-31 Barrel Selector and ExportAs Guarantee", "directive-catalog.spec.ts", "index.ts", "IfIsBrowserDirective", "Master Compatibility Metadata"]
---

# Q: Lock all 31 selectors, exports, and aliases in a compatibility catalog/test

## Answer

Expanded via vocabulary: Master compatibility metadata, barrel export, selector, exportAs, standalone, IfIsBrowserDirective. The audit found 31 source directives but only 30 barrel exports. Restored IfIsBrowserDirective in index.ts, added a runtime contract spec with one inventory gate and 31 metadata gates, reconciled docs/ui/directives.md, and verified focused 32/32 plus full 256/256 tests, typecheck, lint, and an unchanged 993.76 kB production initial bundle.

## Outcome

- Signal: useful

## Source Nodes

- All-31 Barrel Selector and ExportAs Guarantee
- directive-catalog.spec.ts
- index.ts
- IfIsBrowserDirective
- Master Compatibility Metadata