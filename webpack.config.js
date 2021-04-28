process.traceDeprecation = true;
const fs = require("fs");
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");
const webpack = require("webpack");

module.exports = async (env, argv) => {
    const config = patternslib_config(env, argv);

    config.entry = {
        "bundle": path.resolve(__dirname, "src/patterns.js"),
        "bundle-polyfills": path.resolve(__dirname, "node_modules/@patternslib/patternslib/src/polyfills.js"), // prettier-ignore
    };
    config.output.path = path.resolve(__dirname, "dist/");

    // Correct moment alias
    config.resolve.alias.moment = path.resolve(__dirname, "node_modules/moment"); // prettier-ignore

    config.plugins.push(
        new webpack.ProvidePlugin({
            Backbone: "backbone",
            _: "underscore",
        })
    );

    // Add Svelte support
    config.module.rules.push({
        test: /\.svelte$/,
        use: "svelte-loader",
    });
    config.resolve.alias.svelte = path.resolve("node_modules", "svelte");
    config.resolve.extensions = [".wasm", ".mjs", ".js", ".json", ".svelte"];
    config.resolve.mainFields = ["svelte", "browser", "module", "main"];
    if (argv.mode === "development") {
        // Use checked-out versions of dependencies if available.
        try {
            const dev_includes = await fs.promises.readdir(
                path.resolve(__dirname, "devsrc/")
            );
            for (const it of dev_includes) {
                if ([".gitkeep"].includes(it)) {
                    continue;
                }
                const prefix = it.indexOf("pat") === 0 ? "@patternslib/" : "";
                config.resolve.alias[prefix + it] = path.resolve(
                    __dirname,
                    `devsrc/${it}`
                );
            }
        } catch (error) {
            // ignore.
        }

        // Set public path to override __webpack_public_path__
        // for webpack-dev-server
        config.output.publicPath = "/dist/";
        config.devServer = {
            inline: true,
            contentBase: "./docs/_site/",
            port: "8000",
            host: "0.0.0.0",
            watchOptions: {
                ignored: ["node_modules/**", "mockup/**", "docs/**"],
            },
        };
    }

    if (argv.mode === "production") {
        // Also create minified bundles along with the non-minified ones.
        config.entry["bundle.min"] = config.entry["bundle"];
        config.entry["bundle-polyfills.min"] = config.entry["bundle-polyfills"];
    }

    if (env && env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            __dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    return config;
};
