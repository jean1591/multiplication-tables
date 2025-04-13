import { IntlProvider as ReactIntlProvider } from "react-intl";
// Import all translations directly
import de from "@/assets/translations/de.json";
import en from "@/assets/translations/en.json";
import es from "@/assets/translations/es.json";
import fr from "@/assets/translations/fr.json";
import it from "@/assets/translations/it.json";
import pt from "@/assets/translations/pt.json";
import { useSettingsStore } from "@/stores/settingsStore";

// Process translations to flatten them
function flattenMessages(nestedMessages: any, prefix = "") {
  return Object.keys(nestedMessages).reduce(
    (messages: Record<string, string>, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    },
    {}
  );
}

// Create a static reference to all messages
const allMessages = {
  en: flattenMessages(en),
  fr: flattenMessages(fr),
  de: flattenMessages(de),
  es: flattenMessages(es),
  it: flattenMessages(it),
  pt: flattenMessages(pt),
};

export type Locale = keyof typeof allMessages;

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useSettingsStore((state) => state.locale);

  return (
    <ReactIntlProvider
      locale={locale}
      messages={allMessages[locale as Locale] || allMessages.en}
      defaultLocale="en"
      onError={(err) => {
        // Only log missing translation errors in development
        if (
          process.env.NODE_ENV !== "production" &&
          err.code === "MISSING_TRANSLATION"
        ) {
          console.warn(
            `Missing translation for key: "${err.message}" in locale: "${locale}"`
          );
        }
      }}
    >
      {children}
    </ReactIntlProvider>
  );
}
