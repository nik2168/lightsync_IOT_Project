// layout.tsx or RootLayout.tsx
import { store } from "@/redux/store"; // adjust the path to your store
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import SocketInit from "@/redux/socketContext";
import "react-native-reanimated";
import "../global.css";

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
        <SocketInit>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true,
              }}
            />

            <Stack.Screen
              name="motionalerts"
              options={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true,
              }}
            />
            {/* <Stack.Screen
              name="bruno"
              options={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true,
              }}
            /> */}
            <Stack.Screen
              name="light/[id]"
              options={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true,
              }}
            />
          </Stack>
        </SocketInit>
      </GestureHandlerRootView>
    </Provider>
  );
}
