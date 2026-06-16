import { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import type { NavigationContainerRef } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RootStackParamList } from "./types";

const BAR_BG = "rgba(0,0,0,0.75)";
const BTN_BG = "rgba(255,255,255,0.12)";
const LABEL_COLOR = "#ff6b6b";
const TEXT_COLOR = "#fff";
const MIN_TOP_INSET = 8;
const HANDLE_SIZE = 36;
const HANDLE_MARGIN = 12;
/** Below this, a touch is treated as a tap (reopen) rather than a drag. */
const DRAG_THRESHOLD = 4;

type Props = {
  navigationRef: NavigationContainerRef<RootStackParamList>;
};

type Point = { x: number; y: number };

export function DevBar({ navigationRef }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(true);
  const topInset = Math.max(insets.top, MIN_TOP_INSET);

  const [handlePosition, setHandlePosition] = useState<Point>(() => ({
    x: width - HANDLE_SIZE - HANDLE_MARGIN,
    y: topInset,
  }));

  // Read via refs inside the responder below so the gesture handlers below can stay
  // referentially stable across renders without going stale.
  const positionRef = useRef(handlePosition);
  const boundsRef = useRef({ width, height });
  const dragOrigin = useRef<Point>(handlePosition);
  positionRef.current = handlePosition;
  boundsRef.current = { width, height };

  const updatePosition = (next: Point) => {
    positionRef.current = next;
    setHandlePosition(next);
  };

  const clampToScreen = ({ x, y }: Point): Point => {
    const { width: boundsWidth, height: boundsHeight } = boundsRef.current;
    return {
      x: Math.min(Math.max(x, 0), boundsWidth - HANDLE_SIZE),
      y: Math.min(Math.max(y, 0), boundsHeight - HANDLE_SIZE),
    };
  };

  // Created once: recreating the PanResponder mid-render (e.g. from the setState below)
  // would reset its internal gesture tracking and make dx/dy jump mid-drag.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > DRAG_THRESHOLD || Math.abs(gesture.dy) > DRAG_THRESHOLD,
      onPanResponderGrant: () => {
        dragOrigin.current = positionRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        updatePosition(
          clampToScreen({
            x: dragOrigin.current.x + gesture.dx,
            y: dragOrigin.current.y + gesture.dy,
          }),
        );
      },
    }),
  ).current;

  const go = (action: () => void) => {
    if (navigationRef.isReady()) action();
  };

  const buttons = [
    {
      label: "Splash",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "Splash" })),
    },
    {
      label: "Phone",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "PhoneEntry" })),
    },
    {
      label: "Verify",
      onPress: () =>
        go(() =>
          navigationRef.navigate("Onboarding", {
            screen: "Verify",
            params: { phoneNumber: "+15551234567" },
          }),
        ),
    },
    {
      label: "Profile",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "ProfileSetup" })),
    },
    {
      label: "Discover",
      onPress: () => go(() => navigationRef.navigate("Main", { screen: "Discover" })),
    },
  ];

  if (!isOpen) {
    return (
      <View
        {...panResponder.panHandlers}
        style={[styles.handle, { left: handlePosition.x, top: handlePosition.y }]}
      >
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={styles.handleTouchable}
          accessibilityRole="button"
          accessibilityLabel="Show dev menu"
        >
          <Text style={styles.handleText}>DEV</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.bar, { paddingTop: topInset }]}>
      <Text style={styles.label}>DEV</Text>
      {buttons.map(({ label, onPress }) => (
        <TouchableOpacity key={label} onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => setIsOpen(false)}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Hide dev menu"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: BAR_BG,
  },
  label: {
    color: LABEL_COLOR,
    fontSize: 10,
    fontWeight: "700",
    marginRight: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: BTN_BG,
    alignItems: "center",
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BTN_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: TEXT_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: BAR_BG,
  },
  handleTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  handleText: {
    color: LABEL_COLOR,
    fontSize: 10,
    fontWeight: "700",
  },
});
