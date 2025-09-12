// // components/EnergySummary.tsx
// import React, { useEffect, useState, useRef } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useAppSelector } from "@/redux/hook";
// import { LineChart } from "react-native-gifted-charts";

// interface EnergyDataPoint {
//   value: number;
//   timestamp: Date;
// }

// export default function EnergySummary() {
//   const router = useRouter();

//   // Get LED states from Redux with fallback values
//   const lightSyncState = useAppSelector(
//     (state: any) => state.lightSyncState || state.lightSync
//   );
//   const {
//     redLedState = false,
//     yellowLedState = false,
//     greenLedState = false,
//   } = lightSyncState || {};

//   const [miniEnergyData, setMiniEnergyData] = useState<EnergyDataPoint[]>([]);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Calculate current total watts
//   const getCurrentWatts = () => {
//     return (
//       (redLedState ? 1.5 : 0) +
//       (yellowLedState ? 1.5 : 0) +
//       (greenLedState ? 3.3 : 0)
//     );
//   };

//   // Calculate active devices count
//   const getActiveDevices = () => {
//     return [redLedState, yellowLedState, greenLedState].filter(Boolean).length;
//   };

//   // Initialize mini chart with 5 minutes of data (15 points, 20-second intervals for compact view)
//   useEffect(() => {
//     const now = new Date();
//     const initialData: EnergyDataPoint[] = [];

//     for (let i = 14; i >= 0; i--) {
//       const timestamp = new Date(now.getTime() - i * 20000); // 20 seconds apart
//       initialData.push({
//         value: 0,
//         timestamp,
//       });
//     }

//     setMiniEnergyData(initialData);
//   }, []);

//   // Live data updates every 20 seconds for compact view
//   useEffect(() => {
//     if (lightSyncState) {
//       intervalRef.current = setInterval(() => {
//         const currentWatts = getCurrentWatts();
//         const now = new Date();

//         setMiniEnergyData((prevData) => {
//           const newData = [...prevData.slice(1)]; // Remove oldest point
//           newData.push({
//             value: currentWatts,
//             timestamp: now,
//           });
//           return newData;
//         });
//       }, 2000); // Update every 20 seconds
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [redLedState, yellowLedState, greenLedState, lightSyncState]);

//   // Handle navigation to energy tab
//   const handlePress = () => {
//     router.push("/energy");
//   };

//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       className="bg-gray-200 rounded-3xl p-4"
//       activeOpacity={0.8}
//     >
//       {/* Header Row */}
//       <View className="flex-row justify-between items-center mb-3">
//         <View className="flex-row items-center">
//           <View className="bg-green-100 rounded-full p-1.5 mr-2">
//             <Ionicons name="flash" size={14} color="#10b981" />
//           </View>
//           <Text className="text-black text-sm font-medium">Energy Usage</Text>
//         </View>
//         <View className="flex-row items-center">
//           <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
//           <Text className="text-green-800 text-xs">Live</Text>
//           <Ionicons
//             name="chevron-forward"
//             size={14}
//             color="#9ca3af"
//             className="ml-1"
//           />
//         </View>
//       </View>

//       {/* Main Content Row */}
//       <View className="flex-row justify-between items-center">
//         {/* Left: Current Usage */}
//         <View className="flex-1">
//           <Text className="text-2xl font-bold text-black">
//             {getCurrentWatts()}W
//           </Text>
//           <Text className="text-xs text-gray-500 mb-2">
//             ₹{((getCurrentWatts() * 12 * 6.5) / 1000).toFixed(2)} /day
//           </Text>

//           {/* Device Status Compact */}
//           <View className="flex-row items-center">
//             <Text className="text-xs text-gray-600 mr-2">
//               {getActiveDevices()}/3 active
//             </Text>
//             <View className="flex-row space-x-1">
//               <MaterialCommunityIcons
//                 name="lightbulb"
//                 size={12}
//                 color={redLedState ? "#007aff" : "#d1d5db"}
//               />
//               <MaterialCommunityIcons
//                 name="lightbulb"
//                 size={12}
//                 color={yellowLedState ? "#007aff" : "#d1d5db"}
//               />
//               <MaterialCommunityIcons
//                 name="fan"
//                 size={12}
//                 color={greenLedState ? "#007aff" : "#d1d5db"}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Right: Mini Sparkline Chart */}
//         <View className="flex-1 ml-4">
//           <View className="bg-white rounded-2xl p-2 h-20">
//             <Text className="text-xs text-gray-500 mb-1">Last 5 min Usage</Text>
//             <View style={{ height: 35, width: "100%" }}>
//               <LineChart
//                 data={miniEnergyData}
//                 height={35}
//                 width={120}
//                 spacing={6}
//                 color="#10b981"
//                 thickness={2}
//                 curved
//                 hideDataPoints
//                 hideAxesAndRules
//                 hideYAxisText
//                 initialSpacing={0}
//                 endSpacing={0}
//                 maxValue={6.3}
//                 animateOnDataChange
//                 animationDuration={800}
//                 backgroundColor="transparent"
//                 startFillColor="rgba(16, 185, 129, 0.15)"
//                 endFillColor="rgba(16, 185, 129, 0.05)"
//                 startOpacity={0.3}
//                 endOpacity={0.1}
//                 areaChart
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// components/EnergySummary.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hook";
import { LineChart } from "react-native-gifted-charts";

interface EnergyDataPoint {
  value: number;
  timestamp: Date;
}

export default function EnergySummary() {
  const router = useRouter();

  // Get LED states from Redux with fallback values
  const lightSyncState = useAppSelector(
    (state: any) => state.lightSyncState || state.lightSync
  );
  const {
    redLedState = false,
    yellowLedState = false,
    greenLedState = false,
  } = lightSyncState || {};

  const [miniEnergyData, setMiniEnergyData] = useState<EnergyDataPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current total watts
  const getCurrentWatts = () => {
    return (
      (redLedState ? 1.5 : 0) +
      (yellowLedState ? 1.5 : 0) +
      (greenLedState ? 3.3 : 0)
    );
  };

  // Calculate active devices count
  const getActiveDevices = () => {
    return [redLedState, yellowLedState, greenLedState].filter(Boolean).length;
  };

  // Initialize mini chart with 5 minutes of data (15 points, 20-second intervals for compact view)
  useEffect(() => {
    const now = new Date();
    const initialData: EnergyDataPoint[] = [];

    for (let i = 14; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 20000); // 20 seconds apart
      initialData.push({
        value: 0,
        timestamp,
      });
    }

    setMiniEnergyData(initialData);
  }, []);

  // Live data updates every 2 seconds for compact view
  useEffect(() => {
    if (lightSyncState) {
      intervalRef.current = setInterval(() => {
        const currentWatts = getCurrentWatts();
        const now = new Date();

        setMiniEnergyData((prevData) => {
          const newData = [...prevData.slice(1)]; // Remove oldest point
          newData.push({
            value: currentWatts,
            timestamp: now,
          });
          return newData;
        });
      }, 2000); // Update every 2 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [redLedState, yellowLedState, greenLedState, lightSyncState]);

  // Handle navigation to energy tab
  const handlePress = () => {
    router.push("/energy");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-3xl overflow-hidden"
      activeOpacity={0.8}
    >
      <ImageBackground
        source={require("@/assets/home/nighthome.jpg")}
        className="p-4"
        imageStyle={{ borderRadius: 24 }}
        resizeMode="cover"
      >
        {/* Semi-transparent overlay for better text readability */}
        <View className="absolute inset-0 bg-black/20 rounded-3xl" />

        {/* Content with higher z-index */}
        <View className="relative z-10">
          {/* Header Row */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="bg-white/30 backdrop-blur rounded-full p-1.5 mr-2">
                <Ionicons name="flash" size={14} color="#ffffff" />
              </View>
              <Text className="text-white text-sm font-medium">
                Energy Usage
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <Text className="text-gray-200 text-xs">Live</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#ffffff"
                className="ml-1"
              />
            </View>
          </View>

          {/* Main Content Row */}
          <View className="flex-row justify-between items-center">
            {/* Left: Current Usage */}
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white">
                {getCurrentWatts()}W
              </Text>
              <Text className="text-xs text-gray-200 mb-2">
                ₹{((getCurrentWatts() * 12 * 6.5) / 1000).toFixed(2)} /day
              </Text>

              {/* Device Status Compact */}
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-200 mr-2">
                  {getActiveDevices()}/3 active
                </Text>
                <View className="flex-row space-x-1">
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={12}
                    color={redLedState ? "#60a5fa" : "#94a3b8"}
                  />
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={12}
                    color={yellowLedState ? "#60a5fa" : "#94a3b8"}
                  />
                  <MaterialCommunityIcons
                    name="fan"
                    size={12}
                    color={greenLedState ? "#60a5fa" : "#94a3b8"}
                  />
                </View>
              </View>
            </View>

            {/* Right: Mini Sparkline Chart */}
            <View className="flex-1 ml-4">
              <View className="bg-white/10 backdrop-blur rounded-2xl p-2 h-20 border border-white/20">
                <Text className="text-xs text-gray-200 mb-1">
                  Last 5 min Usage
                </Text>
                <View style={{ height: 35, width: "100%" }}>
                  <LineChart
                    data={miniEnergyData}
                    height={35}
                    width={120}
                    spacing={6}
                    color="#60a5fa"
                    thickness={2}
                    curved
                    hideDataPoints
                    hideAxesAndRules
                    hideYAxisText
                    initialSpacing={0}
                    endSpacing={0}
                    maxValue={6.3}
                    animateOnDataChange
                    animationDuration={800}
                    backgroundColor="transparent"
                    startFillColor="rgba(96, 165, 250, 0.3)"
                    endFillColor="rgba(96, 165, 250, 0.1)"
                    startOpacity={0.4}
                    endOpacity={0.1}
                    areaChart
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
