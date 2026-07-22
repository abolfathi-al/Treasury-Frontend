# Domain Workspace Design Rules

These rules are UI-facing acceptance gates for Velora workspaces. They are based on the current codebase shape and design lessons from fixture-heavy workspace copy.

## Anti-Template Rule

A workspace cannot be marked complete if:

- tabs only change active state
- actions exist but do nothing
- modals are explanatory only
- drawers reuse static content
- table columns are generic
- wizards share generic step names without domain-specific meaning
- compare flows compare labels instead of domain semantics
- impact panels are static or generic
- create/edit flows ask irrelevant fields
- registry/module-specific validation is missing

## Required Acceptance Gate

Before any workspace is accepted:

- every tab must change meaningful content
- every action must be browser-visible
- every modal/drawer must show domain-specific data
- every table must have domain-specific columns
- every wizard must have domain-specific step names and meaning
- every create/edit flow must validate domain-specific rules
- every compare flow must compare domain semantics
- every impact panel must show real downstream consumers

## Workspace Completion Rules

Tabs:

- A tab must change data, scope, or workflow.
- A tab cannot exist only to show a different active class.

Actions:

- Every action must have a handler.
- Every handler must visibly change state, open a domain-specific overlay, navigate, or show a meaningful disabled reason.
- Demo action modals do not prove production action completeness.

Tables:

- Columns must describe the domain.
- Row actions must include row-specific object identity.
- Bulk actions must include count and impact.

Modals and drawers:

- Content must be specific to the selected object or workflow.
- Static explanatory copy is not enough.
- Destructive actions require confirmation and impact.

Wizards:

- Steps must be named for the domain.
- Each step must have a validation rule and domain reason.
- Review step must summarize actual entered/selected data.

Compare flows:

- Compare values with semantic meaning, not just translated labels.
- Show additions, removals, updates, and unchanged values when relevant.
- Use `DeepDiffMapper` only after mapping to meaningful domain objects.

Impact panels:

- Show affected downstream consumers.
- Show severity/risk.
- Show blockers and required approvals.

Create/edit flows:

- Ask only fields relevant to the target entity and action.
- Validate domain constraints before submit.
- Show server-side validation near fields where possible.

## Review Questions

- What domain object is this UI about?
- What state changes when the user acts?
- What downstream object or actor is affected?
- What permission or capability decides visibility/enabled state?
- What evidence proves this is not just a template?

