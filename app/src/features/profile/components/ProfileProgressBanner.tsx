import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily, fontSize, lineHeight, radii, spacing } from "@/styles/tokens";

import type { ProfileProgress } from "../lib/profileProgress";

/** The thin progress track is purely decorative chrome, so its height stays local. */
const TRACK_HEIGHT = 6;
const DISMISS_GLYPH = "×";

type Props = {
  progress: ProfileProgress;
  onDismiss: () => void;
};

/**
 * A warm, non-blocking nudge toward finishing the minimum profile.
 */
export function ProfileProgressBanner({ progress, onDismiss }: Props) {
  const { ratio, completed, total, nextStep } = progress;
  const message = nextStep?.nudge ?? "Your profile is all set.";

  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <AppText variant="label">Complete your profile</AppText>
          <AppText variant="subhead" style={styles.message}>
            {message}
          </AppText>
        </View>

        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={spacing.sm}
          style={styles.dismiss}
        >
          <AppText style={styles.dismissGlyph}>{DISMISS_GLYPH}</AppText>
        </Pressable>
      </View>

      <View style={styles.progressRow}>
        <View
          style={styles.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: completed }}
        >
          <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
        </View>
        <AppText variant="subhead" style={styles.count}>
          {completed} of {total}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
  },
  copy: {
    flex: 1,
  },
  message: {
    fontSize: fontSize.caption,
  },
  dismiss: {
    width: spacing.lg,
    height: spacing.lg,
    alignItems: "center",
  },
  dismissGlyph: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h2,
    lineHeight: lineHeight.h2,
    color: colors.textSecondary,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.brandLight,
  },
  fill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.brand,
  },
  count: {
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
});
