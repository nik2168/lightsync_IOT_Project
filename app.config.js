import "dotenv/config";

export default {
  expo: {
    name: "LightSync",
    slug: "lightsync",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.nik21.lightsync",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner: "nik21",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nik21.lightsync",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "This app needs access to your microphone for voice commands to control your smart home devices.",
        NSCameraUsageDescription:
          "This app may need camera access for future features.",
      },
    },
    android: {
      package: "com.nik21.lightsync",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "RECORD_AUDIO",
        "MODIFY_AUDIO_SETTINGS",
        "INTERNET",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "WAKE_LOCK",
      ],
    },
    updates: {
      url: "https://u.expo.dev/8450a062-b4b4-42da-9fcb-21023daeea7c",
      enabled: true,
      fallbackToCacheTimeout: 0,
    },
    extra: {
      server: process.env.EXPO_PUBLIC_API_URL,
      googleSpeechKey: process.env.EXPO_PUBLIC_GOOGLE_SPEECH_API_KEY, // Add this line
      eas: {
        projectId: "8450a062-b4b4-42da-9fcb-21023daeea7c",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#38b6ff",
        },
      ],
      [
        "expo-av",
        {
          microphonePermission:
            "This app needs access to your microphone for voice commands to control your smart home devices.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
