import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ImageBackground,
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

const LIGHT_CONFIG = {
  green: {
    name: "Smart Light",
    location: "Kitchen",
    color: "#10b981",
    lightColor: "#22c55e",
    gradientColors: [
      "rgba(0,0,0,0.1)",
      "rgba(145,145,145,0.95)",
      "rgba(255,255,255,1)",
    ],
    iconColor: "#059669",
  },
  red: {
    name: "Smart Light",
    location: "Living Room",
    color: "#ef4444",
    lightColor: "#f87171",
    gradientColors: [
      "rgba(239,68,68,0.1)",
      "rgba(145,145,145,0.95)",
      "rgba(255,255,255,1)",
    ],
    iconColor: "#dc2626",
  },
  yellow: {
    name: "Smart Light",
    location: "Bedroom",
    color: "#f59e0b",
    lightColor: "#fbbf24",
    gradientColors: [
      "rgba(245,158,11,0.1)",
      "rgba(145,145,145,0.95)",
      "rgba(255,255,255,1)",
    ],
    iconColor: "#d97706",
  },
} as const;

type LightConfigKey = keyof typeof LIGHT_CONFIG;

export default function SingleLightControl() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const socket = getSocket();
  const dispatch = useAppDispatch();

  const typedId = (Array.isArray(id) ? id[0] : id) as LightConfigKey;
  const currentLight = LIGHT_CONFIG[typedId] || LIGHT_CONFIG.green;

  const { greenLedState, greenLedBrightness } = useAppSelector(
    (state) => state.lightSyncState
  );

  const [localBrightness, setLocalBrightness] = useState(
    Math.round((greenLedBrightness / 255) * 100)
  );
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newBrightness = Math.round((greenLedBrightness / 255) * 100);
    setLocalBrightness(newBrightness);
  }, [greenLedBrightness]);

  const debouncedBrightnessChange = useCallback(
    (value: number) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const esp32Brightness = Math.round((value / 100) * 255);
        dispatch(updateGreenBrightness(esp32Brightness));

        if (typedId === "green") {
          socket.emit("setGreenBrightness", { brightness: esp32Brightness });
        }
      }, 0);
    },
    [socket, typedId, dispatch]
  );

  useEffect(() => {
    socket.on("greenBrightnessUpdate", (data: { brightness: number }) => {
      dispatch(updateGreenBrightness(data.brightness));
    });

    socket.on("ledUpdate", (data: any) => {
      dispatch(updateLedStates(data));
    });

    socket.on(
      "sensorUpdate",
      (data: {
        redLedState: boolean;
        greenLedState: boolean;
        yellowLedState: boolean;
        allLightsState: boolean;
      }) => {
        dispatch(updateLedStates(data));
      }
    );

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      socket.off("greenBrightnessUpdate");
      socket.off("ledUpdate");
      socket.off("sensorUpdate");
    };
  }, [socket, dispatch]);

  const handleSliderChange = (value: number) => setLocalBrightness(value);
  const handleSliderComplete = (value: number) =>
    debouncedBrightnessChange(value);

  const toggleLight = () => {
    dispatch(toggleGreenLed());
    if (typedId === "green") {
      socket.emit("toggleGreenLed", { greenLedState: !greenLedState });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ImageBackground
        source={{
          uri: "https://source.unsplash.com/1200x800/?home,smart,house",
        }}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={currentLight.gradientColors}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 pt-[5rem]">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 bg-white rounded-full shadow-sm"
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-gray-800 text-2xl font-semibold">
                {currentLight.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                {currentLight.location}
              </Text>
            </View>

            <View className="w-10" />
          </View>

          {/* Status Cards Row */}
          <View className="flex-row gap-4 px-6 mt-6">
            {/* Brightness Status */}
            <View className="bg-white rounded-3xl p-6 flex-1 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons
                  name="sunny"
                  size={24}
                  color={currentLight.iconColor}
                />
                <Text className="text-2xl font-bold text-gray-900">
                  {Math.round(localBrightness)}%
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Brightness</Text>
            </View>

            {/* Light Status */}
            <TouchableOpacity
              onPress={toggleLight}
              className="bg-white rounded-3xl p-6 flex-1 shadow-sm"
            >
              <View className="flex-row items-center justify-between mb-2">
                <MaterialCommunityIcons
                  name={greenLedState ? "lightbulb-on" : "lightbulb-outline"}
                  size={24}
                  color={greenLedState ? currentLight.color : "#d1d5db"}
                />
                <Text
                  className="text-2xl font-bold"
                  style={{
                    color: greenLedState ? currentLight.color : "#6b7280",
                  }}
                >
                  {greenLedState ? "ON" : "OFF"}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Power Status</Text>
            </TouchableOpacity>
          </View>

          {/* Main Brightness Control */}
          <View className="flex-1 px-6 py-8 justify-center">
            <View className="bg-white rounded-3xl p-8 shadow-sm">
              <Text className="text-center text-gray-800 text-xl font-semibold mb-6">
                Brightness Control
              </Text>

              {/* Large Brightness Display */}
              <View className="items-center mb-8">
                <Text
                  className="text-7xl font-light mb-2"
                  style={{
                    color: greenLedState ? currentLight.color : "#d1d5db",
                  }}
                >
                  {Math.round(localBrightness)}%
                </Text>
                <Text className="text-gray-600">
                  {localBrightness > 75
                    ? "High"
                    : localBrightness > 40
                    ? "Medium"
                    : "Low"}
                </Text>
              </View>

              {/* Slider Control */}
              <View className="mb-6">
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  value={localBrightness}
                  onValueChange={handleSliderChange}
                  onSlidingComplete={handleSliderComplete}
                  minimumTrackTintColor={currentLight.color}
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor={currentLight.color}
                  disabled={!greenLedState}
                />

                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-500 text-sm">0%</Text>
                  <Text className="text-gray-500 text-sm">100%</Text>
                </View>
              </View>

              {/* Quick Controls */}
              <View className="flex-row justify-center gap-4">
                <TouchableOpacity
                  onPress={() => {
                    setLocalBrightness(25);
                    debouncedBrightnessChange(25);
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-gray-700 font-medium">25%</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLocalBrightness(50);
                    debouncedBrightnessChange(50);
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-gray-700 font-medium">50%</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLocalBrightness(100);
                    debouncedBrightnessChange(100);
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-gray-700 font-medium">100%</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
