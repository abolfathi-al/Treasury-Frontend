# Quick Start Guide

## 🚀 Getting Started

### 1. Import in Your Project

**Angular:**
```scss
// In your styles.scss or angular.json
@import 'path/to/sass/main.angular';
```

**Other Projects:**
```scss
// In your main stylesheet
@import 'path/to/sass/main';
```

### 2. Customize Variables

Edit these files to customize your theme:

- `abstracts/variables/_variables-custom.scss` - Custom variable overrides
- `abstracts/variables/_variables-override.scss` - Final overrides (highest priority)

### 3. Add Custom Components

1. Create your component file: `components/_my-component.scss`
2. Add to `components/_index.scss`:
   ```scss
   @import 'my-component';
   ```

### 4. File Organization

```
abstracts/     → Variables, functions, mixins (design tokens)
base/          → Reset, typography, root styles
components/    → Reusable UI components
layout/        → Page structure (header, sidebar, etc.)
pages/         → Page-specific styles
themes/        → Theme variations
utilities/     → Helper classes
vendors/       → Third-party plugins
```

## 📝 Common Tasks

### Override Bootstrap Variables

```scss
// In abstracts/variables/_variables-custom.scss
$primary: #your-color;
$font-family-base: 'Your Font', sans-serif;
```

### Create a New Component

```scss
// components/_card-custom.scss
.card-custom {
  // Block
  &__header {
    // Element
  }

  &--featured {
    // Modifier
  }
}
```

Then import in `components/_index.scss`.

### Add a Layout Section

```scss
// layout/_custom-section.scss
.app-custom-section {
  // Styles
}
```

Then import in `layout/_index.scss`.

## ⚠️ Important Notes

1. **Import Order Matters** - Don't change the order in `main.scss`
2. **Use Abstracts** - Always use variables/mixins from `abstracts/`
3. **BEM Naming** - Follow BEM for component classes
4. **No Deep Nesting** - Keep nesting ≤ 3 levels

## 🔍 Finding Files

- **Variables?** → `abstracts/variables/`
- **Mixins?** → `abstracts/mixins/`
- **Components?** → `components/`
- **Layout?** → `layout/`
- **Utilities?** → `utilities/`

## 📚 Next Steps

- Read `README.md` for detailed architecture
- Check `MIGRATION.md` if migrating from old structure
- Review component files for examples
