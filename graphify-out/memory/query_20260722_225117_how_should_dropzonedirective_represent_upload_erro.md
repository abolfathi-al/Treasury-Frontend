---
type: "query"
date: "2026-07-22T22:51:17.228061+00:00"
question: "How should DropzoneDirective represent upload errors that have no XMLHttpRequest?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".attachEventCallbacks()", ".onFileError()", ".onErrorMultiple()", "dropzone.directive.spec.ts"]
---

# Q: How should DropzoneDirective represent upload errors that have no XMLHttpRequest?

## Answer

Expanded from the task via graph vocab: [dropzone, error, multiple, request, callback, event, emit, file, files]. .attachEventCallbacks() receives client-side error events without a request and now forwards undefined without casting. DropzoneOptions error callbacks accept an optional XMLHttpRequest; errorEvent payloads keep the xhr field but type it as XMLHttpRequest or undefined. .onFileError() and .onErrorMultiple() preserve the same events, status updates, file synchronization, and callback paths. dropzone.directive.spec.ts locks both type and runtime behavior.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .attachEventCallbacks()
- .onFileError()
- .onErrorMultiple()
- dropzone.directive.spec.ts