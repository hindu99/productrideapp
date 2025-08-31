// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    // CSS modules / plain CSS
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Images and other assets -> stub them out
    "\\.(png|jpg|jpeg|gif|svg|webp|avif)$": "<rootDir>/test/__mocks__/fileMock.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/**/index.{js,jsx}"],
};
