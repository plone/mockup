// Jest transformer for Svelte 5 runes-in-module files (.svelte.js / .svelte.ts).
//
// svelte-jester only strips TypeScript via svelte.preprocess, which operates on
// <script> blocks and therefore does nothing for tag-less .svelte.ts modules.
// svelte.compileModule does not understand TypeScript either, so we:
//   1. strip TS types with @babel/preset-typescript (runes stay intact),
//   2. compile the runes with svelte.compileModule (emits ESM),
//   3. down-convert ESM -> CommonJS so Jest's default (CJS) runtime can load it.
const babel = require("@babel/core");
const svelte = require("svelte/compiler");

module.exports = {
    process(source, filename) {
        const stripped = babel.transformSync(source, {
            filename,
            babelrc: false,
            configFile: false,
            presets: [
                [
                    "@babel/preset-typescript",
                    { allExtensions: true, allowDeclareFields: true },
                ],
            ],
        }).code;

        const compiled = svelte.compileModule(stripped, {
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
            .update("svelte-module-v1")
            .digest("hex");
    },
};
