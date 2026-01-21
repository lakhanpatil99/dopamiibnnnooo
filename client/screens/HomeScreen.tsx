import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { storage, Order } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, LDPSColors } from "@/constants/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OFFERS = [
  {
    id: "1",
    title: "First Delivery Free",
    subtitle: "Use code: LDPSFIRST",
    color: "#3B82F6",
  },
  {
    id: "2",
    title: "20% Off Weekends",
    subtitle: "Valid Sat & Sun",
    color: "#10B981",
  },
  {
    id: "3",
    title: "Refer & Earn",
    subtitle: "Get 50 credits",
    color: "#F59E0B",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadRecentOrders();
  }, []);

  const loadRecentOrders = async () => {
    const orders = await storage.getOrders();
    setRecentOrders(orders.slice(0, 3));
  };

  const handleBookDelivery = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("PickupDrop", { pickupAddress, dropAddress });
  };

  const handleLocationInput = (type: "pickup" | "drop") => {
    Haptics.selectionAsync();
    navigation.navigate("Map", {
      type,
      currentAddress: type === "pickup" ? pickupAddress : dropAddress,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing.xl,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.section}
      >
        <View style={styles.bookingCard}>
          <ThemedText type="h3" style={styles.bookingTitle}>
            Where to deliver?
          </ThemedText>

          <Pressable
            style={[
              styles.locationInput,
              { backgroundColor: theme.backgroundSecondary },
            ]}
            onPress={() => handleLocationInput("pickup")}
          >
            <View
              style={[
                styles.locationDot,
                { backgroundColor: LDPSColors.pickupMarker },
              ]}
            />
            <View style={styles.locationTextContainer}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Pickup Location
              </ThemedText>
              <ThemedText
                type="body"
                numberOfLines={1}
                style={pickupAddress ? {} : { color: theme.textSecondary }}
              >
                {pickupAddress || "Enter pickup address"}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <View style={styles.locationConnector}>
            <View
              style={[styles.connectorLine, { backgroundColor: theme.border }]}
            />
          </View>

          <Pressable
            style={[
              styles.locationInput,
              { backgroundColor: theme.backgroundSecondary },
            ]}
            onPress={() => handleLocationInput("drop")}
          >
            <View
              style={[
                styles.locationDot,
                { backgroundColor: LDPSColors.dropMarker },
              ]}
            />
            <View style={styles.locationTextContainer}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Drop Location
              </ThemedText>
              <ThemedText
                type="body"
                numberOfLines={1}
                style={dropAddress ? {} : { color: theme.textSecondary }}
              >
                {dropAddress || "Enter drop address"}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Button onPress={handleBookDelivery} style={styles.bookButton}>
            Book Delivery
          </Button>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.section}
      >
        <ThemedText type="h4" style={styles.sectionTitle}>
          Special Offers
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersContainer}
        >
          {OFFERS.map((offer, index) => (
            <Pressable
              key={offer.id}
              style={[styles.offerCard, { backgroundColor: offer.color }]}
              onPress={() => Haptics.selectionAsync()}
            >
              <View style={styles.offerContent}>
                <Feather name="gift" size={24} color="#FFFFFF" />
                <ThemedText
                  type="h4"
                  style={{ color: "#FFFFFF", marginTop: 8 }}
                >
                  {offer.title}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {offer.subtitle}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Recent Orders
          </ThemedText>
          {recentOrders.length > 0 ? (
            <Pressable onPress={() => navigation.navigate("OrdersTab" as any)}>
              <ThemedText type="link" style={{ color: LDPSColors.primary }}>
                View All
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() =>
                navigation.navigate("OrderStatus", { orderId: order.id })
              }
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="package" size={32} color={theme.textSecondary} />
            </View>
            <ThemedText
              type="body"
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              No orders yet
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.emptySubtext, { color: theme.textSecondary }]}
            >
              Book your first delivery above
            </ThemedText>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (order.status) {
      case "searching":
        return LDPSColors.warning;
      case "assigned":
      case "in_transit":
        return LDPSColors.primary;
      case "delivered":
        return LDPSColors.success;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case "searching":
        return "Searching";
      case "assigned":
        return "Assigned";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return order.status;
    }
  };

  return (
    <Pressable
      style={[styles.orderCard, { backgroundColor: theme.backgroundDefault }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <View style={styles.orderHeader}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {order.id}
        </ThemedText>
        <View
          style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <ThemedText
            type="small"
            style={{ color: getStatusColor(), fontWeight: "500" }}
          >
            {getStatusText()}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderAddresses}>
        <View style={styles.orderAddress}>
          <Feather name="circle" size={10} color={LDPSColors.pickupMarker} />
          <ThemedText type="body" numberOfLines={1} style={{ flex: 1 }}>
            {order.pickupAddress}
          </ThemedText>
        </View>
        <View style={styles.orderAddress}>
          <Feather name="map-pin" size={10} color={LDPSColors.dropMarker} />
          <ThemedText type="body" numberOfLines={1} style={{ flex: 1 }}>
            {order.dropAddress}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {order.distance} km
        </ThemedText>
        <ThemedText type="h4" style={{ color: LDPSColors.primary }}>
          Rs. {order.price}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  bookingCard: {
    gap: 12,
  },
  bookingTitle: {
    marginBottom: 4,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationTextContainer: {
    flex: 1,
    gap: 2,
  },
  locationConnector: {
    paddingLeft: 22,
    height: 16,
    justifyContent: "center",
  },
  connectorLine: {
    width: 2,
    height: "100%",
    marginLeft: 5,
  },
  bookButton: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  offersContainer: {
    paddingRight: Spacing.lg,
    gap: 12,
  },
  offerCard: {
    width: SCREEN_WIDTH * 0.6,
    height: 120,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginRight: 12,
  },
  offerContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emptyText: {
    marginBottom: 4,
  },
  emptySubtext: {},
  orderCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  orderAddresses: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  orderAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
