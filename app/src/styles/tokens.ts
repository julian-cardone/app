/**
 * Design tokens — the single source of truth for Placecard's visual language.
 */

export const colors = {
  // Brand teal
  brand: "#1D9E75",
  brandDark: "#0F6E56",
  brandLight: "#E1F5EE",

  // Text
  textPrimary: "#1A3C5E", // primary text / headings
  textSecondary: "#888888", // secondary text
  textTertiary: "#666666", // tertiary / body-on-surface

  // Surfaces
  surface: "#F8FFFE", // app background (off-white with a teal whisper)
  white: "#FFFFFF",
  onBrand: "#FFFFFF", // text/icon color on top of the teal gradient

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
} as const;

export const radii = {
  sm: 10,
  md: 14,
  pill: 999,
} as const;

export const borders = {
  default: 1.5,
} as const;

/**
 * Nunito family keys map to the exact exports from `@expo-google-fonts/nunito`.
 * Loaded once at app bootstrap (see App.tsx). React Native has no font-weight cascade,
 * so weight is selected by picking the right family — not via `fontWeight`.
 */
export const fontFamily = {
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
  wordmark: 34,
  wordmarkLg: 48,
} as const;

/**
 * Shadows must be set per platform: iOS reads `shadow*`, Android renders from `elevation`.
 * Each token bundles both so a single reference renders correctly on every device.
 */
export const shadows = {
  button: {
    shadowColor: colors.brand,
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

// spacing sm is too small and spacing md is too big
export const inputPaddingVertical = spacing.sm + 1;
