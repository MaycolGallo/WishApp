const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
};

module.exports = withNativeWind(config, { input: './global.css' });
