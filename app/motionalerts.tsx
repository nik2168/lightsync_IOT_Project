// MotionAlertsScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import { getSocket } from "@/redux/socket";

type BarData = {
  value: number;
  label: string;
};

interface Alert {
  id: string;
  location: string;
  time: string;
  timestamp?: number;
}

export default function MotionAlertsScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const socket = getSocket();

  // parse initial alerts from params if provided
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

  // tick to force chart to recompute every second (keeps "Now" bucket up to date)
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // listen for live motion events
  useEffect(() => {
    if (!socket) return;

    const onObjectDetected = (data: any) => {
      const motion = !!data.motion;
      if (!motion) return; // only add alerts for positive detections

      // Normalize timestamp: if invalid, fallback to now
      let ts = data.timestamp;
      if (!ts || typeof ts !== "number" || ts < 1e12) {
        ts = Date.now();
      }

      // Format: 24 Aug at 08:47 pm
      const dateObj = new Date(ts);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const time = dateObj.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const formattedTime = `${day} ${month} at ${time.toLowerCase()}`;

      const alert: Alert = {
        id: `${data.deviceId || "device"}_${ts}`,
        location: "Living Room",
        time: formattedTime,
        timestamp: ts,
      };

      setAlerts((prev) => [alert, ...prev].slice(0, 500)); // keep recent 500
      // socket.emit("toggleGreenLed", { greenLedState: true });
    };

    socket.on("objectDetected", onObjectDetected);
    return () => {
      socket.off("objectDetected", onObjectDetected);
    };
  }, [socket]);

  // chartData: compute buckets for last 5 minutes (0 = now, 1 = 1 min ago, ... up to 4)
  const chartData: BarData[] = useMemo(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Keep only alerts within last 5 minutes
    const recentAlerts = alerts.filter((a) => {
      const ts = a.timestamp ?? 0;
      return ts >= fiveMinutesAgo && ts <= now;
    });

    // Count per minute bucket: bucketIndex = Math.floor((now - ts) / 60000)
    const countMap: Record<number, number> = {};
    recentAlerts.forEach((a) => {
      const ts = a.timestamp ?? now;
      const idx = Math.floor((now - ts) / 60000); // 0..4
      if (idx >= 0 && idx <= 4) {
        countMap[idx] = (countMap[idx] ?? 0) + 1;
      }
    });

    const data: BarData[] = [];
    // Build bars from -4m ... Now (we want left = oldest, right = Now)
    for (let i = 4; i >= 0; i--) {
      data.push({
        value: countMap[i] ?? 0,
        label: i === 0 ? "Now" : `-${i}m`,
      });
    }
    return data;
  }, [alerts]);

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mt-[2rem] mb-6 ml-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Motion Alerts</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Chart Section */}
      <View className="bg-gray-100 rounded-3xl px-8 mb-6">
        <Text className="text-black font-semibold text-base mb-4">
          Motion Activity (Last 5 Minutes)
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
