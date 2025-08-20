import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type SelectCompProps = {
  label: string;
  required?: boolean;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  containerClassName?: string;
  optionClassName?: string;
  selectedOptionClassName?: string;
  labelClassName?: string;
  textClassName?: string;
  selectedTextClassName?: string;
};

export const SelectComp: React.FC<SelectCompProps> = ({
  label,
  required = false,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View className="flex w-full justify-between  items-left ">
      <Text className="text-darkGrey my-2 ">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {options.map((type) => (
          <TouchableOpacity
            key={type}
            className={`border px-2 py-1  justify-center items-center rounded-md ${
              type === selectedValue
                ? "bg-primary border-primary"
                : "border-medium bg-circle "
            }`}
            onPress={() =>
              //   dispatch(updateField({ field: "broadcastType", value: type }))
              onSelect(type)
            }
          >
            <Text
              className={`text-sm ${
                selectedValue === type
                  ? "text-dark-text font-medium"
                  : "text-medium"
              }`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
