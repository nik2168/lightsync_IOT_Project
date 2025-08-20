import { View, Text } from "react-native";
import React from "react";

const Circles = () => {
  return (
    <>
      <View className="w-[7rem] h-[7rem] rounded-full absolute top-[6rem] left-[-1.5rem] bg-circle"></View>
      <View className="w-[7rem] h-[7rem] rounded-full absolute right-[2rem] top-[18rem] bg-circle"></View>
      <View className="w-[7rem] h-[7rem] rounded-full absolute bottom-[16rem] left-[6rem] bg-circle"></View>
    </>
  );
};

export default Circles;
