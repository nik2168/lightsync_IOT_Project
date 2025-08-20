import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardTypeOptions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function InputComp({
  showPassword,
  isFocused,
  setIsFocused,
  setShowPassword,
  Label,
  isPassword,
  errorMsg = "",
  keyboardType,
  text,
  setText,
  width = "full",
  isMandotory = false,
  placeholder = "",
}: {
  showPassword: boolean;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  setShowPassword: (show: boolean) => void;
  Label: string;
  isPassword: boolean;
  keyboardType: KeyboardTypeOptions;
  text: string;
  setText: (val: string) => void;
  width?: string;
  isMandotory?: boolean;
  placeholder?: string;
  errorMsg?: string;
}) {
  return (
    <View className={`flex-col justify-center gap-2 ${width}`}>
      <Text className="text-darkGrey">
        {Label}
        {isMandotory && <Text className="text-red-500">*</Text>}
      </Text>
      <View
        className={`flex-row items-center justify-center w-full rounded-[8px] px-4 h-[40px] border ${
          errorMsg
            ? "border-alert"
            : isFocused
            ? "border-primary"
            : "border-mediumDark"
        } bg-light-background`}
      >
        <TextInput
          className="flex-1 text-md  text-gray-800 placeholder:text-medium "
          value={text}
          placeholder={placeholder}
          onChangeText={setText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType={keyboardType}
          secureTextEntry={isPassword ? !showPassword : false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity
            className="cursor-pointer"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMsg && <Text className="text-alert text-xs">{errorMsg}</Text>}
    </View>
  );
}
