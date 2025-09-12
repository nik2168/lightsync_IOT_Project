import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = Colors.lightPrimary;

export default function TabLayout() {
  const translateX = useSharedValue(0);
  const { width } = useWindowDimensions();
  const TAB_WIDTH = width / 2; // Changed from width / 5 to width / 2

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 65,
          paddingTop: 4,
          paddingBottom: 6,
          paddingVertical: 0,
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          backgroundColor: "#fff",
        },
        tabBarItemStyle: {
          height: "100%",
          paddingVertical: 0,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 0,
          marginBottom: 0,
        },
      }}
      tabBar={(props) => (
        <AnimatedTabBar
          {...props}
          translateX={translateX}
          tabWidth={TAB_WIDTH}
        />
      )}
    >
      {/* Only keep Home and Energy tabs */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const AnimatedTabBar = ({
  state,
  descriptors,
  navigation,
  translateX,
  tabWidth,
}: BottomTabBarProps & {
  translateX: Animated.SharedValue<number>;
  tabWidth: number;
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const insetBottom = Platform.OS === "ios" ? 0 : insets.bottom;

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, { duration: 450 });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 65 + insetBottom,
        paddingBottom: insetBottom,
        paddingTop: 0,
        paddingVertical: 0,
        backgroundColor: "#fff",
        borderTopWidth: 0.5,
        borderTopColor: "#ccc",
        position: "relative",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: insetBottom + 4,
            left: 0,
            width: 80, // Increased from 50 for better visibility with 2 tabs
            height: 6,
            backgroundColor: ACTIVE_COLOR,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            marginLeft: (tabWidth - 80) / 2, // Adjusted for new width
          },
          animatedStyle,
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name as never);
          }
        };

        const icon = getTabIcon(route.name, isFocused);
        const label = getTabLabel(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8, // Slightly increased padding for 2-tab layout
              height: "100%",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 3, // Slightly increased gap for better spacing
                opacity: isFocused ? 1 : 0.5,
              }}
            >
              {icon}
              <Text
                style={{
                  fontSize: 11, // Slightly larger font for better readability with 2 tabs
                  color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
                  marginTop: 0,
                  lineHeight: 14,
                  fontWeight: isFocused ? "600" : "400", // Bold text for active tab
                }}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function getTabIcon(name: string, focused: boolean) {
  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

  switch (name) {
    case "index":
      return <MaterialIcons name="home-filled" size={26} color={color} />; // Slightly larger for 2-tab layout
    case "energy":
      return <MaterialIcons name="bolt" size={26} color={color} />; // Slightly larger for 2-tab layout
    default:
      return null;
  }
}

function getTabLabel(name: string) {
  switch (name) {
    case "index":
      return "Home";
    case "energy":
      return "Energy";
    default:
      return "";
  }
}
