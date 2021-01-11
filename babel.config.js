module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "entry",
                corejs: 3,
            },
        ],
        "@babel/preset-react",
    ],
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-syntax-export-namespace-from",
        "@babel/plugin-proposal-throw-expressions",
    ],
};
