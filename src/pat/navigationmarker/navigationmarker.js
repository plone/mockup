import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("navigationmarker");
parser.addArgument("portal-url", undefined);

class Pattern extends BasePattern {
    static name = "navigationmarker";
    static trigger = ".pat-navigationmarker";
    static parser = parser;

    async init() {
        this.portal_url = this.options.portalUrl || document.body.dataset.portalUrl;

        this.scan_navigation();
    }

    scan_navigation() {
        const href =
            document.querySelector('head link[rel="canonical"]')?.href ||
            window.location.href;

        const anchors = this.el.querySelectorAll("a");

        for (const anchor of anchors) {

            const parent = anchor.parentElement;
            const navlink = anchor.href.replace("/view", "");

            // We can exit early, if the navlink is not part of the current URL.
            if (href.indexOf(navlink) === -1) {
                this.clear(parent);
                continue;
            }

            // BBB
            // check the input-openers within the path
            const check = parent.querySelector(":scope > input");
            if (check) {
                check.checked = true;
            }

            // set "inPath" to all nav items which are within the current path
            // check if parts of navlink are in canonical url parts
            //
            const href_parts = href.split("/");
            const nav_parts = navlink.split("/");
            let inPath = false;

            // The last part of the URL must match.
            const nav_compare = nav_parts[nav_parts.length - 1];
            const href_compare = href_parts[nav_parts.length - 1];
            if (nav_compare === href_compare) {
                inPath = true;
            }

            // Avoid marking "Home" with "inPath", when not actually there
            if (navlink === this.portal_url && href !== this.portal_url) {
                inPath = false;
            }

            // Set the class
            if (inPath) {
                parent.classList.add("inPath");
            }

            // set "current" to the current selected nav item, if it is in the navigation structure.
            if (href === navlink) {
                parent.classList.add("current");
            }
        }
    }

    clear(element) {
        // Clear all classes
        if (element.classList.contains("inPath")) {
            element.classList.remove("inPath");
        }
        if (element.classList.contains("current")) {
            element.classList.remove("current");
        }
    }
}

// Register Pattern class in the global pattern registry
registry.register(Pattern);

// Make it available
export default Pattern;
