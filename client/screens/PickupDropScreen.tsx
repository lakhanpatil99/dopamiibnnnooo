import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { calculateDistance, calculatePrice } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, LDPSColors } from "@/constants/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, "PickupDrop">;

export default function PickupDropScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const [pickupAddress, setPickupAddress] = useState(
    route.params?.pickupAddress || "",
  );
  const [dropAddress, setDropAddress] = useState(
    route.params?.dropAddress || "",
  );
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (pickupAddress && dropAddress) {
      const dist = calculateDistance();
      const calculatedPrice = calculatePrice(dist);
      setDistance(dist);
      setPrice(calculatedPrice);
    }
  }, [pickupAddress, dropAddress]);

  const handleEditLocation = (type: "pickup" | "drop") => {
    Haptics.selectionAsync();
    navigation.navigate("Map", {
      type,
      currentAddress: type === "pickup" ? pickupAddress : dropAddress,
    });
  };

  const handleConfirmOrder = () => {
    if (!pickupAddress || !dropAddress) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OrderSummary", {
      pickupAddress,
      dropAddress,
      distance,
      price,
    });
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText type="h3" style={styles.title}>
          Confirm Locations
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Review and edit your delivery locations
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.locationsContainer}
      >
        <Pressable
          style={[
            styles.locationCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
          onPress={() => handleEditLocation("pickup")}
        >
          <View style={styles.locationHeader}>
            <View
              style={[
                styles.locationIcon,
                { backgroundColor: `${LDPSColors.pickupMarker}20` },
              ]}
            >
              <Feather
                name="circle"
                size={16}
                color={LDPSColors.pickupMarker}
              />
            </View>
            <ThemedText type="h4">Pickup Location</ThemedText>
            <Feather name="edit-2" size={18} color={theme.textSecondary} />
          </View>
          <ThemedText
            type="body"
            style={[
              styles.addressText,
              !pickupAddress && { color: theme.textSecondary },
            ]}
          >
            {pickupAddress || "Tap to select pickup location"}
          </ThemedText>
        </Pressable>

        <View style={styles.connector}>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
          <View
            style={[
              styles.connectorDot,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            ]}
          >
            <Feather name="arrow-down" size={14} color={theme.textSecondary} />
          </View>
          <View style={[styles.connectorLine, { backgroundColor: theme.border }]} />
        </View>

        <Pressable
          style={[
            styles.locationCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
          onPress={() => handleEditLocation("drop")}
        >
          <View style={styles.locationHeader}>
            <View
              style={[
                styles.locationIcon,
                { backgroundColor: `${LDPSColors.dropMarker}20` },
              ]}
            >
              <Feather name="map-pin" size={16} color={LDPSColors.dropMarker} />
            </View>
            <ThemedText type="h4">Drop Location</ThemedText>
            <Feather name="edit-2" size={18} color={theme.textSecondary} />
          </View>
          <ThemedText
            type="body"
            style={[
              styles.addressText,
              !dropAddress && { color: theme.textSecondary },
            ]}
          >
            {dropAddress || "Tap to select drop location"}
          </ThemedText>
        </Pressable>
      </Animated.View>

      {pickupAddress && dropAddress ? (
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[
            styles.summaryCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Distance
              </ThemedText>
              <View style={styles.summaryValue}>
                <ThemedText type="h2">{distance}</ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  {" "}
                  km
                </ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.summaryItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Estimated Price
              </ThemedText>
              <View style={styles.summaryValue}>
                <ThemedText type="small" style={{ color: LDPSColors.primary }}>
                  Rs.{" "}
                </ThemedText>
                <ThemedText type="h2" style={{ color: LDPSColors.primary }}>
                  {price}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Base Fare
              </ThemedText>
              <ThemedText type="small">Rs. 40</ThemedText>
            </View>
            <View style={styles.priceRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Distance Charge ({distance} km x Rs. 12)
              </ThemedText>
              <ThemedText type="small">Rs. {price - 40}</ThemedText>
            </View>
          </View>
        </Animated.View>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleConfirmOrder}
          disabled={!pickupAddress || !dropAddress}
        >
          Continue to Summary
        </Button>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  locationsContainer: {
    gap: 0,
    marginBottom: 24,
  },
  locationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addressText: {
    marginLeft: 48,
  },
  connector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginLeft: 33,
  },
  connectorLine: {
    width: 2,
    height: 16,
  },
  connectorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -4,
  },
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryValue: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  divider: {
    width: 1,
    height: 50,
    marginHorizontal: 20,
  },
  priceBreakdown: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "auto",
  },
});
