import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/layout";
import { SCREEN_INSET_MODE } from "@/components/layout/Screen/types";
import { AppText } from "@/components/ui";
import { ProfileCompletionBanner } from "@/features/profile";
import { spacing } from "@/styles/tokens";

/**
 * New members land here straight after fast signup. They can browse, but the feed is
 * empty for now — plans, hosting, and matching arrive in later issues.
 *
 * The completion banner is a connected component sharing state via ProfileCompletionProvider, so a
 * dismiss persists as the member moves between screens. The screen owns its safe area through
 * `Screen`; the banner sits in the already-safe content area.
 */
export function DiscoverScreen() {
  return (
    <Screen insetMode={SCREEN_INSET_MODE.TOP}>
      <ProfileCompletionBanner />

      <View style={styles.header}>
        <AppText variant="headline">Discover</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="subhead" style={styles.empty}>
          Plans near you will show up here soon.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
  },
});
