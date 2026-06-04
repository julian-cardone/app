import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  PhoneEntryScreen,
  ProfileSetupScreen,
  SplashScreen,
  VerifyScreen,
} from "@/features/onboarding";

import type { OnboardingStackParamList } from "./types";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * The pre-account flow: Splash → Phone Entry → Verify → Profile Setup. Headers are hidden so each
 * screen owns its own chrome. Completing setup resets the root to the Main app, which discards this
 * whole stack so members can't swipe back into signup.
 */
export function OnboardingNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}
