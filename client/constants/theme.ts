import { Platform } from "react-native";

// LDPS Brand Colors
export const LDPSColors = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  primaryLight: "#3B82F6",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  pickupMarker: "#EF4444",
  dropMarker: "#10B981",
};

const tintColorLight = LDPSColors.primary;
const tintColorDark = "#3B82F6";

export const Colors = {
  light: {
    text: LDPSColors.textPrimary,
    textSecondary: LDPSColors.textSecondary,
    buttonText: "#FFFFFF",
    tabIconDefault: LDPSColors.textSecondary,
    tabIconSelected: tintColorLight,
    link: LDPSColors.primary,
    backgroundRoot: LDPSColors.background,
    backgroundDefault: LDPSColors.surface,
    backgroundSecondary: "#F1F5F9",
    backgroundTertiary: "#E2E8F0",
    border: LDPSColors.border,
    success: LDPSColors.success,
    warning: LDPSColors.warning,
    error: LDPSColors.error,
    primary: LDPSColors.primary,
    primaryDark: LDPSColors.primaryDark,
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorDark,
    link: "#3B82F6",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    border: "#334155",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    primary: "#3B82F6",
    primaryDark: "#2563EB",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 52,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500" as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
