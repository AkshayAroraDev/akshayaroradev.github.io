# Theming Guide - Portfolio App

## Overview
This document explains how to use the centralized theming system to maintain consistent colors throughout the application and make theme changes easily.

## Architecture

### 1. Color Palette Structure
**File:** `src/app/custom-timeline/design-tokens.scss`

The design tokens file is now organized into layers:

```
Extended Color Palette (base colors)
    ↓
Semantic Variables (primary-blue, primary-cyan, etc.)
    ↓
Component Colors (card-bg, button-primary-bg, etc.)
    ↓
SCSS Mixins (reusable styling patterns)
```

### 2. Key Changes Made

#### Extended Color Palette
```scss
$color-blue-400: #60a5fa;
$color-blue-500: #3b82f6;    // primary
$color-blue-600: #2563eb;
$color-cyan-400: #22d3ee;
$color-cyan-500: #06b6d4;    // secondary
```

#### Semantic Component Colors
Instead of hardcoding colors everywhere, use semantic variables:
```scss
$card-bg: rgba($primary-blue, 0.08);
$card-border: rgba($primary-blue, 0.25);
$badge-bg: rgba($primary-blue, 0.12);
$button-primary-bg: rgba($primary-blue, 0.18);
```

## How to Use

### Option 1: Using Existing Mixins (Recommended for New Code)

#### For Cards
```scss
.my-card {
  @include card-base();
  
  &:hover {
    @include card-hover();
  }
}
```

#### For Buttons
```scss
.my-button {
  @include button-base();
}
```

#### For Badges/Pills
```scss
.my-badge {
  @include badge-base();
}
```

#### For Gradient Text
```scss
.my-title {
  @include gradient-text();
  // Or custom colors:
  @include gradient-text($color-blue-500, $color-cyan-500);
}
```

#### For Glow Effects
```scss
.my-element {
  @include glow-effect();
  // Or custom:
  @include glow-effect($primary-blue, 20px, 0.6);
}
```

### Option 2: Using Component Color Variables (For Complex Styling)

```scss
.my-element {
  background: $card-bg;
  border: 1px solid $card-border;
  color: $text-primary;
  
  &:hover {
    border-color: $card-border-hover;
    box-shadow: 0 30px 60px $card-glow;
  }
}
```

### Option 3: Using Core Color Variables (For Raw Control)

```scss
.my-element {
  color: $primary-blue;
  background: rgba($primary-blue, 0.08);
}
```

## Changing the Theme

### To Change Primary Color (e.g., from Blue to Purple)

**File:** `src/app/custom-timeline/design-tokens.scss`

**Step 1:** Update the base color palette
```scss
// Change this:
$color-blue-500: #3b82f6;
// To:
$color-purple-500: #a855f7;
```

**Step 2:** Update the semantic variables
```scss
// Change this:
$primary-blue: $color-blue-500;
// To:
$primary-blue: $color-purple-500;
```

**Step 3:** Done! All components using the mixins and component colors will automatically update.

## File Organization

### Where Colors Are Used

| File | Purpose |
|------|---------|
| `design-tokens.scss` | Central source of truth for all colors |
| `*.component.scss` | Should import and use tokens, not hardcode colors |
| `*.directive.ts` | Can use CSS variables or be updated individually |
| `*.component.html` | Avoid inline styles |

## Migration Checklist

### For Existing Components (Gradual Migration)

When updating existing components:
- [ ] Replace hardcoded colors with semantic variables
- [ ] Use mixins for common patterns
- [ ] Update documentation with mixin examples

### Example Migration

**Before:**
```scss
.project-card {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(217, 70, 239, 0.08) 100%
  );
  border: 1px solid rgba(139, 92, 246, 0.25);
  
  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 30px 60px rgba(139, 92, 246, 0.5);
  }
}
```

**After:**
```scss
.project-card {
  @include card-base();
  
  &:hover {
    @include card-hover();
  }
}
```

## Common Patterns

### Creating a New Card Component
```scss
.my-card {
  @include card-base($card-bg, $card-border);
  padding: $card-padding;
  border-radius: $card-border-radius;
  
  &:hover {
    @include card-hover($card-border-hover, $card-glow-hover);
  }
}
```

### Creating a New Button Style
```scss
.my-button {
  @include button-base();
  padding: 12px 24px;
  font-size: 14px;
  
  &:active {
    transform: translateY(2px);
  }
}
```

### Creating Gradient Text with Animation
```scss
.my-title {
  @include gradient-text();
  font-size: 32px;
  font-weight: 700;
  background-size: 300% 300%;
  animation: gradientFlow 8s ease infinite;
}
```

### Creating a Glowing Effect
```scss
.my-element {
  @include glow-effect($primary-blue, 20px);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    @include glow-effect($primary-blue, 30px, 0.8);
  }
}
```

## Variable Reference

### Primary Colors
- `$primary-blue: #3b82f6` - Main brand color
- `$primary-cyan: #06b6d4` - Secondary brand color
- `$accent-blue: #60a5fa` - Accent color

### Background Colors
- `$bg-base: #0a0a0f` - Primary background
- `$bg-secondary: #0f0f1a` - Secondary background
- `$bg-tertiary: #0d0d1a` - Tertiary background

### Text Colors
- `$text-primary: #d1d5db` - Primary text
- `$text-secondary: #9ca3af` - Secondary text
- `$text-tertiary: #6b7280` - Tertiary text

### Component Colors
- `$card-bg`, `$card-border`, `$card-border-hover`
- `$button-primary-bg`, `$button-secondary-bg`
- `$badge-bg`, `$badge-border`, `$badge-text`

## Mixin Reference

### Available Mixins
- `@include card-base()` - Card styling
- `@include card-hover()` - Card hover state
- `@include gradient-text()` - Gradient text effect
- `@include glow-effect()` - Glow/shadow effect
- `@include button-base()` - Button styling
- `@include badge-base()` - Badge styling
- `@include icon-button()` - Icon button styling
- `@include glass-overlay()` - Glass morphism
- `@include connector-gradient()` - Connector line gradient

## Best Practices

1. **Always use design tokens** - Never hardcode colors
2. **Use mixins for common patterns** - Reduces code duplication
3. **Keep component colors** - Use `$card-bg`, `$button-primary-bg` instead of raw colors
4. **Group related properties** - Use mixins for coherent styling
5. **Test theme changes** - Always verify colors across all components

## Future Enhancements

### Planned Improvements
- [ ] CSS Custom Properties for runtime theme switching
- [ ] Dark/Light mode support
- [ ] Theme configuration file for easy color customization
- [ ] Color contrast validator
- [ ] Automated color palette generator

## Questions?

Refer to:
- `design-tokens.scss` - Source of all theme variables and mixins
- Component SCSS files - Examples of how to use the system
- This guide - For patterns and best practices
