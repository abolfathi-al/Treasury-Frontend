# States: Loading, Error, Empty, Partial, Validation

Primary source references:

- `apps/web/src/app/shared/loading-states/paragraph-skeleton/paragraph-skeleton.component.ts`
- `apps/web/src/app/shared/ui/button-with-indicator/button-with-indicator.component.ts`
- `apps/web/src/app/utils/async-resource.ts`
- `apps/web/src/app/modules/errors`
- `apps/web/src/app/shared/forms/invalid-feedback/invalid-feedback.component.ts`
- `apps/web/src/app/shell/layout/shell.facade.ts`

## Loading States

Existing patterns:

- `ShellFacade.isLoading` toggles during Angular router navigation.
- `ButtonWithIndicatorComponent` accepts a `BehaviorSubject<boolean>` and emits only when not loading.
- `trackResource` returns `ResourceStatus.LOADING` before data loads unless running on server.
- Auth pages bind `data-velora-indicator="on"` while `AuthService.isLoading$` is true.

Rules:

- Show loading at the smallest meaningful scope: button, panel, table, page, or shell.
- Disable terminal actions while loading.
- Preserve layout dimensions to avoid content jumping.
- For router-level loading, use shell state rather than page-local duplicated state.

Example:

```html
<button
  type="button"
  class="btn btn-primary"
  [disabled]="isLoading()"
  [attr.data-velora-indicator]="isLoading() ? 'on' : 'off'">
  <span class="indicator-label">{{ 'common.actions.submit' | translate }}</span>
  <span class="indicator-progress">{{ 'common.states.wait' | translate }}</span>
</button>
```

## Skeleton/Shimmer States

Existing component:

- `vl-paragraph-skeleton`

Inputs:

- `minParagraphs`
- `maxParagraphs`
- `minLines`
- `maxLines`

Rules:

- Use skeletons for text/card content while data shape is known.
- Do not use skeletons as empty states.
- Keep count ranges small in dense tools.

## Error States

Existing error routes:

- `/error/404`
- `/error/500`
- `/error/403`
- `/error/401`
- `/error/400`
- `/error/503`

Existing services:

- `ErrorService` owns `currentError`, `errorHistory`, `retryCount`, retry behavior, severity/category mapping.
- `BaseErrorComponent` creates route-data-driven error information and sets page title.
- `ErrorUtils` supports extracting and classifying error information.
- `handleHttpError` and `trackResource` show toast messages and fallback/error states.

Rules:

- Use route data for full-page errors.
- Use local inline error state for recoverable panel/table failures.
- Include retry only when retry is possible.
- Do not redirect to auth/error pages from inside panel components unless it is a route-level failure.

## Empty States

No dedicated shared empty-state component was found.

Required empty-state pattern:

- Title: what is empty.
- Body: why it is empty or what scope/filter caused it.
- Action: only if the user can resolve the state.
- Reset filters action if filters caused the empty result.
- Domain-specific icon or status, not generic copy.

Example:

```html
@if (!isLoading() && rows().length === 0) {
  <section class="text-center py-10">
    <vl-velora-icon name="file-right" class="fs-2hx text-gray-500"></vl-velora-icon>
    <h2 class="fs-4 fw-bold">{{ 'workspace.accessRequests.empty.title' | translate }}</h2>
    <p class="text-muted">{{ 'workspace.accessRequests.empty.description' | translate }}</p>
  </section>
}
```

This example is an inferred pattern; no shared empty component exists.

## Validation Error States

Existing component:

- `vl-invalid-feedback`

Rules:

- Show field errors after dirty or touched.
- Mark all controls touched on attempted submit.
- Use translation keys for field names and messages.
- For server errors, map backend errors to form/control errors before rendering.

## Partial Data States

Partial data occurs when a panel can render core data but not all related data.

Required pattern:

- Render available data.
- Mark missing sections explicitly.
- Do not show stale related data without a timestamp/source.
- Provide retry for the failed section, not the whole page, when possible.

## Retry Patterns

Existing:

- `ErrorService.retry()` reloads the window until max retry count.
- `trackResource` returns `ResourceStatus.ERROR`.

Rules:

- For page-level unrecoverable errors, use error routes.
- For panel/table errors, keep the user in context and retry the failed request.
- Retry buttons must show loading while retrying.

## Anti-patterns

- Skeleton used for empty results.
- Generic "Something went wrong" without context or retry.
- Error modals that block all work for a local panel failure.
- Submit buttons that stay enabled during save.
- Empty states that hide active filters.

