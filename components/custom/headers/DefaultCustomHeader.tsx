import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DefaultCustomHeader({
  title,
  floating = false,
}: {
  title: string;
  safeArea?: boolean;
  floating?: boolean;
}) {
  const isIos = Platform.OS === "ios";
  const router = useRouter();

  return (
    <SafeAreaView
      className={`flex-row  items-center justify-between px-4 py-2 ${
        floating && "absolute flex-1 w-full z-10"
      }  ${!isIos && "mt-[1rem]"}`}
    >
      <TouchableOpacity onPress={() => router.back()} className="w-[32px]">
        <Ionicons name="chevron-back" size={28} color={Colors.primary} />
      </TouchableOpacity>

      <Text className="text-primary text-xl font-medium">{title}</Text>

      {/* Invisible placeholder to center title */}
      <View className="w-[32px]" />
    </SafeAreaView>
  );
}
