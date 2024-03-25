const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

// config.setupFilesAfterEnv.push("./node_modules/@testing-library/jest-dom/extend-expect");
config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.transformIgnorePatterns = [
    "/node_modules/(?!@patternslib/)(?!@plone/)(?!preact/)(?!screenfull/)(?!sinon/)(?!bootstrap/)(?!datatable/)(?!svelte/).+\\.[t|j]sx?$",
];

// add svelte-jester
config.transform["^.+\\.svelte$"] = "svelte-jester";

console.log(JSON.stringify(config, null, 4));
module.exports = config;
