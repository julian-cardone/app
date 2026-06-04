import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, fontFamily, fontSize, lineHeight } from "@/styles/tokens";

type AppTextProps = TextProps & {
  variant?: "headline" | "subhead" | "label";
};

export function AppText({ variant = "subhead", style, ...props }: AppTextProps) {
  return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.ink,
  },

  headline: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
  },

  subhead: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.muted,
  },

  label: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.ink,
  },
});
