/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Polyfill for setImmediate (needed by react-native-screens in Jest)
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
// Polyfill for clearImmediate (needed by react-native-screens in Jest)
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = (id) => clearTimeout(id);
}
