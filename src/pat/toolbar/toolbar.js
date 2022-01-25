import $ from "jquery";
import { Offcanvas } from "bootstrap";
import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";

export default Base.extend({
    name: "toolbar",
    trigger: ".pat-toolbar",
    parser: "mockup",
    defaults: {},
    init_offcanvas: function () {
        const offcanvas_toolbar = document.getElementById("edit-zone");
        const bsOffcanvas = new Offcanvas(offcanvas_toolbar);
        bsOffcanvas.show();
    },
    reload_main_toolbar: function(e, path) {
        $.ajax({
            url: $("body").attr("data-portal-url") + path + "/@@render-toolbar",
        }).done((data) => {
            const wrapper = $(utils.parseBodyTag(data));
            const $el = wrapper.find("#edit-zone .plone-toolbar-main");
            const $main_toolbar = $(".plone-toolbar-main", this.$el);
            registry.scan($el);
            $main_toolbar.replaceWith($el);
        });
    },
    init: function () {
        import("./pattern.toolbar.scss");

        this.init_offcanvas();

        $("body").on("structure-url-changed", this.reload_main_toolbar);

        this.el.classList.add("initialized");
    },
});
