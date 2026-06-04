import { StyleSheet, View } from "react-native";

import { AppText, Screen } from "@/components/ui";
import { spacing } from "@/styles/tokens";

/**
 * Browse plans by neighbourhood, time, and type. The list, filters, and "tonight" sections
 * from the prototype arrive in later issues — for now this is an empty placeholder so the
 * bottom-nav tab has a destination. The screen owns its safe area through `Screen`.
 */
export function ExploreScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="headline">Explore</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="subhead" style={styles.empty}>
          Plans to explore will show up here soon.
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
