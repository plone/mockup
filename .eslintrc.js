module.exports = {
    extends: ["eslint:recommended", "prettier"],
    root: true,
    env: {
        es6: "true",
        browser: true,
        node: true,
    },
    ignorePatterns: [
        "mockup/build/",
        "mockup/coverage/",
        "mockup/docs/",
        "mockup/node_modules/",
        "mockup/tests/files/r.js",
    ],
    rules: {
        "no-debugger": 1,
        "no-duplicate-imports": 1,
        // Do keep due avoid unintendet consequences.
        "no-alert": 0,
        "no-control-regex": 0,
        "no-self-assign": 0,
        "no-useless-escape": 0,
    },
    globals: {
        define: true,
        require: true,
        // tests
        it: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
    },
};
