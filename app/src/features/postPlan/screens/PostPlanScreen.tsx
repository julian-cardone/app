import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/layout";
import { SCREEN_INSET_MODE } from "@/components/layout/Screen/types";
import { AppText } from "@/components/ui";
import { spacing } from "@/styles/tokens";

/**
 * Reached from the centre action of the bottom nav. The type selector and plan form from the
 * prototype arrive in a later issue — for now this is an empty placeholder so the action has a
 * destination. The screen owns its safe area through `Screen`.
 */
export function PostPlanScreen() {
  return (
    <Screen insetMode={SCREEN_INSET_MODE.TOP}>
      <View style={styles.header}>
        <AppText variant="headline">Post a plan</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="subhead" style={styles.empty}>
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
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
  },
});
