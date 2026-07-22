---
type: "query"
date: "2026-07-22T18:16:27.674560+00:00"
question: "ok, continue"
contributor: "graphify"
outcome: "corrected"
correction: "KeyboardEventService remains in core. Its redundant DrawerDirective dependency was deleted; DrawerDirective already handles Escape itself."
source_nodes: ["Project Composition Boundary", "LoggerService", "LayoutService", "runSafely()", "KeyboardEventService", "DrawerDirective"]
---

# Q: ok, continue

## Answer

Expanded query: core shared dependency imports boundary drawer directive layout logger safely flatpickr english. Final implementation removes all four core-to-shared imports: deletes unused flatpickr config, removes the redundant DrawerDirective.hideAll call because DrawerDirective already owns Escape handling, and relocates runSafely into core utilities while preserving the old shared re-export. ESLint blocks core imports from shared, shell, project, modules, and demo.

## Outcome

- Signal: corrected
- Correction: KeyboardEventService remains in core. Its redundant DrawerDirective dependency was deleted; DrawerDirective already handles Escape itself.

## Source Nodes

- Project Composition Boundary
- LoggerService
- LayoutService
- runSafely()
- KeyboardEventService
- DrawerDirective