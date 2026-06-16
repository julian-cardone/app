import type { NavigatorScreenParams } from "@react-navigation/native";

import type { MAIN_TAB_ROUTES, ONBOARDING_ROUTES, ROOT_ROUTES } from "./routes";

/** The pre-account flow. Discarded from the stack once an account exists. */
export type OnboardingStackParamList = {
  [ONBOARDING_ROUTES.SPLASH]: undefined;
  [ONBOARDING_ROUTES.PHONE_ENTRY]: undefined;
  [ONBOARDING_ROUTES.VERIFY]: { phoneNumber: string };
  [ONBOARDING_ROUTES.PROFILE_SETUP]: undefined;
};

/**
 * The signed-in app: a bottom-tab navigator modelled on the product prototype.
 */
export type MainTabParamList = {
  [MAIN_TAB_ROUTES.DISCOVER]: undefined;
  [MAIN_TAB_ROUTES.MESSAGES]: undefined;
  [MAIN_TAB_ROUTES.POST_PLAN]: undefined;
  [MAIN_TAB_ROUTES.EXPLORE]: undefined;
  [MAIN_TAB_ROUTES.PROFILE]: undefined;
};

/** Top-level split: the onboarding flow versus the signed-in app. */
export type RootStackParamList = {
  [ROOT_ROUTES.ONBOARDING]: NavigatorScreenParams<OnboardingStackParamList>;
  [ROOT_ROUTES.MAIN]: NavigatorScreenParams<MainTabParamList>;
};
