---
type: "query"
date: "2026-07-22T21:55:07.336393+00:00"
question: "Make all existing DrawerDirective Master Admin inputs reactive after initialization without changing the public facade"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DrawerDirective", ".setupInputBindings()", ".updateOption()", ".applyOptionChange()", ".setupEscapeHandler()", ".setupToggleHandlers()", ".setupCloseHandlers()"]
---

# Q: Make all existing DrawerDirective Master Admin inputs reactive after initialization without changing the public facade

## Answer

DrawerDirective now synchronizes drawerShown, width, activate, overlay, overlayClass, baseClass, direction, name, escape, toggle selector, and close selector changes with live state, DOM, body attributes, responsive width, and delegated listeners. Selector rebinding removes the prior handler before attaching the new one, Escape reads current options from one lifecycle-managed listener, and public operations no-op after destruction. All existing selectors, exportAs, inputs, outputs, methods, store APIs, and packages are preserved. Focused tests: 9/9; full tests: 271/271; typecheck, lint, and production build passed; initial production bundle: 997.28 kB.

## Outcome

- Signal: useful

## Source Nodes

- DrawerDirective
- .setupInputBindings()
- .updateOption()
- .applyOptionChange()
- .setupEscapeHandler()
- .setupToggleHandlers()
- .setupCloseHandlers()