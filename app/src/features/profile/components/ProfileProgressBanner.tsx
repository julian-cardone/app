import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily, fontSize, lineHeight, radii, spacing } from "@/styles/tokens";

import type { ProfileProgress } from "../lib/profileProgress";

/** The thin progress track is purely decorative chrome, so its height stays local. */
const TRACK_HEIGHT = 6;

type Props = {
  progress: ProfileProgress;
  onDismiss: () => void;
};

/**
 * A warm, non-blocking nudge toward finishing the minimum profile. It matches the app
 * background, sits at the top of the screen, and never gates browsing — the member can
 * dismiss it. Presentational only: it renders the progress it is handed and reports a
 * dismiss; deciding whether to show it and what "done" means lives with the screen.
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
          <AppText style={styles.dismissGlyph}>×</AppText>
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
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  message: {
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  dismiss: {
    flexShrink: 0,
    width: spacing.lg,
    height: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissGlyph: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h2,
    lineHeight: fontSize.h2,
    color: colors.muted,
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
    backgroundColor: colors.tealSoft,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.tealPrimary,
  },
  count: {
    flexShrink: 0,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
});
