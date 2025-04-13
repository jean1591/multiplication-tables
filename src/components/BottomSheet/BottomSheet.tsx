import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { forwardRef, useCallback, type PropsWithChildren } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetBackdrop } from "./BottomSheetBackdrop";

interface BottomSheetProps extends PropsWithChildren {
  className?: string;
}

export const BottomSheet = forwardRef<
  BottomSheetModalMethods,
  BottomSheetProps
>(({ children, className }, ref) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const hideSheet = useCallback(() => {
    Keyboard.dismiss();
    // @ts-ignore
    ref?.current?.close();
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enablePanDownToClose
      activeOffsetX={[-999, 999]}
      activeOffsetY={[-5, 5]}
      backdropComponent={({ animatedIndex }) => (
        <Pressable style={StyleSheet.absoluteFill} onPress={hideSheet}>
          <BottomSheetBackdrop animatedIndex={animatedIndex} />
        </Pressable>
      )}
      handleIndicatorStyle={{
        width: 40,
      }}
      backgroundStyle={{
        backgroundColor: "#fff",
      }}
    >
      <BottomSheetScrollView style={{ flex: 1 }}>
        <View
          className={className}
          style={{ marginBottom: insets.bottom + 16 }}
        >
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
