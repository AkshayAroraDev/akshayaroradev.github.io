# Developer Onboarding Checklist

## For New Team Members

When working with the theme system, follow this checklist:

### Understanding the Architecture
- [ ] Read `SCALABLE_THEME_SYSTEM.md` for complete overview
- [ ] Skim `THEME_QUICK_REFERENCE.md` for quick lookup
- [ ] Review `src/app/constants/themes.ts` to see how themes are defined
- [ ] Check `src/app/services/theme.service.ts` to understand theme management

### Adding Colors to Existing Component
- [ ] Identify the component that needs color
- [ ] In SCSS: Use `var(--accent-primary)` or `var(--accent-secondary)`
- [ ] For rgba: Use `rgba(var(--theme-primary-rgb), opacity)`
- [ ] Never hardcode hex colors like `#3b82f6`
- [ ] Test by switching themes in toolbar

### Adding a New Component with Theme Support
1. **In Component Class:**
   ```typescript
   import { ThemeService } from './services/theme.service';
   constructor(private themeService: ThemeService) {}
   ```

2. **In Component SCSS:**
   ```scss
   // Use CSS variables, NOT hardcoded colors
   background: var(--accent-primary);
   border: 1px solid rgba(var(--theme-primary-rgb), 0.25);
   ```

3. **Test:**
   - [ ] Click theme selector dots
   - [ ] Verify colors change instantly
   - [ ] Refresh page, verify theme persists

### Adding a New Theme
1. **Edit** `src/app/constants/themes.ts`
2. **Add** new theme object to `THEMES`:
   ```typescript
   green: { id: 'green', name: 'Green', primary: '#10b981', secondary: '#14b8a6' }
   ```
3. **Test:**
   - [ ] New theme appears in toolbar
   - [ ] Clicking theme dot applies colors
   - [ ] Refresh page, theme persists
   - [ ] All components use new colors

### Code Review Checklist
When reviewing PR changes to components:
- [ ] No hardcoded hex colors (e.g., `#3b82f6`)
- [ ] No hardcoded RGB values (e.g., `rgba(59, 130, 246, ...)`)
- [ ] All colors use CSS variables or ThemeService
- [ ] Component uses `hexToRgbString()` if converting colors in TypeScript
- [ ] SCSS uses `rgba(var(--theme-primary-rgb), opacity)` pattern

### Testing Requirements
- [ ] Switching between themes works smoothly
- [ ] Color changes apply instantly (no page refresh needed)
- [ ] Theme persists after page reload
- [ ] All components show correct theme colors
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari, Edge

### Common Questions

**Q: Should I import theme definitions in my component?**
A: No! Use `ThemeService` instead. Never import `THEMES` directly.

**Q: How do I access theme colors in TypeScript?**
A: Use `ThemeService.getCurrentTheme()` or subscribe to `currentTheme$`

**Q: My SCSS gradient isn't updating when theme changes?**
A: Make sure you're using CSS variables, not hardcoded colors. Example:
```scss
// ❌ Wrong - won't update
background: linear-gradient(135deg, #3b82f6, #06b6d4);

// ✅ Correct - will update
background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
```

**Q: Can users create custom themes?**
A: Currently no, but infrastructure is in place. See "Future Enhancements" section in `THEME_REFACTOR_SUMMARY.md`

**Q: How many themes can we support?**
A: Unlimited! Each theme is just one object in the `THEMES` record. No code changes needed beyond that.

**Q: What if I need a color that isn't primary or secondary?**
A: You have options:
1. Use `rgba(var(--theme-primary-rgb), opacity)` at different opacities
2. Define a new theme color pair in `THEMES` and add CSS variables
3. Use static colors that don't change with theme (background, text, etc.)

---

## Files You'll Likely Work With

| File | When to Edit | Purpose |
|------|--------------|---------|
| `constants/themes.ts` | Adding new themes | Theme definitions |
| `services/theme.service.ts` | Rarely (if changing switch logic) | Theme management |
| `utils/color.utils.ts` | Rarely (if adding color functions) | Color conversion |
| Component `.scss` files | Adding colors to component | All colors go here |
| Component `.ts` files | Need reactive theme updates | Subscribe to `currentTheme$` |

---

## DO's and DON'Ts

### ✅ DO
```typescript
// Import and use ThemeService
import { ThemeService } from './services/theme.service';
constructor(private themeService: ThemeService) {}
const theme = this.themeService.getCurrentTheme();
```

```scss
// Use CSS variables
background: var(--accent-primary);
color: var(--text-primary);
border: 1px solid rgba(var(--theme-primary-rgb), 0.25);
```

```typescript
// Use utilities for conversion
import { hexToRgbString } from './utils/color.utils';
const rgb = hexToRgbString('#3b82f6'); // "59,130,246"
```

### ❌ DON'T
```typescript
// Don't read localStorage directly
const theme = localStorage.getItem('theme'); // ❌ Wrong

// Don't import THEMES directly
import { THEMES } from './constants/themes'; // ❌ Wrong
```

```scss
// Don't hardcode colors
background: #3b82f6; // ❌ Won't update with theme
color: #06b6d4; // ❌ Won't update with theme
border: 1px solid rgba(59, 130, 246, 0.25); // ❌ Won't update
```

---

## Troubleshooting

### Issue: "Theme color not changing in my component"
**Solution:** Check that:
1. You're using CSS variables in SCSS (not hardcoded hex)
2. CSS variables are applied to :root (check DevTools)
3. Component doesn't override with hardcoded colors
4. Browser cache cleared (Ctrl+Shift+Delete)

### Issue: "MutationObserver warning in console"
**Solution:** Component is watching style changes correctly. This is expected behavior. If performance is poor:
1. Check that MutationObserver is disconnected in `ngOnDestroy`
2. Consider throttling updates with RxJS `debounceTime()`

### Issue: "Theme works on initial load but not after switching"
**Solution:** 
1. Verify localStorage is being updated: `localStorage.getItem('theme')` in console
2. Check that ThemeService `switchTheme()` is being called
3. Ensure CSS variables updated on :root (check DevTools > Elements > :root styles)

### Issue: "Colors showing default blue even though purple is selected"
**Solution:**
1. Check localStorage: `localStorage.setItem('theme', 'purple')`
2. Hard refresh: Ctrl+Shift+R
3. Verify theme colors in CSS variables in DevTools
4. Check that component isn't overriding with hardcoded colors

---

## Performance Tips

1. **Don't** create new MutationObservers in every component
   - Only hero and timeline need it for gradient updates
   - Most components use CSS variables which auto-update

2. **Do** unsubscribe from observables in `ngOnDestroy`
   ```typescript
   ngOnDestroy() {
     this.subscription?.unsubscribe();
     this.observer?.disconnect();
   }
   ```

3. **Use** OnPush change detection where possible
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

---

## Resources

- **Architecture**: See `SCALABLE_THEME_SYSTEM.md`
- **Quick Reference**: See `THEME_QUICK_REFERENCE.md`
- **Implementation**: See `THEME_REFACTOR_SUMMARY.md`
- **Service Code**: `src/app/services/theme.service.ts`
- **Utilities**: `src/app/utils/color.utils.ts`
- **Examples**: `src/app/components/app-hero/app-hero.component.ts`

---

## When You're Done

After implementing theme support in your component:

- [ ] All colors use CSS variables
- [ ] No hardcoded hex or RGB values
- [ ] Theme switching works (visible color change)
- [ ] Theme persists on page reload
- [ ] No console errors
- [ ] Tested in at least 2 browsers
- [ ] Code reviewed by another developer
- [ ] PR description mentions "Theme System" for easy reference

---

## Questions?

1. Check `THEME_QUICK_REFERENCE.md` for quick answers
2. Read `SCALABLE_THEME_SYSTEM.md` for detailed explanations
3. Review `app-hero.component.ts` for implementation example
4. Ask team lead or check git history for context

Happy theming! 🎨
