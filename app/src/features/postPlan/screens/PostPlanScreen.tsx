import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/layout";
import { SCREEN_INSET_MODE } from "@/components/layout/Screen/types";
import { AppText } from "@/components/ui";
import { colors, spacing } from "@/styles/tokens";

export function PostPlanScreen() {
  return (
    <Screen insetMode={SCREEN_INSET_MODE.TOP}>
      <View style={styles.header}>
        <AppText variant="headline">Post a plan</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="body" style={styles.empty}>
          Sharing a plan will live here soon.
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
