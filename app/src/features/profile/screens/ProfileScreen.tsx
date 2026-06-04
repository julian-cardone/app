import { StyleSheet, View } from "react-native";

import { AppText, Screen } from "@/components/ui";
import { spacing } from "@/styles/tokens";

/**
 * The member's own profile. Editing, prompts, and photos arrive in later issues — for now this
 * is an empty placeholder so the bottom-nav tab has a destination. The screen owns its safe area
 * through `Screen`.
 */
export function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="headline">Profile</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="subhead" style={styles.empty}>
          Your profile will live here soon.
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
