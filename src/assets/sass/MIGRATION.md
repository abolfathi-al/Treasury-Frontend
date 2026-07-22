# Migration Guide

## From Old Structure to New 7-1 Architecture

### Old Entry Points (Deprecated)

The following files are **deprecated** and kept only for reference:

- `_init.scss` - Use `abstracts/_index.scss` instead
- `plugins.scss` - Use `vendors/_index.scss` instead
- `style.angular.scss` - Use `main.angular.scss` instead
- `components/components.scss` - Use `components/_index.scss` instead
- `core/components/components.scss` - Use `components/_index.scss` instead

### New Entry Points

**For new projects, use:**

```scss
// Main entry point (includes everything)
@import 'path/to/sass/main';

// Or for Angular projects
@import 'path/to/sass/main.angular';
```

### Path Changes

| Old Path | New Path |
|----------|----------|
| `core/base/functions/` | `abstracts/functions/` |
| `core/base/mixins/` | `abstracts/mixins/` |
| `core/components/variables` | `abstracts/variables/variables` |
| `core/components/_variables-dark` | `abstracts/variables/variables-dark` |
| `components/_variables.custom` | `abstracts/variables/variables-custom` |
| `components/_variables.override` | `abstracts/variables/variables-override` |
| `core/components/_reboot` | `base/_reset` |
| `core/components/_type` | `base/_typography` |
| `core/components/_root` | `base/_root` |
| `core/components/*` | `components/*` |
| `core/layout/base/*` | `layout/*` |
| `layout/*` | `layout/*` (merged) |
| `core/vendors/plugins/*` | `vendors/plugins/*` |

### Import Updates Required

If you have custom files importing from the old structure, update them:

**Before:**
```scss
@import "core/components/variables";
@import "core/base/mixins";
```

**After:**
```scss
@import "abstracts/index"; // Includes all variables, functions, mixins
```

### Component Imports

Component imports remain the same (relative paths):

```scss
// Still works
@import "components/buttons";
@import "forms/form-control";
```

### Bootstrap Integration

Bootstrap is now imported in `main.scss` in the correct order:

1. Abstracts (variables, functions, mixins)
2. Bootstrap initialization
3. Base styles
4. Bootstrap components
5. Custom components
6. Layout
7. Pages
8. Themes
9. Utilities
10. Vendors

You don't need to import Bootstrap separately if using `main.scss`.
