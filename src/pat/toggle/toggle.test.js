import "regenerator-runtime/runtime"; // needed for ``await`` support
import "./toggle";
import $ from "jquery";
import logger from "@patternslib/patternslib/src/core/logging";
import registry from "@patternslib/patternslib/src/core/registry";
import { jest } from "@jest/globals";

describe("Toggle", function () {
    beforeEach(function () {
        document.body.innerHTML = `
          <div id="body">
            <a class="pat-toggle"
              data-pat-toggle="target: #target;
                               targetScope: #body;
                               value: toggled">Button</a>
            <div id="target">
              <a href="patterns.html">Click here to go somewhere else</a>
            </div>
        </div>
        `;
        this.$el = $("#body");
    });

    afterEach(function () {
        document.body.outerHTML = "";
    });

    it("1 - by default toggles on click event", async function () {
        expect($(".toggled", this.$el).length).toEqual(0);

        // scan dom for patterns
        registry.scan(this.$el);
        expect($(".toggled", this.$el).length).toEqual(0);
        $(".pat-toggle", this.$el).trigger("click");
        expect($(".toggled", this.$el).length).toEqual(1);
        $(".pat-toggle", this.$el).trigger("click");
        expect($(".toggled", this.$el).length).toEqual(0);
    });

    it("can also listen to custom event", function () {
        $(".pat-toggle", this.$el).attr(
            "data-pat-toggle",
            "target: #target; targetScope: #body; value: toggled; event: customEvent"
        );
        expect($(".toggled", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        expect($(".toggled", this.$el).length).toEqual(0);
        $(".pat-toggle", this.$el).trigger("customEvent");
        expect($(".toggled", this.$el).length).toEqual(1);
    });

    it("can also toggle custom element attribute", function () {
        $(".pat-toggle", this.$el).attr(
            "data-pat-toggle",
            "target: #target; targetScope: #body; value: toggled; attribute: rel"
        );
        expect($(".toggled", this.$el).length).toEqual(0);
        expect($('[rel="toggled"]', this.$el).length).toEqual(0);
        registry.scan(this.$el);
        expect($('[rel="toggled"]', this.$el).length).toEqual(0);
        expect($(".toggled", this.$el).length).toEqual(0);
        $(".pat-toggle", this.$el).trigger("click");
        expect($(".toggled", this.$el).length).toEqual(0);
        expect($('[rel="toggled"]', this.$el).length).toEqual(1);
        $(".pat-toggle", this.$el).trigger("click");
        expect($('[rel="toggled"]', this.$el).length).toEqual(0);
    });

    it("toggle multiple targets", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                "  <div>" +
                "    <div>" +
                "      <div>" +
                '        <a class="pat-toggle"' +
                '          data-pat-toggle="target: .target;' +
                "                           targetScope: #body;" +
                '                           value: toggled">Button</a>' +
                "      </div>" +
                '      <div class="target"></div>' +
                "    </div>" +
                '    <div class="target"></div>' +
                '    <div class="target"></div>' +
                "  </div>" +
                '  <div class="target"></div>' +
                '  <div class="target"></div>' +
                "</div>"
        );
        registry.scan($el);
        expect($(".toggled", $el).length).toEqual(0);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(5);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(0);
    });

    it("if some elements already marked, mark all with first click", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                "  <div>" +
                "    <div>" +
                "      <div>" +
                '        <a class="pat-toggle"' +
                '          data-pat-toggle="target: .target;' +
                "                           targetScope: #body;" +
                '                           value: toggled">Button</a>' +
                "      </div>" +
                '      <div class="target toggled"></div>' +
                "    </div>" +
                '    <div class="target"></div>' +
                '    <div class="target toggled"></div>' +
                "  </div>" +
                '  <div class="target toggled"></div>' +
                '  <div class="target"></div>' +
                "</div>"
        );
        registry.scan($el);
        expect($(".toggled", $el).length).toEqual(3);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(5);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(0);
    });

    it("if all elements already marked, unmark all with first click", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                "  <div>" +
                "    <div>" +
                "      <div>" +
                '        <a class="pat-toggle"' +
                '          data-pat-toggle="target: .target;' +
                "                           targetScope: #body;" +
                '                           value: toggled">Button</a>' +
                "      </div>" +
                '      <div class="target toggled"></div>' +
                "    </div>" +
                '    <div class="target toggled"></div>' +
                '    <div class="target toggled"></div>' +
                "  </div>" +
                '  <div class="target toggled"></div>' +
                '  <div class="target toggled"></div>' +
                "</div>"
        );
        registry.scan($el);
        expect($(".toggled", $el).length).toEqual(5);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(0);
    });

    it("should also be able to mark the toggle itself", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                "  <div>" +
                "    <div>" +
                "      <div>" +
                '        <a class="pat-toggle target"' +
                '          data-pat-toggle="target: .target;' +
                "                           targetScope: #body;" +
                '                           value: toggled">Button</a>' +
                "      </div>" +
                '      <div class="target"></div>' +
                "    </div>" +
                '    <div class="target"></div>' +
                '    <div class="target"></div>' +
                "  </div>" +
                '  <div class="target"></div>' +
                '  <div class="target"></div>' +
                "</div>"
        );
        registry.scan($el);
        expect($(".toggled", $el).length).toEqual(0);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(6);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(0);
    });

    it("should target itself when no target is specified", function () {
        var $el = $(
            "" +
                "<div>" +
                ' <a class="pat-toggle"' +
                '    data-pat-toggle="value: toggled">Button</a>' +
                "</div>"
        );
        registry.scan($el);
        expect($(".toggled", $el).length).toEqual(0);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(1);
        $(".pat-toggle", $el).trigger("click");
        expect($(".toggled", $el).length).toEqual(0);
    });

    it("should use the targetScope option to find the target when specified", function () {
        var $el = $(
            "" +
                "<div>" +
                '  <div class="parent1 myParent">' +
                '    <a class="pat-toggle"' +
                '      data-pat-toggle="target: .target;' +
                "                       value: toggled;" +
                '                       targetScope: .myParent">Button</a>' +
                '    <div class="target pt1">' +
                '     <a href="patterns.html">Click here to go somewhere else</a>' +
                "    </div>" +
                "  </div>" +
                '  <div class="parent2 myParent">' +
                '    <a class="pat-toggle"' +
                '      data-pat-toggle="target: .target;' +
                "                       value: toggled;" +
                '                       targetScope: .myParent">Button</a>' +
                '    <div class="target pt2">' +
                '     <a href="patterns.html">Click here to go somewhere else</a>' +
                "    </div>" +
                "  </div>" +
                "</div>"
        );
        registry.scan($el);
        var $pattern1 = $el.find(".pat-toggle").first();
        expect($(".toggled", $el).length).toEqual(0);
        $pattern1.trigger("click");
        expect($(".toggled", $el).length).toEqual(1);
        expect($(".parent1 .toggled", $el).length).toEqual(1);
        expect($(".parent2 .toggled", $el).length).toEqual(0);
    });

    it("should use the target when targetScope is global", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                ' <a class="pat-toggle"' +
                '    data-pat-toggle="target: #target;' +
                "                     targetScope: global;" +
                '                     value: toggled">Button</a>' +
                ' <div id="target"><div>' +
                "</div>"
        ).appendTo("body");
        var $target = $("#target");
        expect($target.hasClass("toggled")).toEqual(false);
        registry.scan($el);
        expect($target.hasClass("toggled")).toEqual(false);
        $el.find(".pat-toggle").first().trigger("click");
        expect($target.hasClass("toggled")).toEqual(true);
        $el.remove();
    });

    it("the targetScope option should also work with other tags like p tag", function () {
        var $el = $(
            "" +
                "<div>" +
                '  <p class="parent1 myParent">' +
                '    <a class="pat-toggle"' +
                '      data-pat-toggle="target: .target;' +
                "                       value: toggled;" +
                '                       targetScope: .myParent">Button</a>' +
                '    <a class="target" href="patterns.html">Click here to go somewhere else</a>' +
                "  </p>" +
                '  <p class="parent2 myParent">' +
                '    <a class="uupat-toggle"' +
                '      data-pat-toggle="target: .target;' +
                "                       value: toggled;" +
                '                       targetScope: .myParent">Button</a>' +
                '    <p><a class="target" href="patterns.html">Click here to go somewhere else</a></p>' +
                "  </p>" +
                "</div>"
        );
        registry.scan($el);
        var $pattern1 = $el.find(".pat-toggle").first();
        expect($(".toggled", $el).length).toEqual(0);
        $pattern1.trigger("click");
        expect($(".toggled", $el).length).toEqual(1);
        expect($(".parent1 .toggled", $el).length).toEqual(1);
        expect($(".parent2 .toggled", $el).length).toEqual(0);
    });

    it("12 - should throw an error when it cannot find the target", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                ' <a class="pat-toggle"' +
                '    data-pat-toggle="target: #notarget;' +
                "                     targetScope: #body;" +
                '                     value: toggled">Button</a>' +
                ' <div id="target">' +
                '   <a href="patterns.html">Click here to go somewhere else</a>' +
                " </div>" +
                "</div>"
        );
        const spy_log_error = jest.spyOn(console, "error");
        registry.scan($el);
        expect(spy_log_error).toHaveBeenCalledTimes(1);
        expect(spy_log_error).toHaveBeenCalledWith(
            "pat-toggle:",
            'No target found for "#notarget".'
        );
        spy_log_error.mockRestore();
    });
});
