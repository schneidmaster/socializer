import "@testing-library/react/cleanup-after-each";

// FIXME Remove when we upgrade to React >= 16.9
// https://github.com/testing-library/react-testing-library/issues/281
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
