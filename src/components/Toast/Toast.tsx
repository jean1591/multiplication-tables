import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

const COLORS = {
  success: {
    bg: "bg-green-500",
    text: "text-white",
    icon: <Ionicons name="checkmark-circle" size={24} color="white" />,
  },
  error: {
    bg: "bg-red-500",
    text: "text-white",
    icon: <Ionicons name="close-circle" size={24} color="white" />,
  },
  warning: {
    bg: "bg-yellow-500",
    text: "text-gray-900",
    icon: <Ionicons name="warning" size={24} color="gray" />,
  },
  info: {
    bg: "bg-blue-500",
    text: "text-white",
    icon: <Ionicons name="information-circle" size={24} color="white" />,
  },
};

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      onHide?.();
    }, duration);
  }, [duration, onHide]);

  const { bg, text, icon } = COLORS[type];

  return (
    <Animated.View
      className="absolute left-0 right-0"
      style={{
        top: insets.top + 10,
        elevation: 999999,
        zIndex: 999999,
      }}
      entering={SlideInUp}
      exiting={SlideOutUp}
    >
      <View
        className={`flex-row items-center px-4 py-2 rounded-lg mx-4 ${bg} shadow-lg`}
      >
        {icon}
        <Text className={`flex-1 ml-2 ${text}`}>{message}</Text>
      </View>
    </Animated.View>
  );
}
