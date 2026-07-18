import { Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function MissionScreen() {
  const { usesSidebar } = useResponsiveLayout();

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ paddingBottom: usesSidebar ? 0 : 112 }}
    >
      <Text className="font-brand-semibold text-display text-text-heading">
        선교
      </Text>
    </View>
  );
}
