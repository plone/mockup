process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");
const webpack = require("webpack");

module.exports = async (env, argv, build_dirname = __dirname) => {
    let config = {
        entry: {
            "bundle": path.resolve(__dirname, "src/patterns.js"),
            "bundle-polyfills": path.resolve(build_dirname, "node_modules/@patternslib/patternslib/src/polyfills.js"), // prettier-ignore
        },
    };

    config = patternslib_config(env, argv, config);

    config.output.path = path.resolve(__dirname, "dist/");

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

    if (process.env.NODE_ENV === "development") {
        // Set public path to override __webpack_public_path__ for webpack-dev-server
        config.output.publicPath = "/dist/";
        config.devServer = {
            inline: true,
            contentBase: "./docs/_site/",
            port: "8000",
            host: "0.0.0.0",
            watchOptions: {
                ignored: ["node_modules/**", "mockup/**", "docs/**"],
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    if (env && env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            build_dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    return config;
};
