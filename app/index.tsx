import React, { useState } from "react";
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

export default function SmartHomeScreen() {
  const [acOn, setAcOn] = useState(true);
  const [temperature, setTemperature] = useState(26.6);
  const [lampOn, setLampOn] = useState(true);
  const [lampBrightness, setLampBrightness] = useState(80);
  const [lamp2On, setLamp2On] = useState(false);

  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Fading Background */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
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
              <Text className="text-gray-100 text-md">Hello, Nik</Text>
              <Text className="text-white text-2xl ">
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
          <View className="h-[130px] flex justify-center items-left px-6">
            <Text className="text-white text-4xl font-black ">LightSync</Text>
            <Text className="text-white text-4xl font-black ">Automation</Text>
            <Text className="text-white text-md italic">
              "Bringing intelligence to your everyday living."
            </Text>
          </View>
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
                    <Text className="text-gray-600 text-sm"> 78%</Text>
                  </View>
                  <Text className="text-6xl font-medium text-black">
                    {temperature}°
                  </Text>
                  <Text className="text-gray-600 text-sm mt-2">
                    Min: {30}° | Max: {45}°
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
                <View className="bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1">
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
                      onValueChange={setLampOn}
                      trackColor={{ false: "#d1d5db", true: "#3B82F6" }}
                      thumbColor="#ffffff"
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text className="text-black font-medium">
                      {lampBrightness}%
                    </Text>
                  </View>
                </View>

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
