import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SplashScreen from "@/screens/SplashScreen";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import MapScreen from "@/screens/MapScreen";
import PickupDropScreen from "@/screens/PickupDropScreen";
import OrderSummaryScreen from "@/screens/OrderSummaryScreen";
import OrderStatusScreen from "@/screens/OrderStatusScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Map: {
    type: "pickup" | "drop";
    currentAddress?: string;
  };
  PickupDrop: {
    pickupAddress?: string;
    dropAddress?: string;
  };
  OrderSummary: {
    pickupAddress: string;
    dropAddress: string;
    distance: number;
    price: number;
  };
  OrderStatus: {
    orderId: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: "Create Account",
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: "Select Location",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="PickupDrop"
        component={PickupDropScreen}
        options={{
          headerTitle: "Confirm Locations",
        }}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{
          headerTitle: "Order Summary",
        }}
      />
      <Stack.Screen
        name="OrderStatus"
        component={OrderStatusScreen}
        options={{
          headerTitle: "Track Order",
        }}
      />
    </Stack.Navigator>
  );
}
