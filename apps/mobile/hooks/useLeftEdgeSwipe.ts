import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  ReduceMotion,
  type SharedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const EDGE_WIDTH = 24;
const ACTIVATION_DISTANCE = 4;
const MIN_SWIPE_DISTANCE = 72;
const SWIPE_COMPLETION_RATIO = 0.45;
const SWIPE_PROGRESS_RATIO = 0.65;
const VERTICAL_TOLERANCE = 20;

type UseLeftEdgeSwipeOptions = {
  enabled?: boolean;
  onSwipe: () => void;
  progress?: SharedValue<number>;
};

/**
 * Creates a left-edge pan gesture that invokes a callback once per completed
 * swipe.
 *
 * The completion distance scales with viewport width and has a minimum
 * threshold. When supplied, `progress` is updated from zero to one and springs
 * back to zero after an incomplete swipe.
 */
export function useLeftEdgeSwipe({
  enabled = true,
  onSwipe,
  progress,
}: UseLeftEdgeSwipeOptions) {
  const { width } = useWindowDimensions();
  const hasCompleted = useSharedValue(false);

  return useMemo(() => {
    const swipeDistance = Math.max(
      MIN_SWIPE_DISTANCE,
      width * SWIPE_COMPLETION_RATIO,
    );
    const progressDistance = Math.max(
      MIN_SWIPE_DISTANCE * 2,
      width * SWIPE_PROGRESS_RATIO,
    );

    return Gesture.Pan()
      .enabled(enabled)
      .hitSlop({ left: 0, width: EDGE_WIDTH })
      .activeOffsetX(ACTIVATION_DISTANCE)
      .failOffsetY([-VERTICAL_TOLERANCE, VERTICAL_TOLERANCE])
      .onBegin(() => {
        hasCompleted.value = false;
      })
      .onUpdate(({ translationX }) => {
        if (progress) {
          progress.value = Math.min(
            Math.max(translationX / progressDistance, 0),
            1,
          );
        }

        if (translationX >= swipeDistance && !hasCompleted.value) {
          hasCompleted.value = true;
          scheduleOnRN(onSwipe);
        }
      })
      .onEnd(() => {
        if (!hasCompleted.value && progress) {
          progress.value = withSpring(0, {
            damping: 18,
            reduceMotion: ReduceMotion.System,
            stiffness: 220,
          });
        }
      })
      .onFinalize((_event, success) => {
        if (!success && !hasCompleted.value && progress) {
          progress.value = withSpring(0, {
            damping: 18,
            reduceMotion: ReduceMotion.System,
            stiffness: 220,
          });
        }

        hasCompleted.value = false;
      });
  }, [enabled, hasCompleted, onSwipe, progress, width]);
}
