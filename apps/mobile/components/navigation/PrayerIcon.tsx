import { Asset } from "expo-asset";
import { type ColorValue } from "react-native";
import { SvgUri } from "react-native-svg";

const prayerOutlineAsset = require("../../assets/icons/praying-hands-outline.svg");
const prayerFilledAsset = require("../../assets/icons/praying-hands.svg");

type PrayerIconProps = {
  color: ColorValue;
  focused: boolean;
  size: number;
};

/** Renders the filled or outlined prayer icon according to tab focus state. */
export function PrayerIcon({ color, focused, size }: PrayerIconProps) {
  const prayerAsset = focused ? prayerFilledAsset : prayerOutlineAsset;
  const prayerUri = Asset.fromModule(prayerAsset).uri;

  return <SvgUri color={color} height={size} uri={prayerUri} width={size} />;
}
