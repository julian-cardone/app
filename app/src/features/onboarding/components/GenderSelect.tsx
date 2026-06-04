import { StyleSheet, View } from "react-native";

import { AppText, Chip } from "@/components/ui";
import { spacing } from "@/styles/tokens";

const GENDER_OPTIONS = ["Woman", "Man", "Nonbinary", "Other"] as const;

export type GenderIdentity = (typeof GENDER_OPTIONS)[number];

type GenderSelectProps = {
  value: GenderIdentity | null;
  onSelect: (value: GenderIdentity) => void;
};

export function GenderSelect({ value, onSelect }: GenderSelectProps) {
  return (
    <View style={styles.container}>
      <AppText variant="label">Gender identity</AppText>
      <View style={styles.options}>
        {GENDER_OPTIONS.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={option === value}
            onPress={() => onSelect(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
