---
type: "query"
date: "2026-07-22T21:31:32.745948+00:00"
question: "Refactor MenuDirective delayed work and registry cleanup without changing its Master Admin public facade"
contributor: "graphify"
outcome: "useful"
source_nodes: ["MenuDirective", "BaseDirective", ".initWithDelay()", ".cleanup()", ".handleMouseOut()"]
---

# Q: Refactor MenuDirective delayed work and registry cleanup without changing its Master Admin public facade

## Answer

MenuDirective now owns and cancels delayed initialization, standalone visibility, and hover timers through the injected browser window. Destruction clears pending work, removes per-item hover metadata, and removes host/external-trigger DataUtil registry entries only when they still reference the same directive instance. Selector, exportAs, inputs, outputs, public methods, vendor adapters, and package capabilities remain unchanged. Focused MenuDirective tests: 3/3; full tests: 260/260; typecheck, lint, and production build passed; initial production bundle: 994.99 kB.

## Outcome

- Signal: useful

## Source Nodes

- MenuDirective
- BaseDirective
- .initWithDelay()
- .cleanup()
- .handleMouseOut()