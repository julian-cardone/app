import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainNavigator } from "./MainNavigator";
import { OnboardingNavigator } from "./OnboardingNavigator";
import { ROOT_ROUTES } from "./routes";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The top-level split between the pre-account onboarding flow and the signed-in app. Headers are
 * hidden; each nested navigator owns its own chrome. Onboarding replaces itself with Main on
 * completion, so the onboarding stack does not linger on the back stack.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROOT_ROUTES.ONBOARDING}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROOT_ROUTES.ONBOARDING} component={OnboardingNavigator} />
      <Stack.Screen name={ROOT_ROUTES.MAIN} component={MainNavigator} />
    </Stack.Navigator>
  );
}
