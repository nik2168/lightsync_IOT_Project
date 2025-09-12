import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-gifted-charts";
import { getSocket } from "@/redux/socket";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addMotionAlert, updateMotionDetected } from "@/redux/lightSyncSlice";

interface MotionDataPoint {
  value: number;
  label?: string;
  timestamp: number;
}

export default function MotionAlertsScreen() {
  const router = useRouter();
  const socket = getSocket();
  const dispatch = useAppDispatch();

  // Get alerts from Redux store
  const alerts = useAppSelector((state) => state.lightSyncState.motionAlerts);
  const motionDetected = useAppSelector(
    (state) => state.lightSyncState.motionDetected
  );

  const [liveChartData, setLiveChartData] = useState<MotionDataPoint[]>([]);
  const [totalAlertsToday, setTotalAlertsToday] = useState(0);
  const [alertsLastHour, setAlertsLastHour] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chart with 10 minutes of data (30 points, 20-second intervals)
  useEffect(() => {
    const now = Date.now();
    const initialData: MotionDataPoint[] = [];

    for (let i = 29; i >= 0; i--) {
      const timestamp = now - i * 20000; // 20 seconds apart
      const dateObj = new Date(timestamp);
      initialData.push({
        value: 0,
        timestamp,
        label:
          i % 6 === 0
            ? `${dateObj.getHours()}:${dateObj
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
            : undefined,
      });
    }

    setLiveChartData(initialData);
  }, []);

  // Live chart updates every 20 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const twentySecondsAgo = now - 20000;

      // Count alerts in last 20 seconds - fix timestamp undefined issue
      const recentAlerts = alerts.filter((alert) => {
        const alertTimestamp = alert.timestamp ?? 0;
        return alertTimestamp >= twentySecondsAgo && alertTimestamp <= now;
      }).length;

      setLiveChartData((prevData) => {
        const newData = [...prevData.slice(1)]; // Remove oldest point
        const dateObj = new Date(now);
        newData.push({
          value: recentAlerts,
          timestamp: now,
          label:
            dateObj.getSeconds() === 0
              ? `${dateObj.getHours()}:${dateObj
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              : undefined,
        });
        return newData;
      });
    }, 1000); // Update every 20 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alerts]);

  // Listen for live motion events
  // useEffect(() => {
  //   if (!socket) return;

  //   const onObjectDetected = (data: any) => {
  //     const motion = !!data.motion;
  //     dispatch(updateMotionDetected(motion));

  //     if (!motion) return;

  //     let ts = data.timestamp;
  //     if (!ts || typeof ts !== "number" || ts < 1e12) {
  //       ts = Date.now();
  //     }

  //     const dateObj = new Date(ts);
  //     const time = dateObj.toLocaleString("en-US", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: true,
  //       second: "2-digit",
  //     });
  //     const formattedTime = `at ${time.toLowerCase()}`;

  //     dispatch(
  //       addMotionAlert({
  //         id: `${data.deviceId || "device"}_${ts}`,
  //         location: "Back Door",
  //         time: formattedTime,
  //         timestamp: ts,
  //       })
  //     );
  //   };

  //   socket.on("objectDetected", onObjectDetected);
  //   return () => {
  //     socket.off("objectDetected", onObjectDetected);
  //   };
  // }, [socket, dispatch]);

  // Calculate statistics - fix timestamp undefined issue
  useEffect(() => {
    const now = Date.now();
    const startOfToday = new Date(now).setHours(0, 0, 0, 0);
    const oneHourAgo = now - 60 * 60 * 1000;

    const todayAlerts = alerts.filter((alert) => {
      const alertTimestamp = alert.timestamp ?? 0;
      return alertTimestamp >= startOfToday;
    }).length;

    const hourlyAlerts = alerts.filter((alert) => {
      const alertTimestamp = alert.timestamp ?? 0;
      return alertTimestamp >= oneHourAgo;
    }).length;

    setTotalAlertsToday(todayAlerts);
    setAlertsLastHour(hourlyAlerts);
  }, [alerts]);

  // Get max value for chart scaling
  const getMaxValue = () => {
    const maxDataValue = Math.max(...liveChartData.map((d) => d.value), 5);
    return Math.ceil(maxDataValue / 2) * 2;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 pt-[3rem]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Motion Alerts</Text>
        <View className="w-7" />
      </View>
      <ScrollView className="flex-1">
        <View className="px-4 pb-4">
          {/* Statistics Cards */}
          <View className="flex-row gap-3 mb-6">
            {/* Total Today */}
            <View className="flex-1 bg-gray-100 rounded-3xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="text-2xl font-bold text-black">
                  {totalAlertsToday}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Today's Total</Text>
            </View>

            {/* Last Hour */}
            <View className="flex-1 bg-gray-100 rounded-3xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#10b981"
                />
                <Text className="text-2xl font-bold text-black">
                  {alertsLastHour}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Last Hour</Text>
            </View>

            {/* Live Status */}
            <View className="flex-1 bg-gray-100 rounded-3xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <View
                  className={`w-3 h-3 rounded-full ${
                    motionDetected ? "bg-red-500" : "bg-green-500"
                  }`}
                />
                <Text
                  className={`text-sm font-semibold ${
                    motionDetected ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {motionDetected ? "ACTIVE" : "CLEAR"}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Live Status</Text>
            </View>
          </View>

          {/* Live Motion Activity Chart */}
          <View className="rounded-3xl overflow-hidden mb-6">
            <ImageBackground
              source={require("@/assets/home/nighthome.jpg")}
              className="p-4"
              imageStyle={{ borderRadius: 24 }}
              resizeMode="cover"
            >
              {/* Semi-transparent overlay */}
              <View className="absolute inset-0 bg-black/40 rounded-3xl" />

              {/* Content */}
              <View className="relative z-10">
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-white text-lg font-semibold">
                      Live Motion Activity
                    </Text>
                    <Text className="text-gray-200 text-xs">
                      Last 10 minutes
                    </Text>
                  </View>
                  <View className="bg-white/20 backdrop-blur rounded-full p-2">
                    <MaterialCommunityIcons
                      name="motion-sensor"
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                </View>

                <View className="bg-white/10 backdrop-blur rounded-2xl p-4">
                  <LineChart
                    data={liveChartData}
                    height={180}
                    spacing={8}
                    color="#60a5fa"
                    thickness={3}
                    startFillColor="rgba(96, 165, 250, 0.3)"
                    endFillColor="rgba(96, 165, 250, 0.1)"
                    startOpacity={0.4}
                    endOpacity={0.1}
                    initialSpacing={0}
                    noOfSections={4}
                    maxValue={getMaxValue()}
                    yAxisColor="rgba(255, 255, 255, 0.3)"
                    xAxisColor="rgba(255, 255, 255, 0.3)"
                    yAxisTextStyle={{ color: "#ffffff", fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: "#ffffff", fontSize: 10 }}
                    curved
                    areaChart
                    hideDataPoints={false}
                    dataPointsColor="#60a5fa"
                    dataPointsRadius={3}
                    focusEnabled
                    showStripOnFocus
                    stripColor="rgba(96, 165, 250, 0.2)"
                    stripOpacity={0.5}
                    animateOnDataChange
                    animationDuration={1000}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Quick Actions */}
          <View className="bg-gray-100 rounded-3xl p-4 mb-6">
            <Text className="text-black font-semibold text-lg mb-4">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center">
                <MaterialCommunityIcons
                  name="shield-check"
                  size={24}
                  color="#10b981"
                />
                <Text className="text-black text-sm font-medium mt-2">
                  Arm Security
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#3b82f6"
                />
                <Text className="text-black text-sm font-medium mt-2">
                  Notifications
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center">
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={24}
                  color="#6b7280"
                />
                <Text className="text-black text-sm font-medium mt-2">
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Alerts */}
          <View className="bg-gray-100 rounded-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-black font-semibold text-lg">
                Recent Alerts
              </Text>
              <Text className="text-gray-500 text-sm">
                {alerts.length} total
              </Text>
            </View>

            {alerts.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <MaterialCommunityIcons
                  name="shield-check"
                  size={48}
                  color="#10b981"
                />
                <Text className="text-gray-600 text-center mt-2">
                  No motion detected
                </Text>
                <Text className="text-gray-500 text-xs text-center">
                  Your home is secure
                </Text>
              </View>
            ) : (
              <FlatList
                data={alerts.slice(0, 5)}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View
                    className={`flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 ${
                      index < 4 ? "mb-3" : ""
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="bg-red-100 rounded-full p-2 mr-3">
                        <MaterialCommunityIcons
                          name="motion-sensor"
                          size={16}
                          color="#ef4444"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-black font-medium">
                          {item.location}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {item.time}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity className="bg-blue-50 rounded-full p-2">
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#3b82f6"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            {/* {alerts.length > 5 && (
              <TouchableOpacity className="bg-white rounded-2xl p-3 mt-3 items-center">
                <Text className="text-blue-600 font-medium">
                  View All {alerts.length} Alerts
                </Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
