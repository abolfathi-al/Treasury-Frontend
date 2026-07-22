---
type: "query"
date: "2026-07-22T21:36:40.403184+00:00"
question: "Make MenuDirective custom event subscriptions safe for multiple handlers without changing its Master Admin public API"
contributor: "graphify"
outcome: "useful"
source_nodes: ["MenuDirective", ".on()", ".one()", ".off()", ".trackEventHandler()", ".untrackEventHandler()", ".cleanup()"]
---

# Q: Make MenuDirective custom event subscriptions safe for multiple handlers without changing its Master Admin public API

## Answer

MenuDirective now stores a set of EventUtil handler identifiers per event. on() can register multiple independent handlers, one() removes only the identifier that fired, off() removes every handler for that event, and destruction removes every remaining handler. The public on/one/off signatures and all directive selectors, inputs, outputs, methods, vendor adapters, and packages are preserved. Focused tests: 6/6; full tests: 263/263; typecheck, lint, and production build passed; initial production bundle: 995.23 kB.

## Outcome

- Signal: useful

## Source Nodes

- MenuDirective
- .on()
- .one()
- .off()
- .trackEventHandler()
- .untrackEventHandler()
- .cleanup()