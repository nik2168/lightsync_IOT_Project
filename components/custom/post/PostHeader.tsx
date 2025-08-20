import { Colors } from "@/constants/Colors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonComp from "../shared/Button";
import { useRouter } from "expo-router";

const PostHeader = ({
  buttonVisibility = true,
  bgColor = Colors.light.background,
  classProps,
}: {
  buttonVisibility?: boolean;
  bgColor?: string;
  classProps?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        backgroundColor: bgColor,
      }}
      className={` ${classProps}`}
    >
      <StatusBar
        backgroundColor={Colors.light.background} // Match your header background
        barStyle="dark-content" // Makes status bar icons dark (visible on light bg)
        animated={true}
      />

      <View
        className={`${
          Platform.OS === "ios" ? "h-[4rem]" : "h-[7rem]"
        }  flex-row gap-[10]  items-center justify-between px-[20]`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="relative rounded-full flex-row justify-center items-center"
        >
          <Feather name="chevron-left" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <View className=" flex items-center justify-center ">
          <Text className="text-lg text-primary font-semibold justify-center items-center  text-center">
            Your story
          </Text>
        </View>
        <TouchableOpacity className="flex flex-row bg-primary rounded-lg p-2">
          <MaterialCommunityIcons
            name="share-variant"
            size={18}
            color={Colors.light.background}
            className=""
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostHeader;
