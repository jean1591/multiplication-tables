import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { memo, useCallback, forwardRef, useEffect } from "react";
import { TextInput } from "react-native";
import { cn } from "@/lib/utils";

type ComponentProps = typeof TextInput extends React.ComponentType<infer P>
  ? P
  : never;

const BottomSheetTextInputComponent = forwardRef<TextInput, ComponentProps>(
  ({ onFocus, onBlur, className, ...rest }, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    useEffect(() => {
      return () => {
        shouldHandleKeyboardEvents.value = false;
      };
    }, [shouldHandleKeyboardEvents]);

    const handleOnFocus = useCallback(
      (args: any) => {
        shouldHandleKeyboardEvents.value = true;
        if (onFocus) {
          onFocus(args);
        }
      },
      [onFocus, shouldHandleKeyboardEvents]
    );
    const handleOnBlur = useCallback(
      (args: any) => {
        shouldHandleKeyboardEvents.value = false;
        if (onBlur) {
          onBlur(args);
        }
      },
      [onBlur, shouldHandleKeyboardEvents]
    );

    return (
      <TextInput
        ref={ref}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        className={cn(
          "p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          className
        )}
        {...rest}
      />
    );
  }
);

export const BottomSheetTextInput = memo(BottomSheetTextInputComponent);
