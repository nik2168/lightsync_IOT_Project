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
          colors={[
            "rgba(0,0,0,0.1)",
            "rgba(145,145,145,0.95)",
            "rgba(255,255,255,1)",
          ]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 pt-[5rem]">
            <View>
              <Text className="text-gray-800 text-md">Hello, Nik</Text>
              <Text className="text-gray-800 text-2xl">
                {(() => {
                  const now = new Date();
                  const hours = now.getHours();
                  if (hours < 12) return "Good Morning";
                  if (hours < 17) return "Good Afternoon";
                  return "Good Evening";
                })()}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 bg-blue-200 p-2 rounded-full">
              <TouchableOpacity className="p-2 bg-white rounded-full">
                <Ionicons name="menu" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-white rounded-full">
                <Ionicons name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <UpdatePrompt isVisible={isUpdateAvailable} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-6 gap-6 shadow-sm">
              {/* Temperature Card */}
              <View className="bg-white rounded-3xl p-6">
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-black text-xl">Temperature</Text>
                    <Text className="text-gray-600 text-sm">Living room</Text>
                  </View>
                </View>

                <View className="items-center mb-6 w-full">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="water" size={18} color="#3B82F6" />
                    <Text className="text-gray-600 text-sm"> {humidity}%</Text>
                  </View>
                  <Text className="text-6xl font-medium text-black">
                    {temperature}°
                  </Text>
                  <Text className="text-gray-600 text-sm mt-2">
                    Min: {14}° | Max: {38}°
                  </Text>
                </View>
              </View>

              {/* Motion Alert */}
              <View className="rounded-2xl">
                <View className="flex-row items-center bg-white rounded-full px-2 py-2 justify-between">
                  <View className="flex-row items-center justify-center">
                    <TouchableOpacity className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center">
                      <Ionicons
                        name={motionDetected ? "alert" : "checkmark-circle"}
                        size={20}
                        color={motionDetected ? "#ef4444" : "#10b981"}
                      />
                    </TouchableOpacity>
                    <View className="flex-col justify-center items-left ml-3 gap-1 mb-1">
                      <Text className="text-black font-semibold">
                        {motionDetected ? "Motion detected!" : "No motion"}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {motionDetected && motionAlerts.length > 0
                          ? `In Living room ${motionAlerts[0].time}`
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
                {/* First Row - Red and Green Lights */}
                <View className="flex-row gap-4 p-4 rounded-3xl">
                  {/* Red Light */}
                  <TouchableOpacity
                    onPress={handleToggleRedLed}
                    className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
                  >
                    <View>
                      <Text className="text-black font-semibold mb-1">
                        Red Light
                      </Text>
                      <Text className="text-gray-500 text-xs mb-4">
                        Living room
                      </Text>
                    </View>
                    <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                      <MaterialCommunityIcons
                        name={
                          redLedState
                            ? "lightbulb-on-outline"
                            : "lightbulb-outline"
                        }
                        size={45}
                        color={redLedState ? "#ef4444" : "#d1d5db"}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Switch
                        value={redLedState}
                        onValueChange={handleToggleRedLed}
                        trackColor={{ false: "#d1d5db", true: "#ef4444" }}
                        thumbColor="#ffffff"
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                      <Text className="text-black font-medium">
                        {redLedState ? "ON" : "OFF"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Green Light */}
                  <TouchableOpacity
                    onPress={() => router.push(`/light/green`)}
                    className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
                  >
                    <View>
                      <Text className="text-black font-semibold mb-1">
                        Green Light
                      </Text>
                      <Text className="text-gray-500 text-xs mb-4">
                        Kitchen
                      </Text>
                    </View>
                    <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                      <MaterialCommunityIcons
                        name={
                          greenLedState
                            ? "lightbulb-on-outline"
                            : "lightbulb-outline"
                        }
                        size={45}
                        color={greenLedState ? "#10b981" : "#d1d5db"}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Switch
                        value={greenLedState}
                        onValueChange={handleToggleGreenLed}
                        trackColor={{ false: "#d1d5db", true: "#10b981" }}
                        thumbColor="#ffffff"
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                      <Text className="text-black font-medium">
                        {greenLedState ? "ON" : "OFF"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Second Row - Yellow Light and All Lights */}
                <View className="flex-row gap-4 px-4 pb-4 rounded-3xl">
                  {/* Yellow Light */}
                  <TouchableOpacity
                    onPress={handleToggleYellowLed}
                    className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
                  >
                    <View>
                      <Text className="text-black font-semibold mb-1">
                        Yellow Light
                      </Text>
                      <Text className="text-gray-500 text-xs mb-4">
                        Bedroom
                      </Text>
                    </View>
                    <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                      <MaterialCommunityIcons
                        name={
                          yellowLedState
                            ? "lightbulb-on-outline"
                            : "lightbulb-outline"
                        }
                        size={45}
                        color={yellowLedState ? "#f59e0b" : "#d1d5db"}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Switch
                        value={yellowLedState}
                        onValueChange={handleToggleYellowLed}
                        trackColor={{ false: "#d1d5db", true: "#f59e0b" }}
                        thumbColor="#ffffff"
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                      <Text className="text-black font-medium">
                        {yellowLedState ? "ON" : "OFF"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* All Lights */}
                  <TouchableOpacity
                    onPress={handleToggleAllLights}
                    className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
                  >
                    <View>
                      <Text className="text-black font-semibold mb-1">
                        All Lights
                      </Text>
                      <Text className="text-gray-500 text-xs mb-4">
                        Entire House
                      </Text>
                    </View>
                    <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                      <MaterialCommunityIcons
                        name={
                          allLightsState
                            ? "lightbulb-on-outline"
                            : "lightbulb-outline"
                        }
                        size={45}
                        color={allLightsState ? "#8b5cf6" : "#d1d5db"}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Switch
                        value={allLightsState}
                        onValueChange={handleToggleAllLights}
                        trackColor={{ false: "#d1d5db", true: "#8b5cf6" }}
                        thumbColor="#ffffff"
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                      <Text className="text-black font-medium">
                        {allLightsState ? "ON" : "OFF"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
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
