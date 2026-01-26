# Quick Theming Reference

## For Developers: Fast Copy-Paste Solutions

### Common Use Cases

#### 1. Card Component
```scss
.my-card {
  @include card-base();
  padding: tokens.$card-padding;
  
  &:hover {
    @include card-hover();
  }
}
```

#### 2. Button
```scss
.my-button {
  @include button-base();
  padding: 12px 24px;
  
  &--primary {
    // Override if needed
  }
}
```

#### 3. Badge/Pill/Tag
```scss
.my-badge {
  @include badge-base();
}
```

#### 4. Icon Button
```scss
.my-icon-button {
  @include icon-button();
}
```

#### 5. Gradient Text (for titles, headers)
```scss
.my-title {
  @include gradient-text();
  font-size: 32px;
  font-weight: 700;
}
```

#### 6. Glow/Shadow Effect
```scss
.my-element {
  @include glow-effect();
  
  &:hover {
    @include glow-effect(tokens.$primary-blue, 30px, 0.8);
  }
}
```

#### 7. Glass Morphism Container
```scss
.my-glass {
  @include glass-overlay();
  padding: 20px;
}
```

#### 8. Connector/Progress Line
```scss
.my-line {
  background: linear-gradient(
    180deg,
    rgba(tokens.$primary-blue, 0.25) 0%,
    tokens.$primary-blue 20%,
    #60a5fa 50%,
    tokens.$primary-cyan 100%
  );
  
  // Or use mixin:
  @include connector-gradient();
}
```

## Color Variables for Direct Use

### Primary Colors
- `tokens.$primary-blue` - #3b82f6
- `tokens.$primary-cyan` - #06b6d4

### Extended Colors
- `tokens.$color-blue-400` - #60a5fa
- `tokens.$color-blue-600` - #2563eb
- `tokens.$color-cyan-400` - #22d3ee

### Text Colors
- `tokens.$text-primary` - #d1d5db
- `tokens.$text-secondary` - #9ca3af
- `tokens.$text-tertiary` - #6b7280

### Background Colors
- `tokens.$bg-base` - #0a0a0f
- `tokens.$bg-secondary` - #0f0f1a
- `tokens.$bg-tertiary` - #0d0d1a

### Component Colors
- `tokens.$card-bg` - rgba(blue, 0.08)
- `tokens.$card-border` - rgba(blue, 0.25)
- `tokens.$card-border-hover` - rgba(blue, 0.5)
- `tokens.$button-primary-bg` - rgba(blue, 0.18)
- `tokens.$badge-bg` - rgba(blue, 0.12)

## Pre-Made Color Combinations

```scss
// These are already defined and ready to use:

// Shadows
tokens.$shadow-sm          // Small shadow
tokens.$shadow-hover       // Hover shadow
tokens.$shadow-highlighted // Highlighted state
tokens.$shadow-highlighted-hover

// Glows
tokens.$glow-base          // Base glow
tokens.$glow-hover         // Hover glow
tokens.$glow-glowing       // Active glow
tokens.$glow-hover-extended
tokens.$glow-highlighted-hover-extended

// Borders
tokens.$border-base
tokens.$border-hover
tokens.$border-highlighted
tokens.$border-highlighted-hover

// Insets
tokens.$inset-base         // For glass effect
tokens.$inset-hover
tokens.$inset-highlighted
tokens.$inset-highlighted-hover
```

## Transitions & Effects

```scss
// Use these for consistent animations:
transition: tokens.$transition-default;    // all 0.3s ease
transition: tokens.$transition-smooth;      // all 0.6s cubic-bezier(...)
transition: tokens.$transition-fill;        // height 0.15s ease-out

// Blur amount for glass morphism:
backdrop-filter: blur(tokens.$blur-amount); // 20px
```

## Spacing & Sizing

```scss
tokens.$card-width              // 35%
tokens.$card-padding            // 2rem
tokens.$card-border-radius      // 20px
tokens.$card-border-width       // 1.5px

tokens.$dot-size               // 16px
tokens.$dot-border-width       // 3px

tokens.$connector-width        // 3px

tokens.$blur-amount            // 20px
```

## Real-World Examples

### Example 1: Creating a New Modal
```scss
.modal {
  @include glass-overlay(0.15);
  padding: 40px;
  border-radius: 20px;
  
  .modal__title {
    @include gradient-text();
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .modal__button {
    @include button-base();
    margin-top: 20px;
  }
}
```

### Example 2: Creating an Alert/Notification
```scss
.alert {
  @include card-base(tokens.$card-bg, tokens.$card-border);
  padding: 16px;
  margin-bottom: 16px;
  
  &__title {
    color: tokens.$text-primary;
    font-weight: 600;
  }
  
  &__close {
    @include icon-button();
    width: 32px;
    height: 32px;
  }
}
```

### Example 3: Creating a Feature Card
```scss
.feature {
  @include card-base();
  padding: tokens.$card-padding;
  text-align: center;
  
  &__icon {
    font-size: 48px;
    @include glow-effect(tokens.$primary-blue, 20px);
    margin-bottom: 16px;
  }
  
  &__title {
    @include gradient-text();
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  &:hover {
    @include card-hover();
    
    .feature__icon {
      @include glow-effect(tokens.$primary-blue, 30px, 0.8);
    }
  }
}
```

## When to Change Theme

To change from blue to another color:

1. Open `src/app/custom-timeline/design-tokens.scss`
2. Find the PRIMARY COLORS section
3. Change these two lines:
   ```scss
   $primary-blue: #NEW_COLOR;
   $primary-cyan: #NEW_ACCENT_COLOR;
   ```
4. Done! Everything updates automatically.

## Troubleshooting

**Problem:** Mixin not found
**Solution:** Make sure you have `@use '../../custom-timeline/design-tokens.scss' as tokens;` at the top of your SCSS file

**Problem:** Colors don't match
**Solution:** Use the exact variable name with `tokens.` prefix: `tokens.$primary-blue`

**Problem:** Hover state not working
**Solution:** Make sure you're using the mixin before the `&:hover` block: `@include card-base();` then `&:hover { @include card-hover(); }`

## Need Help?

- Full guide: See `THEMING_GUIDE.md`
- Migration info: See `THEMING_REFACTORING_PROGRESS.md`
- Source: `src/app/custom-timeline/design-tokens.scss`
