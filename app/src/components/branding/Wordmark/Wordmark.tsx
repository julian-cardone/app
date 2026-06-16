import { StyleSheet, Text } from "react-native";

import { colors, fontFamily, fontSize } from "@/styles/tokens";

const WORDMARK_LETTER_SPACING = -0.5;

// no 'style' prop: if a consumer changes the style, then it isn't a wordmark anymore.
type WordmarkProps = {
  size?: "splash" | "compact";
};

/**
 * The Placecard brand wordmark, rendered as text (per the brand spec — no logo image).
 */
export function Wordmark({ size = "compact" }: WordmarkProps) {
  const sizeStyle = size === "splash" ? styles.splash : styles.compact;
  return <Text style={[styles.base, sizeStyle]}>placecard</Text>;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.black,
    color: colors.textPrimary,
    letterSpacing: WORDMARK_LETTER_SPACING,
  },
  splash: {
    fontSize: fontSize.wordmarkLg,
  },
  compact: {
    fontSize: fontSize.wordmark,
  },
});
