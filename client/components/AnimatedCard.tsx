import React from "react";
import { StyleSheet, Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 1 | 2 | 3;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedCard({
  children,
  onPress,
  style,
  elevation = 1,
}: AnimatedCardProps) {
  const { theme } = useTheme();
  const pressed = useSharedValue(0);

  const getBackgroundColor = () => {
    switch (elevation) {
      case 1:
        return theme.backgroundDefault;
      case 2:
        return theme.backgroundSecondary;
      case 3:
        return theme.backgroundTertiary;
      default:
        return theme.backgroundDefault;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      { translateY: interpolate(pressed.value, [0, 1], [0, 2]) },
    ],
    shadowOpacity: interpolate(pressed.value, [0, 1], [0.08, 0.04]),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 15, stiffness: 200 });
      }}
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          shadowColor: "#000",
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
});
