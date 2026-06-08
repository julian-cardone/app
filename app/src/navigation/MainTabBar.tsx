import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, radii, shadows } from "@/styles/tokens";

import type { MainTabParamList } from "./types";

/**
 * Custom bottom tab bar for the signed-in app.
 */
const BAR_HEIGHT = 60;
const ICON_SIZE = 22;
const LABEL_SIZE = 10;
const FAB_SIZE = 44;
const FAB_ICON_SIZE = 24;

type MainTabName = keyof MainTabParamList;
type FeatherName = React.ComponentProps<typeof Feather>["name"];

type TabConfigItem = {
  label: string;
  icon: FeatherName;
  isFab: boolean;
};

const TAB_CONFIG: Record<MainTabName, TabConfigItem> = {
  Messages: { label: "Messages", icon: "message-circle", isFab: false },
  Explore: { label: "Explore", icon: "compass", isFab: false },
  Discover: { label: "Discover", icon: "layers", isFab: false },
  Profile: { label: "Profile", icon: "user", isFab: false },
  PostPlan: { label: "Post a plan", icon: "plus", isFab: true },
};

export function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { height: BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TAB_CONFIG[route.name as MainTabName];

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
              accessibilityLabel={tab.label}
              style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.fab, shadows.buttonTeal]}
              >
                <Feather name={tab.icon} size={FAB_ICON_SIZE} color={colors.onTeal} />
              </LinearGradient>
            </Pressable>
          );
        }

        const iconColor = focused ? colors.tealPrimary : colors.muted;

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
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  navBtn: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: LABEL_SIZE,
    lineHeight: LABEL_SIZE + 3,
    color: colors.muted,
  },
  labelActive: {
    fontFamily: fontFamily.extrabold,
    color: colors.tealPrimary,
  },
  fabWrap: {
    flex: 1,
    height: BAR_HEIGHT,
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
