import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type SelectCompProps = {
  label: string;
  required?: boolean;
  options: any[]; // Better to type this as OptionType[]
  selectedValue: any; // Better to type this as OptionType | null
  onSelect: (value: any) => void; // Change from string to any or OptionType
  containerClassName?: string;
  optionClassName?: string;
  selectedOptionClassName?: string;
  labelClassName?: string;
  textClassName?: string;
  selectedTextClassName?: string;
  itemBgColor?: string;
};

export const SelectComp: React.FC<SelectCompProps> = ({
  label,
  required = false,
  options,
  selectedValue,
  onSelect,
  itemBgColor = "bg-circle",
}) => {
  return (
    <View className="flex w-full justify-between  items-left ">
      <Text className="text-darkGrey my-2 ">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {options?.map((type: any) => (
          <TouchableOpacity
            key={type?.id}
            className={`border px-2 py-1   justify-center items-center rounded-md ${
              type.id === selectedValue?.id
                ? "bg-primary border-primary"
                : "border-medium " + itemBgColor
            }`}
            onPress={() =>
              //   dispatch(updateField({ field: "broadcastType", value: type }))
              onSelect(type)
            }
          >
            <Text
              className={`text-sm ${
                selectedValue?.id === type?.id
                  ? "text-dark-text font-medium"
                  : "text-medium"
              }`}
            >
              {type?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
