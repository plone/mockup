const config = require("@patternslib/dev/.release-it.js");

// Releasing from the maintenance branch instead of master/main.
config.git.requireBranch = "5.6.x";

module.exports = config;
