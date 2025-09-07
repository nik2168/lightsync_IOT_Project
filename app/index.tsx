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

export default function SmartHomeScreen() {
  const [temperature, setTemperature] = useState(26.6);
  const [humidity, setHumidity] = useState(78);

  // Individual light states
  const [redLedState, setRedLedState] = useState(false);
  const [greenLedState, setGreenLedState] = useState(false);
  const [yellowLedState, setYellowLedState] = useState(false);
  const [allLightsState, setAllLightsState] = useState(false);

  const [motionDetected, setMotionDetected] = useState(false);
  const router = useRouter();
  const socket = getSocket();

  useEffect(() => {
    // SENSOR UPDATES
    socket.on("sensorUpdate", (data) => {
      console.log("📡 sensorUpdate:", data);
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setRedLedState(data.redLedState);
      setGreenLedState(data.greenLedState);
      setYellowLedState(data.yellowLedState);
      setAllLightsState(data.allLightsState);
    });

    // MOTION UPDATES
    socket.on("motionUpdate", (data) => {
      setMotionDetected(data.motion);
    });

    // LED UPDATES from backend
    socket.on("ledUpdate", (data) => {
      console.log("💡 ledUpdate received:", data);
      if (data.redLedState !== undefined) setRedLedState(data.redLedState);
      if (data.greenLedState !== undefined)
        setGreenLedState(data.greenLedState);
      if (data.yellowLedState !== undefined)
        setYellowLedState(data.yellowLedState);
      if (data.allLightsState !== undefined)
        setAllLightsState(data.allLightsState);
    });

    return () => {
      socket.off("sensorUpdate");
      socket.off("motionUpdate");
      socket.off("ledUpdate");
    };
  }, [socket]);

  // Toggle functions for each light
  const toggleRedLed = () => {
    const newState = !redLedState;
    socket.emit("toggleRedLed", { redLedState: newState });
    // setRedLedState(newState); // Optimistic update
  };

  const toggleGreenLed = () => {
    const newState = !greenLedState;
    socket.emit("toggleGreenLed", { greenLedState: newState });
    // setGreenLedState(newState); // Optimistic update
  };

  const toggleYellowLed = () => {
    const newState = !yellowLedState;
    socket.emit("toggleYellowLed", { yellowLedState: newState });
    // setYellowLedState(newState); // Optimistic update
  };

  const toggleAllLights = () => {
    const newState = !allLightsState;
    socket.emit("toggleAllLights", { allLightsState: newState });
    // setAllLightsState(newState); // Optimistic update
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Fading Background */}
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
          <View className="flex-row justify-between items-center px-6 py-4 pt-[5rem] ">
            <View>
              <Text className="text-gray-800 text-md">Hello, Nik</Text>
              <Text className="text-gray-800 text-2xl ">
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
                        {motionDetected
                          ? "In Living room just now!"
                          : "All clear"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push("/motionalerts")}
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
                    onPress={toggleRedLed}
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
                        onValueChange={toggleRedLed}
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
                    onPress={toggleGreenLed}
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
                        onValueChange={toggleGreenLed}
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
                    onPress={toggleYellowLed}
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
                        onValueChange={toggleYellowLed}
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
                    onPress={toggleAllLights}
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
                        onValueChange={toggleAllLights}
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
