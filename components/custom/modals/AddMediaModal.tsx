import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Linking,
} from "react-native";

type MediaFile = {
  uri: string;
  type: string;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onMediaSelected: (files: MediaFile | MediaFile[]) => void; // ✅ Updated to handle single or multiple
  allowMultipleImages?: boolean; // ✅ New prop
};

export default function AddMediaModal({
  visible,
  onClose,
  onMediaSelected,
  allowMultipleImages = false, // ✅ Default to single image
}: Props) {
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [libraryStatus, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleCameraPermission = async () => {
    if (!cameraStatus) return false;

    if (cameraStatus.granted) return true;

    if (!cameraStatus.canAskAgain) {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in Settings > Expo Go > Camera to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    const result = await requestCameraPermission();
    return result.granted;
  };

  const handleLibraryPermission = async () => {
    if (!libraryStatus) return false;

    if (libraryStatus.granted) return true;

    if (!libraryStatus.canAskAgain) {
      Alert.alert(
        "Photo Library Permission Required",
        "Please enable photo access in Settings > Expo Go > Photos to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    const result = await requestLibraryPermission();
    return result.granted;
  };

  const pickImage = async (fromCamera: boolean) => {
    try {
      // Check permissions first
      const hasPermission = fromCamera
        ? await handleCameraPermission()
        : await handleLibraryPermission();

      if (!hasPermission) {
        onClose();
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        allowsEditing: !allowMultipleImages, // ✅ Disable editing for multiple selection
        quality: 1,
        allowsMultipleSelection: allowMultipleImages && !fromCamera, // ✅ Enable multiple only for library
      };

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // ✅ Handle multiple assets
        const files: MediaFile[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: asset.type ?? "image/jpeg",
          name: asset.fileName ?? `photo_${Date.now()}_${index}.jpg`,
        }));

        // ✅ Return single file or array based on allowMultipleImages
        if (allowMultipleImages) {
          onMediaSelected(files); // Return array
        } else {
          onMediaSelected(files[0]); // Return single file
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to access camera/photos. Please try again.");
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
              {allowMultipleImages
                ? "Select multiple photos"
                : "Upload from phone"}{" "}
              {/* ✅ Dynamic text */}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
