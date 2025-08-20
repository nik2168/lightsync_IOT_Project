import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function ButtonComp({
  onClick,
  text,
  isSubmitting = false,
  isIcon = false,
  isDisabled = false,
  errorMsg = "",
}: {
  onClick: () => void;
  text: string;
  isSubmitting?: boolean;
  isIcon?: boolean;
  isDisabled?: boolean;
  errorMsg?: string;
}) {
  const router = useRouter();
  return (
    <>
      <Text className="text-alert text-xs mb-3">{errorMsg}</Text>
      <TouchableOpacity
        className={`py-3 ${
          Platform.OS === "ios" ? "h-[40px]" : "h-[40px]"
        }  rounded-xl flex flex-row gap-3 justify-center  items-center mb-4 ${
          errorMsg ? "bg-alert" : isDisabled ? "bg-medium" : "bg-primary"
        } w-full  `}
        onPress={() => onClick()}
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text className="text-dark-text text-md font-medium">{text}</Text>
            {isIcon && (
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={Colors.dark.text}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </>
  );
}
