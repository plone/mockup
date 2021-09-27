import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import "./pattern.toolbar.scss";

export default Base.extend({
    name: "toolbar",
    trigger: ".pat-toolbar",
    parser: "mockup",
    defaults: {},
    init_offcanvas: function() {
        var self = this,
            offcanvas_toolbar = document.getElementById('edit-zone'),
            bsOffcanvas = new bootstrap.Offcanvas(offcanvas_toolbar);
        bsOffcanvas.show();
    },
    init: function () {
        var self = this;

        self.init_offcanvas();

        /* folder contents changes the context.
         This is for usability so the menu changes along with
         the folder contents context */
        $("body")
            .off("structure-url-changed")
            .on("structure-url-changed", function (e, path) {
                $.ajax({
                    url: $("body").attr("data-portal-url") + path + "/@@render-toolbar",
                }).done(function (data) {
                    var $el = $(utils.parseBodyTag(data));
                    $el = $el.find("#edit-zone").length ? $el.find("#edit-zone") : $el;
                    self.$el.replaceWith($el);
                    self.init_offcanvas();
                    registry.scan($el);
                });
            });
    },
});
