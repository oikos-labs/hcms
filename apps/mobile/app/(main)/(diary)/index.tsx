import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Platform, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMainTabHistory } from "@/context/MainTabHistoryContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function DiaryScreen() {
  const mainTabsNavigation = useNavigation("/(main)");
  const { getPreviousMainTab } = useMainTabHistory();
  const insets = useSafeAreaInsets();
  const { usesSidebar } = useResponsiveLayout();

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        mainTabsNavigation.navigate(getPreviousMainTab() as never);
        return true;
      },
    );

    return () => subscription.remove();
  }, [getPreviousMainTab, mainTabsNavigation]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: usesSidebar ? 32 : 150 + Math.max(insets.bottom, 16),
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
      testID="diary-index-screen"
    >
      <Text className="font-brand-regular text-display text-text-heading">
        일기 Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since 1966, when designers at Letraset and James Mosley, the librarian
        at St Bride Printing Library in London, took a 1914 Cicero translation
        and scrambled it to make dummy text for Letraset's Body Type sheets. It
        has survived not only many decades, but also the leap into electronic
        typesetting, remaining essentially unchanged. Lorem Ipsum is simply
        dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since 1966, when designers
        at Letraset and James Mosley, the librarian at St Bride Printing Library
        in London, took a 1914 Cicero translation and scrambled it to make dummy
        text for Letraset's Body Type sheets. It has survived not only many
        decades, but also the leap into electronic typesetting, remaining
        essentially unchanged. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since 1966, when designers at Letraset and James Mosley,
        the librarian at St Bride Printing Library in London, took a 1914 Cicero
        translation and scrambled it to make dummy text for Letraset's Body Type
        sheets. It has survived not only many decades, but also the leap into
        electronic typesetting, remaining essentially unchanged. Lorem Ipsum is
        simply dummy text of the printing and typesetting industry. Lorem Ipsum
        has been the industry's standard dummy text ever since 1966, when
        designers at Letraset and James Mosley, the librarian at St Bride
        Printing Library in London, took a 1914 Cicero translation and scrambled
        it to make dummy text for Letraset's Body Type sheets. It has survived
        not only many decades, but also the leap into electronic typesetting,
        remaining essentially unchanged. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since 1966, when designers at Letraset and
        James Mosley, the librarian at St Bride Printing Library in London, took
        a 1914 Cicero translation and scrambled it to make dummy text for
        Letraset's Body Type sheets. It has survived not only many decades, but
        also the leap into electronic typesetting, remaining essentially
        unchanged.
      </Text>
    </ScrollView>
  );
}
