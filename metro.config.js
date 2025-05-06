const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Set any custom options here
config.resolver.unstable_enablePackageExports = false;
config.resolver.unstable_enableSymlinks = false;

// Wrap with NativeWind and export
module.exports = withNativeWind(config, { input: "./app/global.css" });
