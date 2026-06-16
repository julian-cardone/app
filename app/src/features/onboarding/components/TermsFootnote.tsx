import { Linking, StyleSheet, Text } from "react-native";

import { AppText } from "@/components/ui/AppText/AppText";
import { externalLinks } from "@/config/links";
import { colors, fontFamily } from "@/styles/tokens";

const handleTermsPress = () => {
  void Linking.openURL(externalLinks.terms);
};

const handlePrivacyPress = () => {
  void Linking.openURL(externalLinks.privacy);
};

/**
 * The fine print beneath the phone-entry CTA.
 */
export function TermsFootnote() {
  return (
    <AppText variant="caption" style={styles.text}>
      By continuing you agree to our{" "}
      <Text accessibilityRole="link" style={styles.link} onPress={handleTermsPress}>
        Terms
      </Text>{" "}
      and{" "}
      <Text accessibilityRole="link" style={styles.link} onPress={handlePrivacyPress}>
        Privacy Policy
      </Text>
      .
    </AppText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textSecondary,
    textAlign: "center",
  },
  link: {
    fontFamily: fontFamily.bold,
    color: colors.brandDark,
  },
});
