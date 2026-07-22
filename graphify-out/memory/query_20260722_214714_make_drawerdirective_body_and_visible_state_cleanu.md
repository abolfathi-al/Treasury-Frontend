---
type: "query"
date: "2026-07-22T21:47:14.749445+00:00"
question: "Make DrawerDirective body and visible state cleanup safe across multiple Master Admin drawer instances"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DrawerDirective", "DrawerStore", ".setBodyAttrsOnShow()", ".clearBodyAttrsOnHide()", ".hideDrawer()", ".cleanup()"]
---

# Q: Make DrawerDirective body and visible state cleanup safe across multiple Master Admin drawer instances

## Answer

DrawerDirective now treats body visibility attributes as shared state: hiding one drawer preserves global and same-name attributes while another matching drawer remains open. Destroy marks the directive destroyed, transitions an open drawer to hidden without emitting lifecycle outputs, removes its overlay and active classes, and releases shared body state only when no remaining drawer owns it. Public selector, exportAs, inputs, outputs, methods, store APIs, and packages remain unchanged. Focused tests: 6/6; full tests: 268/268; typecheck, lint, and production build passed; initial production bundle: 995.73 kB.

## Outcome

- Signal: useful

## Source Nodes

- DrawerDirective
- DrawerStore
- .setBodyAttrsOnShow()
- .clearBodyAttrsOnHide()
- .hideDrawer()
- .cleanup()