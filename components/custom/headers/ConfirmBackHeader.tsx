import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function ConfirmBackHeader({
  handleGoBack,
  title,
  floating = false,
}: {
  handleGoBack: () => void;
  title: string;
  floating?: boolean;
}) {
  const isIos = Platform.OS === "ios";

  return (
    <SafeAreaView
      className={`flex-row  items-center justify-between px-4 py-2 ${
        floating && "absolute top-4 flex-1 w-full z-10"
      }  ${!isIos && "mt-[2rem]"}`}
    >
      <TouchableOpacity
        onPress={handleGoBack}
        className={`w-[32px] ${isIos && "pl-4"}`}
      >
        <Ionicons name="chevron-back" size={28} color={Colors.primary} />
      </TouchableOpacity>

      <Text className="text-primary text-xl font-medium">{title}</Text>

      {/* Invisible placeholder to center title */}
      <View className="w-[32px]" />
    </SafeAreaView>
  );
}
