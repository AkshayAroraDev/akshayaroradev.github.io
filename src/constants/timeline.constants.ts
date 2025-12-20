/**
 * Timeline Component Constants
 * Centralized configuration values for performance tuning and behavior settings
 */

// ============================================================================
// SCROLL & RESIZE THROTTLING
// ============================================================================
export const SCROLL_THROTTLE_MS = 16;    // ~60fps for smooth scroll animation
export const RESIZE_THROTTLE_MS = 250;   // Less frequent resize handling

// ============================================================================
// PATH GENERATION & TIMING
// ============================================================================
export const PATH_GENERATION_DELAY_MS = 100; // Delay after view init for path generation

// ============================================================================
// BEZIER CURVE PARAMETERS
// ============================================================================
export const Y_OFFSET = -20;             // Path Y offset for dot alignment
export const BEZIER_CONTROL_OFFSET = 60; // Horizontal offset for bezier control points
export const BEZIER_CURVE_DIVISOR = 4;   // Divisor for vertical control point calculation

// ============================================================================
// PROGRESS & HIGHLIGHTING
// ============================================================================
export const PROGRESS_PRECISION = 0.001;        // Minimum progress change to trigger update
export const PROGRESS_HIGHLIGHT_THRESHOLD = 0.85; // Force highlight last item at this progress

// ============================================================================
// SVG DIMENSIONS
// ============================================================================
export const SVG_INITIAL_WIDTH = 100;
export const SVG_INITIAL_HEIGHT = 1000;

// ============================================================================
// COMBINED CONFIGURATION OBJECT
// ============================================================================
export const TIMELINE_CONFIG = {
  scrollThrottle: SCROLL_THROTTLE_MS,
  resizeThrottle: RESIZE_THROTTLE_MS,
  pathGenerationDelay: PATH_GENERATION_DELAY_MS,
  bezier: {
    yOffset: Y_OFFSET,
    controlOffset: BEZIER_CONTROL_OFFSET,
    curveDivisor: BEZIER_CURVE_DIVISOR,
  },
  progress: {
    precision: PROGRESS_PRECISION,
    highlightThreshold: PROGRESS_HIGHLIGHT_THRESHOLD,
  },
  svg: {
    initialWidth: SVG_INITIAL_WIDTH,
    initialHeight: SVG_INITIAL_HEIGHT,
  },
};
