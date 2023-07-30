const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.transformIgnorePatterns = [
    "/node_modules/(?!@patternslib/)(?!@plone/)(?!preact/)(?!screenfull/)(?!sinon/)(?!bootstrap/)(?!datatable/).+\\.[t|j]sx?$",
];

module.exports = config;
