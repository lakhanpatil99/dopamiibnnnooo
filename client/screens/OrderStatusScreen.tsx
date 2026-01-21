import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { storage, Order } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, LDPSColors } from "@/constants/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, "OrderStatus">;

type OrderStatus = "searching" | "assigned" | "in_transit" | "delivered";

const STATUSES: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "searching", label: "Searching for Partner", icon: "search" },
  { key: "assigned", label: "Partner Assigned", icon: "user-check" },
  { key: "in_transit", label: "In Transit", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "check-circle" },
];

const DRIVER_NAMES = ["Raj Kumar", "Amit Singh", "Vikash Sharma", "Priya Patel"];

export default function OrderStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && order.status !== "delivered") {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );

      const statusProgression = setInterval(async () => {
        setCurrentStatusIndex((prev) => {
          if (prev < STATUSES.length - 1) {
            const newIndex = prev + 1;
            const newStatus = STATUSES[newIndex].key;

            Haptics.notificationAsync(
              newStatus === "delivered"
                ? Haptics.NotificationFeedbackType.Success
                : Haptics.NotificationFeedbackType.Warning,
            );

            if (newStatus === "assigned") {
              const driverName =
                DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
              const driverRating = (Math.random() * 1 + 4).toFixed(1);
              storage.updateOrderStatus(
                orderId,
                newStatus,
                driverName,
                parseFloat(driverRating),
              );
              setOrder((prevOrder) =>
                prevOrder
                  ? {
                      ...prevOrder,
                      status: newStatus,
                      driverName,
                      driverRating: parseFloat(driverRating),
                    }
                  : null,
              );
            } else {
              storage.updateOrderStatus(orderId, newStatus);
              setOrder((prevOrder) =>
                prevOrder ? { ...prevOrder, status: newStatus } : null,
              );
            }

            return newIndex;
          }
          return prev;
        });
      }, 5000);

      return () => clearInterval(statusProgression);
    }
  }, [order?.id]);

  const loadOrder = async () => {
    const orders = await storage.getOrders();
    const foundOrder = orders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      const statusIndex = STATUSES.findIndex(
        (s) => s.key === foundOrder.status,
      );
      setCurrentStatusIndex(statusIndex >= 0 ? statusIndex : 0);
    }
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (!order) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ThemedText type="body">Loading...</ThemedText>
      </View>
    );
  }

  const currentStatus = STATUSES[currentStatusIndex];
  const isDelivered = currentStatus.key === "delivered";

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.header}
      >
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Order ID
        </ThemedText>
        <ThemedText type="h4">{order.id}</ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={[styles.statusCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <View style={styles.currentStatusSection}>
          <Animated.View
            style={[
              styles.statusIconContainer,
              {
                backgroundColor: isDelivered
                  ? `${LDPSColors.success}20`
                  : `${LDPSColors.primary}20`,
              },
              !isDelivered && pulseAnimatedStyle,
            ]}
          >
            <Feather
              name={currentStatus.icon as any}
              size={32}
              color={isDelivered ? LDPSColors.success : LDPSColors.primary}
            />
          </Animated.View>
          <ThemedText type="h3" style={styles.statusLabel}>
            {currentStatus.label}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {isDelivered
              ? "Your package has been delivered successfully!"
              : "We're working on your delivery..."}
          </ThemedText>
        </View>

        <View style={styles.progressContainer}>
          {STATUSES.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <React.Fragment key={status.key}>
                <View style={styles.progressStep}>
                  <View
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor: isCompleted
                          ? LDPSColors.success
                          : theme.backgroundSecondary,
                        borderColor: isCompleted
                          ? LDPSColors.success
                          : theme.border,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Feather name="check" size={12} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <ThemedText
                    type="small"
                    style={[
                      styles.progressLabel,
                      {
                        color: isCompleted ? theme.text : theme.textSecondary,
                        fontWeight: isCurrent ? "600" : "400",
                      },
                    ]}
                  >
                    {status.label}
                  </ThemedText>
                </View>
                {index < STATUSES.length - 1 ? (
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor:
                          index < currentStatusIndex
                            ? LDPSColors.success
                            : theme.border,
                      },
                    ]}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </View>
      </Animated.View>

      {order.driverName ? (
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[
            styles.driverCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <View style={styles.driverHeader}>
            <ThemedText type="h4">Delivery Partner</ThemedText>
          </View>

          <View style={styles.driverInfo}>
            <View
              style={[
                styles.driverAvatar,
                { backgroundColor: LDPSColors.primary },
              ]}
            >
              <ThemedText
                type="h4"
                style={{ color: "#FFFFFF" }}
              >
                {order.driverName.charAt(0)}
              </ThemedText>
            </View>
            <View style={styles.driverDetails}>
              <ThemedText type="h4">{order.driverName}</ThemedText>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={14} color={LDPSColors.warning} />
                <ThemedText type="small">{order.driverRating}</ThemedText>
              </View>
            </View>
            <Pressable
              style={[
                styles.callButton,
                { backgroundColor: `${LDPSColors.success}20` },
              ]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Feather name="phone" size={20} color={LDPSColors.success} />
            </Pressable>
          </View>
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={[
          styles.orderDetailsCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ThemedText type="h4" style={styles.cardTitle}>
          Delivery Details
        </ThemedText>

        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <View
              style={[
                styles.addressIcon,
                { backgroundColor: `${LDPSColors.pickupMarker}20` },
              ]}
            >
              <Feather
                name="circle"
                size={12}
                color={LDPSColors.pickupMarker}
              />
            </View>
            <View style={styles.addressContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Pickup
              </ThemedText>
              <ThemedText type="body">{order.pickupAddress}</ThemedText>
            </View>
          </View>

          <View style={styles.addressConnector}>
            <View
              style={[styles.connectorLine, { backgroundColor: theme.border }]}
            />
          </View>

          <View style={styles.addressRow}>
            <View
              style={[
                styles.addressIcon,
                { backgroundColor: `${LDPSColors.dropMarker}20` },
              ]}
            >
              <Feather name="map-pin" size={12} color={LDPSColors.dropMarker} />
            </View>
            <View style={styles.addressContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Drop
              </ThemedText>
              <ThemedText type="body">{order.dropAddress}</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        <View style={styles.orderFooter}>
          <View style={styles.footerItem}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Distance
            </ThemedText>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {order.distance} km
            </ThemedText>
          </View>
          <View style={styles.footerItem}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Amount
            </ThemedText>
            <ThemedText
              type="body"
              style={{ fontWeight: "600", color: LDPSColors.primary }}
            >
              Rs. {order.price}
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {!isDelivered ? (
        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.goBack();
          }}
        >
          <ThemedText type="body" style={{ color: LDPSColors.error }}>
            Cancel Order
          </ThemedText>
        </Pressable>
      ) : null}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 24,
    gap: 4,
  },
  statusCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: 16,
  },
  currentStatusSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    marginBottom: 4,
    textAlign: "center",
  },
  progressContainer: {
    gap: 0,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  progressLabel: {
    flex: 1,
  },
  progressLine: {
    width: 2,
    height: 20,
    marginLeft: 11,
    marginVertical: 4,
  },
  driverCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: 16,
  },
  driverHeader: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  driverDetails: {
    flex: 1,
    gap: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  orderDetailsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  addressSection: {
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  addressIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
    gap: 2,
  },
  addressConnector: {
    paddingLeft: 13,
    height: 16,
    justifyContent: "center",
  },
  connectorLine: {
    width: 2,
    height: "100%",
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerItem: {
    gap: 4,
  },
  cancelButton: {
    alignItems: "center",
    padding: Spacing.lg,
  },
});
