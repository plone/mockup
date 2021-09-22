module.exports = {
    rootDir: "./src",
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        "\\.(html|xml)$": "jest-raw-loader",
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
    transformIgnorePatterns: ["/node_modules/(?!.*patternslib/*).+\\.[t|j]sx?$"],
};
