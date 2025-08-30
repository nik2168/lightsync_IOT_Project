import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function SmartHomeScreen() {
  const [acOn, setAcOn] = useState(true);
  const [temperature, setTemperature] = useState(26.6);
  const [lampOn, setLampOn] = useState(true);
  const [lampBrightness, setLampBrightness] = useState(80);
  const [lamp2On, setLamp2On] = useState(false);
  const [speakerVolume, setSpeakerVolume] = useState(60);
  const [selectedMode, setSelectedMode] = useState("All");

  const modes = [
    { name: "All", icon: "apps" },
    { name: "Print", icon: "print" },
    { name: "Car", icon: "directions-car" },
  ];

  const controlModes = ["Mode", "Air", "Sleep", "Time"];

  const adjustTemperature = (increment: any) => {
    setTemperature((prev) => Math.max(16, Math.min(30, prev + increment)));
  };

  return (
    <SafeAreaView className="flex-1 bg-white py-10">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 ">
        <View>
          <Text className="text-gray-500 text-md">Hello, Nik</Text>
          <Text className="text-black text-2xl ">
            {(() => {
              const now = new Date();
              const hours = now.getHours();
              if (hours < 12) {
                return "Good Morning";
              } else if (hours < 17) {
                return "Good Afternoon";
              } else {
                return "Good Evening";
              }
            })()}
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

      {/* Control Modes */}
      <View className="flex-row px-6 justify-between">
        {controlModes.map((mode, index) => (
          <TouchableOpacity
            key={mode}
            className="items-center p-1 px-3 bg-gray-100 rounded-lg"
          >
            <View className="w-10 h-10 items-center justify-center">
              {mode === "Mode" && (
                <MaterialIcons name="tune" size={20} color="#666" />
              )}
              {mode === "Air" && <Feather name="wind" size={20} color="#666" />}
              {mode === "Sleep" && (
                <Ionicons name="moon" size={20} color="#666" />
              )}
              {mode === "Time" && (
                <Ionicons name="time" size={20} color="#666" />
              )}
            </View>
            <Text className="text-gray-600 text-xs">{mode}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* <View className="flex-col justify-center items-left my-3">
        <Text className="text-3xl font-semibold px-6">LightSync </Text>
        {/* <Text className="text-3xl font-semibold px-6">Automation </Text> */}
      {/* <Text className="text-xs my-2 px-6">IOT PROJECT DASHBOARD</Text> */}
      {/* </View>  */}

      <View className="px-6 gap-6 mt-[2rem]">
        {/* Air Conditioner Card */}
        <View className="bg-gray-200 rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-black text-xl">Temperature</Text>
              <Text className="text-gray-600 text-sm">Living room</Text>
            </View>
            <Switch
              value={acOn}
              onValueChange={setAcOn}
              trackColor={{ false: "#d1d5db", true: "#3B82F6" }}
              thumbColor={acOn ? "#ffffff" : "#ffffff"}
            />
          </View>

          <View className="flex-row justify-between items-center mb-6">
            {/* <TouchableOpacity
              onPress={() => adjustTemperature(-0.1)}
              className="w-12 h-12 border border-gray-500 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={20} color="#666" />
            </TouchableOpacity> */}
            <View className="items-center mb-6 w-full">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water" size={18} color="#3B82F6" />
                <Text className="text-gray-600 text-sm"> 78%</Text>
              </View>
              <Text className="text-6xl font-medium text-black">
                {temperature}°
              </Text>
            </View>
            {/* <TouchableOpacity
              onPress={() => adjustTemperature(0.1)}
              className="w-12 h-12 border border-gray-500 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={20} color="#666" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Lamp and Speaker Row */}
        <View className="flex-row gap-4 p-4 bg-gray-200 rounded-3xl">
          {/* Lamp Card */}
          <View className=" bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1">
            <View>
              <Text className="text-black font-semibold mb-1">Lamp 1</Text>
              <Text className="text-gray-500 text-xs mb-4">Living room</Text>
            </View>

            <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
              <MaterialCommunityIcons
                name={lampOn ? "lightbulb-on-outline" : "lightbulb-outline"}
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
              <Text className="text-black font-medium">{lampBrightness}%</Text>
            </View>
          </View>
          {/* Lamp Card */}
          <View className=" bg-white rounded-2xl flex justify-between p-4 h-[10rem] flex-1">
            <View>
              <Text className="text-black font-semibold mb-1">Lamp 2</Text>
              <Text className="text-gray-500 text-xs mb-4">Kitchen</Text>
            </View>

            <View className="w-12 h-12 absolute top-4 right-4 items-center justify-center">
              <MaterialCommunityIcons
                name={lamp2On ? "lightbulb-on-outline" : "lightbulb-outline"}
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
              <Text className="text-black font-medium">{lampBrightness}%</Text>
            </View>
          </View>
        </View>

        {/* Create Scene Card */}
        <View className="bg-white rounded-2xl">
          <View className="flex-row items-center bg-gray-200 rounded-full px-2 py-2 justify-between">
            <View className="flex-row items-center justify-center">
              <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center">
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
            <TouchableOpacity className="bg-blue-500 px-4 py-2 mr-2 rounded-full">
              <Text className="text-white text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
