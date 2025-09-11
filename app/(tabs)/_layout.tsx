import { Colors } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  const TAB_WIDTH = width / 5;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          backgroundColor: "#fff",
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
      <Tabs.Screen
        name="about"
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

      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="bruno"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: Colors.primary,
          headerRight: () => null,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 16,
            color: Colors.primary,
          },
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
        height: 80 + insetBottom,
        paddingBottom: insetBottom,
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
            bottom: insetBottom + 6,
            left: 0,
            width: 50,
            height: 8,
            backgroundColor: ACTIVE_COLOR,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            marginLeft: (tabWidth - 50) / 2,
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
            }}
          >
            <View
              style={{
                alignItems: "center",
                opacity: isFocused ? 1 : 0.5,
              }}
            >
              {icon}
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
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
      return <MaterialIcons name="home-filled" size={28} color={color} />;
    case "bruno":
      return <Feather name="user" size={22} color={color} />;
    case "profile":
      return <Ionicons name="person-circle-outline" size={28} color={color} />;
    case "about":
      return <Feather name="info" size={22} color={color} />;
    case "energy":
      return <MaterialIcons name="bolt" size={28} color={color} />;
    default:
      return null;
  }
}

function getTabLabel(name: string) {
  switch (name) {
    case "index":
      return "Home";
    case "bruno":
      return "Bruno";
    case "profile":
      return "Profile";
    case "about":
      return "About";
    case "energy":
      return "Energy";
    default:
      return "";
  }
}
