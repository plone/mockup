import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "navigationmarker",
    trigger: ".pat-navigationmarker",
    parser: "mockup",
    init: function () {
        var self = this;
        const portal_url = document.body.dataset.portalUrl;
        var href =
            document.querySelector('head link[rel="canonical"]').href ||
            window.location.href;

        $("a", this.$el).each(function () {
            var navlink = this.href.replace("/view", "");
            if (href.indexOf(navlink) !== -1) {
                var parent = $(this).parent();

                // check the input-openers within the path
                var check = parent.find("> input");
                if (check.length) {
                    check[0].checked = true;
                }

                // set "inPath" to all nav items which are within the current path
                // check if parts of navlink are in canonical url parts
                var hrefParts = href.split("/");
                var navParts = navlink.split("/");
                var inPath = false;
                for (var i = 0, size = navParts.length; i < size; i++) {
                    // The last path-part must match.
                    inPath = false;
                    if (navParts[i] === hrefParts[i]) {
                        inPath = true;
                    }
                }
                if ((navlink === portal_url) && (href !== portal_url)) {
                    // Avoid marking "Home" with "inPath", when not actually there
                    inPath = false;
                }
                if (inPath) {
                    parent.addClass("inPath");
                }

                // set "current" to the current selected nav item, if it is in the navigation structure.
                if (href === navlink) {
                    parent.addClass("current");
                }
            }
        });
    },
});
