/**
 * Color Utilities
 * Reusable color conversion functions
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB object
 * @param hex - Hex color (e.g., '#3b82f6' or '3b82f6')
 * @returns RGB object or default blue if invalid
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
  // Default fallback to blue
  return { r: 59, g: 130, b: 246 };
}

/**
 * Convert hex color to RGB string format (for rgba usage)
 * @param hexOrRgb - Hex color or RGB string
 * @returns RGB string (e.g., '59,130,246')
 */
export function hexToRgbString(hexOrRgb: string): string {
  // If already RGB, extract the values
  if (hexOrRgb.includes('rgb')) {
    return hexOrRgb.replace(/[rgb()]/g, '').replace(/\s/g, '');
  }

  // Convert hex to RGB
  const rgb = hexToRgb(hexOrRgb);
  return `${rgb.r},${rgb.g},${rgb.b}`;
}

/**
 * Apply theme colors to root CSS variables
 * @param primary - Primary theme color (hex)
 * @param secondary - Secondary theme color (hex)
 */
export function applyThemeCSSVariables(primary: string, secondary: string): void {
  const root = document.documentElement;

  // Set hex colors
  root.style.setProperty('--accent-primary', primary);
  root.style.setProperty('--accent-secondary', secondary);

  // Convert and set RGB versions for rgba() usage
  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);

  root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`);
  root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`);
}

/**
 * Get theme colors from CSS variables
 * Falls back to reading from DOM computed styles
 */
export function getThemeColorsFromCSS(): { primary: string; secondary: string } {
  const root = document.documentElement;
  const primary = getComputedStyle(root).getPropertyValue('--accent-primary')?.trim() || '#3b82f6';
  const secondary = getComputedStyle(root).getPropertyValue('--accent-secondary')?.trim() || '#06b6d4';

  return { primary, secondary };
}
