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
 * Main signed-in tab navigator.
 *
 * Wires app-level tabs to their screens, uses the custom tab bar, and provides
 * shared profile-completion state across the tab tree.
 */
export function MainNavigator() {
  return (
    <ProfileCompletionProvider>
      <Tab.Navigator
        initialRouteName="Discover"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MainTabBar {...props} />}
      >
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="PostPlan" component={PostPlanScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </ProfileCompletionProvider>
  );
}
