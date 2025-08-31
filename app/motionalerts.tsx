// app/motionalerts.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BarChart } from "react-native-gifted-charts";

export default function MotionAlertsScreen() {
  const router = useRouter();

  // Example motion alerts
  const [alerts] = useState([
    { id: "1", location: "Living Room", time: "12:30 AM" },
    { id: "2", location: "Kitchen", time: "01:15 AM" },
    { id: "3", location: "Bedroom", time: "02:40 AM" },
    { id: "4", location: "Living Room", time: "06:10 AM" },
    { id: "5", location: "Garage", time: "08:25 AM" },
  ]);

  // Example chart data (frequency of alerts per hour)
  const chartData = [
    { value: 2, label: "12AM" },
    { value: 1, label: "1AM" },
    { value: 1, label: "2AM" },
    { value: 0, label: "3AM" },
    { value: 0, label: "4AM" },
    { value: 1, label: "6AM" },
    { value: 1, label: "8AM" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 ml-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Motion Alerts</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Chart Section */}
      <View className="bg-gray-100 rounded-3xl px-8 mb-6">
        <Text className="text-black font-semibold text-base mb-4">
          Motion Activity (Past Hours)
        </Text>
        <BarChart
          data={chartData}
          barWidth={28}
          spacing={16}
          xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 12 }}
          yAxisTextStyle={{ color: "#6b7280" }}
          frontColor="#3B82F6"
        />
      </View>

      {/* Alerts List */}
      <Text className="text-black p-3 font-semibold text-base mb-3">
        Recent Alerts
      </Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        className="p-3"
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between bg-gray-100 rounded-2xl px-4 py-3 mb-3">
            <View>
              <Text className="text-black font-medium">{item.location}</Text>
              <Text className="text-gray-500 text-xs">At {item.time}</Text>
            </View>
            <Ionicons name="alert-circle-outline" size={22} color="#3B82F6" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
