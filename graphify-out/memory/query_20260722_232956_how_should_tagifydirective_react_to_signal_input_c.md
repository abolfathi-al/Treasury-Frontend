---
type: "architecture"
date: "2026-07-22T23:29:56.713240+00:00"
question: "How should TagifyDirective react to signal input changes without duplicate reinitialization?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TagifyDirective", ".initEffects()", ".onOptionsChange()", ".reinit()", "tagify.directive.spec.ts"]
---

# Q: How should TagifyDirective react to signal input changes without duplicate reinitialization?

## Answer

Expanded from the graph vocabulary via [tagify, reinit, reinitialize, changes, effect, options, input, update, destroy, initialize, refresh, manager]. TagifyDirective signal effects already synchronize every declared input through setOptionIfChanged or updateDropdownOption into onOptionsChange, which calls reinit only after initialization. The additional ngOnChanges hook recreated once with stale options and the effect recreated again with current options. Removing the redundant OnChanges implementation leaves one authoritative path. The regression test failed before the fix with 3 instances and passed after it with 2 total instances and maxTags 2 on the replacement.

## Outcome

- Signal: useful

## Source Nodes

- TagifyDirective
- .initEffects()
- .onOptionsChange()
- .reinit()
- tagify.directive.spec.ts