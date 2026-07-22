---
type: "query"
date: "2026-07-22T22:22:14.547992+00:00"
question: "How should DropzoneDirective recreate safely before or during lazy library loading?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".loadLibrary()", ".recreate()"]
---

# Q: How should DropzoneDirective recreate safely before or during lazy library loading?

## Answer

Return and reuse one library-load promise, initialize from the cached class after cleanup, ignore completion after destroy, and have recreate await that shared promise so it resolves only after initialization or recorded load failure.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .loadLibrary()
- .recreate()