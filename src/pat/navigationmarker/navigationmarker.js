import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("navigationmarker");
parser.addArgument("portal-url", undefined);
parser.addArgument("in-path-class", "inPath");
parser.addArgument("current-class", "current");
parser.addArgument("item-wrapper", null);

class Pattern extends BasePattern {
    static name = "navigationmarker";
    static trigger = ".pat-navigationmarker";
    static parser = parser;

    parser_group_options = false;

    init() {
        this.portal_url = this.options["portal-url"] || document.body.dataset.portalUrl;

        this.scan_navigation();
    }

    scan_navigation() {
        const current_url =
            document.querySelector('head link[rel="canonical"]')?.href ||
            window.location.href;

        const nav_items = this.el.querySelectorAll("a");

        for (const nav_item of nav_items) {
            const wrapper = this.options.itemWrapper
                ? nav_item.closest(this.options.itemWrapper)
                : nav_item.parentElement;

            const nav_url = nav_item.href.replace("/view", "");

            // We can exit early, if the nav_url is not part of the current URL.
            if (current_url.indexOf(nav_url) === -1) {
                this.clear(wrapper);
                this.clear(nav_item);
                continue;
            }

            // BBB
            // check the input-openers within the path
            const check = wrapper.querySelector(":scope > input[type=checkbox]");
            if (check) {
                check.checked = true;
            }

            // set "inPath" to all nav items which are within the current path
            // check if parts of nav_url are in canonical url parts
            //
            const current_url_parts = current_url.split("/");
            const nav_url_parts = nav_url.split("/");
            let in_path = false;

            // The last part of the URL must match.
            const nav_url_part = nav_url_parts[nav_url_parts.length - 1];
            const current_url_part = current_url_parts[nav_url_parts.length - 1];
            if (nav_url_part === current_url_part) {
                in_path = true;
            }

            // Avoid marking "Home" with "inPath", when not actually there
            if (nav_url === this.portal_url && current_url !== this.portal_url) {
                in_path = false;
            }

            // Set the class
            if (in_path) {
                wrapper.classList.add(this.options["in-path-class"]);
                // Don't mark the nav_item as inPath:
                // - An <a>nchor element cannot have sub-items, so this is not needed anyways.
                // - Having a parent nav_item marked as inPath and thus multiple
                //   nav items in a kind-of-active style looks confusing.
            }

            // set "current" to the current selected nav item, if it is in the navigation structure.
            if (current_url === nav_url) {
                wrapper.classList.add(this.options["current-class"]);
                nav_item.classList.add(this.options["current-class"]);
            }
        }
    }

    clear(element) {
        // Clear all classes
        if (element.classList.contains(this.options["in-path-class"])) {
            element.classList.remove(this.options["in-path-class"]);
        }
        if (element.classList.contains(this.options["current-class"])) {
            element.classList.remove(this.options["current-class"]);
        }
    }
}

// Register Pattern class in the global pattern registry
registry.register(Pattern);

// Make it available
export default Pattern;
