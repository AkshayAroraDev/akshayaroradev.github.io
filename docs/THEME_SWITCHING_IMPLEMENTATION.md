# Theme Switching with CSS Custom Properties + SCSS

## Overview
This implementation enables instant theme switching across the entire website without page refresh using CSS Custom Properties combined with SCSS variables.

## How It Works

### 1. **CSS Custom Properties (Runtime Variables)**
Defined in `src/app/app.scss`:
```scss
:host {
  --accent-primary: #3b82f6;      // Blue theme primary
  --accent-secondary: #06b6d4;    // Blue theme secondary
  --theme-primary-rgb: 59,130,246;
  --theme-secondary-rgb: 6,182,212;
}
```

These variables exist at runtime and can be changed instantly via JavaScript.

### 2. **SCSS Variables Reference CSS Custom Properties**
In `src/app/custom-timeline/design-tokens.scss`:
```scss
$primary-blue: var(--accent-primary);
$primary-cyan: var(--accent-secondary);
```

During SCSS compilation, these become CSS that references the custom properties:
```css
/* Compiled CSS */
background: var(--accent-primary);  /* Not a fixed color! */
```

### 3. **Theme Switching in TypeScript**
In `src/app/components/app-toolbar/app-toolbar.component.ts`:
```typescript
applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  // Update CSS custom properties
  root.style.setProperty('--accent-primary', theme.primary);
  root.style.setProperty('--accent-secondary', theme.secondary);
  
  // Optional: RGB variants for rgba() usage
  const rgb = this.hexToRgb(theme.primary);
  root.style.setProperty('--theme-primary-rgb', `${rgb.r},${rgb.g},${rgb.b}`);
}
```

## Available Themes

### Blue Theme (Default)
- Primary: `#3b82f6`
- Secondary: `#06b6d4`

### Purple Theme
- Primary: `#a855f7`
- Secondary: `#ec4899`

## Theme Flow

```
User clicks theme dot in toolbar
    ↓
switchTheme() called
    ↓
applyTheme() updates CSS custom properties
    ↓
Browser re-evaluates all var(--accent-primary) references
    ↓
All colors update instantly (no refresh needed!)
    ↓
localStorage saves preference for next visit
```

## Adding New Themes

### Step 1: Add to theme list (app-toolbar.component.ts)
```typescript
themes: Theme[] = [
  { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { id: 'purple', name: 'Purple', primary: '#a855f7', secondary: '#ec4899' },
  // Add here:
  { id: 'green', name: 'Green', primary: '#10b981', secondary: '#14b8a6' }
];
```

### Step 2: That's it!
The theme selector automatically picks it up and it works instantly.

## Benefits

✅ **No page refresh** - Changes apply instantly  
✅ **Pure SCSS** - All styling uses SCSS features (mixins, variables, etc.)  
✅ **Persistent** - Theme preference saved in localStorage  
✅ **Scalable** - Easy to add unlimited themes  
✅ **Performance** - No extra network requests or stylesheet loads  
✅ **SEO Friendly** - Single CSS bundle, no FOUC (flash of unstyled content)  

## Technical Details

### CSS Variable Inheritance
When you update `--accent-primary`, all elements using `var(--accent-primary)` automatically update because CSS custom properties are inherited and re-evaluated.

### SCSS Compilation
```scss
// Before compilation
.button { background: $primary-blue; }

// After compilation (with our setup)
.button { background: var(--accent-primary); }

// At runtime (when user switches theme)
// --accent-primary changes to #a855f7 automatically
```

### RGB Values for rgba()
Some components need semi-transparent colors like `rgba(59, 130, 246, 0.2)`. We store RGB values separately:
```css
--theme-primary-rgb: 59,130,246;

/* Usage */
background: rgba(var(--theme-primary-rgb), 0.2);
```

## Migration Path

All new components should reference CSS custom properties through SCSS:
```scss
// Good - uses runtime theme colors
.card { background: $primary-blue; }

// Avoid - hardcoded colors
.card { background: #3b82f6; }
```

## Browser Support
CSS Custom Properties are supported in all modern browsers (IE 11 not supported, but that's fine for 2026).

## Files Modified

- `src/app/custom-timeline/design-tokens.scss` - Uses CSS variables
- `src/app/components/app-toolbar/app-toolbar.component.ts` - Theme switching logic
- `src/app/app.scss` - CSS custom properties defined

No other files needed changes because they already reference design tokens!
