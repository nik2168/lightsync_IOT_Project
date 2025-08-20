import DefaultCustomHeader from "@/components/custom/headers/DefaultCustomHeader";
import React from "react";
import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 bg-light-background  relative">
      <DefaultCustomHeader title="Home" />
      <View className="flex-1 justify-start items-center">
        <Text>Lasya, Your design goes here ...</Text>
      </View>
    </View>
  );
}
