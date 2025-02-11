module.exports = {
    stories: ["../src/stories/**/*.stories.js", "../src/stories/**/*.docs.mdx"],
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
