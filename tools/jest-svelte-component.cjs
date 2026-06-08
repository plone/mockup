// Jest transformer for Svelte 5 components (.svelte).
//
// svelte-jester refuses to run while Jest is in CJS mode, which is the mode the
// Patternslib base jest config uses — so component-mount tests are otherwise
// impossible here. This mirrors tools/jest-svelte-module.cjs: compile the
// component to client JS with the svelte compiler and down-convert the emitted
// ESM to CommonJS so Jest's default runtime can require it.
//
// The filemanager components use plain JS (JSDoc) in their <script> blocks, so
// no TypeScript preprocessing is needed here. The .ts modules they import are
// handled by the separate .ts transform in jest.config.js.
const babel = require("@babel/core");
const svelte = require("svelte/compiler");

module.exports = {
    process(source, filename) {
        const compiled = svelte.compile(source, {
            filename,
            dev: true,
            generate: "client",
        }).js.code;

        const cjs = babel.transformSync(compiled, {
            filename,
            babelrc: false,
            configFile: false,
            sourceMaps: "inline",
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        });

        return { code: cjs.code };
    },

    getCacheKey(source, filename) {
        return require("crypto")
            .createHash("md5")
            .update(source)
            .update(filename)
            .update("svelte-component-v1")
            .digest("hex");
    },
};
