// layout.tsx or RootLayout.tsx
import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; // adjust the path to your store

import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />

          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
