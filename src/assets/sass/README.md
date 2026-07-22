# Sass Architecture - 7-1 Pattern

This project follows the **7-1 Architecture Pattern** for organized, maintainable Sass code.

## 📁 Folder Structure

```
sass/
├── abstracts/          # Variables, functions, mixins (no CSS output)
│   ├── variables/      # All Sass variables
│   ├── functions/      # Sass functions
│   └── mixins/         # Sass mixins
├── base/               # Reset, typography, root styles
├── components/         # Reusable UI components (BEM naming)
│   ├── buttons/
│   ├── forms/
│   ├── helpers/
│   ├── menu/
│   └── stepper/
├── layout/             # Application layout structure
│   ├── header/
│   ├── sidebar/
│   └── aside/
├── pages/              # Page-specific styles
├── themes/             # Theme variations
├── utilities/          # Helper classes
├── vendors/            # Third-party plugin customizations
│   └── plugins/
├── main.scss           # Main entry point
└── main.angular.scss   # Angular-specific entry point
```

## 🚀 Usage

### For Angular Projects

```scss
// In your angular.json or component styles
@import 'path/to/sass/main.angular';
```

### For Other Projects

```scss
// In your main stylesheet
@import 'path/to/sass/main';
```

## 📋 Import Order

The main stylesheet follows this order (critical for proper compilation):

1. **Abstracts** - Variables, functions, mixins
2. **Bootstrap** - Bootstrap initialization
3. **Base** - Reset, typography, root
4. **Bootstrap Components** - Full Bootstrap
5. **Components** - Custom UI components
6. **Layout** - Application structure
7. **Pages** - Page-specific styles
8. **Themes** - Theme variations
9. **Utilities** - Helper classes (last for specificity)
10. **Vendors** - Third-party plugins

## 🎨 Naming Conventions

### BEM Methodology

Components follow BEM (Block Element Modifier) naming:

```scss
.block {
  &__element {
    // Element styles
  }

  &--modifier {
    // Modifier styles
  }
}
```

### File Naming

- All partial files start with `_` (underscore)
- Use kebab-case: `_button-group.scss`
- Index files: `_index.scss` in each folder

## 🔧 Customization

### Override Variables

1. Edit `abstracts/variables/_variables-custom.scss` for custom values
2. Edit `abstracts/variables/_variables-override.scss` for final overrides

### Add New Components

1. Create component file in `components/` folder
2. Import in `components/_index.scss`
3. Follow BEM naming conventions

### Add New Layout Sections

1. Create layout file in `layout/` folder
2. Import in `layout/_index.scss`

## 📝 Best Practices

1. **Single Responsibility** - One component per file
2. **No Nesting > 3 levels** - Keep selectors shallow
3. **Use Variables** - Never hardcode colors, spacing, etc.
4. **Use Mixins** - For repeated patterns
5. **Mobile First** - Use `min-width` media queries
6. **BEM Consistency** - Stick to the methodology

## 🔄 Migration from Old Structure

The old structure (`core/`, `layout/` at root) has been reorganized:

- `core/components/` → `components/`
- `core/base/` → `abstracts/`
- `core/layout/` → `layout/`
- `core/vendors/` → `vendors/`
- `components/` (root) → `components/` or `pages/`

## 📚 Resources

- [7-1 Architecture](https://sass-guidelin.es/#the-7-1-pattern)
- [BEM Methodology](http://getbem.com/)
- [Sass Guidelines](https://sass-guidelin.es/)
