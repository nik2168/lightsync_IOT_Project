import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hook";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";

interface EnergyDataPoint {
  value: number;
  label?: string;
  timestamp: Date;
}

export default function Energy() {
  // Fix the Redux selector - use the correct state path and add error handling
  const lightSyncState = useAppSelector(
    (state: any) => state.lightSyncState || state.lightSync
  );

  // Destructure with fallback values to prevent undefined errors
  const {
    redLedState = false,
    yellowLedState = false,
    greenLedState = false,
  } = lightSyncState || {};

  const [energyData, setEnergyData] = useState<EnergyDataPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current total watts with error handling
  const getCurrentWatts = () => {
    try {
      return (
        (redLedState ? 1.5 : 0) +
        (yellowLedState ? 1.5 : 0) +
        (greenLedState ? 3.3 : 0)
      );
    } catch (error) {
      console.warn("Error calculating watts:", error);
      return 0;
    }
  };

  // Initialize chart with 5 minutes of data (30 points, 10-second intervals)
  useEffect(() => {
    const now = new Date();
    const initialData: EnergyDataPoint[] = [];

    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 10000); // 10 seconds apart
      initialData.push({
        value: 0,
        timestamp,
        label:
          i % 6 === 0
            ? `${timestamp.getHours()}:${timestamp
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
            : undefined,
      });
    }

    setEnergyData(initialData);
  }, []);

  // Live data updates every 10 seconds
  useEffect(() => {
    // Only start interval if we have valid state
    if (lightSyncState) {
      intervalRef.current = setInterval(() => {
        const currentWatts = getCurrentWatts();
        const now = new Date();

        setEnergyData((prevData) => {
          const newData = [...prevData.slice(1)]; // Remove oldest point
          newData.push({
            value: currentWatts,
            timestamp: now,
            label:
              now.getSeconds() === 0
                ? `${now.getHours()}:${now
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : undefined,
          });
          return newData;
        });
      }, 1000); // Update every 10 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [redLedState, yellowLedState, greenLedState, lightSyncState]);

  // Get max value for chart scaling
  const getMaxValue = () => {
    const maxDataValue = Math.max(...energyData.map((d) => d.value), 6.3); // 6.3W is max possible
    return Math.ceil(maxDataValue / 2) * 2; // Round up to nearest even number
  };

  // Show loading state if Redux state is not available
  if (!lightSyncState) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-100 rounded-full p-4 mb-4">
            <Ionicons name="flash" size={32} color="#10b981" />
          </View>
          <Text className="text-gray-600 text-lg">Loading Energy Data...</Text>
          <Text className="text-gray-500 text-sm mt-2">
            Connecting to devices
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 pt-[3rem]">
      <View className="mb-6 px-4">
        <Text className="text-xl font-bold text-black mb-1">Energy Usage</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4 ">
        {/* Header */}

        {/* Energy Statistics */}
        <View className="bg-gray-100 rounded-3xl p-4 mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Today's Summary
          </Text>

          <View className="flex-row justify-between">
            {/* Peak Usage */}
            <View className="flex-1 bg-white rounded-2xl p-3 mr-2">
              <View className="flex-row items-center mb-2">
                <Ionicons name="trending-up" size={16} color="#ef4444" />
                <Text className="text-xs text-gray-600 ml-1">Peak</Text>
              </View>
              <Text className="text-lg font-semibold text-black">6.3W</Text>
              <Text className="text-xs text-gray-500">12:30 PM</Text>
            </View>

            {/* Average Usage */}
            <View className="flex-1 bg-white rounded-2xl p-3 mr-2">
              <View className="flex-row items-center mb-2">
                <Ionicons name="analytics" size={16} color="#3b82f6" />
                <Text className="text-xs text-gray-600 ml-1">Average</Text>
              </View>
              <Text className="text-lg font-semibold text-black">2.8W</Text>
              <Text className="text-xs text-gray-500">Since 6 AM</Text>
            </View>

            {/* Total Energy */}
            <View className="flex-1 bg-white rounded-2xl p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="battery-charging" size={16} color="#10b981" />
                <Text className="text-xs text-gray-600 ml-1">Total</Text>
              </View>
              <Text className="text-lg font-semibold text-black">0.07kWh</Text>
              <Text className="text-xs text-gray-500">Today</Text>
            </View>
          </View>
        </View>

        {/* Live Chart Section */}
        <View className="bg-gray-100 rounded-3xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-black text-lg font-semibold">
                Live Usage
              </Text>
              <Text className="text-gray-600 text-xs">Last 5 minutes</Text>
            </View>
            <View className="bg-green-100 rounded-full p-2">
              <Ionicons name="pulse" size={16} color="#10b981" />
            </View>
          </View>

          {/* Chart Container */}
          <View className="bg-white rounded-2xl p-4">
            <LineChart
              data={energyData}
              height={200}
              spacing={8}
              color="#10b981"
              thickness={3}
              startFillColor="#10b981"
              endFillColor="rgba(16, 185, 129, 0.1)"
              startOpacity={0.4}
              endOpacity={0.1}
              initialSpacing={0}
              noOfSections={4}
              maxValue={getMaxValue()}
              yAxisColor="#e5e7eb"
              xAxisColor="#e5e7eb"
              yAxisTextStyle={{ color: "#6b7280", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 10 }}
              curved
              areaChart
              hideDataPoints={false}
              dataPointsColor="#10b981"
              dataPointsRadius={3}
              focusEnabled
              showStripOnFocus
              stripColor="rgba(16, 185, 129, 0.2)"
              stripOpacity={0.5}
              animateOnDataChange
              animationDuration={1000}
            />

            {/* Current Value Indicator */}
            <View className="absolute top-2 right-2 bg-green-100 rounded-full px-3 py-1">
              <Text className="text-green-800 font-semibold text-xs">
                {getCurrentWatts()}W Live
              </Text>
            </View>
          </View>
        </View>

        {/* Energy Usage Cards */}
        <View className="bg-gray-200 rounded-3xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-black text-sm font-medium">
                Energy Usage
              </Text>
              <Text className="text-gray-600 text-xs">
                Real-time consumption
              </Text>
            </View>
            <View className="bg-white rounded-full p-2">
              <Ionicons name="flash" size={16} color="#10b981" />
            </View>
          </View>

          {/* Individual Device Usage Row */}
          <View className="flex-row justify-between mb-4">
            {/* Lamp 1 (Red LED) */}
            <View className="flex-1 bg-white rounded-2xl p-3 mr-2">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="lightbulb"
                  size={16}
                  color={redLedState ? "#ef4444" : "#9ca3af"}
                />
                <Text className="text-xs text-gray-600 ml-1">Lamp 1</Text>
              </View>
              <Text className="text-lg font-semibold text-black">
                {redLedState ? "1.5W" : "0W"}
              </Text>
              <Text className="text-xs text-gray-500">
                {redLedState ? "1.5V × 1A" : "Off"}
              </Text>
            </View>

            {/* Lamp 2 (Yellow LED) */}
            <View className="flex-1 bg-white rounded-2xl p-3 mr-2">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="lightbulb"
                  size={16}
                  color={yellowLedState ? "#eab308" : "#9ca3af"}
                />
                <Text className="text-xs text-gray-600 ml-1">Lamp 2</Text>
              </View>
              <Text className="text-lg font-semibold text-black">
                {yellowLedState ? "1.5W" : "0W"}
              </Text>
              <Text className="text-xs text-gray-500">
                {yellowLedState ? "1.5V × 1A" : "Off"}
              </Text>
            </View>

            {/* Fan (Green LED) */}
            <View className="flex-1 bg-white rounded-2xl p-3">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="fan"
                  size={16}
                  color={greenLedState ? "#10b981" : "#9ca3af"}
                />
                <Text className="text-xs text-gray-600 ml-1">Fan</Text>
              </View>
              <Text className="text-lg font-semibold text-black">
                {greenLedState ? "3.3W" : "0W"}
              </Text>
              <Text className="text-xs text-gray-500">
                {greenLedState ? "3.3V × 1A" : "Off"}
              </Text>
            </View>
          </View>

          {/* Total Usage Summary */}
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <Ionicons name="home" size={18} color="#10b981" />
                </View>
                <View>
                  <Text className="text-black font-semibold">Total Usage</Text>
                  <Text className="text-xs text-gray-500">
                    Current consumption
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xl font-bold text-black">
                  {getCurrentWatts()}W
                </Text>
                <Text className="text-xs text-gray-500">
                  ₹{((getCurrentWatts() * 12 * 6.5) / 1000).toFixed(2)} /day
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
