const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

// config.setupFilesAfterEnv.push("./node_modules/@testing-library/jest-dom/extend-expect");
config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.transformIgnorePatterns = [
    "/node_modules/(?!.pnpm/)(?!@patternslib/)(?!@plone/)(?!preact/)(?!screenfull/)(?!sinon/)(?!bootstrap/)(?!datatable/)(?!svelte/)(?!esm-env/).+\\.[t|j]sx?$",
    "/node_modules/.pnpm/(?!@patternslib)(?!@plone)(?!preact)(?!screenfull)(?!sinon)(?!bootstrap)(?!datatable)(?!svelte)(?!esm-env)",
];

// Transforms. Order matters: Jest uses the first matching pattern, so the
// runes-in-module rule (.svelte.ts / .svelte.js) must precede the generic
// babel rule (which would otherwise also match `.svelte.ts`).
config.transform = {
    "^.+\\.svelte\\.(js|ts)$": path.resolve(__dirname, "./tools/jest-svelte-module.cjs"),
    // svelte-jester refuses to run in Jest's CJS mode, so use a custom client
    // compile + ESM->CJS transformer (see the tool for the rationale).
    "^.+\\.svelte$": path.resolve(__dirname, "./tools/jest-svelte-component.cjs"),
    ...config.transform,
};

// console.log(JSON.stringify(config, null, 4));
module.exports = config;
