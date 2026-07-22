---
type: "query"
date: "2026-07-22T22:15:08.246292+00:00"
question: "How should DropzoneDirective keep its declared advanced inputs and derived outputs operational?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".validate()", ".syncFiles()", ".setTotalSize()"]
---

# Q: How should DropzoneDirective keep its declared advanced inputs and derived outputs operational?

## Answer

Use one shared input binding table for initial sync and reactive effects, include hiddenInputContainer, renameFile, transformFile, and resize, emit validation and changed total-size results, and copy the mutable vendor files array before storing it in signal state.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .validate()
- .syncFiles()
- .setTotalSize()