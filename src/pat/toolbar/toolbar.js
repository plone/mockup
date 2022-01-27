import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import "jquery.cookie";

export default Base.extend({
    name: "toolbar",
    trigger: ".pat-toolbar",
    parser: "mockup",
    defaults: {},

    init: function () {
        import("./pattern.toolbar.scss");

        $("body").on("structure-url-changed", (e, path) => {
            $.ajax({
                url: $("body").attr("data-portal-url") + path + "/@@render-toolbar",
            }).done((data) => {
                const wrapper = $(utils.parseBodyTag(data));
                const $main_toolbar = wrapper.find("#edit-zone .plone-toolbar-main");
                const $personal_tools = wrapper.find("#edit-zone #collapse-personaltools");
                // setup modals
                registry.scan($main_toolbar);
                $(".plone-toolbar-main", this.$el).replaceWith($main_toolbar);
                $("#collapse-personaltools", this.$el).replaceWith($personal_tools);
            });
        });

        // unpin toolbar and save state
        this.$el.on("click", ".offcanvas-unpin", (e) => {
            $("body").removeClass("plone-toolbar-left-expanded");
            $.cookie("plone-toolbar", JSON.stringify({expanded: false}));
        });

        // pin toolbar and save state
        this.$el.on("click", ".offcanvas-pin", (e) => {
            $("body").addClass("plone-toolbar-left-expanded");
            $.cookie("plone-toolbar", JSON.stringify({expanded: true}));
        });

        this.el.classList.add("initialized");
    },
});
