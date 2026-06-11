import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { DiscoverScreen } from "@/features/discover";
import { ExploreScreen } from "@/features/explore";
import { MessagesScreen } from "@/features/messages";
import { PostPlanScreen } from "@/features/postPlan";
import { ProfileCompletionProvider, ProfileScreen } from "@/features/profile";

import { MainTabBar } from "./MainTabBar";
import { MAIN_TAB_ROUTES } from "./routes";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <ProfileCompletionProvider>
      <Tab.Navigator
        initialRouteName={MAIN_TAB_ROUTES.DISCOVER}
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MainTabBar {...props} />}
      >
        <Tab.Screen name={MAIN_TAB_ROUTES.DISCOVER} component={DiscoverScreen} />
        <Tab.Screen name={MAIN_TAB_ROUTES.MESSAGES} component={MessagesScreen} />
        <Tab.Screen name={MAIN_TAB_ROUTES.POST_PLAN} component={PostPlanScreen} />
        <Tab.Screen name={MAIN_TAB_ROUTES.EXPLORE} component={ExploreScreen} />
        <Tab.Screen name={MAIN_TAB_ROUTES.PROFILE} component={ProfileScreen} />
      </Tab.Navigator>
    </ProfileCompletionProvider>
  );
}
