import '../global.css';

import { Stack } from 'expo-router';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Uniwind } from 'uniwind';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode="dark">
          <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  
  );
}
