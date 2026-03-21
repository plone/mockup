import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import events from "@patternslib/patternslib/src/core/events";
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
        this.portal_url = this.cleanup_url(this.portal_url());

        // Support for navigate event.
        // Re-scan when a navigation change has happened,
        // e.g. by a ajax call,
        // e.g. via pat-inject with history:record setting.
        events.add_event_listener(
            window?.navigation,
            "navigate",
            "pat-navigationmarker--history-changed",
            (e) => {
                const current_url = e?.destination?.url;
                this.mark_items(current_url);
            },
        );

        this.mark_items();
    }

    /**
     * Mark all navigation items that are in the path of
     * the current url
     *
     * @params {String} [url]: Optional url, the current
     * url which all links are compared to.
     */
    mark_items(url) {
        const current_url = this.rebase_url(
            this.cleanup_url(url || this.current_url()),
            this.portal_url,
        );

        const nav_items = this.el.querySelectorAll("a");

        for (const nav_item of nav_items) {
            const wrapper = this.options.itemWrapper
                ? nav_item.closest(this.options.itemWrapper)
                : nav_item.parentElement;

            const nav_url = this.rebase_url(
                this.cleanup_url(nav_item.href),
                this.portal_url,
            );

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

            // Compare the current navigation item url with a slash at the end
            // - if it is "inPath" it must have a slash in it.
            // But do not set inPath for the "Home" url, as this would always
            // be in the path.
            // Except when directly on home page, mark it.
            if (
                (current_url.indexOf(`${nav_url}/`) === 0 &&
                    nav_url !== this.portal_url) ||
                current_url === nav_url
            ) {
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

    /**
     * Rebase URL agains a base URL. Do nothing,
     *
     * @param {String} url: The Url to clean up.
     */
    rebase_url(url, base_url) {
        return new URL(url, base_url)?.href;
    }

    /**
     * Cleanup the URL from parts, which use brittle and useless to compare.
     *
     * @param {String} url: The Url to clean up.
     */
    cleanup_url(url) {
        return url
            ?.split("/view")[0] // Remove "/view"
            .split("@@")[0] // Remove @@ view parts
            .split("++")[0] // Remove ++ view parts (++add++...)
            .replace(/\/$/, ""); // Remove last "/"
    }

    /**
     * Get the portal URL.
     *
     * @returns {String} - The current navigation URL.
     */
    portal_url() {
        return this.options["portal-url"] || document.body.dataset.portalUrl;
    }

    /**
     * Get the current URL.
     *
     * @returns {String} - The current navigation URL.
     */
    current_url() {
        return (
            document.querySelector('head link[rel="canonical"]')?.href ||
            window.location.href
        );
    }
}

// Register Pattern class in the global pattern registry
registry.register(Pattern);

// Make it available
export default Pattern;
