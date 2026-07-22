---
type: "query"
date: "2026-07-22T21:41:56.773773+00:00"
question: "Prevent stale MenuDirective asynchronous completions without changing its Master Admin facade"
contributor: "graphify"
outcome: "useful"
source_nodes: ["MenuDirective", ".showAccordion()", ".hideAccordion()", ".withPopper()", ".initDropdownPopper()", ".initStandaloneMenuPopper()"]
---

# Q: Prevent stale MenuDirective asynchronous completions without changing its Master Admin facade

## Answer

MenuDirective now ignores accordion animation completions after destruction. Lazy Popper callbacks create dropdown or standalone instances only while the corresponding menu is still shown, and replace any prior instance before storing the current one. This prevents late Popper creation and stale DOM/output mutations while preserving all selectors, inputs, outputs, methods, vendor adapters, packages, and behavior contracts. Focused tests: 9/9; full tests: 266/266; typecheck, lint, and production build passed; initial production bundle: 995.48 kB.

## Outcome

- Signal: useful

## Source Nodes

- MenuDirective
- .showAccordion()
- .hideAccordion()
- .withPopper()
- .initDropdownPopper()
- .initStandaloneMenuPopper()