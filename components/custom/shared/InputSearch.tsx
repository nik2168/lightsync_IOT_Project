import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardTypeOptions,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function InputCompWithSearch({
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
  query = "",
  setQuery,
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
  query?: string;
  setQuery?: (query: string) => void;
}) {
  // Handle input change for dropdown search
  const handleInputChange = (value: string) => {
    if (isDropdown) {
      setQuery?.(value);
      if (!isDropdownOpen) {
        setDropdownOpen();
      }
    } else {
      setText(value);
    }
  };

  // Handle dropdown item selection
  const handleDropdownSelection = (item: any) => {
    setText(item.location_name); // Set the display text
    setQuery?.(item.location_name); // Update query to match selected item
    setLanguageSelected?.(item);
    setDropdownOpen(); // Close dropdown
  };

  // Handle input focus for dropdown
  const handleInputFocus = () => {
    setIsFocused(true);
    if (isDropdown) {
      setDropdownOpen();
    }
  };

  // Handle clicking the entire row (only for dropdown when not actively typing)
  const handleRowPress = () => {
    if (isDropdown && !isFocused) {
      setDropdownOpen();
    }
  };

  // Wrapper for row: either Touchable if dropdown (and not focused), or plain View
  const InputRowWrapper = View;
  const inputRowProps =
    isDropdown && !isFocused
      ? {
          activeOpacity: 0.8,
          onPress: handleRowPress,
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
          className="flex-1 text-md text-gray-800 placeholder:text-medium"
          value={isDropdown ? query : text}
          placeholder={placeholder}
          onChangeText={handleInputChange}
          editable={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType={keyboardType}
          secureTextEntry={isPassword ? !showPassword : false}
          onFocus={handleInputFocus}
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
        {/* {isDropdown && (
          <TouchableOpacity
            className="cursor-pointer"
            onPress={() => setDropdownOpen()}
          >
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )} */}
      </InputRowWrapper>
      {errorMsg && <Text className="text-alert text-xs">{errorMsg}</Text>}
      {isDropdownOpen && (
        <View className="absolute top-[5rem] flex-1 w-full z-50 bg-light-background shadow-sm rounded-md max-h-48">
          {dropDownData?.length > 0 ? (
            dropDownData.slice(0, 3).map((item: any, index) => (
              <TouchableOpacity
                key={index}
                className="px-4 py-3 border-b border-gray-200 w-full flex-1"
                onPress={() => handleDropdownSelection(item)}
              >
                <Text className="text-gray-700">{item?.location_name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View className="px-4 py-3">
              <Text className="text-gray-500 text-center">
                {query ? "No results found" : "Start typing to search..."}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
