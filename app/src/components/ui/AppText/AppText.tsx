import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, fontFamily, fontSize, lineHeight } from "@/styles/tokens";

/**
 * Shared typography primitive. Variants control font family, size, and line height only —
 * text color is intentionally left out, since color is contextual and should be set
 * per call site (via `style`) rather than baked into a variant.
 */
type AppTextProps = TextProps & {
  variant?: "headline" | "body" | "label" | "caption" | "button";
};

export function AppText({ variant = "body", style = "", ...props }: AppTextProps) {
  return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },

  headline: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
  },

  body: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },

  label: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },

  caption: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },

  button: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
});
