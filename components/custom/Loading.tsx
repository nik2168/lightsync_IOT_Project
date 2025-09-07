import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Text } from "react-native";

const Loading = () => {
  const outerScale = useRef(new Animated.Value(0)).current;
  const outerOpacity = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(0)).current;
  const innerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const DURATION = 1500;

    const animate = () => {
      // Outer ring animation
      const outer = Animated.sequence([
        Animated.parallel([
          Animated.timing(outerScale, {
            toValue: 1,
            duration: DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 0,
            duration: DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(outerScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Inner ring animation with delay *inside* the loop
      const inner = Animated.sequence([
        Animated.delay(DURATION / 2),
        Animated.parallel([
          Animated.timing(innerScale, {
            toValue: 1,
            duration: DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(innerOpacity, {
            toValue: 0,
            duration: DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(innerScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(innerOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Run both in loop in a single parent sequence
      Animated.loop(Animated.parallel([outer, inner])).start();
    };

    animate();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="relative w-16 h-16 items-center justify-center">
        {/* Outer Ring */}
        <Animated.View
          style={{
            position: "absolute",
            width: 44,
            height: 44,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: "#000",
            transform: [{ scale: outerScale }],
            opacity: outerOpacity,
          }}
        />

        {/* Inner Ring */}
        <Animated.View
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#000",
            transform: [{ scale: innerScale }],
            opacity: innerOpacity,
          }}
        />
      </View>
      {/* <Text className="text-md font-light">Connecting ... </Text> */}
    </View>
  );
};

export default Loading;
