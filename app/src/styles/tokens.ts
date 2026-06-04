/**
 * Design tokens — the single source of truth for Placecard's visual language.
 *
 * Values are derived from the product prototype: brand teal, navy ink, an off-white
 * surface, generous rounding, and Nunito type. Components reference these tokens rather
 * than hardcoding values, so the brand can evolve in one place as the app grows.
 *
 * This module defines the core brand spine plus what the onboarding flow uses today.
 * Accent families (amber/purple/coral) from the prototype are intentionally deferred
 * until a feature needs them, to keep the palette honest.
 */

export const colors = {
  // Brand teal
  tealPrimary: "#1D9E75",
  tealDeep: "#0F6E56",
  tealSoft: "#E1F5EE",
  mint: "#9FE1CB",

  // Gradient stops for the primary CTA (135°)
  gradientStart: "#1D9E75",
  gradientEnd: "#0F6E56",

  // Text
  ink: "#1A3C5E", // primary text / headings
  muted: "#888888", // secondary text
  subtle: "#666666", // tertiary / body-on-surface

  // Surfaces
  surface: "#F8FFFE", // app background (off-white with a teal whisper)
  white: "#FFFFFF",
  onTeal: "#FFFFFF", // text/icon color on top of the teal gradient

  // Lines
  border: "#E5E5E5",

  // Feedback
  danger: "#D64545", // validation errors and destructive states
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  input: 10,
  button: 14,
  card: 16,
  lg: 24,
  pill: 999,
} as const;

/**
 * Nunito family keys map to the exact exports from `@expo-google-fonts/nunito`.
 * Loaded once at app bootstrap (see App.tsx). React Native has no font-weight cascade,
 * so weight is selected by picking the right family — not via `fontWeight`.
 */
export const fontFamily = {
  regular: "Nunito_400Regular",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
  black: "Nunito_900Black",
} as const;

export const fontSize = {
  caption: 12,
  body: 15,
  h2: 20,
  h1: 26,
  wordmark: 30,
  wordmarkLg: 44,
} as const;

export const lineHeight = {
  caption: 18,
  body: 22,
  h2: 26,
  h1: 32,
} as const;

/**
 * Shadows must be set per platform: iOS reads `shadow*`, Android renders from `elevation`.
 * Each token bundles both so a single reference renders correctly on every device.
 */
export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  buttonTeal: {
    shadowColor: colors.tealPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const animation = {
  splashMinMs: 1000,
  splashEnterMs: 600,
} as const;
