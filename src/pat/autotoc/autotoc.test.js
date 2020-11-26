import $ from "jquery";
import Pattern from "./autotoc";
import registry from "patternslib/src/core/registry";
import utils from "patternslib/src/core/utils";

describe("AutoTOC", function () {
    beforeEach(() => {
        this.$el = $(
            "" +
                '<div class="pat-autotoc">' +
                " <div>" +
                "   <h1>Title 1</h1>" +
                "   <h1>Title 2</h1>" +
                "   <h2>Title 2.1</h2>" +
                "   <h2>Title 2.3</h2>" +
                "   <h2>Title 2.4</h2>" +
                "   <h1>Title 3</h1>" +
                "   <h2>Title 3.1</h2>" +
                "   <h3>Title 3.1.1</h3>" +
                "   <h4>Title 3.1.1.1</h4>" +
                '   <h1 style="margin-top: 500px;">Title 4</h1>' +
                " </div>" +
                ' <div class="placeholder" style="height: 1000px;">' +
                '   <div id="first-elem"></div>' +
                " </div>" +
                "</div>"
        ).appendTo("body");
    });
    afterEach(() => {
        this.$el.remove();
    });
    it("by default creates TOC from h1/h2/h3", async (done) => {
        expect($("> nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(1);
        expect($("> nav > a", this.$el).length).toEqual(9);
        expect($("> nav > a.autotoc-level-1", this.$el).length).toEqual(4);
        expect($("> nav > a.autotoc-level-2", this.$el).length).toEqual(4);
        expect($("> nav > a.autotoc-level-3", this.$el).length).toEqual(1);
        expect($("> nav > a.autotoc-level-4", this.$el).length).toEqual(0);

        done();
    });
    it("sets href and id", async (done) => {
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav > a:first", this.$el).attr("id")).toEqual(
            "autotoc-item-autotoc-0"
        );
        expect($("> nav > a:first", this.$el).attr("href")).toEqual(
            "#autotoc-item-autotoc-0"
        );

        done();
    });
    it("can be used as jQuery plugin as well", async (done) => {
        expect($("> nav", this.$el).length).toEqual(0);
        this.$el.patternAutotoc();
        expect($("> nav", this.$el).length).toEqual(1);

        done();
    });
    it("can have custom levels", async (done) => {
        this.$el.attr("data-pat-autotoc", "levels: h1");
        expect($("> nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(1);
        expect($("> nav > a.autotoc-level-1", this.$el).length).toEqual(4);
        expect($("> nav > a.autotoc-level-2", this.$el).length).toEqual(0);

        done();
    });
    it("can be appended anywhere", async (done) => {
        this.$el.attr("data-pat-autotoc", "levels: h1;appendTo:.placeholder");
        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(1);
        expect(
            $("div.placeholder", this.$el).children().eq(0).attr("id")
        ).toEqual("first-elem");
        expect(
            $("div.placeholder", this.$el).children().eq(1).attr("class")
        ).toEqual("autotoc-nav");

        done();
    });
    it("can be prepended anywhere", async (done) => {
        this.$el.attr("data-pat-autotoc", "levels: h1;prependTo:.placeholder");
        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(0);
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav", this.$el).length).toEqual(0);
        expect($("div.placeholder > nav", this.$el).length).toEqual(1);
        expect(
            $("div.placeholder", this.$el).children().eq(0).attr("class")
        ).toEqual("autotoc-nav");
        expect(
            $("div.placeholder", this.$el).children().eq(1).attr("id")
        ).toEqual("first-elem");

        done();
    });
    it("by default the first element is the active one", async (done) => {
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav > a.active", this.$el).text()).toEqual("Title 1");

        done();
    });
    it("the first element with `classActiveName` will be the active", async (done) => {
        $("h1:eq(1)", this.$el).addClass("active");
        // the second element with `classActiveName` will be ignored as active
        $("h1:eq(2)", this.$el).addClass("active");
        registry.scan(this.$el);
        await utils.timeout(1);

        expect($("> nav > a.active", this.$el).text()).toEqual("Title 2");

        done();
    });
    it("custom className", async (done) => {
        this.$el.attr("data-pat-autotoc", "className:SOMETHING");
        registry.scan(this.$el);
        await utils.timeout(1);

        expect(this.$el.hasClass("SOMETHING")).toEqual(true);

        done();
    });
    // it('scrolls to content', async (done) => {
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
    //     .click();
    // });
});
