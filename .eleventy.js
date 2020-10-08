// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
// module.exports = function(eleventyConfig) {
//   eleventyConfig.addPlugin(eleventyNavigationPlugin);
// };


module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"mockup/patterns": "patterns"});
  eleventyConfig.addPassthroughCopy({"favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy({"docs/main.css": "main.css"});
  eleventyConfig.addPassthroughCopy({"mockup/build": "mockup/build"});
  // eleventyConfig.addPassthroughCopy({"mockup/tests/fakeserver.js": "mockup/build/fakeserver.js"});
  eleventyConfig.addPassthroughCopy({"mockup/node_modules/bootstrap": "mockup/build/node_modules/bootstrap"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/requirejs/require.js": "mockup/build/require.js"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon.js": "mockup/build/sinon.js"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon-esm.js": "mockup/build/sinon-esm.js"});
  //eleventyConfig.addPassthroughCopy("mockup/patterns/**/*.json");
  //eleventyConfig.addPassthroughCopy({"../mockup/js/bundles": "js/bundles"});
  //eleventyConfig.addPassthroughCopy({"../mockup/js/config.js": "js/config.js"});
  //eleventyConfig.addPassthroughCopy({"../mockup/js/patterns": "patterns"});
  //eleventyConfig.addPassthroughCopy({"../mockup/node_modules": "node_modules"});

  // Filter source file names using a glob
  eleventyConfig.addCollection("patterns", function(collectionApi) {
    return collectionApi.getFilteredByGlob("mockup/patterns/**/README.md");
  });

  eleventyConfig.addLiquidFilter("replaceString", function(arg1, arg2, arg3) {
    return arg1.replace(arg2, arg3);
  });

  eleventyConfig["dir"] = {
      input: "./",
      ouput: "docs/_site",
      includes: "docs/_includes",
      data: "docs/_data"
  };
  return eleventyConfig;
};