process.traceDeprecation = true;
const path = require("path");
const package_json = require("./package.json");
const patternslib_package_json = require("@patternslib/patternslib/package.json");
const mf_config = require("@patternslib/dev/webpack/webpack.mf");
const webpack_config = require("@patternslib/dev/webpack/webpack.config").config;

module.exports = () => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "src/index.js"),
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // `module.resource` contains the absolute path of the file on disk.
                    // We need to substitute the path separators to make it work on different OSes.
                    tinymce_plugins: {
                        name: "tinymce_plugins",
                        test(module) {
                            const default_plugins = [
                                "fullscreen",
                                "hr",
                                "lists",
                                "media",
                                "nonbreaking",
                                "noneditable",
                                "pagebreak",
                                "paste",
                                "preview",
                                "print",
                                "searchreplace",
                                "tabfocus",
                                "table",
                                "visualchars",
                                "wordcount",
                                "code",
                            ];
                            if (
                                /node_modules.tinymce.plugins/.test(module.resource) ===
                                false
                            ) {
                                return false;
                            }

                            for (const plugin of default_plugins) {
                                if (module.resource.includes(plugin)) {
                                    return true;
                                }
                            }
                            return false;
                        },
                        chunks: "async",
                    },
                    tinymce: {
                        name: "tinymce",
                        test(module) {
                            return (
                                /node_modules.tinymce/.test(module.resource) === true &&
                                !module.resource.includes("tinymce-i18n") &&
                                !module.resource.includes("plugins")
                            );
                        },
                        chunks: "async",
                    },
                    datatables: {
                        name: "datatables",
                        test: /[\\/]node_modules[\\/]datatables.net.*[\\/]/,
                        chunks: "async",
                    },
                    select2: {
                        name: "select2",
                        test: /[\\/]node_modules[\\/]select2.*[\\/]/,
                        chunks: "async",
                    },
                    jquery_plugins: {
                        name: "jquery_plugins",
                        test: /[\\/]node_modules[\\/]jquery\..*[\\/]/,
                        chunks: "async",
                    },
                },
            },
        },
    };

    config = webpack_config({
        config: config,
        package_json: package_json,
    });

    config.output.path = path.resolve(__dirname, "dist/");

    config.module.rules.push({
        test: /\.svelte$/,
        // exclude: /node_modules/,
        use: {
            loader: "svelte-loader",
            options: {
                compilerOptions: {
                    dev: process.env.NODE_ENV === "development",
                },
                emitCss: process.env.NODE_ENV !== "development",
                hotReload: process.env.NODE_ENV === "development",
            },
        },
    });

    config.module.rules.push({
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
            fullySpecified: false,
        },
    });

    config.resolve.alias.svelte = path.resolve('node_modules', 'svelte/src/runtime')
    config.resolve.extensions = [".js", ".json", ".wasm", ".svelte"];
    config.resolve.mainFields = ["browser", "module", "main", "svelte"];
    // config.resolve.conditionNames = ["svelte", "browser", "import"];
    //config.resolve.conditionNames = ["svelte", "module", "browser"];

    config.plugins.push(
        mf_config({
            name: package_json.name,
            filename: "remote.min.js",
            remote_entry: config.entry["bundle.min"],
            dependencies: {
                ...patternslib_package_json.dependencies,
                ...package_json.dependencies,
            },
            shared: {
                bootstrap: {
                    singleton: true,
                    requiredVersion: package_json.dependencies["bootstrap"],
                    eager: true,
                },
                jquery: {
                    singleton: true,
                    requiredVersion: package_json.dependencies["jquery"],
                    eager: true,
                },
            },
        })
    );

    if (process.env.NODE_ENV === "development") {
        // Note: ``publicPath`` is set to "auto" in Patternslib,
        //        so for the devServer the public path set to "/".
        config.devServer.allowedHosts = ['localhost', 'plone.lan'];
        config.devServer.port = "8000";
        config.devServer.static.directory = path.resolve(__dirname, "./_site/");
    }

    if (process.env.DEPLOYMENT === "docs") {
        config.output.path = path.resolve(
            __dirname,
            "./_site/dist/mockup/"
        );
    }
    if (process.env.DEPLOYMENT === "plone") {
        config.output.path = path.resolve(
            __dirname,
            "../plone.staticresources/src/plone/staticresources/static/bundle-plone/"
        );
    }

    console.log(JSON.stringify(config, null, 4));

    return config;
};
