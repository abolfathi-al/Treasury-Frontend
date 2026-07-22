---
type: "query"
date: "2026-07-22T22:09:29.305622+00:00"
question: "How should DropzoneDirective prevent stale delayed preview and manual remove work after destroy or reinitialize?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DropzoneDirective", ".clearPendingWork()", ".cleanup()"]
---

# Q: How should DropzoneDirective prevent stale delayed preview and manual remove work after destroy or reinitialize?

## Answer

Track every timeout and animation frame, register remove clicks through Renderer2 with stored cleanup functions, and clear timers, frames, listeners, and element markers before destroying the Dropzone instance.

## Outcome

- Signal: useful

## Source Nodes

- DropzoneDirective
- .clearPendingWork()
- .cleanup()