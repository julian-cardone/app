import { type StyleProp, StyleSheet, Text, type TextStyle } from "react-native";

import { colors, fontFamily, fontSize } from "@/styles/tokens";

const WORDMARK_LETTER_SPACING = -0.5;

type WordmarkProps = {
  /** `splash` is the large centered brand moment; `compact` sits at the top of a screen. */
  size?: "splash" | "compact";
  style?: StyleProp<TextStyle>;
};

/**
 * The Placecard brand wordmark, rendered as text (per the brand spec — no logo image).
 * A domain-agnostic primitive: it owns only how the name looks, never layout or position.
 */
export function Wordmark({ size = "compact", style }: WordmarkProps) {
  const sizeStyle = size === "splash" ? styles.splash : styles.compact;
  return <Text style={[styles.base, sizeStyle, style]}>placecard</Text>;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.black,
    color: colors.ink,
    letterSpacing: WORDMARK_LETTER_SPACING,
  },
  splash: {
    fontSize: fontSize.wordmarkLg,
  },
  compact: {
    fontSize: fontSize.wordmark,
  },
});
