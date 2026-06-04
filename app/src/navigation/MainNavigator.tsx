import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { DiscoverScreen } from "@/features/discover";
import { ExploreScreen } from "@/features/explore";
import { MessagesScreen } from "@/features/messages";
import { PostPlanScreen } from "@/features/postPlan";
import { ProfileCompletionProvider, ProfileScreen } from "@/features/profile";

import { MainTabBar } from "./MainTabBar";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * The signed-in app: a bottom-tab navigator with a custom tab bar (`MainTabBar`) modelled on the
 * product prototype — Messages, Explore, the central Post-a-plan FAB, Discover, and Profile, with
 * Discover as the landing tab. Screens are registered left-to-right so `PostPlan` falls in the
 * centre slot the FAB occupies. `ProfileCompletionProvider` wraps the navigator so the
 * profile-completion banner's state is shared across tabs; screens render the banner themselves and
 * own their own safe area, keeping this pure route wiring plus shared state.
 */
export function MainNavigator() {
  return (
    <ProfileCompletionProvider>
      <Tab.Navigator
        initialRouteName="Discover"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MainTabBar {...props} />}
      >
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="PostPlan" component={PostPlanScreen} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </ProfileCompletionProvider>
  );
}
