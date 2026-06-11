import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  PhoneEntryScreen,
  ProfileSetupScreen,
  SplashScreen,
  VerifyScreen,
} from "@/features/onboarding";

import { ONBOARDING_ROUTES } from "./routes";
import type { OnboardingStackParamList } from "./types";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ONBOARDING_ROUTES.SPLASH}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ONBOARDING_ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ONBOARDING_ROUTES.PHONE_ENTRY} component={PhoneEntryScreen} />
      <Stack.Screen name={ONBOARDING_ROUTES.VERIFY} component={VerifyScreen} />
      <Stack.Screen name={ONBOARDING_ROUTES.PROFILE_SETUP} component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}
