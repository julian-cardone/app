export const SCREEN_INSET_MODE = {
  TOP: "top",
  BOTTOM: "bottom",
  BOTH: "both",
  NONE: "none",
} as const;

export type ScreenInsetMode = (typeof SCREEN_INSET_MODE)[keyof typeof SCREEN_INSET_MODE];
