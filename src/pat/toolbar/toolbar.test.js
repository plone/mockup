import $ from "jquery";
import Pattern from "./toolbar";

describe("Backdrop", function () {
    it("default behaviour", function () {
        var $el = $('<div id="edit-zone">' +
                    ' <div class="pat-toolbar" />' +
                    '</div>'),
            toolbar = new Pattern($el);
        expect($(".plone-backdrop", $el).length).toEqual(1);
    });
});

        /*
define([
    "expect",
    "jquery",
    "pat-registry",
    "plone-patterns-toolbar",
], function (expect, $, registry, Toolbar) {
    "use strict";

    window.mocha.setup("bdd");
    $.fx.off = true;

    describe("Plone Toolbar", function () {
        beforeEach(function () {
            this.$el = $(
                "" +
                    '<div id="edit-zone">' +
                    ' <div class="pat-toolbar" />' +
                    "</div>"
            ).appendTo($("body"));
        });

        afterEach(function () {
            $("body").empty();
            this.$el.remove();
            this.pattern = null;
        });

        it("Initializes", function () {
            registry.scan(this.$el);
            // check if toolbar was initialized.
            expect(this.$el.find(".pat-toolbar.initialized").length).to.equal(
                1
            );
            // TODO: more and better tests.
        });
    });
});

 */
