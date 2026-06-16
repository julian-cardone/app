import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, radii, shadows } from "@/styles/tokens";

import { MAIN_TAB_ROUTES } from "./routes";

const BAR_HEIGHT = 60;
const ICON_SIZE = 22;
const LABEL_SIZE = 10;
const ICON_LABEL_GAP = 2;
const FAB_SIZE = 44;
const FAB_ICON_SIZE = 24;

type MainTabName = (typeof MAIN_TAB_ROUTES)[keyof typeof MAIN_TAB_ROUTES];
type FeatherName = React.ComponentProps<typeof Feather>["name"];

type TabConfigItem = {
  label: string;
  icon: FeatherName;
  isFab: boolean;
};

const TAB_CONFIG: Record<MainTabName, TabConfigItem> = {
  [MAIN_TAB_ROUTES.MESSAGES]: { label: "Messages", icon: "message-circle", isFab: false },
  [MAIN_TAB_ROUTES.EXPLORE]: { label: "Explore", icon: "compass", isFab: false },
  [MAIN_TAB_ROUTES.DISCOVER]: { label: "Discover", icon: "layers", isFab: false },
  [MAIN_TAB_ROUTES.PROFILE]: { label: "Profile", icon: "user", isFab: false },
  [MAIN_TAB_ROUTES.POST_PLAN]: { label: "Post a plan", icon: "plus", isFab: true },
};

export function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const tabBarStyle = [
    styles.bar,
    {
      height: BAR_HEIGHT + insets.bottom,
      paddingBottom: insets.bottom,
    },
  ];

  return (
    <View style={tabBarStyle}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        // Safe because route names are defined by MainNavigator.
        const tab = TAB_CONFIG[route.name as MainTabName];

        if (!tab) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (tab.isFab) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={tab.label}
              style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
            >
              <LinearGradient
                colors={[colors.brand, colors.brandDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.fab, shadows.button]}
              >
                <Feather name={tab.icon} size={FAB_ICON_SIZE} color={colors.onBrand} />
              </LinearGradient>
            </Pressable>
          );
        }

        const iconColor = focused ? colors.brand : colors.textSecondary;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            style={styles.navBtn}
          >
            <Feather name={tab.icon} size={ICON_SIZE} color={iconColor} />
            <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: ICON_LABEL_GAP,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: LABEL_SIZE,
    lineHeight: LABEL_SIZE + 3,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fontFamily.extrabold,
    color: colors.brand,
  },
  fabWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPressed: {
    transform: [{ scale: 0.94 }],
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
