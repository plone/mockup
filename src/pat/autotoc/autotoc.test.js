import { jest } from "@jest/globals";
import "./autotoc";
import $ from "jquery";
import events from "@patternslib/patternslib/src/core/events";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("1 - AutoTOC", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <div class="pat-autotoc">
             <div>
               <h1>Title 1</h1>
               <h1>Title 2</h1>
               <h2>Title 2.1</h2>
               <h2>Title 2.3</h2>
               <h2>Title 2.4</h2>
               <h1>Title 3</h1>
               <h2>Title 3.1</h2>
               <h3>Title 3.1.1</h3>
               <h4>Title 3.1.1.1</h4>
               <h1 style="margin-top: 500px;">Title 4</h1>
             </div>
             <div class="placeholder" style="height: 1000px;">
               <div id="first-elem"></div>
             </div>
            </div>
        `;

        this.$el = $(".pat-autotoc");
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("by default creates TOC from h1/h2/h3", async function () {
        expect(document.querySelectorAll(".nav").length).toEqual(0);

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".nav").length).toEqual(1);
        expect(document.querySelectorAll(".nav > li > a").length).toEqual(9);
        expect(
            document.querySelectorAll(".nav > li > a.autotoc-level-1").length
        ).toEqual(4);
        expect(
            document.querySelectorAll(".nav > li > a.autotoc-level-2").length
        ).toEqual(4);
        expect(
            document.querySelectorAll(".nav > li > a.autotoc-level-3").length
        ).toEqual(1);
        expect(
            document.querySelectorAll(".nav > li > a.autotoc-level-4").length
        ).toEqual(0);
    });
    it("sets href and id", async () => {
        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".nav > li > a")[0].getAttribute("id")).toEqual(
            "autotoc-item-autotoc-0-tab"
        );
        expect(
            document
                .querySelectorAll(".nav > li > a")[0]
                .getAttribute("data-bs-target")
        ).toEqual("#autotoc-item-autotoc-0");
    });
    it("can have custom levels", async function () {
        this.$el.attr("data-pat-autotoc", "levels: h1");
        expect($("> .nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(1);
        expect($("> nav > ul > li > a.autotoc-level-1", this.$el).length).toEqual(4);
        expect($("> nav > ul > li > a.autotoc-level-2", this.$el).length).toEqual(0);
    });
    it("can be appended anywhere", async function () {
        this.$el.attr("data-pat-autotoc", "levels: h1;appendTo:.placeholder");
        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(1);
        expect($("div.placeholder", this.$el).children().eq(0).attr("id")).toEqual(
            "first-elem"
        );
        expect(
            $("div.placeholder", this.$el).children().eq(1).find("ul").attr("class")
        ).toContain("autotoc-nav nav flex-column");

    });
    it("can be prepended anywhere", async function () {
        this.$el.attr("data-pat-autotoc", "levels: h1;prependTo:.placeholder");
        expect($("> .nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > .nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> .nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(1);
        expect($("div.placeholder", this.$el).children().eq(0).find("ul").attr("class")).toContain(
            "autotoc-nav nav flex-column"
        );
        expect($("div.placeholder", this.$el).children().eq(1).attr("id")).toEqual(
            "first-elem"
        );
    });
    it("by default the first element is the active one", async function () {
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav > ul > li > a.active", this.$el).text()).toEqual("Title 1");
    });
    it("the first element with `classActiveName` will be the active", async function () {
        $("h1:eq(1)", this.$el).addClass("active");
        // the second element with `classActiveName` will be ignored as active
        $("h1:eq(2)", this.$el).addClass("active");
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav > ul > li > a.active", this.$el).text()).toEqual("Title 2");
    });
    it("custom className", async function () {
        this.$el.attr("data-pat-autotoc", "className:SOMETHING");
        registry.scan(this.$el);
        await utils.timeout(1);

        expect(this.$el.hasClass("SOMETHING")).toEqual(true);
    });
    // it('scrolls to content', async  function () {
    //   registry.scan(this.$el);
    //    await utils.timeout(1);
    //
    //   expect($(document).scrollTop()).toEqual(0);
    //   if (navigator.userAgent.search('PhantomJS') >= 0) {
    //     // TODO Make this test work in PhantomJS as well as Chrome
    //     //      See https://github.com/ariya/phantomjs/issues/10162
    //     done();
    //   }
    //   $('> nav > a.autotoc-level-1', this.$el).last()
    //     .on('clicked.autodoc.patterns', function() {
    //       var documentOffset = Math.round($(document).scrollTop());
    //       var headingOffset = Math.round($('#autotoc-item-autotoc-8', this.$el).offset().top);
    //       expect(documentOffset).toEqual(headingOffset);
    //       done();
    //     })
    //     .trigger("click");
    // });
});

describe("2 - AutoTOC with tabs", function () {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    // NOTE: These tests pass individually but not together with the other tests.
    //       This pattern has poor isolation and needs to be rewritten using
    //       Patternslib BasePattern class.

    it.skip("2.1 - integrates with pat-validation and marks tabs as required and/or invalid.", async function () {
        // Use pat-validation to test the required and invalid classes
        await import("@patternslib/patternslib/src/pat/validation/validation");

        document.body.innerHTML = `
            <form class="pat-validation pat-autotoc"
                  data-pat-autotoc="
                      levels: legend;
                      section: fieldset;
                      className: autotabs;
                      validationDelay: 0;
                  "
                  data-pat-validation="
                      delay: 0;
                  "
            >
                <fieldset id="fieldset-1">
                    <legend>Tab 1</legend>
                    <input name="constraint-number" type="number" max="1000"/>
                </fieldset>

                <fieldset id="fieldset-2">
                    <legend>Tab 2</legend>
                    <input name="constraint-required" required />
                </fieldset>

                <fieldset id="fieldset-3">
                    <legend>Tab 3</legend>
                    <input name="constraint-none" />
                </fieldset>
            </form>
        `;

        const inp1 = document.querySelector("input[name=constraint-number]");
        const inp2 = document.querySelector("input[name=constraint-required]");
        const inp3 = document.querySelector("input[name=constraint-none]");

        registry.scan(document.body);
        await utils.timeout(1);

        const tabs = document.querySelectorAll(".autotoc-nav > a");
        expect(tabs.length).toEqual(3);

        // Reqwuired checks
        expect(tabs[0].classList.contains("required")).toEqual(false);
        expect(tabs[1].classList.contains("required")).toEqual(true);
        expect(tabs[2].classList.contains("required")).toEqual(false);

        // Validation checks
        expect(tabs[0].classList.contains("invalid")).toEqual(false);
        expect(tabs[1].classList.contains("invalid")).toEqual(false);
        expect(tabs[2].classList.contains("invalid")).toEqual(false);

        inp1.dispatchEvent(events.change_event());
        inp2.dispatchEvent(events.change_event());
        inp3.dispatchEvent(events.change_event());
        await utils.timeout(10);
        expect(tabs[0].classList.contains("invalid")).toEqual(false);
        expect(tabs[1].classList.contains("invalid")).toEqual(true);
        expect(tabs[2].classList.contains("invalid")).toEqual(false);

        inp1.value = "10000";
        inp1.dispatchEvent(events.change_event());
        inp2.dispatchEvent(events.change_event());
        inp3.dispatchEvent(events.change_event());
        await utils.timeout(10);
        expect(tabs[0].classList.contains("invalid")).toEqual(true);
        expect(tabs[1].classList.contains("invalid")).toEqual(true);
        expect(tabs[2].classList.contains("invalid")).toEqual(false);

        inp1.value = "123";
        inp2.value = "okay";
        inp1.dispatchEvent(events.change_event());
        inp2.dispatchEvent(events.change_event());
        inp3.dispatchEvent(events.change_event());
        await utils.timeout(10);
        expect(tabs[0].classList.contains("invalid")).toEqual(false);
        expect(tabs[1].classList.contains("invalid")).toEqual(false);
        expect(tabs[2].classList.contains("invalid")).toEqual(false);
    });

    it.skip("2.2 - the validation marker is called only once when a bunch of updates arrives.", async function () {
        // Use pat-validation to test the required and invalid classes
        await import("@patternslib/patternslib/src/pat/validation/validation");

        document.body.innerHTML = `
            <form class="pat-validation pat-autotoc"
                  data-pat-autotoc="
                      levels: legend;
                      section: fieldset;
                      className: autotabs;
                      validationDelay: 0;
                  "
                  data-pat-validation="
                      delay: 0;
                  "
            >
                <fieldset id="fieldset-1">
                    <legend>Tab 1</legend>
                    <input name="inp1" />
                    <input name="inp2" />
                </fieldset>
            </form>
        `;

        const form = document.querySelector(".pat-autotoc");
        const inp1 = document.querySelector("input[name=inp1]");
        const inp2 = document.querySelector("input[name=inp2]");

        registry.scan(document.body);
        await utils.timeout(1);

        const instance = form["pattern-autotoc"];
        const spy_validation_marker = jest.spyOn(instance, "validation_marker");

        inp1.dispatchEvent(events.change_event());
        inp2.dispatchEvent(events.change_event());
        await utils.timeout(10);
        expect(spy_validation_marker).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();
    });

    it.skip("2.3 - Also set required for checkboxes or radio buttons, where no required attribute might be set on the input itself but instead on or near the label.", async function () {
        document.body.innerHTML = `
            <form class="pat-autotoc"
                  data-pat-autotoc="
                      levels: legend;
                      section: fieldset;
                      className: autotabs;
                      validationDelay: 0;
                  "
            >
                <fieldset id="fieldset-1">
                    <legend>Tab 1</legend>
                    <label class="required">Input 1</label>
                </fieldset>

                <fieldset id="fieldset-2">
                    <legend>Tab 2</legend>
                    <label>Input 2 <span class="required"/></label>
                </fieldset>

                <fieldset id="fieldset-3">
                    <legend>Tab 3</legend>
                </fieldset>
            </form>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        const tabs = document.querySelectorAll(".autotoc-nav > a");
        expect(tabs.length).toEqual(3);

        expect(tabs[0].classList.contains("required")).toEqual(true);
        expect(tabs[1].classList.contains("required")).toEqual(true);
        expect(tabs[2].classList.contains("required")).toEqual(false);
    });
});
