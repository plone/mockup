import $ from "jquery";
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import Cookies from "js-cookie";

export const parser = new Parser("toolbar");
parser.addArgument("update-trigger", "structure-url-changed");
parser.addArgument("render-url", "@@render-toolbar");

class Pattern extends BasePattern {
    static name = "toolbar";
    static trigger = ".pat-toolbar";
    static parser = parser;

    parser_group_options = false;

    async init() {
        if (window.__patternslib_import_styles) {
            import("./toolbar.scss");
        }

        // Reload on context change in folder content browser.
        $("body").on(this.options["update-trigger"], async (e, path) => {
            await this.reload_toolbar(
                `${document.body.dataset["portal-url"]}${path}/${this.options["render-url"]}`
            );
        });

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

    async reload_toolbar(url) {
        // fetch toolbar
        const response = await fetch(url);
        const data = await response.text();

        // Find toolbar nodes
        const div = document.createElement("div");
        div.innerHTML = data;
        const main_toolbar = div.querySelector("#edit-zone .plone-toolbar-main");
        const personal_tools = div.querySelector("#edit-zone #collapse-personaltools");

        // setup modals
        registry.scan(main_toolbar);
        document.querySelector(".plone-toolbar-main").replaceWith(main_toolbar);
        document.querySelector("#collapse-personaltools").replaceWith(personal_tools);
    }
}
registry.register(Pattern);
export default Pattern;
export { Pattern };
