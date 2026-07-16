import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import "@/global.css";

export { ErrorBoundary } from "expo-router";

void SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const { theme, resolvedTheme, isHydrated } = useTheme();

  useEffect(() => {
    if (isHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#EFF4F8",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#128575" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode={theme} style={config[resolvedTheme]}>
          <Stack screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
