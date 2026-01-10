const ri_config = require("@patternslib/dev/.release-it.js");

module.exports = () => {
    ri_config.git.requireBranch = "5.4.x";
    return ri_config;
};
