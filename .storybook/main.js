module.exports = {
    stories: ["../src/stories/**/*.docs.mdx", "../src/stories/**/*.stories.js"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-docs",
    ],
    framework: {
        name: "@storybook/html-webpack5",
        options: {},
    },
};
