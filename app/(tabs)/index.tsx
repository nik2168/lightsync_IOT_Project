import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getSocket } from "@/redux/socket";
import {
  updateSensorData,
  updateLedStates,
  toggleRedLed,
  toggleGreenLed,
  toggleYellowLed,
  toggleAllLights,
  updateMotionDetected,
  addMotionAlert,
  updateGreenBrightness,
} from "@/redux/lightSyncSlice";
import * as Updates from "expo-updates";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
// Add this to your component's imports and setup
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
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

  useEffect(() => {
    // SENSOR UPDATES
    socket.on("sensorUpdate", (data) => {
      console.log("📡 sensorUpdate:", data);
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
      console.log("motionDAta: ", data);
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
            location: "Living Room",
            time: formattedTime,
            timestamp: data.timestamp,
          })
        );

        console.log("toggle Yellow ");
        // Toggle green LED on motion
        handleToggleYellowLed();
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
  }, [socket, dispatch]);

  // Toggle functions with optimistic updates
  const handleToggleRedLed = () => {
    dispatch(toggleRedLed()); // Optimistic update
    socket.emit("toggleRedLed", { redLedState: !redLedState });
  };

  const handleToggleGreenLed = () => {
    dispatch(toggleGreenLed()); // Optimistic update
    socket.emit("toggleGreenLed", { greenLedState: !greenLedState });
  };

  const handleToggleYellowLed = () => {
    dispatch(toggleYellowLed()); // Optimistic update
    socket.emit("toggleYellowLed", { yellowLedState: !yellowLedState });
  };

  const handleToggleAllLights = () => {
    dispatch(toggleAllLights()); // Optimistic update
    socket.emit("toggleAllLights", { allLightsState: !allLightsState });
  };

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

  // 2. INSIDE YOUR COMPONENT (after other state variables)
  const fanRotation = useSharedValue(0);

  // 3. CREATE ANIMATED STYLE
  const fanAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${fanRotation.value}deg`,
        },
      ],
    };
  }, []);

  // 4. USEEFFECT FOR FAN ROTATION (add console.logs for debugging)
  useEffect(() => {
    console.log("Fan effect triggered, greenLedState:", greenLedState);

    if (greenLedState) {
      console.log("Starting fan rotation");
      // Continuous smooth rotation with linear easing
      fanRotation.value = withRepeat(
        withTiming(360, {
          duration: 400,
          easing: Easing.linear, // This eliminates the glitch!
        }),
        -1, // infinite
        false // don't reverse
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
        {/* <LinearGradient
          colors={[
            "rgba(0,0,0,0.1)",
            "rgba(145,145,145,0.95)",
            "rgba(255,255,255,1)",
          ]}
          style={{ flex: 1 }}
        > */}
        {/* Header */}
        <View className="flex-row justify-between items-center px-4  pt-[3.5rem]">
          <View>
            <Text className="text-gray-800 text-sm">Hello, Nik</Text>
            <Text className="text-gray-800 text-2xl">
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
              <Ionicons name="menu" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-white rounded-full">
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <UpdatePrompt isVisible={isUpdateAvailable} />

        <View>
          <View className="p-4 py-5 gap-3">
            {/* Temperature Card */}
            <View className="bg-gray-200 rounded-3xl p-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-black text-sm">Temperature</Text>
                  {/* <Text className="text-gray-600 text-xs">Living room</Text> */}
                </View>
              </View>

              <View className="items-center mb-6 w-full">
                <View className="flex-row justify-center items-center mb-2">
                  <Ionicons name="water" size={14} color="#3B82F6" />
                  <Text className="text-gray-600 text-xs">
                    {" "}
                    humidity : {humidity}%
                  </Text>
                </View>
                <Text className="text-4xl font-medium text-black">
                  {temperature}°
                </Text>
                {/* <Text className="text-gray-600 text-sm mt-2">
                  Min: {14}° | Max: {38}°
                </Text> */}
              </View>
            </View>

            {/* Motion Alert */}
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
                        ? `On back door at ${motionAlerts[0].time}`
                        : "All clear"}
                    </Text>
                  </View>
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

            {/* Lights Control */}
            <View className="bg-gray-200 rounded-3xl">
              {/* First Row - Lamp 1 and Fan */}
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
                    <Text className="text-gray-500 text-xs">Outdoor</Text>
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
                  className="bg-white rounded-2xl flex-row justify-between p-4  flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Lamp 2
                    </Text>
                    <Text className="text-gray-500 text-xs">Main Door</Text>
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

              {/* Second Row - Lamp 2 and Everything On */}
              <View className="flex-row gap-3 px-3 pb-3 rounded-3xl">
                {/* Fan */}
                <TouchableOpacity
                  onPress={() => router.push(`/light/green`)}
                  className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
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
                  className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
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
          </View>
        </View>
        {/* </LinearGradient> */}
      </ImageBackground>
    </View>
  );
}

function UpdatePrompt({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <View className=" w-full px-4">
      <View className="bg-circle rounded-2xl border-[1px] border-medium shadow-lg p-4 flex-row justify-between items-center">
        <Text className="text-base font-semibold">
          A new update is available 🎉
        </Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch (e) {
              console.log("Update failed", e);
            }
          }}
        >
          <Text className="text-primary font-semibold text-md">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
