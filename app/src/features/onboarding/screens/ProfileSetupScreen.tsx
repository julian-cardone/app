import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { AppText, Button, Screen, TextField } from "@/components/ui";
import type { OnboardingStackParamList, RootStackParamList } from "@/navigation/types";
import { spacing } from "@/styles/tokens";

import { DateOfBirthField } from "../components/DateOfBirthField";
import { type GenderIdentity, GenderSelect } from "../components/GenderSelect";
import { MIN_AGE, validateDob } from "../lib/dob";

type Props = NativeStackScreenProps<OnboardingStackParamList, "ProfileSetup">;

const MAX_NAME_LENGTH = 50;

/**
 * Fast signup: the smallest set of fields needed to create an account — display name, age,
 * and a soft-filter gender. Everything else (photos, prompts, preferences) is collected later
 * via the profile completion flow. The screen owns its form state and derives validity during
 * render; account creation is the parent's job once the backend exists.
 */
export function ProfileSetupScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<GenderIdentity | null>(null);

  const trimmedName = firstName.trim();
  const dob = validateDob(dateOfBirth);
  const dobError =
    dob.isComplete && !dob.isValid
      ? `Enter a valid date — you must be at least ${MIN_AGE}.`
      : undefined;
  const canSubmit = trimmedName.length > 0 && dob.isValid && gender !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: create the account with { firstName, dateOfBirth, gender } plus the verified
    // phone number once the backend exists. Replacing the root Onboarding route with Main
    // discards the whole onboarding stack so the member can't swipe back into signup.
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.replace("Main", { screen: "Discover" });
  };

  return (
    <Screen scroll keyboardAware contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="headline">Tell us about you</AppText>
        <AppText variant="subhead">Just the basics — you can finish your profile later.</AppText>
      </View>

      <View style={styles.form}>
        <TextField
          label="First name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          maxLength={MAX_NAME_LENGTH}
          returnKeyType="next"
        />
        <DateOfBirthField value={dateOfBirth} onChangeText={setDateOfBirth} error={dobError} />
        <GenderSelect value={gender} onSelect={setGender} />
      </View>

      <View style={styles.footer}>
        <Button title="Create account" onPress={handleSubmit} disabled={!canSubmit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: "auto",
  },
});
