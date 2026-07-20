import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      testID="home-screen"
    >
      <Text className="text-3xl font-brand-bold text-text-heading">HCMS</Text>
    </View>
  );
}
