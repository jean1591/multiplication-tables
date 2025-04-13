import { Platform } from "react-native";

// Replace these with your actual RevenueCat API keys
const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_APPLE_API_KEY,
  android: process.env.EXPO_PUBLIC_RC_GOOGLE_API_KEY,
});

export const ENTITLEMENT_ID = "Premium";

export const PRODUCT_IDS = {
  monthly: "$rc_monthly",
  yearly: "$rc_annual",
  lifetime: "$rc_lifetime",
} as const;

export { REVENUECAT_API_KEY };
