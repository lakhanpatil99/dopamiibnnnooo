import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { storage, Order } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, LDPSColors } from "@/constants/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MENU_ITEMS = [
  { id: "addresses", icon: "map-pin", label: "Saved Addresses" },
  { id: "payment", icon: "credit-card", label: "Payment Methods" },
  { id: "notifications", icon: "bell", label: "Notifications" },
  { id: "help", icon: "help-circle", label: "Help & Support" },
  { id: "about", icon: "info", label: "About LDPS" },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    loadOrderCount();
  }, []);

  const loadOrderCount = async () => {
    const orders = await storage.getOrders();
    setTotalOrders(orders.length);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleMenuPress = (id: string) => {
    Haptics.selectionAsync();
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.profileHeader}
      >
        <View
          style={[styles.avatar, { backgroundColor: LDPSColors.primary }]}
        >
          <ThemedText type="h1" style={{ color: "#FFFFFF" }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </ThemedText>
        </View>
        <ThemedText type="h3" style={styles.userName}>
          {user?.name || "User"}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {user?.email || "user@example.com"}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.statsRow}
      >
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: `${LDPSColors.primary}20` },
            ]}
          >
            <Feather name="package" size={20} color={LDPSColors.primary} />
          </View>
          <ThemedText type="h2">{totalOrders}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Total Orders
          </ThemedText>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: `${LDPSColors.success}20` },
            ]}
          >
            <Feather name="check-circle" size={20} color={LDPSColors.success} />
          </View>
          <ThemedText type="h2">{totalOrders}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Completed
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={[
          styles.infoCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ThemedText type="h4" style={styles.cardTitle}>
          Account Details
        </ThemedText>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Feather name="user" size={18} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Name
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "500" }}>
            {user?.name || "Not set"}
          </ThemedText>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Feather name="phone" size={18} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Phone
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "500" }}>
            {user?.phone || "Not set"}
          </ThemedText>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Feather name="mail" size={18} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Email
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "500" }}>
            {user?.email || "Not set"}
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={[
          styles.menuCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        {MENU_ITEMS.map((item, index) => (
          <React.Fragment key={item.id}>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather
                  name={item.icon as any}
                  size={18}
                  color={theme.textSecondary}
                />
              </View>
              <ThemedText type="body" style={{ flex: 1 }}>
                {item.label}
              </ThemedText>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
            {index < MENU_ITEMS.length - 1 ? (
              <View
                style={[styles.separator, { backgroundColor: theme.border }]}
              />
            ) : null}
          </React.Fragment>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(400)}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={LDPSColors.error} />
          <ThemedText type="body" style={{ color: LDPSColors.error, fontWeight: "600" }}>
            Logout
          </ThemedText>
        </Pressable>
      </Animated.View>

      <ThemedText
        type="small"
        style={[styles.version, { color: theme.textSecondary }]}
      >
        LDPS v1.0.0
      </ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
  menuCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: LDPSColors.error,
  },
  version: {
    textAlign: "center",
    marginTop: 24,
  },
});
