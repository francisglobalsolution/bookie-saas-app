/* global jest */
import "@testing-library/jest-native/extend-expect";
// Set EXPO_OS for Jest environment
process.env.EXPO_OS = "ios";

// Polyfill for setImmediate (needed by react-native-screens in Jest)
if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
// Polyfill for clearImmediate (needed by react-native-screens in Jest)
if (typeof global.clearImmediate === "undefined") {
  global.clearImmediate = (id) => clearTimeout(id);
}

// --- Global mocks for Expo modules used in the app/tests ---
// Mock expo-router
jest.mock("expo-router", () => {
  // require React inside the factory to avoid out-of-scope variable errors
  const React = jest.requireActual("react");
  return {
    Link: ({ children }) => React.createElement("a", null, children),
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  };
});
// Note: React is required inside mock factories via jest.requireActual to avoid
// out-of-scope variable issues. Do not import React at top-level here.

// Mock expo-web-browser
jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

// Mock expo-image
jest.mock("expo-image", () => ({
  Image: () => null,
}));

// Mock expo-symbols
jest.mock("expo-symbols", () => ({
  SymbolView: () => null,
}));

// Mock expo-blur
jest.mock("expo-blur", () => ({
  BlurView: () => null,
}));

// Extended mock for react-native-reanimated (global)
jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock");
  return {
    ...Reanimated,
    useScrollViewOffset: () => ({ value: 0 }),
    useAnimatedRef: () => null,
    useAnimatedStyle: () => () => ({}),
  };
});
