import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/layout";
import { SCREEN_INSET_MODE } from "@/components/layout/Screen/types";
import { AppText } from "@/components/ui";
import { ProfileCompletionBanner } from "@/features/profile";
import { colors, spacing } from "@/styles/tokens";

export function DiscoverScreen() {
  return (
    <Screen insetMode={SCREEN_INSET_MODE.TOP}>
      <ProfileCompletionBanner />

      <View style={styles.header}>
        <AppText variant="headline">Discover</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="body" style={styles.empty}>
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
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: colors.textSecondary,
  },
});
