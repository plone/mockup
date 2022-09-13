import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";

export const parser = new Parser("navigation");
parser.addArgument("item-wrapper", null);
parser.addArgument("in-path-class", "inPath");
parser.addArgument("current-class", "current");

export default Base.extend({
    name: "navigationmarker",
    trigger: ".pat-navigationmarker",
    parser: "mockup",
    init() {
        this.options = parser.parse(this.el, this.options);
        this.mark_items();
    },

    mark_items(url) {
        // Mark all navigation items that are in the path of the current url

        const current_url = url || this.base_url();
        const current_url_prepared = this.prepare_url(current_url);

        const portal_url = this.prepare_url(document.body.dataset?.portalUrl);
        const nav_items = this.el.querySelectorAll("a");

        for (const nav_item of nav_items) {
            // Get the nav item's url and rebase it against the current url to
            // make absolute or relative URLs FQDN URLs.
            const nav_url = this.prepare_url(
                new URL(nav_item.getAttribute("href", ""), current_url)?.href
            );

            const wrapper = this.options.itemWrapper
                ? nav_item.closest(this.options.itemWrapper)
                : nav_item.parentNode;

            if (nav_url === current_url_prepared) {
                nav_item.classList.add(this.options.currentClass);
                wrapper.classList.add(this.options.currentClass);
            } else if (
                // Compare the current navigation item url with a slash at the
                // end - if it is "inPath" it must have a slash in it.
                current_url_prepared.indexOf(`${nav_url}/`) === 0 &&
                // Do not set inPath for the "Home" url, as this would always
                // be in the path.
                nav_url !== portal_url
            ) {
                nav_item.classList.add(this.options.inPathClass);
                wrapper.classList.add(this.options.inPathClass);
            } else {
                // Not even in path.
                continue;
            }

            // The path was at least found in the current url, so we need to
            // check the input-openers within the path
            // Find the first input which is the correct one, even if this
            // navigation item has many children.
            // These hidden checkboxes are used to open the navigation item for
            // mobile navigation.
            const check = wrapper.querySelector("input");
            if (check) check.checked = true;
        }
    },

    clear_items() {
        // Clear all navigation items from the inPath and current classes

        const items = this.el.querySelectorAll(
            `.${this.options.inPathClass}, .${this.options.currentClass}`
        );
        for (const item of items) {
            item.classList.remove(this.options.inPathClass);
            item.classList.remove(this.options.currentClass);
        }
    },

    prepare_url(url) {
        return url?.replace("/view", "").replaceAll("@@", "").replace(/\/$/, "");
    },

    base_url() {
        return this.prepare_url(
            document.querySelector('head link[rel="canonical"]')?.href ||
                window.location.href
        );
    },
});
