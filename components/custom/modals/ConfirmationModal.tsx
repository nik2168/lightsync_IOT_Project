import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import ErrorSvg from "@/assets/modal/error.svg";

const ConfirmationModal = ({
  visible,
  onCancel,
  onDelete,
  header = "Are you sure?",
  text,
  confirmText = "Delete",
  isError = false,
}: {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  text: string;
  confirmText?: string;
  isError?: boolean;
  header?: string;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Blur overlay */}
      <BlurView
        intensity={60}
        tint="dark"
        className="absolute left-0 top-0 right-0 bottom-0"
      />
      {/* Centered modal card */}
      <View className="flex-1  items-center justify-center">
        <View className="w-[80%] pb-6 flex-col items-center justify-center  rounded-2xl shadow-md bg-light-background">
          <View className="w-full pt-3 rounded-t-2xl bg-circle">
            <Text className="text-center font-bold text-base mb-4 text-primary">
              {header}
            </Text>
          </View>
          {isError && (
            <View className="w-full flex items-center gap-6 pt-6 justify-center ">
              <Text>oops!</Text>
              <ErrorSvg width={50} height={50} />
            </View>
          )}
          <Text className="text-center my-8 px-[3rem] text-light-text text-[15px]">
            {text}
          </Text>
          <View className="flex-row gap-4 justify-center">
            <Pressable
              className="w-[120px] h-[34px] flex items-center justify-center rounded-xl border border-primary mr-2"
              onPress={onCancel}
            >
              <Text className="text-primary text-sm font-medium">Cancel</Text>
            </Pressable>
            <Pressable
              className="w-[120px] h-[34px] flex items-center justify-center rounded-xl bg-primary"
              onPress={onDelete}
            >
              <Text className="text-dark-text text-sm font-medium">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
