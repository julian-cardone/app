import { Linking, StyleSheet, Text } from "react-native";

import { colors, fontFamily, fontSize, lineHeight } from "@/styles/tokens";

// Placeholder destinations until the real legal pages exist.
const TERMS_URL = "https://placecard.app/terms";
const PRIVACY_URL = "https://placecard.app/privacy";

/**
 * The fine print beneath the phone-entry CTA. Owns opening the legal links, which is why
 * it is a small feature component rather than inline markup.
 */
export function TermsFootnote() {
  return (
    <Text style={styles.text}>
      By continuing you agree to our{" "}
      <Text style={styles.link} onPress={() => Linking.openURL(TERMS_URL)}>
        Terms
      </Text>{" "}
      and{" "}
      <Text style={styles.link} onPress={() => Linking.openURL(PRIVACY_URL)}>
        Privacy Policy
      </Text>
      .
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    color: colors.muted,
    textAlign: "center",
  },
  link: {
    fontFamily: fontFamily.bold,
    color: colors.tealDeep,
  },
});
