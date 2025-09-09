export default {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|expo-modules-core|expo-router|expo-image|expo-asset|expo-[a-zA-Z0-9-]+|react-native-reanimated)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
