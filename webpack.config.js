process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config");
const svelte_config = require("@patternslib/pat-content-browser/webpack.svelte");

const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = async (env, argv, build_dirname = __dirname) => {
    let config = {
        entry: {
            "bundle": path.resolve(__dirname, "src/index.js"),
            "bundle-polyfills": path.resolve(build_dirname, "node_modules/@patternslib/patternslib/src/polyfills.js"), // prettier-ignore
        },
    };

    config = svelte_config(env, argv, patternslib_config(env, argv, config, ["mockup"]));
    config.output.path = path.resolve(__dirname, "dist/");

    config.plugins.push(
        new webpack.ProvidePlugin({
            Backbone: "backbone",
            _: "underscore",
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static = {
            directory: path.resolve(__dirname, "./docs/_site/"),
        };
        config.devServer.port = "8000";
        config.output.publicPath = "/dist/"; // publicPath to discover assets like the chunks directory
    }

    if (env && env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            build_dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    config.plugins.push(
        new ModuleFederationPlugin({
            shared: {
                "@patternslib/patternslib": {
                    singleton: true,
                },
            },
        })
    );

    return config;
};
