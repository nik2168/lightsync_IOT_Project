// components/FanSpeedControl.tsx - Actually simple rotation speed
import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getSocket } from "@/redux/socket";
import { updateGreenBrightness } from "@/redux/lightSyncSlice";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

export default function FanSpeedControl() {
  const dispatch = useAppDispatch();
  const socket = getSocket();

  const { greenLedState, greenLedBrightness } = useAppSelector(
    (state) => state.lightSyncState
  );

  const [localSpeed, setLocalSpeed] = useState(
    Math.round((greenLedBrightness / 255) * 100)
  );
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Simple rotation
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Start animation once, let it run
  useEffect(() => {
    if (greenLedState) {
      // Start infinite rotation - we'll just let it run
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 400, // Fixed 1 second per rotation
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [greenLedState]); // Only depend on fan on/off, not speed

  // Update local speed when Redux state changes
  useEffect(() => {
    const newSpeed = Math.round((greenLedBrightness / 255) * 100);
    setLocalSpeed(newSpeed);
  }, [greenLedBrightness]);

  // Debounced speed change for ESP32
  const debouncedSpeedChange = useCallback(
    (value: number) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const esp32Brightness = Math.round((value / 100) * 255);
        dispatch(updateGreenBrightness(esp32Brightness));
        socket.emit("setGreenBrightness", { brightness: esp32Brightness });
      }, 100);
    },
    [socket, dispatch]
  );

  const handleSliderChange = (value: number) => setLocalSpeed(value);
  const handleSliderComplete = (value: number) => debouncedSpeedChange(value);

  // Get speed level text
  const getSpeedLevel = () => {
    if (localSpeed >= 80) return "High";
    if (localSpeed >= 50) return "Medium";
    if (localSpeed >= 20) return "Low";
    return "Off";
  };

  // Quick speed presets
  const setQuickSpeed = (speed: number) => {
    setLocalSpeed(speed);
    debouncedSpeedChange(speed);
  };

  // Don't render if fan is off
  //   if (!greenLedState) return null;

  return (
    <View className="rounded-3xl overflow-hidden mb-4">
      <ImageBackground
        source={require("@/assets/home/balloon.jpg")}
        className="p-4"
        imageStyle={{ borderRadius: 24 }}
        resizeMode="cover"
      >
        {/* Semi-transparent overlay */}
        <View className="absolute inset-0 bg-black/40 rounded-3xl" />

        {/* Content */}
        <View className="relative z-10">
          {/* Header Row */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="bg-white/20 backdrop-blur rounded-full p-2 mr-3">
                <Animated.View style={animatedStyle}>
                  <MaterialCommunityIcons
                    name="fan"
                    size={28}
                    color="#ffffff"
                  />
                </Animated.View>
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">
                  Fan Speed
                </Text>
                <Text className="text-gray-200 text-xs">PWM Control</Text>
              </View>
            </View>

            {/* Speed Display */}
            <View className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2">
              <Text className="text-white text-2xl font-bold text-center">
                {localSpeed}%
              </Text>
              <Text className="text-gray-200 text-xs text-center">
                {getSpeedLevel()}
              </Text>
            </View>
          </View>

          {/* Speed Slider */}
          <View className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={100}
              value={localSpeed}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor="#60a5fa"
              maximumTrackTintColor="#ffffff20"
              thumbTintColor="#60a5fa"
              step={5}
              disabled={!greenLedState}
            />

            {/* Slider Labels */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-200 text-xs">Off</Text>
              <Text className="text-gray-200 text-xs">Low</Text>
              <Text className="text-gray-200 text-xs">Med</Text>
              <Text className="text-gray-200 text-xs">High</Text>
              <Text className="text-gray-200 text-xs">Max</Text>
            </View>
          </View>

          {/* Quick Speed Controls */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setQuickSpeed(0)}
              className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 mr-2 items-center"
            >
              <MaterialCommunityIcons
                name="fan-off"
                size={20}
                color="#ffffff"
              />
              <Text className="text-white text-xs font-medium mt-1">Off</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setQuickSpeed(25)}
              className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 mr-2 items-center"
            >
              <MaterialCommunityIcons
                name="fan-speed-1"
                size={20}
                color="#ffffff"
              />
              <Text className="text-white text-xs font-medium mt-1">Low</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setQuickSpeed(60)}
              className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 mr-2 items-center"
            >
              <MaterialCommunityIcons
                name="fan-speed-2"
                size={20}
                color="#ffffff"
              />
              <Text className="text-white text-xs font-medium mt-1">Med</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setQuickSpeed(100)}
              className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 items-center"
            >
              <MaterialCommunityIcons
                name="fan-speed-3"
                size={20}
                color="#ffffff"
              />
              <Text className="text-white text-xs font-medium mt-1">Max</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
