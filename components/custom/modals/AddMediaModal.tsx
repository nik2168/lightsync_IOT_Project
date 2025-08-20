import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type MediaFile = {
  uri: string;
  type: string;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onMediaSelected: (file: MediaFile) => void;
};

export default function AddMediaModal({
  visible,
  onClose,
  onMediaSelected,
}: Props) {
  const pickImage = async (fromCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"], // ✅ mutable array
      allowsEditing: true,
      quality: 1,
    };

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const file: MediaFile = {
        uri: asset.uri,
        type: asset.type ?? "image/jpeg",
        name: asset.fileName ?? `photo_${Date.now()}.jpg`,
      };

      onMediaSelected(file);
    }

    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View className="absolute bottom-0 w-full p-6 pb-[3rem] pl-[2rem] bg-white rounded-t-[2rem]">
        <TouchableOpacity onPress={() => pickImage(true)} className="py-3">
          <View className="flex-row items-center">
            <Ionicons name="camera" size={28} color={Colors.primary} />
            <Text className="text-darkGrey text-xl font-medium ml-3">
              Open camera
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage(false)} className="py-3">
          <View className="flex-row items-center">
            <Ionicons name="image" size={28} color={Colors.primary} />
            <Text className="text-darkGrey text-xl font-medium ml-3">
              Upload from phone
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
