// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");
// // metro.config.js
// const {
//   wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(
//   wrapWithReanimatedMetroConfig(config),
//   { input: "./global.css" }
// );
// module.exports = wrapWithReanimatedMetroConfig(config);
// module.exports = withNativeWind(config, { input: "./global.css" });
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const path = require("path");

// Get default Expo config
const config = getDefaultConfig(__dirname);

// Add SVG transformer
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// Wrap with NativeWind and Reanimated configs
module.exports = withNativeWind(wrapWithReanimatedMetroConfig(config), {
  input: "./global.css",
});
