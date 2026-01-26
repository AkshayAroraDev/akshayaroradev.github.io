import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { THEMES, getThemeById, DEFAULT_THEME_ID, THEME_LIST, Theme } from '../constants/themes';
import { applyThemeCSSVariables } from '../utils/color.utils';

/**
 * Theme Management Service
 * Centralized service for theme switching and management
 * Automatically applies theme to all components through CSS variables
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>(this.loadInitialTheme());
  
  // Public observable for components to subscribe to theme changes
  public currentTheme$: Observable<Theme> = this.currentThemeSubject.asObservable();

  // Expose available themes
  public themes = THEME_LIST;

  constructor() {
    // Apply the initial theme to CSS variables
    this.applyTheme(this.currentThemeSubject.value);
  }

  /**
   * Load theme from localStorage or return default
   */
  private loadInitialTheme(): Theme {
    const savedThemeId = localStorage.getItem('theme') || DEFAULT_THEME_ID;
    return getThemeById(savedThemeId);
  }

  /**
   * Get current theme (synchronous)
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Switch to a different theme
   * @param theme - Theme object or theme ID
   */
  switchTheme(theme: Theme | string): void {
    const themeToApply = typeof theme === 'string' ? getThemeById(theme) : theme;
    
    // Update localStorage
    localStorage.setItem('theme', themeToApply.id);

    // Apply theme to CSS variables
    this.applyTheme(themeToApply);

    // Update BehaviorSubject to notify all subscribers
    this.currentThemeSubject.next(themeToApply);

    // Emit a custom event for components using MutationObserver
    this.notifyThemeChanged();
  }

  /**
   * Apply theme colors to CSS variables
   * This is what makes all components update their colors
   */
  private applyTheme(theme: Theme): void {
    applyThemeCSSVariables(theme.primary, theme.secondary);
  }

  /**
   * Notify components about theme change via DOM mutation
   * Used by components that watch style attribute changes
   */
  private notifyThemeChanged(): void {
    const root = document.documentElement;
    // Trigger a small change to notify MutationObservers
    root.style.setProperty('--_theme-notify', Date.now().toString());
  }

  /**
   * Check if a theme ID exists
   */
  hasTheme(themeId: string): boolean {
    return !!THEMES[themeId];
  }

  /**
   * Get all available themes
   */
  getAllThemes(): Theme[] {
    return THEME_LIST;
  }
}
