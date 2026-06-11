import type { NavigatorScreenParams } from "@react-navigation/native";

/** The pre-account flow. Discarded from the stack once an account exists. */
export type OnboardingStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  Verify: { phoneNumber: string };
  ProfileSetup: undefined;
};

/**
 * The signed-in app: a bottom-tab navigator modelled on the product prototype. `PostPlan` is the
 * centre action, raised into a FAB by the custom tab bar. The profile-completion banner is shared
 * via a provider around this navigator and rendered by screens themselves, not threaded here.
 */
export type MainTabParamList = {
  Messages: undefined;
  Explore: undefined;
  PostPlan: undefined;
  Discover: undefined;
  Profile: undefined;
};

/** Top-level split: the onboarding flow versus the signed-in app. */
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
