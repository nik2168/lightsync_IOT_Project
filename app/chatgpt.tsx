import { View, Text, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SmartHome() {
  const [acOn, setAcOn] = useState(true);
  const [lampOn, setLampOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-500 text-base">Hello, Saif</Text>
          <Text className="text-xl font-semibold">Good Evening</Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Pressable className="bg-white p-2 rounded-full shadow">
            <Ionicons name="add" size={20} color="black" />
          </Pressable>
          <Pressable className="bg-white p-2 rounded-full shadow">
            <Ionicons name="notifications-outline" size={20} color="black" />
          </Pressable>
        </View>
      </View>

      {/* AC Control */}
      <View className="bg-white rounded-2xl p-4 shadow mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-lg font-medium">Air Conditioner</Text>
            <Text className="text-gray-400 text-sm">Living room</Text>
          </View>
          <Switch value={acOn} onValueChange={setAcOn} />
        </View>

        <Text className="text-center text-gray-400">78%</Text>
        <View className="flex-row items-center justify-center my-3">
          <Pressable className="p-2 bg-gray-100 rounded-full mx-3">
            <Ionicons name="remove" size={20} color="black" />
          </Pressable>
          <Text className="text-4xl font-semibold">26.6°</Text>
          <Pressable className="p-2 bg-gray-100 rounded-full mx-3">
            <Ionicons name="add" size={20} color="black" />
          </Pressable>
        </View>

        <View className="flex-row justify-between mt-2">
          <Pressable className="flex-1 items-center">
            <Ionicons name="sunny-outline" size={22} color="black" />
            <Text className="text-xs">Mode</Text>
          </Pressable>
          <Pressable className="flex-1 items-center">
            <Ionicons name="leaf-outline" size={22} color="black" />
            <Text className="text-xs">Air</Text>
          </Pressable>
          <Pressable className="flex-1 items-center">
            <Ionicons name="moon-outline" size={22} color="black" />
            <Text className="text-xs">Sleep</Text>
          </Pressable>
          <Pressable className="flex-1 items-center">
            <Ionicons name="time-outline" size={22} color="black" />
            <Text className="text-xs">Time</Text>
          </Pressable>
        </View>
      </View>

      {/* Lamp & Speaker */}
      <View className="flex-row space-x-4 mb-6">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow">
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-medium">Lamp</Text>
            <Switch value={lampOn} onValueChange={setLampOn} />
          </View>
          <Text className="text-gray-400 text-sm">6 hr up</Text>
          <Text className="text-2xl font-semibold mt-2">80%</Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 shadow">
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-medium">Speaker</Text>
            <Switch value={speakerOn} onValueChange={setSpeakerOn} />
          </View>
          <Text className="text-gray-400 text-sm">Off</Text>
          <Text className="text-2xl font-semibold mt-2">60%</Text>
        </View>
      </View>

      {/* Scenes */}
      <View className="bg-white rounded-2xl p-4 shadow flex-row justify-between items-center">
        <Text className="text-base">
          You Create 6 Scene
          {`
`}
          12 Device in use
        </Text>
        <Pressable className="bg-orange-500 px-4 py-2 rounded-xl">
          <Text className="text-white font-medium">See All</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
