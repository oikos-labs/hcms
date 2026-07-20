import * as Haptics from "expo-haptics";
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Pressable } from "react-native";
import Animated, {
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

const TabPressAnimationContext = createContext<SharedValue<number> | null>(
  null,
);

/**
 * A tab-bar press target that provides light haptic feedback and a shared press
 * animation to descendant {@link AnimatedTabIcon} components.
 *
 * Haptic failures are ignored because feedback availability depends on the
 * device and its system settings.
 */
export function HapticTabButton({
  children,
  onPress,
  ...props
}: ComponentProps<typeof Pressable>) {
  const pressProgress = useSharedValue(0);

  const handlePressIn: NonNullable<
    ComponentProps<typeof Pressable>["onPressIn"]
  > = (event) => {
    cancelAnimation(pressProgress);
    pressProgress.value = 0;
    pressProgress.value = withSequence(
      withTiming(1, { duration: 80, reduceMotion: ReduceMotion.System }),
      withTiming(0, { duration: 120, reduceMotion: ReduceMotion.System }),
    );

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Haptics can be unavailable because of device or system settings.
    });
  };

  return (
    <TabPressAnimationContext.Provider value={pressProgress}>
      <Pressable {...props} onPress={onPress} onPressIn={handlePressIn}>
        {children}
      </Pressable>
    </TabPressAnimationContext.Provider>
  );
}

/** Animates its child icon using the nearest {@link HapticTabButton} press. */
export function AnimatedTabIcon({ children }: { children: ReactNode }) {
  const contextProgress = useContext(TabPressAnimationContext);
  const fallbackProgress = useSharedValue(0);
  const pressProgress = contextProgress ?? fallbackProgress;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: 1 + pressProgress.value * 0.1 },
      { scaleY: 1 - pressProgress.value * 0.06 },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
