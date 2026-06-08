const base = require("@patternslib/dev/babel.config.js");

// Extend the Patternslib base babel config with TypeScript support.
// preset-typescript only acts on .ts/.tsx files (by extension), so plain .js
// is unaffected. This covers plain .ts modules in webpack and all .ts files
// under babel-jest. Runes-in-module files (.svelte.ts) are handled separately
// in webpack/jest, not here.
module.exports = (api) => {
    const config = base(api);
    config.presets = [
        ...(config.presets || []),
        ["@babel/preset-typescript", { allowDeclareFields: true }],
    ];
    return config;
};
