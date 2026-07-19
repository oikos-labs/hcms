import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";

const EDGE_WIDTH = 24;
const ACTIVATION_DISTANCE = 20;
const SWIPE_DISTANCE = 72;
const FLICK_DISTANCE = 32;
const FLICK_VELOCITY = 500;
const VERTICAL_TOLERANCE = 20;

type UseLeftEdgeSwipeOptions = {
  enabled?: boolean;
  onSwipe: () => void;
};

export function useLeftEdgeSwipe({
  enabled = true,
  onSwipe,
}: UseLeftEdgeSwipeOptions) {
  return useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .hitSlop({ left: 0, width: EDGE_WIDTH })
        .activeOffsetX(ACTIVATION_DISTANCE)
        .failOffsetY([-VERTICAL_TOLERANCE, VERTICAL_TOLERANCE])
        .runOnJS(true)
        .onEnd(({ translationX, velocityX }) => {
          const isLongSwipe = translationX >= SWIPE_DISTANCE;
          const isQuickFlick =
            translationX >= FLICK_DISTANCE && velocityX >= FLICK_VELOCITY;

          if (isLongSwipe || isQuickFlick) {
            onSwipe();
          }
        }),
    [enabled, onSwipe],
  );
}
