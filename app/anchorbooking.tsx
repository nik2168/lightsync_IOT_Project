import DefaultCustomHeader from "@/components/custom/headers/DefaultCustomHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputComp from "@/components/custom/shared/Input";
import { SelectComp } from "@/components/custom/shared/SelectComp";
import ButtonComp from "@/components/custom/shared/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Circles from "@/components/custom/shared/circles";

type OptionType = {
  id: number;
  name: string;
};

export default function Page() {
  const [topic, setTopic] = useState("");
  const [location, setLocation] = useState("Chennai");
  const [channel, setChannel] = useState("");
  const [purpose, setPurpose] = useState("");

  // Date & Time States
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTopicFocused, setIsTopicFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(Platform.OS === "ios");
  };

  const onChangeTime = (_: any, selectedTime?: Date) => {
    if (selectedTime) setTime(selectedTime);
    setShowTimePicker(Platform.OS === "ios");
  };

  const channelOptions: OptionType[] = [
    { id: 1, name: "Brand Awareness" },
    { id: 2, name: "Product Launch" },
    { id: 3, name: "Others" },
  ];

  const purposeOptions = [
    { id: 1, name: "Interview" },
    { id: 2, name: "Discussion" },
    { id: 3, name: "Event hosting" },
    { id: 4, name: "Promotion" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-light-background">
      <DefaultCustomHeader title="Anchor booking" floating />
      <Circles />

      <ScrollView className="px-4 mt-[5rem]">
        <Text className="font-medium my-3 text-md text-mediumDark">
          Selected Anchor / Influencer
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              className="w-[72px] h-[72px] rounded-lg"
            />
            <View className="flex-col justify-center items-left gap-1">
              <View className="flex-row items-center">
                <Text className="font-semibold text-md text-mediumDark">
                  Priya Deshmukh
                </Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={Colors.green}
                  style={{ marginLeft: 4 }}
                />
              </View>
              <Text className="font-semibold text-sm text-mediumDark">
                $90 - $200
              </Text>
              <View className="flex-col gap-1">
                <Text className="font-medium text-[10px] text-mediumDark ml-1">
                  85 User Stories
                </Text>
                <View className="flex-row">
                  <MaterialIcons name="star" size={16} color="gold" />
                  <MaterialIcons name="star" size={16} color="gold" />
                  <MaterialIcons name="star" size={16} color="gold" />
                  <MaterialIcons name="star" size={16} color="gold" />
                  <MaterialIcons name="star-half" size={16} color="gold" />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity className="bg-primary rounded-[10px] py-[8px] px-[23px]">
            <Text className="font-medium text-sm text-light-background">
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Booking Information */}
        <Text className="my-6 font-semibold text-base text-darkGrey">
          Booking information
        </Text>

        <SelectComp
          label="Channel/platform"
          options={channelOptions}
          selectedValue={channel}
          onSelect={setChannel}
          itemBgColor="bg-light-background"
        />

        <SelectComp
          label="Purpose of booking"
          options={purposeOptions}
          selectedValue={purpose}
          onSelect={setPurpose}
          itemBgColor="bg-light-background"
        />

        {/* Date and Time */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="font-medium text-sm text-mediumDark mb-2">
              Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center h-10 px-3 rounded-lg border border-medium bg-circle"
            >
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={Colors.darkGrey}
              />
              <Text className="ml-2 font-semibold text-xs text-darkGrey">
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          <View className="flex-1">
            <Text className="font-medium text-sm text-mediumDark mb-2">
              Time
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="flex-row items-center h-10 px-3 rounded-lg border border-medium bg-light-background"
            >
              <MaterialIcons
                name="access-time"
                size={16}
                color={Colors.medium}
              />
              <Text className="ml-2 font-semibold text-xs text-darkGrey">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>

        <View className="my-4">
          {/* Topic */}
          {/* <InputComp
            Label="Topic"
            text={topic}
            setText={setTopic}
            isFocused={false}
            setIsFocused={() => {}}
            isPassword={false}
            showPassword={false}
            setShowPassword={() => {}}
            keyboardType="default"
          /> */}
          <InputComp
            Label="Topic"
            text={topic}
            setText={setTopic}
            isFocused={isTopicFocused}
            setIsFocused={setIsTopicFocused}
            isPassword={false}
            showPassword={false}
            setShowPassword={() => {}}
            keyboardType="default"
          />
        </View>

        <View>
          {/* Location */}
          <InputComp
            Label="Location"
            text={location}
            setText={setLocation}
            isFocused={isLocationFocused}
            setIsFocused={setIsLocationFocused}
            isPassword={false}
            showPassword={false}
            setShowPassword={() => {}}
            keyboardType="default"
          />
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View className="p-4 bg-light-background">
        <ButtonComp
          text="Pay now"
          onClick={() => console.log("Pay now button pressed!")}
        />
      </View>
    </SafeAreaView>
  );
}
