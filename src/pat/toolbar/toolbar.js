import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import Cookies from "js-cookie";

export default Base.extend({
    name: "toolbar",
    trigger: ".pat-toolbar",
    parser: "mockup",
    defaults: {},

    _fixDropdownStrategy: function () {
        // Use Popper.js 'fixed' strategy for dropdowns so they are not clipped
        // by the overflow-y: auto scroll container on #edit-zone.
        this.$el
            .find('[data-bs-toggle="dropdown"]')
            .attr("data-bs-popper-config", '{"strategy":"fixed"}');
    },

    init: function () {
        this._fixDropdownStrategy();
        this.el.style.overflowY = "auto";
        this.el.style.overflowX = "hidden";

        $("body").on("structure-url-changed", (e, path) => {
            $.ajax({
                url: $("body").attr("data-portal-url") + path + "/@@render-toolbar",
            }).done((data) => {
                const wrapper = $(utils.parseBodyTag(data));
                const $main_toolbar = wrapper.find("#edit-zone .plone-toolbar-main");
                const $personal_tools = wrapper.find(
                    "#edit-zone #collapse-personaltools"
                );
                // setup modals
                registry.scan($main_toolbar);
                $(".plone-toolbar-main", this.$el).replaceWith($main_toolbar);
                $("#collapse-personaltools", this.$el).replaceWith($personal_tools);
                this._fixDropdownStrategy();
            });
        });

        // unpin toolbar and save state
        this.$el.on("click", ".toolbar-collapse", () => {
            $("body").removeClass("plone-toolbar-left-expanded");
            Cookies.set("plone-toolbar", JSON.stringify({ expanded: false }), {
                path: "/",
            });
        });

        // pin toolbar and save state
        this.$el.on("click", ".toolbar-expand", () => {
            $("body").addClass("plone-toolbar-left-expanded");
            Cookies.set("plone-toolbar", JSON.stringify({ expanded: true }), {
                path: "/",
            });
        });

        this.el.classList.add("initialized");
    },
});
