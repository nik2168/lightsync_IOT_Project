import Bruno from "@/components/custom/Bruno";
import EnergySummary from "@/components/custom/Energy/EnergySummary";
import FanSpeedControl from "@/components/custom/Home/FanSpeedControl";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  addMotionAlert,
  toggleAllLights,
  toggleGreenLed,
  toggleRedLed,
  toggleYellowLed,
  updateGreenBrightness,
  updateLedStates,
  updateMotionDetected,
  updateSensorData,
} from "@/redux/lightSyncSlice";
import { getSocket } from "@/redux/socket";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import * as Updates from "expo-updates";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function SmartHomeScreen() {
  const dispatch = useAppDispatch();
  const {
    temperature,
    humidity,
    redLedState,
    greenLedState,
    yellowLedState,
    allLightsState,
    motionDetected,
    motionAlerts,
  } = useAppSelector((state) => state.lightSyncState);

  const router = useRouter();
  const socket = getSocket();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  // ✅ NEW: Motion alert settings state
  const [motionAlertsEnabled, setMotionAlertsEnabled] = useState(true);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);

  // ✅ STEP 1: Create useCallback functions with dependencies for fresh Redux values
  const handleToggleRedLed = useCallback(() => {
    console.log("🔴 Toggling Red LED, current state:", redLedState);
    dispatch(toggleRedLed());
    socket.emit("toggleRedLed", { redLedState: !redLedState });
  }, [redLedState, dispatch, socket]);

  const handleToggleGreenLed = useCallback(() => {
    console.log("🟢 Toggling Green LED, current state:", greenLedState);
    dispatch(toggleGreenLed());
    socket.emit("toggleGreenLed", { greenLedState: !greenLedState });
  }, [greenLedState, dispatch, socket]);

  const handleToggleYellowLed = useCallback(() => {
    console.log("🟡 Toggling Yellow LED, current state:", yellowLedState);
    dispatch(toggleYellowLed());
    socket.emit("toggleYellowLed", { yellowLedState: !yellowLedState });
  }, [yellowLedState, dispatch, socket]);

  const handleToggleAllLights = useCallback(() => {
    console.log("💡 Toggling All Lights, current state:", allLightsState);
    dispatch(toggleAllLights());

    // Toggle individual lights
    handleToggleYellowLed();
    handleToggleGreenLed();
    handleToggleRedLed();

    socket.emit("toggleAllLights", { allLightsState: !allLightsState });
  }, [
    allLightsState,
    dispatch,
    socket,
    handleToggleRedLed,
    handleToggleGreenLed,
    handleToggleYellowLed,
  ]);

  // ✅ NEW: Advanced motion alert speech function
  const speakMotionAlert = useCallback(
    (alertCount: number, location: string, time: string) => {
      if (!motionAlertsEnabled) {
        console.log("🔇 Motion alerts disabled, skipping speech");
        return;
      }

      let message = "";
      const currentTime = Date.now();
      const timeSinceLastAlert = currentTime - lastAlertTime;

      // ✅ Advanced speech logic based on alert frequency and count
      if (timeSinceLastAlert < 30000) {
        // Less than 30 seconds since last alert
        console.log("⏰ Recent alert detected, using brief message");
        message = `Motion detected again at ${location}.`;
      } else if (alertCount === 1) {
        message = `Security Alert: Motion detected at ${location} ${time}.`;
      } else if (alertCount <= 5) {
        message = `Alert: ${alertCount} motion detections at ${location}. Latest ${time}.`;
      } else if (alertCount <= 10) {
        message = `Warning: Multiple motion alerts detected. Total ${alertCount} incidents at ${location}.`;
      } else {
        message = `Critical: High motion activity detected. ${alertCount} alerts at ${location}. Please check the area.`;
      }

      console.log("🗣️ Speaking motion alert:", message);

      // ✅ Different voice settings based on alert severity
      const voiceConfig = {
        language: "en-US",
        pitch: alertCount > 5 ? 0.75 : 0.85, // Lower pitch for serious alerts
        rate: alertCount > 10 ? 0.7 : 0.8, // Slower for critical alerts
        volume: 1.0,
        onDone: () => {
          console.log("✅ Motion alert speech completed");
          setLastAlertTime(currentTime);
        },
        onError: (error: any) => console.log("❌ TTS Error:", error),
      };

      Speech.speak(message, voiceConfig);
    },
    [motionAlertsEnabled, lastAlertTime]
  );

  // ✅ STEP 2: Create refs for functions used in event listeners
  const handleToggleRedLedRef = useRef(handleToggleRedLed);
  const handleToggleGreenLedRef = useRef(handleToggleGreenLed);
  const handleToggleYellowLedRef = useRef(handleToggleYellowLed);
  const handleToggleAllLightsRef = useRef(handleToggleAllLights);
  const speakMotionAlertRef = useRef(speakMotionAlert);

  // ✅ STEP 3: Update refs whenever functions change
  useEffect(() => {
    handleToggleRedLedRef.current = handleToggleRedLed;
    handleToggleGreenLedRef.current = handleToggleGreenLed;
    handleToggleYellowLedRef.current = handleToggleYellowLed;
    handleToggleAllLightsRef.current = handleToggleAllLights;
    speakMotionAlertRef.current = speakMotionAlert;
  }, [
    handleToggleRedLed,
    handleToggleGreenLed,
    handleToggleYellowLed,
    handleToggleAllLights,
    speakMotionAlert,
  ]);

  // ✅ STEP 4: Debug Redux state changes
  useEffect(() => {
    console.log("🔄 Index Redux state updated:", {
      temperature,
      humidity,
      redLedState,
      greenLedState,
      yellowLedState,
      allLightsState,
      motionDetected,
      alertCount: motionAlerts.length,
    });
  }, [
    temperature,
    humidity,
    redLedState,
    greenLedState,
    yellowLedState,
    allLightsState,
    motionDetected,
    motionAlerts,
  ]);

  // ✅ NEW: Advanced motion alert system - separate useEffect
  useEffect(() => {
    if (motionAlerts.length === 0) return;

    const latestAlert = motionAlerts[motionAlerts.length - 1];
    const alertCount = motionAlerts.length;

    console.log("🚨 Motion alert triggered:", {
      alertCount,
      location: latestAlert.location,
      time: latestAlert.time,
      motionAlertsEnabled,
    });

    // ✅ Use ref to call current version of speech function with fresh state
    speakMotionAlertRef.current(
      alertCount,
      latestAlert.location,
      latestAlert.time
    );

    // ✅ Auto-enable yellow LED on motion (using ref for fresh state)
    if (!yellowLedState) {
      console.log("💡 Auto-enabling yellow LED for motion detection");
      handleToggleYellowLedRef.current();
    }
  }, [motionAlerts.length]); // Only depend on alert count to avoid duplicate triggers

  // ✅ Socket listeners setup
  useEffect(() => {
    // SENSOR UPDATES
    socket.on("sensorUpdate", (data) => {
      dispatch(
        updateSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
        })
      );
      dispatch(
        updateLedStates({
          redLedState: data.redLedState,
          greenLedState: data.greenLedState,
          yellowLedState: data.yellowLedState,
          allLightsState: data.allLightsState,
        })
      );
    });

    // MOTION DETECTION
    socket.on("objectDetected", (data) => {
      console.log("📡 Motion data received:", data);
      dispatch(updateMotionDetected(data.motion));

      if (data.motion) {
        const timestamp = new Date(data.timestamp);
        const day = timestamp.getDate();
        const month = timestamp.toLocaleString("en-US", { month: "short" });
        const time = timestamp.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          second: "2-digit",
        });

        const formattedTime = `at ${time.toLowerCase()}`;

        dispatch(
          addMotionAlert({
            id: data.deviceId,
            location: "Back Door",
            time: formattedTime,
            timestamp: data.timestamp,
          })
        );
      }
    });

    // LED UPDATES from backend
    socket.on("ledUpdate", (data) => {
      console.log("💡 ledUpdate received:", data);
      dispatch(updateLedStates(data));
    });

    // BRIGHTNESS UPDATES
    socket.on("greenBrightnessUpdate", (data) => {
      console.log("🎛️ Brightness update:", data);
      dispatch(updateGreenBrightness(data.brightness));
    });

    return () => {
      socket.off("sensorUpdate");
      socket.off("objectDetected");
      socket.off("ledUpdate");
      socket.off("greenBrightnessUpdate");
    };
  }, [socket, dispatch]); // ✅ Only depend on socket and dispatch, not state values

  // Check for updates
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdateAvailable(true);
        }
      } catch (e) {
        console.log("Error checking updates", e);
      }
    };
    checkUpdates();
  }, []);

  // Fan rotation animation
  const fanRotation = useSharedValue(0);

  const fanAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${fanRotation.value}deg`,
        },
      ],
    };
  }, []);

  useEffect(() => {
    console.log("Fan effect triggered, greenLedState:", greenLedState);

    if (greenLedState) {
      console.log("Starting fan rotation");
      fanRotation.value = withRepeat(
        withTiming(360, {
          duration: 400,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      console.log("Stopping fan rotation");
      cancelAnimation(fanRotation);
      fanRotation.value = withTiming(0, { duration: 300 });
    }
  }, [greenLedState]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ImageBackground
        source={{
          uri: `https://source.unsplash.com/random/1200x800/?interior,home`,
        }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-[3.5rem]">
          <View>
            <Text className="text-gray-800 text-sm">Hello, Jagdeep</Text>
            <Text className="text-gray-800 text-xl">
              {(() => {
                const now = new Date();
                const hours = now.getHours();
                if (hours < 12) return "Good Morning";
                if (hours < 17) return "Good Afternoon";
                return "Good Evening";
              })()}{" "}
              ,{" "}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 bg-gray-200 p-2 rounded-full">
            <TouchableOpacity className="p-2 bg-white rounded-full">
              <Ionicons name="menu" size={16} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/motionalerts")}
              className="p-2 bg-white rounded-full"
            >
              <Ionicons name="notifications-outline" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <UpdatePrompt isVisible={isUpdateAvailable} />

        <ScrollView>
          <View className="p-4 py-5 gap-3">
            {/* Temperature Card */}
            <View className="rounded-3xl overflow-hidden">
              <ImageBackground
                source={require("@/assets/home/homeplant.jpg")}
                className="p-4"
                imageStyle={{ borderRadius: 24 }}
                resizeMode="cover"
              >
                <View className="absolute inset-0 bg-black/10 rounded-3xl" />

                <View className="relative z-10">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-700 text-sm font-medium">
                        Temperature
                      </Text>
                    </View>
                    <View className="bg-white/20 backdrop-blur rounded-full p-2">
                      <Ionicons name="thermometer" size={16} color="#ffffff" />
                    </View>
                  </View>

                  <View className="items-center mb-6 w-full">
                    <View className="flex-row justify-center items-center mb-2">
                      <Ionicons name="water" size={14} color="#60a5fa" />
                      <Text className="text-gray-700 text-xs">
                        {" "}
                        humidity : {humidity}%
                      </Text>
                    </View>
                    <Text className="text-5xl font-medium text-gray-700 drop-shadow-lg">
                      {temperature}°
                    </Text>

                    <View className="flex-row justify-center mt-3 items-center bg-white/70 backdrop-blur rounded-full px-1 py-1">
                      <View className="w-2 h-2 bg-green-400 rounded-full" />
                      <Text className="text-gray-800 text-center text-xs mr-2">
                        {temperature >= 20 && temperature <= 30
                          ? "Comfortable"
                          : temperature < 20
                          ? "Cool"
                          : "Warm"}
                      </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* ✅ ENHANCED: Motion Alert with Toggle */}
            <View className="rounded-2xl">
              <View className="flex-row items-center bg-gray-200 rounded-full px-2 py-2 justify-between">
                <View className="flex-row items-center justify-center">
                  <TouchableOpacity className="w-12 h-12 bg-white flex-row rounded-full items-center justify-center">
                    <Ionicons
                      name={motionDetected ? "alert" : "checkmark-circle"}
                      size={20}
                      color={motionDetected ? "#ef4444" : "#10b981"}
                    />
                  </TouchableOpacity>
                  <View className="flex-col justify-center items-left ml-3 gap-1 mb-1">
                    <Text className="text-black text-sm font-semibold">
                      {motionDetected
                        ? `${motionAlerts.length} Motion alerts!`
                        : "No motion"}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {motionDetected && motionAlerts.length > 0
                        ? `On back door ${motionAlerts[0].time}`
                        : "All clear"}
                    </Text>
                  </View>
                </View>

                {/* ✅ NEW: Motion Alert Toggle Switch */}
                <View className="flex-row items-center gap-4">
                  <View className="flex-col items-center">
                    {/* <Switch
                      trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                      thumbColor={motionAlertsEnabled ? "#ffffff" : "#9ca3af"}
                      ios_backgroundColor="#d1d5db"
                      onValueChange={setMotionAlertsEnabled}
                      value={motionAlertsEnabled}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    /> */}
                    <TouchableOpacity
                      onPress={() =>
                        setMotionAlertsEnabled(!motionAlertsEnabled)
                      }
                      className={`w-9 h-9 rounded-full items-center justify-center ${
                        motionAlertsEnabled ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="volume-high"
                        size={26}
                        color="white"
                      />
                    </TouchableOpacity>
                    {/* <Text className="text-xs text-gray-600 mt-1">
                      {motionAlertsEnabled ? "🔊" : "🔇"}
                    </Text> */}
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/motionalerts",
                        params: { alerts: JSON.stringify(motionAlerts) },
                      })
                    }
                    className="bg-blue-500 px-4 py-2 mr-2 rounded-full"
                  >
                    <Text className="text-white text-sm font-medium">
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Lights Control */}
            <Text className="text-black text-lg font-semibold px-4 mt-6">
              Home Controls
            </Text>
            <View className="bg-gray-200 rounded-3xl">
              {/* First Row - Lamp 1 and Lamp 2 */}
              <View className="flex-row gap-3 p-3 rounded-3xl">
                {/* Lamp 1 */}
                <TouchableOpacity
                  onPress={handleToggleRedLed}
                  className="bg-white rounded-2xl flex-row justify-between p-4 flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Lamp 1
                    </Text>
                    <Text className="text-gray-500 text-xs">Front Door</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleToggleRedLed}
                    className={`w-11 h-11 rounded-full items-center justify-center ${
                      redLedState ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name="power"
                      size={26}
                      color="white"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Lamp 2 */}
                <TouchableOpacity
                  onPress={handleToggleYellowLed}
                  className="bg-white rounded-2xl flex-row justify-between p-4 flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Lamp 2
                    </Text>
                    <Text className="text-gray-500 text-xs">Back Door</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleToggleYellowLed}
                    className={`w-11 h-11 rounded-full items-center justify-center ${
                      yellowLedState ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name="power"
                      size={26}
                      color="white"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>

              {/* Second Row - Fan and Everything On */}
              <View className="flex-row gap-3 px-3 pb-3 rounded-3xl">
                {/* Fan */}
                <TouchableOpacity
                  onPress={handleToggleGreenLed}
                  className="bg-white rounded-2xl flex justify-between p-4 h-[8rem] flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">Fan</Text>
                    <Text className="text-gray-500 text-xs mb-4">Roof</Text>
                  </View>
                  <View className="w-12 h-12 absolute top-2 right-1 items-center justify-center">
                    <Animated.View style={fanAnimatedStyle}>
                      <MaterialCommunityIcons
                        name="fan"
                        size={35}
                        color="#9ca3af"
                      />
                    </Animated.View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-black font-medium">
                      {greenLedState ? "ON" : "OFF"}
                    </Text>
                    <TouchableOpacity
                      onPress={handleToggleGreenLed}
                      className={`w-11 h-11 rounded-full items-center justify-center ${
                        greenLedState ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="power"
                        size={26}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Everything On */}
                <TouchableOpacity
                  onPress={handleToggleAllLights}
                  className="bg-white rounded-2xl flex justify-between p-4 h-[8rem] flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Quick On
                    </Text>
                    <Text className="text-gray-500 text-xs mb-4">
                      Entire House
                    </Text>
                  </View>
                  <View className="w-12 h-12 absolute top-2 right-1 items-center justify-center">
                    {allLightsState ? (
                      <MaterialCommunityIcons
                        name="lightbulb-on"
                        size={35}
                        color="#007AFF"
                        style={{
                          textShadowColor: "white",
                          textShadowOffset: { width: 0, height: 0 },
                          textShadowRadius: 10,
                        }}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="lightbulb-outline"
                        size={35}
                        color="#9ca3af"
                      />
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-black font-medium">
                      {allLightsState ? "ON" : "OFF"}
                    </Text>
                    <TouchableOpacity
                      onPress={handleToggleAllLights}
                      className={`w-11 h-11 rounded-full items-center justify-center ${
                        allLightsState ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name="power"
                        size={26}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <FanSpeedControl />

            <Text className="text-black text-lg font-semibold px-4 mt-3">
              Smart Assistant
            </Text>
            <Bruno />

            <Text className="text-black text-lg font-semibold px-4 mt-6">
              Energy
            </Text>
            <EnergySummary />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function UpdatePrompt({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <View className=" w-full px-4 my-3">
      <View className="bg-white rounded-2xl border-[1px] border-gray-100 shadow-lg p-4 flex-row justify-between items-center">
        <Text className="text-base text-gray-600">
          A new update is available 🎉
        </Text>
        <TouchableOpacity
          className="p-2 px-4 bg-[#007AFF] shadow rounded-full"
          onPress={async () => {
            try {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch (e) {
              console.log("Update failed", e);
            }
          }}
        >
          <Text className="text-white font-medium text-sm">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
