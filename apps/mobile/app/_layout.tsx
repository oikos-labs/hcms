import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useResolveClassNames } from "uniwind";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import "@/global.css";

export { ErrorBoundary } from "expo-router";

void SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const { theme, resolvedTheme, isHydrated } = useTheme();
  const activityIndicatorStyle = useResolveClassNames("text-brand-500");
  const stackContentStyle = useResolveClassNames("flex-1 bg-background");
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
  });
  const isReady = isHydrated && (fontsLoaded || fontError != null);

  useEffect(() => {
    if (fontError) {
      console.warn("Unable to load custom fonts.", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={activityIndicatorStyle.color} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GestureHandlerRootView className="flex-1">
        <GluestackUIProvider mode={theme} style={config[resolvedTheme]}>
          <Stack
            screenOptions={{
              contentStyle: stackContentStyle,
              headerShown: false,
            }}
          />
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
