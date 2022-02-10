process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config");

module.exports = async (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "src/index.js"),
        },
        externals: {
            "window": "window",
            "$": "jquery",
            "jquery": "jQuery",
            "window.jquery": "jQuery",
            "bootstrap": true,
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    tinymce: {
                        name: "tinymce",
                        test: /[\\/]node_modules[\\/]tinymce.*[\\/]/,
                        chunks: "all",
                    },
                    datatables: {
                        name: "datatables",
                        test: /[\\/]node_modules[\\/]datatables.net.*[\\/]/,
                        chunks: "all",
                    },
                    select2: {
                        name: "select2",
                        test: /[\\/]node_modules[\\/]select2.*[\\/]/,
                        chunks: "all",
                    },
                    jquery_plugins: {
                        name: "jquery_plugins",
                        test: /[\\/]node_modules[\\/]jquery\..*[\\/]/,
                        chunks: "all",
                    },
                },
            },
        },
    };

    config = patternslib_config(env, argv, config, ["mockup"]);
    config.output.path = path.resolve(__dirname, "dist/");

    if (process.env.NODE_ENV === "development") {
        // Note: ``publicPath`` is set to "auto" in Patternslib,
        //        so for the devServer the public path set to "/".
        config.devServer.port = "8000";
        config.devServer.static.directory = path.resolve(__dirname, "./docs/_site/");
    }

    if (env && env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            __dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    return config;
};
