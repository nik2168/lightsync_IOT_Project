import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { FlatList, Keyboard } from "react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface BottomSheetProps {
  onDismiss?: () => void;
}

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ onDismiss }, ref) => {
    const snapPoints = useMemo(() => ["70%"], []);
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      []
    );

    const router = useRouter();
    const { dismiss } = useBottomSheetModal();
    const { user } = useSelector((state: any) => state.userState);

    const [data, setData] = useState([
      {
        id: 1,
        description: "This is a comment",
        author: "John Doe",
        time: "10:30 AM",
        date: "10/11/25",
      },
      {
        id: 2,
        description: "This is a comment",
        author: "John Doe",
        time: "10:30 AM",
        date: "10/11/25",
      },
      {
        id: 3,
        description: "This is a comment",
        author: "John Doe",
        time: "10:30 AM",
        date: "10/11/25",
      },
    ]);
    const [newComment, setNewComment] = useState("");

    const handleNewComment = () => {
      if (!newComment) return;
      const text = newComment;
      setNewComment("");
      setData((pre: any) => [
        ...pre,
        {
          id: pre.length + 1,
          description: text,
          author: "John Doe",
          time: "10:30 AM",
          date: "10/11/25",
        },
      ]);
    };

    return (
      <BottomSheetModal
        backgroundStyle={{ borderRadius: 0 }}
        overDragResistanceFactor={0}
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // tweak offset if needed
        >
          <BottomSheetView className="h-full rounded-md">
            <View className="flex-1 relative">
              <View className="w-full  pl-6 bg-light-background shadow-md">
                <Text className="text-left font-medium text-xl mb-4 text-mediumDark">
                  Comments {data?.length}
                </Text>
                <TouchableOpacity
                  style={{ position: "absolute", top: 6, right: 15, zIndex: 1 }}
                  onPress={() => dismiss()}
                >
                  <Ionicons name="close" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={data}
                keyExtractor={(item: any) => item?.id?.toString()}
                renderItem={({ item }: any) => (
                  <View className="flex-row items-center pl-6 py-6">
                    <View className="w-[2.7rem] h-[2.7rem] rounded-full border-[2px] border-primary items-center justify-center relative">
                      <Ionicons
                        name="person-outline"
                        size={23}
                        color={Colors.primary}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-darkGrey text-lg font-medium ml-3">
                        {item.author}{" "}
                        <Text className="text-sm text-mediumDark">
                          {item.date} {item.time}
                        </Text>
                      </Text>
                      <Text className="text-darkGrey text-sm pl-3 pr-6 text-wrap">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                )}
              />
              <View className=" flex-row justify-center items-center gap-2 w-full mb-[3rem] p-6 bg-white">
                <View className="flex-row w-[90%] items-center border-[1px] border-medium rounded-lg px-4 h-[40px]">
                  <TextInput
                    placeholder="Type something"
                    value={newComment}
                    onChangeText={(text: any) => setNewComment(text)}
                    placeholderTextColor={Colors.dark.text}
                    className="flex-1 h-[40px]  text-light-text text-md placeholder:text-medium"
                  />
                </View>
                <TouchableOpacity
                  className="w-[3rem] h-[3rem] rounded-lg shadow-sm bg-circle items-center justify-center"
                  onPress={() => handleNewComment()}
                >
                  <Ionicons name="arrow-up" size={26} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  }
);

export default BottomSheet;
