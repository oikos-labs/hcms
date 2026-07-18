import { Text, View } from "react-native";

export default function NanumScreen() {
  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      testID="nanum-screen"
    >
      <Text className="font-brand-semibold text-display text-text-heading">
        나눔
      </Text>
    </View>
  );
}
