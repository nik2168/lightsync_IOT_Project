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
import { Colors } from "@/constants/Colors";

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
  isDropdownOpen = false,
  isDropdown = false,
  setDropdownOpen = () => {},
  dropDownData = [],
  setLanguageSelected,
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
  isDropdownOpen?: boolean;
  isDropdown?: boolean;
  setDropdownOpen?: () => void;
  dropDownData?: any[];
  setLanguageSelected?: (val: any) => void;
}) {
  // Wrapper for row: either Touchable if dropdown, or plain View for others
  const InputRowWrapper = isDropdown ? TouchableOpacity : View;
  const inputRowProps = isDropdown
    ? {
        activeOpacity: 0.8,
        onPress: setDropdownOpen,
      }
    : {};

  return (
    <View className={`flex-col justify-center gap-2 ${width}`}>
      <Text className="text-darkGrey">
        {Label}
        {isMandotory && <Text className="text-red-500">*</Text>}
      </Text>
      <InputRowWrapper
        className={`flex-row items-center justify-center w-full rounded-[8px] px-4 h-[40px] border ${
          errorMsg
            ? "border-alert"
            : isFocused
            ? "border-primary"
            : "border-mediumDark"
        } bg-light-background`}
        {...inputRowProps}
      >
        <TextInput
          className="flex-1 text-md  text-gray-800 placeholder:text-medium "
          value={text}
          placeholder={placeholder}
          onChangeText={setText}
          editable={!isDropdown}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType={keyboardType}
          secureTextEntry={isPassword ? !showPassword : false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          pointerEvents={isDropdown ? "none" : "auto"} // disables TextInput clicks when dropdown
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
        {isDropdown && (
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={22}
            color={Colors.primary}
          />
        )}
      </InputRowWrapper>
      {errorMsg && <Text className="text-alert text-xs">{errorMsg}</Text>}
      {isDropdownOpen && (
        <View className="absolute top-[5rem] flex-1 w-full z-50 bg-light-background shadow-sm rounded-md">
          {dropDownData?.map((item: any, index) => (
            <TouchableOpacity
              key={index}
              className="px-4 py-3 border-b border-gray-200 w-full flex-1"
              onPress={() => {
                setLanguageSelected?.(item);
                setDropdownOpen();
              }}
            >
              <Text className="text-gray-700">{item?.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
