import * as Haptics from "expo-haptics";
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  AnimatedTabIcon,
  HapticTabButton,
} from "../components/navigation/HapticTabButton";

jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light" },
  impactAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: { View },
    ReduceMotion: { System: "system" },
    cancelAnimation: jest.fn(),
    useAnimatedStyle: (getStyle: () => object) => getStyle(),
    useSharedValue: (value: number) => ({ value }),
    withSequence: (...values: number[]) => values.at(-1),
    withTiming: (value: number) => value,
  };
});

describe("HapticTabButton", () => {
  it("plays light haptics and forwards every press", async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <HapticTabButton accessibilityRole="button" onPress={onPress}>
        <AnimatedTabIcon>
          <Text>Home</Text>
        </AnimatedTabIcon>
      </HapticTabButton>,
    );
    const button = getByRole("button");

    await fireEvent(button, "pressIn");
    await fireEvent.press(button);
    await fireEvent(button, "pressIn");
    await fireEvent.press(button);

    expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});
