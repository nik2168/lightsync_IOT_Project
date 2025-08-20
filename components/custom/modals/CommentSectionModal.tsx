import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: any[];
};

export default function CommentSectionModal({
  visible,
  onClose,
  comments,
}: Props) {
  const [data, setData] = useState(comments);
  const [newComment, setNewComment] = useState("");

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current; // modal starts off screen

  const handleNewComment = () => {
    if (!newComment) return;
    const text = newComment;
    setNewComment("");
    setData((pre) => [
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

  // Animate in/out based on modal visibility
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // shared value
  const backdropOpacity = useSharedValue(0);

  // animate when shown
  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: 3000 });
  }, []);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const isIos = Platform.OS === "ios";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackdropStyle]}>
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          minHeight: "70%",
          paddingBottom: 48,
          zIndex: 100,
        }}
      >
        <View className="w-full pt-3 pl-6 rounded-t-2xl bg-light-background shadow-sm">
          <Text className="text-left font-medium text-xl mb-4 text-mediumDark">
            Comments {data.length}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", top: 15, right: 15, zIndex: 1 }}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
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
        <View className="absolute bottom-0 flex-row justify-center items-center gap-2 w-full mb-[3rem] p-6 bg-white">
          <View className="flex-row w-[90%] items-center border-[1px] border-medium rounded-lg px-4 py-3">
            <TextInput
              placeholder="Type something"
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
              placeholderTextColor={Colors.dark.text}
              className="flex-1  text-light-text text-md placeholder:text-medium"
            />
          </View>
          <TouchableOpacity
            className="w-[3rem] h-[3rem] rounded-lg shadow-sm bg-circle items-center justify-center"
            onPress={() => handleNewComment()}
          >
            <Ionicons name="arrow-up" size={26} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
