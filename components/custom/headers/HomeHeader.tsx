import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
const dropDown = [
  "Trending",
  "Public",
  "Personal",
  "Political",
  "Sports",
  "Business",
];

const HomeHeader = ({
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
  const [filter, setFilter] = useState(dropDown[0]);
  const [isOpen, setIsOpen] = useState(false);

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
          onPress={() => router.push("/notfound")}
          className="flex flex-row"
        >
          <Image
            className="w-[40] h-[40] rounded-lg"
            source={require("@/assets/images/icon.png")}
          />
        </TouchableOpacity>

        <View className="flex-1 flex items-left justify-center ">
          {buttonVisibility && (
            <TouchableOpacity
              className={`py-1 ${
                Platform.OS === "ios" ? "h-[2.7rem]" : "h-[2.7rem]"
              } shadow-sm rounded-lg flex flex-row justify-around  items-center bg-primary max-w-[10rem] px-3 `}
              onPress={() => setIsOpen((pre) => !pre)}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-dark-text text-md font-medium py-1">
                    {filter}
                  </Text>
                  {!isOpen ? (
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={Colors.light.background}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-up"
                      size={18}
                      color={Colors.light.background}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="relative rounded-full flex-row justify-center items-center"
          onPress={() => router.push("/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color={Colors.primary}
          />
          <View className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View className="absolute top-[7.6rem] left-[5rem] z-50 bg-light-background shadow-lg rounded-lg w-[10rem] ">
          {dropDown.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="px-4 py-3 border-t border-gray-200"
              onPress={() => {
                setFilter(item);
                setIsOpen(false);
              }}
            >
              <Text className="text-gray-700">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeHeader;
