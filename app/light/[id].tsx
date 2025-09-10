import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { getSocket } from "@/redux/socket";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  updateGreenBrightness,
  toggleGreenLed,
  updateLedStates,
} from "@/redux/lightSyncSlice";

const { width } = Dimensions.get("window");

// Light configuration for different colors
import { ColorValue } from "react-native";

const LIGHT_CONFIG: Record<
  string,
  {
    name: string;
    location: string;
    color: string;
    lightColor: string;
    gradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]];
    iconColor: string;
  }
> = {
  green: {
    name: "Smart Light",
    location: "Kitchen",
    color: "#10b981",
    lightColor: "#22c55e",
    gradientColors: ["#dcfce7", "#bbf7d0", "#86efac"] as const,
    iconColor: "#059669",
  },
  red: {
    name: "Smart Light",
    location: "Living Room",
    color: "#ef4444",
    lightColor: "#f87171",
    gradientColors: ["#fef2f2", "#fecaca", "#fca5a5"] as const,
    iconColor: "#dc2626",
  },
  yellow: {
    name: "Smart Light",
    location: "Bedroom",
    color: "#f59e0b",
    lightColor: "#fbbf24",
    gradientColors: ["#fffbeb", "#fef3c7", "#fde68a"] as const,
    iconColor: "#d97706",
  },
};

export default function SingleLightControl() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const socket = getSocket();
  const dispatch = useAppDispatch();

  // Get current light config
  const currentLight =
    LIGHT_CONFIG[id as keyof typeof LIGHT_CONFIG] || LIGHT_CONFIG.green;

  // Get state from Redux store
  const { greenLedState, greenLedBrightness } = useAppSelector(
    (state) => state.lightSyncState
  );

  // **Local state for smooth slider UI** (prevents flickering)
  const [localBrightness, setLocalBrightness] = useState(
    Math.round((greenLedBrightness / 255) * 100)
  );

  // Debounce timer ref for brightness control
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with Redux when ESP32 sends updates
  useEffect(() => {
    const newBrightness = Math.round((greenLedBrightness / 255) * 100);
    setLocalBrightness(newBrightness);
  }, [greenLedBrightness]);

  // **Debounced brightness change handler (150ms)**
  const debouncedBrightnessChange = useCallback(
    (value: number) => {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for 150ms delay
      debounceTimer.current = setTimeout(() => {
        // Convert 0-100 to 0-255 for ESP32
        const esp32Brightness = Math.round((value / 100) * 255);

        // Update Redux store
        dispatch(updateGreenBrightness(esp32Brightness));

        if (id === "green") {
          socket.emit("setGreenBrightness", { brightness: esp32Brightness });
        }
        console.log(
          `🎛️ Debounced brightness sent: ${esp32Brightness} (UI: ${value}%)`
        );
      }, 150);
    },
    [socket, id, dispatch]
  );

  useEffect(() => {
    // Listen for brightness updates from ESP32 (potentiometer changes)
    socket.on("greenBrightnessUpdate", (data) => {
      console.log("🎛️ Brightness update from ESP32:", data);
      dispatch(updateGreenBrightness(data.brightness));
    });

    // Listen for LED state updates
    socket.on("ledUpdate", (data) => {
      console.log("💡 LED update received in single control:", data);
      dispatch(updateLedStates(data));
    });

    // Listen for sensor updates to get initial state
    socket.on("sensorUpdate", (data) => {
      console.log("📡 Sensor update received in single control:", data);
      dispatch(
        updateLedStates({
          redLedState: data.redLedState,
          greenLedState: data.greenLedState,
          yellowLedState: data.yellowLedState,
          allLightsState: data.allLightsState,
        })
      );
    });

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      socket.off("greenBrightnessUpdate");
      socket.off("ledUpdate");
      socket.off("sensorUpdate");
    };
  }, [socket, id, dispatch]);

  // Toggle light on/off with Redux
  const toggleLight = () => {
    dispatch(toggleGreenLed()); // Optimistic update

    if (id === "green") {
      socket.emit("toggleGreenLed", { greenLedState: !greenLedState });
    }
  };

  // **Immediate UI update** (no lag)
  const handleSliderChange = (value: number) => {
    setLocalBrightness(value);
  };

  // **Debounced Redux/Network update** (prevents flickering)
  const handleSliderComplete = (value: number) => {
    debouncedBrightnessChange(value);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={currentLight.gradientColors} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4 pt-12">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
            <View className="w-6 h-6 bg-gray-800 rounded-full" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 py-8">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {currentLight.name}
            </Text>
            <Text className="text-gray-600">{currentLight.location}</Text>
          </View>

          {/* Light Switch */}
          <View className="mb-8">
            <Switch
              value={greenLedState}
              onValueChange={toggleLight}
              trackColor={{ false: "#d1d5db", true: currentLight.color }}
              thumbColor="#ffffff"
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </View>

          {/* Brightness Control Section */}
          <View className="flex-1 items-center justify-center">
            {/* Brightness Label */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                {localBrightness > 75
                  ? "High"
                  : localBrightness > 40
                  ? "Medium"
                  : "Low"}
              </Text>
            </View>

            {/* **iOS-Style Vertical Brightness Slider** */}
            <View className="flex-1 items-center justify-center mb-8">
              <View
                className="bg-white rounded-3xl shadow-lg items-center justify-center relative overflow-hidden"
                style={{ width: width * 0.18, height: width * 0.75 }}
              >
                {/* Background fill effect */}
                <View
                  className="absolute bottom-0 left-0 right-0 rounded-3xl"
                  style={{
                    backgroundColor: greenLedState
                      ? currentLight.lightColor
                      : "#f3f4f6",
                    opacity: greenLedState
                      ? (localBrightness / 100) * 0.8
                      : 0.1,
                    height: `${localBrightness}%`,
                  }}
                />

                {/* **Fixed Slider** - No continuous Redux updates */}
                <Slider
                  style={{
                    width: width * 0.6,
                    height: 44,
                    transform: [{ rotate: "270deg" }],
                  }}
                  minimumValue={0}
                  maximumValue={100}
                  value={localBrightness}
                  onValueChange={handleSliderChange} // **Local state only**
                  onSlidingComplete={handleSliderComplete} // **Redux/Network update**
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="#ffffff"
                  disabled={!greenLedState}
                />
              </View>
            </View>

            {/* Light Bulb Icon & Brightness Percentage */}
            <View className="items-center mb-8">
              {/* Modern Light Icon */}
              <View className="mb-4">
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={60}
                  color={greenLedState ? currentLight.iconColor : "#9ca3af"}
                />
              </View>

              <Text className="text-4xl font-bold text-gray-900 mb-1">
                {Math.round(localBrightness)}%
              </Text>
              <Text className="text-gray-600">Brightness</Text>
            </View>
          </View>

          {/* Schedule Section */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Schedule
              </Text>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#9ca3af"
              />
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-sm text-gray-600">From</Text>
                <Text className="text-base font-medium">12:00 AM</Text>
              </View>
              <Text className="text-gray-400 text-2xl">↓</Text>
              <View>
                <Text className="text-sm text-gray-600">To</Text>
                <Text className="text-base font-medium">12:00 AM</Text>
              </View>
            </View>
          </View>

          {/* **iOS-Style Intensity Section** */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Intensity
              </Text>
              <Text className="text-base font-medium text-gray-900">
                {Math.round(localBrightness)}%
              </Text>
            </View>

            {/* **iOS-style intensity bars** */}
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-gray-500">off</Text>

              <View className="flex-row flex-1 mx-4 justify-between items-end">
                {Array.from({ length: 10 }, (_, i) => {
                  const barHeight = 12 + i * 3; // Progressive height increase
                  const isActive =
                    (i + 1) * 10 <= localBrightness && greenLedState;

                  return (
                    <View
                      key={i}
                      className="w-1.5 rounded-full"
                      style={{
                        height: barHeight,
                        backgroundColor: isActive
                          ? currentLight.color
                          : "#e5e7eb",
                        opacity: isActive ? 1 : 0.3,
                      }}
                    />
                  );
                })}
              </View>

              <Text className="text-xs text-gray-500">100%</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
