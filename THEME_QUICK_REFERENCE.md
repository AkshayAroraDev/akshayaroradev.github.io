# Quick Reference - Scalable Theme System

## 🎯 Adding a New Theme (30 seconds)

```typescript
// src/app/constants/themes.ts
export const THEMES: Record<string, Theme> = {
  blue: { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  purple: { id: 'purple', name: 'Purple', primary: '#a855f7', secondary: '#ec4899' },
  
  // 👇 Add your new theme here
  green: { id: 'green', name: 'Green', primary: '#10b981', secondary: '#14b8a6' }
};
```

That's it! Your theme now appears in the toolbar selector and works everywhere.

---

## 🎨 Using Colors in SCSS

### For Static Colors
```scss
// Use CSS variables
background: var(--accent-primary);
color: var(--accent-secondary);
border: 1px solid var(--text-primary);
```

### For Transparent Colors (rgba)
```scss
// CORRECT - Uses CSS variables
box-shadow: 0 0 20px rgba(var(--theme-primary-rgb), 0.3);
border: 1px solid rgba(var(--theme-secondary-rgb), 0.25);

// WRONG - Hardcoded values ❌
box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
```

### For Gradients
```scss
// CORRECT
background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));

// WRONG ❌
background: linear-gradient(135deg, #3b82f6, #06b6d4);
```

---

## ⚙️ Using Theme in TypeScript

### Inject ThemeService
```typescript
import { ThemeService } from './services/theme.service';

constructor(private themeService: ThemeService) {}
```

### Get Current Theme
```typescript
const currentTheme = this.themeService.getCurrentTheme();
console.log(currentTheme.primary); // "#3b82f6"
```

### Subscribe to Changes
```typescript
this.themeService.currentTheme$.subscribe(theme => {
  console.log('Theme changed to:', theme.id);
  // Component automatically updates via CSS variables
});
```

### Switch Theme
```typescript
this.themeService.switchTheme('purple');
// Or pass Theme object
this.themeService.switchTheme(themeObject);
```

---

## 🛠️ Using Color Utilities

### In TypeScript Components
```typescript
import { hexToRgbString, hexToRgb, getThemeColorsFromCSS } from './utils/color.utils';

// Get current theme colors from CSS
const { primary, secondary } = getThemeColorsFromCSS();

// Convert hex to RGB string for rgba()
const primaryRgb = hexToRgbString('#3b82f6'); // "59,130,246"
const gradientColor = `rgba(${primaryRgb}, 0.5)`; // "rgba(59,130,246, 0.5)"

// Convert hex to RGB object
const rgb = hexToRgb('#3b82f6'); // { r: 59, g: 130, b: 246 }
```

---

## ✅ Checklist for New Features

When adding colors to a new component:

- [ ] Use CSS variables in SCSS, not hardcoded hex colors
- [ ] For rgba, use `rgba(var(--theme-primary-rgb), opacity)`
- [ ] For gradients, use `var(--accent-primary)` and `var(--accent-secondary)`
- [ ] If you need hex in TypeScript, read from `getThemeColorsFromCSS()`
- [ ] Never hardcode colors like `#3b82f6` or `rgba(59, 130, 246, ...)`
- [ ] Test theme switching works (click theme dots in toolbar)

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `constants/themes.ts` | Theme definitions (add new themes here) |
| `services/theme.service.ts` | Theme management & switching |
| `utils/color.utils.ts` | Color conversion utilities |
| `app.ts` | Initializes theme on app startup |
| `app-toolbar.component.ts` | Theme selector UI |

---

## 🎯 Common Tasks

### Task: Add a new color theme
1. Edit `src/app/constants/themes.ts`
2. Add new theme object to `THEMES`
3. Done! ✅

### Task: Change primary colors globally
1. Edit theme in `src/app/constants/themes.ts`
2. All components automatically update ✅

### Task: Use theme in a new component
1. Inject `ThemeService`: `constructor(private themeService: ThemeService) {}`
2. Read colors via: `this.themeService.getCurrentTheme()`
3. Or subscribe: `this.themeService.currentTheme$.subscribe(...)`
4. Use CSS variables in SCSS ✅

### Task: Create a dynamic gradient based on theme
```typescript
import { getThemeColorsFromCSS } from './utils/color.utils';

const { primary, secondary } = getThemeColorsFromCSS();
element.style.backgroundImage = `linear-gradient(135deg, ${primary}, ${secondary})`;
```

---

## 🚀 Current Themes

| Theme | Primary | Secondary |
|-------|---------|-----------|
| Blue | `#3b82f6` | `#06b6d4` |
| Purple | `#a855f7` | `#ec4899` |

Add more by editing `constants/themes.ts`!

---

## 📊 CSS Variables Available

```css
/* Theme Colors */
--accent-primary        /* Main theme color */
--accent-secondary      /* Secondary theme color */

/* For rgba() usage */
--theme-primary-rgb     /* RGB values: "59,130,246" */
--theme-secondary-rgb   /* RGB values: "6,182,212" */

/* Static Colors */
--text-primary          /* Primary text color */
--text-secondary        /* Secondary text color */
--bg-primary            /* Background color */
--bg-secondary          /* Secondary background */
```

---

## ⚠️ Common Mistakes

### ❌ Hardcoding hex colors
```scss
// BAD
background: linear-gradient(135deg, #3b82f6, #06b6d4);
color: #3b82f6;
```

### ✅ Using CSS variables
```scss
// GOOD
background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
color: var(--accent-primary);
```

### ❌ Reading theme from localStorage directly
```typescript
// BAD
const theme = localStorage.getItem('theme');
```

### ✅ Using ThemeService
```typescript
// GOOD
const theme = this.themeService.getCurrentTheme();
```

---

**Questions?** See `SCALABLE_THEME_SYSTEM.md` for detailed documentation.
