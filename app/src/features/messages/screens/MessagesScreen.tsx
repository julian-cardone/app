import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/layout";
import { SCREEN_INSET_MODE } from "@/components/layout/Screen/types";
import { AppText } from "@/components/ui";
import { spacing } from "@/styles/tokens";

/**
 * Conversations with people from shared plans. Threads, tabs, and unread state from the
 * prototype arrive once matching and messaging land — for now this is an empty placeholder
 * so the bottom-nav tab has a destination. The screen owns its safe area through `Screen`.
 */
export function MessagesScreen() {
  return (
    <Screen insetMode={SCREEN_INSET_MODE.TOP}>
      <View style={styles.header}>
        <AppText variant="headline">Messages</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="subhead" style={styles.empty}>
          Your conversations will appear here soon.
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
