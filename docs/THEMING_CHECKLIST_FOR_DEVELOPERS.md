# Theming Checklist for Developers

## ⚠️ IMPORTANT: Before Adding Any New Feature

When adding new components, styling, or features to this portfolio, **you MUST follow these theming guidelines** to ensure new code is automatically compatible with theme switching.

---

## 🎨 Current Themes

- **Blue** (Default): Primary: `#3b82f6`, Secondary: `#06b6d4`
- **Purple** (Legacy): Primary: `#a855f7`, Secondary: `#ec4899`

Future themes can be added by extending the `themes` array in [app-toolbar.component.ts](src/app/components/app-toolbar/app-toolbar.component.ts).

---

## ✅ What You MUST Do When Adding New Features

### Rule 1: NEVER Use Hardcoded Color Hex Values

❌ **DON'T:**
```scss
.my-card {
  background: #3b82f6;
  border: 1px solid #06b6d4;
  color: #d1d5db;
}
```

✅ **DO:**
```scss
.my-card {
  background: var(--accent-primary);
  border: 1px solid var(--accent-secondary);
  color: tokens.$text-primary;
}
```

---

### Rule 2: For Transparent Colors, Use RGB CSS Variables

❌ **DON'T:**
```scss
.my-button {
  background: rgba(59, 130, 246, 0.15);  // Hardcoded RGB values
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

✅ **DO:**
```scss
.my-button {
  background: rgba(var(--theme-primary-rgb), 0.15);  // Uses CSS variable
  box-shadow: 0 0 20px rgba(var(--theme-primary-rgb), 0.3);
}
```

---

### Rule 3: Use Design Token Variables

The file `src/app/custom-timeline/design-tokens.scss` contains pre-built variables for common colors. Use them:

✅ **Good:**
```scss
@use '../../custom-timeline/design-tokens.scss' as tokens;

.my-component {
  background: $gradient-primary;              // Pre-made gradient
  color: tokens.$text-primary;                // Text color
  border: 1px solid $border-base;             // Border color
  box-shadow: $glow-base;                     // Glow effect
}
```

---

### Rule 4: For Gradients, Use CSS Variables

❌ **DON'T:**
```scss
.my-gradient {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
}
```

✅ **DO:**
```scss
.my-gradient {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}
```

---

### Rule 5: For Animations with Colors, Use CSS Variables

For complex animations or dynamic color transitions, use CSS variables so they update in real-time.

✅ **Example:**
```scss
@keyframes colorPulse {
  0% {
    box-shadow: 0 0 10px rgba(var(--theme-primary-rgb), 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(var(--theme-primary-rgb), 0.6);
  }
  100% {
    box-shadow: 0 0 10px rgba(var(--theme-primary-rgb), 0.3);
  }
}
```

---

### Rule 6: For SVG Gradients, Update TypeScript

SVG `<stop>` elements cannot use CSS variables directly. If you add SVG gradients:

1. Define them in the component template
2. Add a TypeScript method to update them when theme changes
3. Listen for CSS variable changes

✅ **Example:**
```typescript
private updateMyGradient(): void {
  const root = document.documentElement;
  const primaryRgb = getComputedStyle(root).getPropertyValue('--theme-primary-rgb');
  
  const stops = document.querySelectorAll('#myGradient stop');
  if (stops[0]) {
    stops[0].setAttribute('style', `stop-color: rgb(${primaryRgb.trim()}); stop-opacity: 1;`);
  }
}

private watchThemeChanges(): void {
  const observer = new MutationObserver(() => this.updateMyGradient());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style']
  });
}
```

---

## 🎯 Available CSS Variables

### Theme Colors
```css
--accent-primary     /* Current theme primary color (e.g., #3b82f6 for blue) */
--accent-secondary   /* Current theme secondary color (e.g., #06b6d4 for blue) */
--theme-primary-rgb  /* RGB values: "59,130,246" (for use in rgba) */
--theme-secondary-rgb /* RGB values: "6,182,212" (for use in rgba) */
```

### Background & Text (Static)
```css
--bg-primary         /* #0a0a0f - Main background */
--bg-secondary       /* #0f0f1a - Secondary background */
--bg-tertiary        /* #0d0d1a - Tertiary background */
--text-primary       /* #d1d5db - Primary text */
--text-secondary     /* #9ca3af - Secondary text */
```

---

## 📚 Design Token Variables (from SCSS)

These are pre-computed SCSS variables that use CSS custom properties. Import and use them:

```scss
@use '../../custom-timeline/design-tokens.scss' as tokens;

// Gradients
$gradient-primary           // Blue-to-cyan gradient at 0.12 opacity
$gradient-hover             // Blue-to-cyan gradient at 0.18 opacity
$gradient-highlighted       // Blue-to-cyan gradient at 0.18 opacity
$gradient-highlighted-hover // Blue-to-cyan gradient at 0.22 opacity

// Component Colors
$card-bg                    // Card background: rgba(theme-primary, 0.08)
$card-border               // Card border: rgba(theme-primary, 0.25)
$card-glow                 // Card glow: rgba(theme-primary, 0.5)
$button-primary-bg         // Button: rgba(theme-primary, 0.18)
$badge-bg                  // Badge: rgba(theme-primary, 0.12)

// Shadows & Glows
$shadow-sm                 // Small shadow
$shadow-hover              // Hover shadow
$glow-base                 // Base glow effect
$glow-hover-extended       // Extended hover glow

// Borders
$border-base               // Border: rgba(theme-primary, 0.15)
$border-hover              // Hover border: rgba(theme-primary, 0.3)
```

---

## 🔍 Pre-made Mixins

These are available in `design-tokens.scss`. Use them for consistency:

```scss
@include card-base()              // Card styling
@include card-hover()             // Card hover state
@include button-base()            // Button styling
@include badge-base()             // Badge styling
@include gradient-text()          // Gradient text effect
@include glow-effect()            // Glow effect
@include icon-button()            // Icon button styling
@include glass-overlay()          // Glass morphism
@include connector-gradient()     // Timeline connector
```

---

## 📋 Pre-Adding New Feature Checklist

Before committing new code, verify:

- [ ] No hardcoded hex color values like `#3b82f6` or `#06b6d4`
- [ ] No hardcoded RGB values like `rgba(59, 130, 246, ...)`
- [ ] All theme colors use CSS variables: `var(--accent-primary)` or `var(--theme-primary-rgb)`
- [ ] Static colors (backgrounds, text) use appropriate CSS variables
- [ ] Gradients use CSS variables: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`
- [ ] Used existing design tokens from `design-tokens.scss` where applicable
- [ ] If adding SVG: Updated TypeScript to watch theme changes and update SVG colors
- [ ] Tested with both Blue and Purple themes to ensure colors switch correctly

---

## 🚀 Adding a New Theme

To add a new theme (e.g., "Green"):

### Step 1: Add to Theme Array
File: `src/app/components/app-toolbar/app-toolbar.component.ts`

```typescript
themes: Theme[] = [
  { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { id: 'purple', name: 'Purple', primary: '#a855f7', secondary: '#ec4899' },
  // Add here:
  { id: 'green', name: 'Green', primary: '#10b981', secondary: '#14b8a6' }
];
```

### Step 2: That's It!
The theme selector automatically picks it up and applies colors across the entire site.

---

## 🐛 Troubleshooting

### Colors Not Changing When Switching Themes?

**Checklist:**
1. Are you using hardcoded hex values? → Replace with CSS variables
2. Are you using hardcoded RGB values like `rgba(59, 130, 246, ...)`? → Replace with `rgba(var(--theme-primary-rgb), ...)`
3. Is this an SVG element? → You need to manually update it via TypeScript
4. Are you using SCSS variables with `$primary-blue`? → These now reference CSS variables, should work automatically

### Theme Changes Don't Apply Instantly?

1. Check if SVG gradients need manual updates
2. Check browser DevTools → Elements → Inspect `:root` element
3. Verify CSS variables are being set: `--accent-primary`, `--theme-primary-rgb`, etc.
4. Hard refresh browser (Ctrl+Shift+R)

---

## 📝 Notes for Team

- **Do NOT** create custom color variables. Use the CSS variables provided.
- **Do NOT** hardcode colors. Future theme support depends on this.
- **Test with both themes** before submitting code.
- **Comment component colors** if they use special logic:
  ```scss
  // Uses theme primary color for border, theme secondary for text
  .special-element {
    border-color: var(--accent-primary);
    color: var(--accent-secondary);
  }
  ```

---

## 📚 References

- [Design Tokens](src/app/custom-timeline/design-tokens.scss) - All color definitions and mixins
- [Theme Implementation](THEME_SWITCHING_IMPLEMENTATION.md) - How theming works
- [Toolbar Component](src/app/components/app-toolbar/app-toolbar.component.ts) - Theme switching logic
- [app.scss](src/app/app.scss) - CSS custom properties definitions
