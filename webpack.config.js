process.traceDeprecation = true;
const path = require("path");
const webpack = require("webpack");

// plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
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
                    exclude: /node_modules\/(?!(patternslib)\/).*/,
                    loader: "babel-loader",
                },
                {
                    test: /\.html$/i,
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
                    test: /\.css$/,
                    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
                },
            ],
        },
        resolve: {
            alias: {
                "moment": path.resolve(__dirname, "node_modules/moment"),
                "moment-timezone": path.resolve(
                    __dirname,
                    "node_modules/moment-timezone"
                ),
            },
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
            }),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
                emitError: true,
            }),
        ],
    };
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
                ignored: ["node_modules/**", "mockup/**"],
            },
        };
    }
    if (mode === "production") {
        config.entry["bundle.min"] = config.entry["bundle"];
        config.entry["bundle-polyfills.min"] = config.entry["bundle-polyfills"];
        config.output.chunkFilename = "chunks/[name].[contenthash].min.js";
    }
    return config;
};
