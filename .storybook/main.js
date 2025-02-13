const path = require("path");

module.exports = {
    stories: ["../src/pat/**/*.docs.mdx", "../src/pat/**/*.stories.js"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-docs",
        "storybook-addon-mock",
    ],
    framework: {
        name: "@storybook/html-webpack5",
        options: {},
    },
    webpackFinal: async (config) => {
        if (!config.resolve) config.resolve = {};
        if (!config.resolve.alias) config.resolve.alias = {};

        // Support XML
        config.module.rules.push({
            test: /\.xml$/,
            type: "asset/resource",
            generator: {
                filename: "static/assets/[name][ext]",
            },
        });

        // Support SCSS
        config.module.rules.push({
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
        });

        // Support SVG
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        // Support Svelte
        config.module.rules.push({
            test: /\.svelte$/,
            use: [
                {
                    loader: "svelte-loader",
                    options: {
                        compilerOptions: {
                            dev: true,
                        },
                        emitCss: true,
                        hotReload: true,
                    },
                },
            ],
        });

        // TODO: make the mock work
        // Force Storybook to always use the mock instead of the real component ?
        config.resolve.alias["./src/pat/contentbrowser/src/App.svelte"] = path.resolve(
            __dirname,
            "../src/pat/contentbrowser/src/App.mock.js"
        );
        config.resolve.alias["#pat/contentbrowser/src/App"] = path.resolve(
            __dirname,
            "../src/pat/contentbrowser/src/App.mock.js"
        );
        config.resolve.alias["./src/pat/contentbrowser/src/SelectedItem.svelte"] =
            path.resolve(__dirname, "../src/pat/contentbrowser/src/App.mock.js");
        config.resolve.alias["#pat/contentbrowser/src/App"] = path.resolve(
            __dirname,
            "../src/pat/contentbrowser/src/SelectedItem.mock.js"
        );

        return config;
    },
};
