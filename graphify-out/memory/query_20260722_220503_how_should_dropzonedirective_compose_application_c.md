---
type: "query"
date: "2026-07-22T22:05:03.406490+00:00"
question: "How should DropzoneDirective compose application callbacks without replacing Dropzone default UI behavior?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".attachEventCallbacks()"]
---

# Q: How should DropzoneDirective compose application callbacks without replacing Dropzone default UI behavior?

## Answer

Remove event callback options from the constructor config, keep init as the lifecycle bridge, and register adapter outputs plus user callbacks through instance.on so Dropzone default preview, removal, drag, reset, and error handlers remain active.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .attachEventCallbacks()