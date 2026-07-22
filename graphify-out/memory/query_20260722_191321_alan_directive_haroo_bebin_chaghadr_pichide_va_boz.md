---
type: "query"
date: "2026-07-22T19:13:21.668793+00:00"
question: "alan directive haroo bebin chaghadr pichide va bozorge, va hamchenin intitializer va token va..."
contributor: "graphify"
outcome: "useful"
source_nodes: ["TreeDirective", "MenuDirective", "BaseDirective", "tokens/index.ts", "initializers/index.ts", "LoggerService", "CoreUtil"]
---

# Q: alan directive haroo bebin chaghadr pichide va bozorge, va hamchenin intitializer va token va...

## Answer

Expanded from original query via graph vocab: directives, initializers, tokens, options, handlers, listeners, cleanup, providers, base, services, config. Audit found 31 production directives totaling 19,831 lines with 529 inputs and 242 outputs; at least 624 signal API members have no external production reference. Thirteen directives totaling 9,388 lines have no production selector or class consumer. TreeDirective is unused at 2,823 lines, 114 methods, and 291 branch points; MenuDirective is used but has 1,559 lines, 108 methods, and 241 branch points. Initializers total 385 lines; legacy storage cleanup and the self-created IndexedDB cache initializer are removal candidates. Tokens total 343 lines; 13 unused token files total 223 lines. BaseDirective plus helpers form a 555-line mini-framework, while CoreUtil, FormUtil, and LoggerService contain major unused or write-only surface. Ranked recommendation: delete dead directives and packages first, then shrink retained directive APIs, then prune tokens and initializers, then simplify utilities and logger.

## Outcome

- Signal: useful

## Source Nodes

- TreeDirective
- MenuDirective
- BaseDirective
- tokens/index.ts
- initializers/index.ts
- LoggerService
- CoreUtil