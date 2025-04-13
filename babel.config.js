module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "react-intl",
        {
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
          extractFromFormatMessageCall: true,
        },
      ],
    ],
  };
};
