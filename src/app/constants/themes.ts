/**
 * Theme Configuration
 * Centralized theme definitions for scalable theme management
 * Add new themes here - all components will automatically support them!
 */

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

export const THEMES: Record<string, Theme> = {
  blue_professional: {
    id: 'blue_professional',
    name: 'Blue Professional',
    primary: '#0284c7',
    secondary: '#0ea5e9'
  },
  blue_vibrant: {
    id: 'blue_vibrant',
    name: 'Blue Vibrant',
    primary: '#2563eb',
    secondary: '#0ea5e9'
  },
  blue_electric: {
    id: 'blue_electric',
    name: 'Blue Electric',
    primary: '#0ea5e9',
    secondary: '#06d6ff'
  },
  blue_classic: {
    id: 'blue_classic',
    name: 'Blue Classic',
    primary: '#1e40af',
    secondary: '#0284c7'
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    primary: '#8b5cf6',
    secondary: '#d946ef'
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    primary: '#f97316',
    secondary: '#fb923c'
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    primary: '#eab308',
    secondary: '#fbbf24'
  },
  green: {
    id: 'green',
    name: 'Green',
    primary: '#22c55e',
    secondary: '#4ade80'
  }
  // 🚀 To add a new theme:
  // green: {
  //   id: 'green',
  //   name: 'Green',
  //   primary: '#10b981',
  //   secondary: '#14b8a6'
  // }
};

export const DEFAULT_THEME_ID = 'blue_vibrant';

export const THEME_LIST = Object.values(THEMES);

export function getThemeById(id: string): Theme {
  return THEMES[id] || THEMES[DEFAULT_THEME_ID];
}
