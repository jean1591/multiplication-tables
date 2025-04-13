import * as Localization from "expo-localization";

import { createJSONStorage, persist } from "zustand/middleware";

import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Locale } from "@/providers/IntlProvider";
import { colorScheme } from "nativewind";
import { create } from "zustand";

interface SettingsStore {
  // Premium status
  isPremium: boolean;
  setPremium: (isPremium: boolean) => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Language
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // App opening count
  appOpeningCount: number;
  incrementAppOpeningCount: () => void;

  isOnboarded: boolean;
  onboardingCompleted: () => void;

  // Reset
  reset: () => void;
}

export const locales = {
  fr: "fr",
  en: "en",
  de: "de",
  es: "es",
  it: "it",
  pt: "pt",
} as const;

export type LocaleKeys = keyof typeof locales;
export type LocaleValues = (typeof locales)[LocaleKeys];
export type ThemeKeys = "dark" | "light" | null;

const defaultLocale = Localization.getLocales()[0].languageCode as LocaleKeys;

const initialStore = {
  isOnboarded: false,
  isPremium: false,
  appOpeningCount: 0,
  locale: (defaultLocale && locales[defaultLocale]) ?? "en",
  theme: Appearance.getColorScheme() || "dark",
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialStore,
      setPremium: (isPremium: boolean) => set({ isPremium }),
      setTheme: (theme: "light" | "dark") => {
        set({ theme });
        colorScheme.set(theme);
      },
      setLocale: (locale) => set({ locale }),
      incrementAppOpeningCount: () =>
        set((state) => ({ appOpeningCount: state.appOpeningCount + 1 })),
      onboardingCompleted: () => set({ isOnboarded: true }),
      reset: () => set(initialStore),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
