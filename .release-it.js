const config = require("@patternslib/patternslib/.release-it.js");
delete config.plugins; // temporarily disable conventional-changelog.
module.exports = config;
