process.traceDeprecation = true;
const package_json = require("./package.json");
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config");
const mf_config = require("@patternslib/patternslib/webpack/webpack.mf");

module.exports = (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "src/index.js"),
        },
    };

    config = patternslib_config(env, argv, config, ["mockup"]);

    config.output.path = path.resolve(__dirname, "dist/");

    config.plugins.push(
        mf_config({
            package_json: package_json,
            remote_entry: config.entry["bundle.min"],
        })
    );

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
