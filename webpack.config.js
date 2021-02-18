process.traceDeprecation = true;
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const webpack_helpers = require("patternslib/webpack/webpack-helpers");

// plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = async (env) => {
    const mode = env.NODE_ENV;

    const config = {
        mode: mode,
        entry: {
            "bundle": path.resolve(__dirname, "src/patterns.js"),
            "bundle-polyfills": path.resolve(__dirname, "src/polyfills.js"),
        },
        externals: [
            {
                window: "window",
            },
        ],
        output: {
            filename: "[name].js",
            chunkFilename: "chunks/[name].[contenthash].js",
            path: path.resolve(__dirname, "dist/"),
            // publicPath set in bundle entry points via __webpack_public_path__
            // See: https://webpack.js.org/guides/public-path/
            // publicPath: "/dist/",
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    include: /(\.min\.js$)/,
                    extractComments: false,
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    // Also exclude mockup itself, so that plone.staticresources does not need to modify and add mockup to excludes.
                    exclude: /node_modules\/(?!(mockup)\/)(?!(patternslib)\/)(?!(pat-.*)\/).*/,
                    loader: "babel-loader",
                },
                {
                    test: /\.*(?:html|xml)$/i,
                    use: "raw-loader",
                },
                {
                    test: require.resolve("jquery"),
                    use: [
                        {
                            loader: "expose-loader",
                            query: "$",
                        },
                        {
                            loader: "expose-loader",
                            query: "jQuery",
                        },
                    ],
                },
                {
                    test: /\.(?:sass|scss|css)$/i,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                insert: webpack_helpers.top_head_insert,
                            },
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: "file-loader",
                },
                {
                    test: /\.svg$/,
                    loader: "svg-inline-loader",
                },
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, "src/polyfills-loader.js"), }, // prettier-ignore
                ],
            }),
            new CleanWebpackPlugin(),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery",
                Backbone: "backbone",
                _: "underscore",
            }),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
                emitError: true,
            }),
        ],
        resolve: {
            alias: {},
        },
    };

    // Use checked-out versions of dependencies if available.
    // try {
    //     const dev_includes = await fs.promises.readdir("devsrc/");
    //     for (const it of dev_includes) {
    //         if (it in [".gitkeep"]) {
    //             continue;
    //         }
    //         config.resolve.alias[it] = path.resolve(__dirname, `devsrc/${it}`);
    //     }
    // } catch (error) {
    //     // ignore.
    // }

    if (mode === "development") {
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

    if (mode === "production") {
        config.entry["bundle.min"] = config.entry["bundle"];
        config.entry["bundle-polyfills.min"] = config.entry["bundle-polyfills"];
        config.output.chunkFilename = "chunks/[name].[contenthash].min.js";
    }
    if (env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            __dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }
    return config;
};
