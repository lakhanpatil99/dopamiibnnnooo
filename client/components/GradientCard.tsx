import React from "react";
import { StyleSheet, Pressable, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { BorderRadius, Spacing } from "@/constants/theme";

interface GradientCardProps {
  colors: string[];
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GradientCard({
  colors,
  children,
  onPress,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    overflow: "hidden",
  },
});
