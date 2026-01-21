import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@ldps_user",
  AUTH: "@ldps_auth",
  ORDERS: "@ldps_orders",
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  pickupAddress: string;
  dropAddress: string;
  distance: number;
  price: number;
  status: "searching" | "assigned" | "in_transit" | "delivered";
  createdAt: string;
  driverName?: string;
  driverRating?: number;
}

export const storage = {
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async setLoggedIn(value: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(value));
  },

  async isLoggedIn(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : false;
  },

  async getOrders(): Promise<Order[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  async saveOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    orders.unshift(order);
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    driverName?: string,
    driverRating?: number,
  ): Promise<void> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      if (driverName) orders[index].driverName = driverName;
      if (driverRating) orders[index].driverRating = driverRating;
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.AUTH,
      STORAGE_KEYS.ORDERS,
    ]);
  },
};

export function generateOrderId(): string {
  return `LDPS${Date.now().toString(36).toUpperCase()}`;
}

export function calculateDistance(): number {
  return Math.round((Math.random() * 15 + 2) * 10) / 10;
}

export function calculatePrice(distance: number): number {
  const basePrice = 40;
  const pricePerKm = 12;
  return Math.round(basePrice + distance * pricePerKm);
}
