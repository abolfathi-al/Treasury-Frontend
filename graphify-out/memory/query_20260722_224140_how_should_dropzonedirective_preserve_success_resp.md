---
type: "query"
date: "2026-07-22T22:41:40.961814+00:00"
question: "How should DropzoneDirective preserve success responses and terminate loading on failures?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".attachEventCallbacks()", ".handleErr()", "dropzone.directive.spec.ts"]
---

# Q: How should DropzoneDirective preserve success responses and terminate loading on failures?

## Answer

Expanded from the task via graph vocab: [dropzone, success, response, error, loading, status, handler, emit]. DropzoneDirective routes initialization and callback failures through .handleErr(), which now ends loading before publishing the error. .attachEventCallbacks() forwards the vendor success response through successEvent instead of replacing it with null, while preserving the existing one-argument success option callback. Focused and full tests verify both contracts.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .attachEventCallbacks()
- .handleErr()
- dropzone.directive.spec.ts