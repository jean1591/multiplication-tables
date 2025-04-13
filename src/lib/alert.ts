import { Alert, Platform } from "react-native";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

const alertPolyfill = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: { cancelable?: boolean; onDismiss?: () => void }
) => {
  const result = window.confirm([title, message].filter(Boolean).join("\n"));

  if (result) {
    const confirmButton = buttons?.find(({ style }) => style !== "cancel");
    confirmButton?.onPress?.();
  } else {
    const cancelButton = buttons?.find(({ style }) => style === "cancel");
    cancelButton?.onPress?.();
    options?.onDismiss?.();
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
