import { Linking, StyleSheet, Text } from "react-native";

import { externalLinks } from "@/config/links";
import { colors, fontFamily, fontSize, lineHeight } from "@/styles/tokens";

const handleTermsPress = () => {
  void Linking.openURL(externalLinks.terms);
};

const handlePrivacyPress = () => {
  void Linking.openURL(externalLinks.privacy);
};

/**
 * The fine print beneath the phone-entry CTA. Owns opening the legal links, which is why
 * it is a small feature component rather than inline markup.
 */
export function TermsFootnote() {
  return (
    <Text style={styles.text}>
      By continuing you agree to our{" "}
      <Text accessibilityRole="link" style={styles.link} onPress={handleTermsPress}>
        Terms
      </Text>{" "}
      and{" "}
      <Text accessibilityRole="link" style={styles.link} onPress={handlePrivacyPress}>
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
    color: colors.textSecondary,
    textAlign: "center",
  },
  link: {
    fontFamily: fontFamily.bold,
    color: colors.brandDark,
  },
});
