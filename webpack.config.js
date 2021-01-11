process.traceDeprecation = true;
const fs = require("fs");
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");
const webpack = require("webpack");

module.exports = async (env, argv, build_dirname = __dirname) => {
    const config = patternslib_config(env, argv);

    config.entry = {
        "bundle": path.resolve(build_dirname, "src/patterns.js"),
        "bundle-polyfills": path.resolve(build_dirname, "node_modules/@patternslib/patternslib/src/polyfills.js"), // prettier-ignore
    };
    config.output.path = path.resolve(build_dirname, "dist/");

    // Volto / React
    const config_babel_loader = config.rules.filter((it) => it.test === /\.js$/)[0];
    config_babel_loader.test = /\.jsx?$/;
    config_babel_loader.exclude = /node_modules\/(?!(.*patternslib)\/)(?!(pat-.*)\/)(?!(mockup|@plone)\/).*/;
    config.resolve.alias["load-volto-addons"] = path.resolve(__dirname, "src/volto/load-volto-addons"); // prettier-ignore
    config.resolve.alias["@sentry/node"] = "@sentry/browser";

    // Correct moment alias
    config.resolve.alias.moment = path.resolve(build_dirname, "node_modules/moment"); // prettier-ignore

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
    config.resolve.extensions = [".wasm", ".mjs", ".js", ".json", ".svelte", ".jsx"];
    config.resolve.mainFields = ["svelte", "browser", "module", "main"];
    if (argv.mode === "development") {
        // Use checked-out versions of dependencies if available.
        try {
            const dev_includes = await fs.promises.readdir(
                path.resolve(build_dirname, "devsrc/")
            );
            for (const it of dev_includes) {
                if ([".gitkeep"].includes(it)) {
                    continue;
                }
                let prefix = "";
                prefix = it.indexOf("pat") === 0 ? "@patternslib/" : prefix;
                prefix = it.indexOf("volto") === 0 ? "@plone/" : prefix;
                config.resolve.alias[prefix + it] = path.resolve(
                    build_dirname,
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
            build_dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    return config;
};
