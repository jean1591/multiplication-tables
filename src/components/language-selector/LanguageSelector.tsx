import { Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { FormattedMessage } from "react-intl";
import type { Locale } from "@/providers/IntlProvider";
import { useSettingsStore } from "@/stores/settingsStore";

type LanguageOption = {
  code: Locale;
  flag: string;
  name: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "pt", flag: "🇵🇹", name: "Português" },
];

export const LanguageSelector = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { locale, setLocale } = useSettingsStore();

  const handleLanguageSelect = (languageCode: Locale) => {
    if (languageCode !== locale) {
      setLocale(languageCode);
    }
    setIsVisible(false);
  };

  const getCurrentLanguageFlag = () => {
    const currentLanguage = LANGUAGES.find((lang) => lang.code === locale);
    return currentLanguage?.flag || "🇬🇧"; // Default to English flag if not found
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="w-8 h-8 items-center justify-center"
      >
        <Text className="text-xl">{getCurrentLanguageFlag()}</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
          className="bg-black/30 justify-center items-center"
        >
          <View className="bg-white rounded-xl w-72 p-4">
            <Text className="text-lg font-bold mb-4 text-center">
              <FormattedMessage
                id="settings.selectLanguage"
                defaultMessage="Select Language"
              />
            </Text>

            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                className={`flex-row items-center p-3 rounded-lg my-1 ${
                  locale === language.code
                    ? "bg-gray-50 border border-gray-200"
                    : ""
                }`}
              >
                <Text className="text-lg mr-3">{language.flag}</Text>
                <Text className="text-base">{language.name}</Text>
                {locale === language.code && (
                  <View className="ml-auto bg-black px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">
                      <FormattedMessage
                        id="settings.active"
                        defaultMessage="Active"
                      />
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
