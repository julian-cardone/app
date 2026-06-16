import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, fontFamily, fontSize, lineHeight } from "@/styles/tokens";

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
