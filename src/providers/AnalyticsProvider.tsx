/* import firebaseAnalytics from "@react-native-firebase/analytics";
 */ import { useGlobalSearchParams, usePathname } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";

interface Analytics {
  page: (name: string, properties?: Record<string, any>) => void;
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<Analytics | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const analytics: Analytics = {
    page: (name, properties) => {
      /* 
      firebaseAnalytics().logScreenView({
        screen_name: name,
        screen_class: name,
        ...properties,
      }); */
    },
    track: (event, properties) => {
      /* 
      firebaseAnalytics().logEvent(event, properties); */
    },
    identify: (userId, traits) => {
      /* 
      firebaseAnalytics().setUserId(userId); */
    },
  };

  useEffect(() => {
    analytics.page(pathname, { params });
  }, [pathname, params]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
