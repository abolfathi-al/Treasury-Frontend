---
type: "architecture"
date: "2026-07-22T23:18:37.395558+00:00"
question: "How should TagifyDirective preserve configured callbacks while emitting Angular outputs and validation?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TagifyDirective", ".createInstance()", ".attachEventCallbacks()", ".validate()", "tagify.directive.spec.ts"]
---

# Q: How should TagifyDirective preserve configured callbacks while emitting Angular outputs and validation?

## Answer

Expanded from the graph vocabulary via [tagify, callbacks, validation, change, emit, event, input, dropdown, options, add, remove, invalid]. Keep user callbacks in Tagify configuration, normalize the declared nested dropdown callbacks and edit callback to Tagify event names, then attach Angular output/state handlers independently through TagifyDirective.attachEventCallbacks using the vendor on API. Emit validationChange immediately after createInstance validates so both valid and invalid initialization attempts are observable. The focused Tagify spec verifies configured add/edit/dropdown callbacks, Angular outputs, and validation output together.

## Outcome

- Signal: useful

## Source Nodes

- TagifyDirective
- .createInstance()
- .attachEventCallbacks()
- .validate()
- tagify.directive.spec.ts