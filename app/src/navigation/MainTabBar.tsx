import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { colors, fontFamily, radii, shadows } from "@/styles/tokens";

import type { MainTabParamList } from "./types";

/**
 * The signed-in app's bottom navigation, modelled on the product prototype: four labelled
 * tabs with the central "Post a plan" action raised into a teal gradient FAB. It owns its own
 * bottom safe-area inset because it is the chrome that sits against the home indicator — the
 * tab bar owning its internal layout, not the navigator shell reaching into insets. Per-screen
 * top/bottom insets remain with the `Screen` primitive.
 */

const BAR_HEIGHT = 60;
const ICON_SIZE = 22;
const LABEL_SIZE = 10;
const FAB_SIZE = 44;
const FAB_ICON_SIZE = 24;

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const TAB_ICON: Record<Exclude<keyof MainTabParamList, "PostPlan">, FeatherName> = {
  Messages: "message-circle",
  Explore: "compass",
  Discover: "layers",
  Profile: "user",
};

const TAB_LABEL: Record<keyof MainTabParamList, string> = {
  Messages: "Messages",
  Explore: "Explore",
  PostPlan: "Post a plan",
  Discover: "Discover",
  Profile: "Profile",
};

export function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { height: BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = TAB_LABEL[route.name as keyof MainTabParamList];

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

        if (route.name === "PostPlan") {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.fab, shadows.buttonTeal]}
              >
                <Feather name="plus" size={FAB_ICON_SIZE} color={colors.onTeal} />
              </LinearGradient>
            </Pressable>
          );
        }

        const iconName = TAB_ICON[route.name as Exclude<keyof MainTabParamList, "PostPlan">];
        const iconColor = focused ? colors.tealPrimary : colors.muted;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={styles.navBtn}
          >
            <Feather name={iconName} size={ICON_SIZE} color={iconColor} />
            <AppText style={[styles.label, focused && styles.labelActive]}>{label}</AppText>
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
