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

        return config;
    },
};
