import $ from "jquery";
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import events from "@patternslib/patternslib/src/core/events";
import logging from "@patternslib/patternslib/src/core/logging";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import Cookies from "js-cookie";

const log = logging.getLogger("pat-toolbar");

export const parser = new Parser("toolbar");
parser.addArgument("render-view", "@@render-toolbar");

class Pattern extends BasePattern {
    static name = "toolbar";
    static trigger = ".pat-toolbar";
    static parser = parser;

    parser_group_options = false;

    previous_toolbar_url = null;

    async init() {
        if (window.__patternslib_import_styles) {
            //import("./toolbar.scss");
        }

        // Reload the toolbar on history change.
        events.add_event_listener(
            window.navigation,
            "navigate",
            "pat-toolbar--history-changed",
            async () => {
                // Wait a tick to let other Patterns set the `data-base-url`.
                await utils.timeout(1);
                await this.reload_toolbar();
            }
        );

        const $el = $(this.el);

        // unpin toolbar and save state
        $el.on("click", ".toolbar-collapse", () => {
            document.body.classList.remove("plone-toolbar-left-expanded");
            Cookies.set("plone-toolbar", JSON.stringify({ expanded: false }), {
                path: "/",
            });
        });

        // pin toolbar and save state
        $el.on("click", ".toolbar-expand", () => {
            document.body.classList.add("plone-toolbar-left-expanded");
            Cookies.set("plone-toolbar", JSON.stringify({ expanded: true }), {
                path: "/",
            });
        });

        this.el.classList.add("initialized");
    }

    async reload_toolbar() {
        const render_view = this.options["render-view"];
        let url = document.body.dataset.baseUrl;
        // Ensure a trailing slash in the URL.
        url = url[url.length - 1] === "/" ? url : `${url}/`
        url = `${url}${render_view}`;

        if (this.previous_toolbar_url === url) {
            // no need to reload same url
            log.debug("No URL change, no reload.");
            return;
        }

        // fetch toolbar
        log.debug("Reload toolbar on: ", url);
        const response = await fetch(url);
        const data = await response.text();

        this.previous_toolbar_url = url;

        // Find toolbar nodes
        const div = document.createElement("div");
        div.innerHTML = data;
        const main_toolbar = div.querySelector("#edit-zone .plone-toolbar-main");
        const personal_tools = div.querySelector("#edit-zone #collapse-personaltools");

        // setup modals
        registry.scan(main_toolbar);
        registry.scan(personal_tools);
        document.querySelector(".plone-toolbar-main")?.replaceWith(main_toolbar);
        document.querySelector("#collapse-personaltools")?.replaceWith(personal_tools);
        log.debug("Re-scanned.");

        // Notify others that the toolbar has been reloaded.
        this.el.dispatchEvent(events.generic_event("pat-toolbar--reloaded"));
        log.debug("Event pat-toolbar--reloaded dispatched.");
    }
}
registry.register(Pattern);
export default Pattern;
export { Pattern };
