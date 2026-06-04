import type { NavigatorScreenParams } from "@react-navigation/native";

/** The pre-account flow. Discarded from the stack once an account exists. */
export type OnboardingStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  Verify: { phoneNumber: string };
  ProfileSetup: undefined;
};

/**
 * The signed-in app. A native stack for now (Discover only); it becomes a tab navigator
 * once Chat/Profile arrive. The profile-completion banner lives in the Main shell above
 * this navigator, not in any single screen here.
 */
export type MainStackParamList = {
  Discover: undefined;
};

/** Top-level split: the onboarding flow versus the signed-in app. */
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
