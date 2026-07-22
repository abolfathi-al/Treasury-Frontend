# SCSS Refactoring Guide

## Completed Refactoring

### ✅ Formatting Standardization
- **Indentation**: All files converted from tabs to **4 spaces**
- **Spacing**: Normalized spacing around selectors, properties, and imports
- **Quotes**: Standardized to single quotes for imports (`'path'` not `"path"`)

### ✅ File Headers
Standardized header format:
```scss
//
// Component Name
// Brief description
//
```

### ✅ Import Statements
- Removed duplicate imports
- Standardized to single quotes
- Removed redundant "Import Dependencies" comments

### ✅ Selector Formatting
- Multi-line selectors properly formatted:
  ```scss
  h1,
  h2,
  h3 {
      // styles
  }
  ```

### ✅ Variable Usage
- Extracted hardcoded values to variables where appropriate
- Added `!default` flags to custom variables
- Used semantic variable names

## Refactored Files

### Base
- ✅ `base/_reset.scss` - Normalized selectors
- ✅ `base/_typography.scss` - Added proper header

### Components
- ✅ `components/_buttons.scss` - Cleaned imports
- ✅ `components/buttons/_base.scss` - Fixed indentation, removed empty rules
- ✅ `components/buttons/_theme.scss` - Improved formatting
- ✅ `components/_forms.scss` - Removed duplicate import
- ✅ `components/_menu.scss` - Standardized header
- ✅ `components/_stepper.scss` - Standardized header
- ✅ `components/_helpers.scss` - Standardized header
- ✅ `components/_card.scss` - Fixed multi-line selectors

### Pages
- ✅ `pages/_landing.scss` - Extracted hardcoded colors to variables, improved structure

### Themes
- ✅ `themes/_theme-mode.scss` - Fixed indentation (tabs to spaces)

### Utilities
- ✅ `utilities/_utilities.scss` - Normalized spacing, added trailing commas

### Layout
- ✅ `layout/sidebar/_sidebar.scss` - Improved header

## Remaining Files

### Pattern to Follow

1. **File Header**:
   ```scss
   //
   // Component Name
   // Description
   //
   ```

2. **Imports** (if any):
   ```scss
   @import 'path/to/file';
   ```

3. **Code Style**:
   - 4 spaces indentation (no tabs)
   - Single quotes for strings
   - Trailing commas in maps/lists
   - Multi-line selectors when appropriate
   - Consistent spacing

3. **Variables**:
   - Use `!default` for custom variables
   - Extract hardcoded values
   - Use semantic names

4. **Selectors**:
   - Keep nesting ≤ 3 levels
   - Use BEM methodology
   - Format multi-line selectors properly

## Files Still Needing Review

### Components (High Priority)
- All component files in `components/` folder
- Form sub-components in `components/forms/`
- Helper files in `components/helpers/`

### Layout (Medium Priority)
- `layout/_root.scss` - Very long, but well-structured
- `layout/header/*` - Header variants
- `layout/sidebar/*` - Sidebar variants

### Vendors (Low Priority)
- Plugin override files (mostly third-party customizations)

## Automated Fixes Applied

1. ✅ Tab to space conversion (all files)
2. ✅ Basic formatting normalization

## Manual Review Needed

- Complex nested selectors
- Hardcoded color values
- Inconsistent variable usage
- Comment quality and consistency
