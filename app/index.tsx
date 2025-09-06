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
  const [lampOn, setLampOn] = useState(false);
  const [lamp2On, setLamp2On] = useState(false);
  const lampBrightness = 100;
  const [motionDetected, setMotionDetected] = useState(false);
  const router = useRouter();
  const socket = getSocket();

  useEffect(() => {
    // SENSOR UPDATES
    socket.on("sensorUpdate", (data) => {
      console.log("📡 sensorUpdate:", data);
      if (data.deviceId === "ESP32_01") {
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setLampOn(data.ledState);
      }
      if (data.deviceId === "lkj") {
        setLamp2On(data.ledState);
      }
    });

    // MOTION UPDATES
    socket.on("motionUpdate", (data) => {
      setMotionDetected(data.motion);
    });

    // LED updates from other clients
    socket.on("ledUpdate", (data) => {
      if (data.deviceId === "living-room") setLampOn(data.ledState);
      if (data.deviceId === "kitchen") setLamp2On(data.ledState);
    });

    return () => {
      socket.off("sensorUpdate");
      socket.off("motionUpdate");
      socket.off("ledUpdate");
    };
  }, [socket]);

  // Toggle LED
  const toggleLamp = (lamp: "lamp1" | "lamp2") => {
    if (lamp === "lamp1") {
      socket.emit("toggleLed", { ledState: !lampOn, deviceId: "living-room" });
    } else {
      socket.emit("toggleLed", { ledState: !lamp2On, deviceId: "kitchen" });
    }
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
          {/* Hero Section */}
          {/* <View className="h-[130px] flex justify-center items-left px-6">
            <Text className="text-white text-4xl font-black ">LightSync</Text>
            <Text className="text-white text-4xl font-black ">Automation</Text>
            <Text className="text-white text-md italic">
              "Bringing intelligence to your everyday living."
            </Text>
          </View> */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-6 gap-6  shadow-sm">
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
              <View className=" rounded-2xl">
                <View className="flex-row items-center bg-white rounded-full px-2 py-2 justify-between">
                  <View className="flex-row items-center justify-center">
                    <TouchableOpacity className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center">
                      <Ionicons name="alert" size={20} color="#666" />
                    </TouchableOpacity>
                    <View className="flex-col justify-center items-left ml-3 gap-1 mb-1">
                      <Text className="text-black font-semibold">
                        Motion detected !
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        In Living room at 12:30 AM !
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

              {/* Lamps */}
              <View className="flex-row gap-4 p-4 bg-blue-200 rounded-3xl">
                {/* Lamp 1 */}
                <TouchableOpacity
                  onPress={() => toggleLamp("lamp1")}
                  className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1"
                >
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Lamp 1
                    </Text>
                    <Text className="text-gray-500 text-xs mb-4">
                      Living room
                    </Text>
                  </View>
                  <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                    <MaterialCommunityIcons
                      name={
                        lampOn ? "lightbulb-on-outline" : "lightbulb-outline"
                      }
                      size={45}
                      color={lampOn ? "#3B82F6" : "#d1d5db"}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Switch
                      value={lampOn}
                      onValueChange={() => toggleLamp("lamp1")}
                      trackColor={{ false: "#d1d5db", true: "#3B82F6" }}
                      thumbColor="#ffffff"
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text className="text-black font-medium">
                      {lampBrightness}%
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Lamp 2 */}
                <View className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1">
                  <View>
                    <Text className="text-black font-semibold mb-1">
                      Lamp 2
                    </Text>
                    <Text className="text-gray-500 text-xs mb-4">Kitchen</Text>
                  </View>
                  <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
                    <MaterialCommunityIcons
                      name={
                        lamp2On ? "lightbulb-on-outline" : "lightbulb-outline"
                      }
                      size={45}
                      color={lamp2On ? "#3B82F6" : "#d1d5db"}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Switch
                      value={lamp2On}
                      onValueChange={setLamp2On}
                      trackColor={{ false: "#d1d5db", true: "#3B82F6" }}
                      thumbColor="#ffffff"
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text className="text-black font-medium">
                      {lampBrightness}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
