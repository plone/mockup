import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "navigationmarker",
    trigger: ".pat-navigationmarker",
    parser: "mockup",
    init() {
        const portal_url = document.body.dataset.portalUrl;
        const href =
            document.querySelector('head link[rel="canonical"]').href ||
            window.location.href;
        const hrefParts = href.split("/");

        const nav_items = this.el.querySelectorAll("a");

        for (const nav_item of nav_items) {
            const navlink = nav_item.getAttribute("href", "").replace("/view", "");
            if (href.indexOf(navlink) !== -1) {
                const parent = $(nav_item).parent();

                // check the input-openers within the path
                const check = parent.find("> input");
                if (check.length) {
                    check[0].checked = true;
                }

                // set "inPath" to all nav items which are within the current path
                // check if parts of navlink are in canonical url parts
                const navParts = navlink.split("/");
                let inPath = false;
                for (let i = 0, size = navParts.length; i < size; i++) {
                    // The last path-part must match.
                    inPath = false;
                    if (navParts[i] === hrefParts[i]) {
                        inPath = true;
                    }
                }
                if (navlink === portal_url && href !== portal_url) {
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
        }
    },
});
