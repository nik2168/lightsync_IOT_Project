import React, { useState } from "react";
import { View, Image, Text, Dimensions, Platform } from "react-native";
import Carousel from "react-native-reanimated-carousel";

interface ImageCarouselProps {
  images: string[];
  height?: number;
  showCounter?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  borderRadius?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height,
  showCounter = true,
  showDots = true,
  autoPlay = false,
  borderRadius = 0, // 2rem = 32px
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const carouselWidth = screenWidth - 20; // Accounting for padding
  const isIos = Platform.OS === "ios";

  // Default height based on platform if not provided
  const carouselHeight = height || (isIos ? 180 : 180); // 18rem = 288px, 14rem = 224px

  // Render individual carousel item
  {
    /* <Image
          source={{
            uri:
              item?.newsImages?.length > 0
                ? item.newsImages[0]?.imageUrl
                : "https://picsum.photos/800/600?random=" +
                  Math.floor(Math.random() * 100),
          }}
          className={`w-full object-cover bg-cover rounded-[2rem] ${
            isIos ? "h-[18rem]" : "h-[14rem]"
          }`}
          resizeMode="cover"
        /> */
  }
  const renderCarouselItem = ({
    item: imageUri,
    index: imageIndex,
  }: {
    item: string;
    index: number;
  }) => (
    <View className="relative overflow-hidden" style={{ borderRadius }}>
      <Image
        source={{ uri: imageUri }}
        style={{
          width: "100%",
          height: carouselHeight,
          borderRadius,
        }}
        className={`w-full object-cover bg-cover ${
          isIos ? "h-[18rem]" : "h-[14rem]"
        }`}
        resizeMode="cover"
      />

      {/* Image counter overlay */}
      {/* {showCounter && images.length > 1 && (
        <View className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {imageIndex + 1}/{images.length}
          </Text>
        </View>
      )} */}
    </View>
  );

  // Configure pan gesture for better scroll handling (v4.x way)
  const onConfigurePanGesture = (gesture: any) => {
    "worklet";
    gesture.activeOffsetX([-10, 10]);
  };

  // Don't render carousel if no images
  if (!images || images.length === 0) {
    return null;
  }

  // If only one image, render without carousel
  if (images.length === 1) {
    return (
      <View className="relative overflow-hidden" style={{ borderRadius }}>
        <Image
          source={{ uri: images[0] }}
          style={{
            width: "100%",
            height: carouselHeight,
            borderRadius,
          }}
          className={`w-full object-cover bg-cover ${
            isIos ? "h-[18rem]" : "h-[14rem]"
          }`}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View className="relative">
      <Carousel
        loop={false}
        width={carouselWidth}
        height={carouselHeight}
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        data={images}
        scrollAnimationDuration={300}
        renderItem={renderCarouselItem}
        onSnapToItem={(index) => setActiveImageIndex(index)}
        onConfigurePanGesture={onConfigurePanGesture}
        style={{
          alignSelf: "center",
        }}
      />
    </View>
  );
};

export default ImageCarousel;
