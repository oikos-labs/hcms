import { Text, View } from "react-native";

export default function MokwonScreen() {
  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      testID="mokwon-screen"
    >
      <Text className="font-brand-semibold text-display text-text-heading">
        목원
      </Text>
    </View>
  );
}
