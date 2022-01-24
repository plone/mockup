import $ from "jquery";
import Offcanvas from "bootstrap";
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
    init: function () {
        import("./pattern.toolbar.scss");

        this.init_offcanvas();

        /* folder_contents change the context
         This is for usability so the menu changes along with the folder contents context */
        $("body")
            .off("structure-url-changed")
            .on("structure-url-changed", (e, path) => {
                $.ajax({
                    url: $("body").attr("data-portal-url") + path + "/@@render-toolbar",
                }).done((data) => {
                    const wrapper = $(utils.parseBodyTag(data));
                    const $el = wrapper.find("#edit-zone").length
                        ? wrapper.find("#edit-zone")
                        : wrapper;
                    this.$el.replaceWith($el);
                    this.init_offcanvas();
                    registry.scan($el);
                });
            });

        this.el.classList.add("initialized");
    },
});
