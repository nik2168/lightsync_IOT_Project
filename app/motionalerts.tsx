import React, { useState, useMemo } from "react";
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
import { useSearchParams } from "expo-router/build/hooks";
type BarData = {
  value: number;
  label: string;
};

interface Alert {
  id: string;
  location: string;
  time: string;
}

export default function MotionAlertsScreen() {
  const router = useRouter();
  const params = useSearchParams();

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const alertsParam = params.get
        ? params.get("alerts")
        : (params as any).alerts;
      return alertsParam ? (JSON.parse(alertsParam) as Alert[]) : [];
    } catch {
      return [];
    }
  });

  const chartData: BarData[] = useMemo(() => {
    // Use explicit typing with index signature for countMap
    const countMap: Record<number, number> = {};

    alerts.forEach(({ time }) => {
      let hour: number | null = null;
      try {
        const date = new Date(`1970-01-01T${time}`);
        if (!isNaN(date.getHours())) {
          hour = date.getHours();
        } else {
          const parts = time.match(/(\d+):\d+(?::\d+)?\s*(AM|PM)/i);
          if (parts) {
            hour = parseInt(parts[1], 10);
            if (/PM/i.test(parts[2]) && hour !== 12) hour += 12;
            if (/AM/i.test(parts[2]) && hour === 12) hour = 0;
          }
        }
      } catch {
        hour = null;
      }

      if (hour !== null) {
        countMap[hour] = (countMap[hour] ?? 0) + 1;
      }
    });

    const data: BarData[] = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        value: countMap[i] ?? 0,
        label: `${i}`.padStart(2, "0") + "h",
      });
    }
    return data;
  }, [alerts]);

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
          Motion Activity (Past 24 Hours)
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
