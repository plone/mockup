process.traceDeprecation = true;
const package_json = require("./package.json");
const path = require("path");
const patternslib_config = require("@patternslib/dev/webpack/webpack.config");
const mf_config = require("@patternslib/dev/webpack/webpack.mf");

module.exports = (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "src/index.js"),
            "bootstrap.min": path.resolve(__dirname, "src/index-bootstrap.js"),
            "jquery.min": path.resolve(__dirname, "src/index-jquery.js"),
        },
    };

    config = patternslib_config(env, argv, config, ["@plone/mockup"]);

    config.output.path = path.resolve(__dirname, "dist/");

    config.plugins.push(
        mf_config({
            package_json: package_json,
            remote_entry: config.entry["bundle.min"],
        })
    );
    config.plugins.push(
        mf_config({
            name: "bootstrap",
            filename: "bootstrap-remote.min.js",
            remote_entry: config.entry["bootstrap.min"],
            shared: {
                bootstrap: {
                    singleton: true,
                    requiredVersion: package_json.dependencies["bootstrap"],
                },
            },
        })
    );
    config.plugins.push(
        mf_config({
            name: "jquery",
            filename: "jquery-remote.min.js",
            remote_entry: config.entry["jquery.min"],
            shared: {
                jquery: {
                    singleton: true,
                    requiredVersion: package_json.dependencies["jquery"],
                },
            },
        })
    );

    if (process.env.NODE_ENV === "development") {
        // Note: ``publicPath`` is set to "auto" in Patternslib,
        //        so for the devServer the public path set to "/".
        config.devServer.port = "8000";
        config.devServer.static.directory = path.resolve(
            __dirname,
            "./docs/_site/"
        );
    }

    if (env && env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            __dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    //console.log(JSON.stringify(config, null, 4));

    return config;
};
