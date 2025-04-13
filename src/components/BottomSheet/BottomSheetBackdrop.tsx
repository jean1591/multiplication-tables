import { BlurView as ExpoBlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  type SharedValue,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(ExpoBlurView);

interface BlurViewProps {
  animatedIndex: SharedValue<number>;
}

export function BottomSheetBackdrop({ animatedIndex }: BlurViewProps) {
  const animatedProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        animatedIndex.value,
        [-1, 0],
        [0, 30],
        Extrapolation.CLAMP
      ),
    };
  }, [animatedIndex]);

  return (
    <AnimatedBlurView
      animatedProps={animatedProps}
      intensity={30}
      experimentalBlurMethod="dimezisBlurView"
      style={{
        flex: 1,
      }}
    />
  );
}
