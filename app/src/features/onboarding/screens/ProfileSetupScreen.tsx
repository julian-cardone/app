import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, Button, Screen, TextField } from "@/components/ui";
import { spacing } from "@/styles/tokens";

import { DateOfBirthField } from "../components/DateOfBirthField";
import { type GenderIdentity, GenderSelect } from "../components/GenderSelect";
import { MIN_AGE, validateDob } from "../lib/dob";

const MAX_NAME_LENGTH = 50;

/**
 * Fast signup: the smallest set of fields needed to create an account — display name, age,
 * and a soft-filter gender. Everything else (photos, prompts, preferences) is collected later
 * via the profile completion flow. The screen owns its form state and derives validity during
 * render; account creation is the parent's job once the backend exists.
 */
export function ProfileSetupScreen() {
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
    // phone number and route into the app once the backend and home screen exist.
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
