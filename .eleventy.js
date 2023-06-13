const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });
    eleventyConfig.addPassthroughCopy({ "docs/main.css": "dist/main.css" });
    eleventyConfig.addPassthroughCopy({ dist: "dist" });
    eleventyConfig.addPassthroughCopy({ "src/tests/fakeserver.js": "dist/fakeserver.js" }); // prettier-ignore
    eleventyConfig.addPassthroughCopy({ "src/pat/querystring/test-querystringcriteria.json": "dist/test-querystringcriteria.json" }); // prettier-ignore
    eleventyConfig.addPassthroughCopy({ "node_modules/prismjs": "dist/prismjs" });
    eleventyConfig.addPassthroughCopy({ "node_modules/sinon": "dist/sinon" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/skins": "dist/skins" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/icons": "dist/icons" });
    eleventyConfig.addPassthroughCopy({ "node_modules/tinymce/themes": "dist/themes" });
    eleventyConfig.addPassthroughCopy({ "node_modules/underscore": "dist/underscore" });
    eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap": "dist/bootstrap" });
    eleventyConfig.addPassthroughCopy({ "node_modules/jquery": "dist/jquery" });

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
