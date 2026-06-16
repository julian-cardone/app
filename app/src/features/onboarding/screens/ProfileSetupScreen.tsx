import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { Screen } from "@/components/layout";
import { AppText, Button, TextField } from "@/components/ui";
import { MAIN_TAB_ROUTES, type ONBOARDING_ROUTES, ROOT_ROUTES } from "@/navigation/routes";
import type { OnboardingStackParamList, RootStackParamList } from "@/navigation/types";
import { spacing } from "@/styles/tokens";

import { DateOfBirthField } from "../components/DateOfBirthField";
import { type GenderIdentity, GenderSelect } from "../components/GenderSelect";
import { MIN_AGE, validateDob } from "../lib/dob";

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  typeof ONBOARDING_ROUTES.PROFILE_SETUP
>;

const MAX_NAME_LENGTH = 50;

/**
 * Fast signup: the smallest set of fields needed to create an account — display name, age,
 * and a soft-filter gender. Everything else (photos, prompts, preferences) is collected later
 * via the profile completion flow.
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
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.replace(ROOT_ROUTES.MAIN, { screen: MAIN_TAB_ROUTES.DISCOVER });
  };

  return (
    <Screen keyboardAware scroll>
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
          returnKeyType="done"
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
  header: {
    gap: spacing.sm,
    paddingTop: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: "auto",
  },
});
