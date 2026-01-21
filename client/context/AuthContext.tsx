import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { storage, User } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id">) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const loggedIn = await storage.isLoggedIn();
      if (loggedIn) {
        const savedUser = await storage.getUser();
        setUser(savedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      const savedUser = await storage.getUser();
      if (savedUser && savedUser.email === email) {
        setUser(savedUser);
        setIsLoggedIn(true);
        await storage.setLoggedIn(true);
        return true;
      }
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        phone: "",
      };
      await storage.saveUser(newUser);
      await storage.setLoggedIn(true);
      setUser(newUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userData: Omit<User, "id">): Promise<boolean> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };
      await storage.saveUser(newUser);
      await storage.setLoggedIn(true);
      setUser(newUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await storage.setLoggedIn(false);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
