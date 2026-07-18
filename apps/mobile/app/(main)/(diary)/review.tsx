import { Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function ReviewScreen() {
  const { usesSidebar } = useResponsiveLayout();

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ paddingBottom: usesSidebar ? 0 : 112 }}
      testID="diary-review-screen"
    >
      <Text className="font-brand-semibold text-display text-text-heading">
        검토
      </Text>
    </View>
  );
}
