// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
// module.exports = function(eleventyConfig) {
//   eleventyConfig.addPlugin(eleventyNavigationPlugin);
// };
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.addPlugin(syntaxHighlight);
    //eleventyConfig.addPassthroughCopy({"src/pat": "pat"});
    eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });
    eleventyConfig.addPassthroughCopy({ "docs/main.css": "dist/main.css" });
    eleventyConfig.addPassthroughCopy({ dist: "dist" });
    //   eleventyConfig.addPassthroughCopy({"src/tests/json":"dist/json"});
    eleventyConfig.addPassthroughCopy({
        "src/tests/fakeserver.js": "dist/fakeserver.js",
    });
    eleventyConfig.addPassthroughCopy({
        "src/pat/querystring/test-querystringcriteria.json":
            "dist/test-querystringcriteria.json",
    });
    eleventyConfig.addPassthroughCopy({
        "node_modules/prism-themes": "dist/prism-themes",
    });
    eleventyConfig.addPassthroughCopy({ "node_modules/sinon": "dist/sinon" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/skins": "dist/skins" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/icons": "dist/icons" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/themes": "dist/themes" });
    eleventyConfig.addPassthroughCopy({ "node_modules/underscore": "dist/underscore" });
    eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap": "dist/bootstrap" });
    // eleventyConfig.addPassthroughCopy({"mockup/node_modules/requirejs/require.js": "mockup/build/require.js"});
    // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon.js": "mockup/build/sinon.js"});
    // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon-esm.js": "mockup/build/sinon-esm.js"});
    //eleventyConfig.addPassthroughCopy("mockup/patterns/**/*.json");
    //eleventyConfig.addPassthroughCopy({"../mockup/js/bundles": "js/bundles"});
    //eleventyConfig.addPassthroughCopy({"../mockup/js/config.js": "js/config.js"});
    //eleventyConfig.addPassthroughCopy({"../mockup/js/patterns": "patterns"});
    //eleventyConfig.addPassthroughCopy({"../mockup/node_modules": "node_modules"});

    // Filter source file names using a glob
    eleventyConfig.addCollection("patterns", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/pat/**/README.md");
    });
    eleventyConfig.addCollection("externalpatterns", function (collectionApi) {
        return collectionApi.getFilteredByGlob([
            "docs/external/@patternslib/patternslib/src/pat/**/*.md",
            "docs/external/@patternslib/pat-*/README.md",
            "docs/external/pat-*/README.md",
        ]);
    });

    eleventyConfig.addFilter("replaceString", function (arg1, arg2, arg3) {
        return arg1.replace(arg2, arg3);
    });

    eleventyConfig.addFilter("pageTitle", (item) => {
        if (item.data.title && item.data.title !== "") {
            return `${item.data.title}`;
        }
        let url_parts = item.data.page.filePathStem.split("/");
        return url_parts[url_parts.length - 2];
    });

    eleventyConfig.addFilter("stringify", function (value) {
        return JSON.stringify(value);
    });

    eleventyConfig.addFilter("slugFromUrl", (item) => {
        let url_parts = item.url.split("/");
        return url_parts[url_parts.length];
    });

    eleventyConfig["dir"] = {
        input: "./",
        ouput: "docs/_site",
        includes: "docs/_includes",
        data: "docs/_data",
    };
    return eleventyConfig;
};
