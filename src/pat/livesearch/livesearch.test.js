import Livesearch from "./livesearch";
import $ from "jquery";
import sinon from "sinon";
import dom from "@patternslib/patternslib/src/core/dom";

describe("Livesearch", function () {
    beforeEach(function () {
        this.server = sinon.fakeServer.create();
        this.server.autoRespond = true;

        this.server.respondWith("GET", /livesearch\.json/, function (xhr) {
            var items = [];
            for (var i = 0; i < 7; i = i + 1) {
                items.push({
                    description: "Site News",
                    img_tag: "",
                    state: "published",
                    title: "News",
                    url: "http://localhost:8081/news/aggregator",
                });
            }
            xhr.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify({
                    total: items.length * 2,
                    items: items,
                })
            );
        });
        this.clock = sinon.useFakeTimers();

        this.$el = $(`
            <form class="pat-livesearch">
                <input type="text" value="foobar" />
            </form>
        `).appendTo($("body"));

        this.ls = new Livesearch(this.$el, {
            ajaxUrl: "livesearch.json",
        });
    });

    afterEach(function () {
        $("body").empty();
        this.server.restore();
        this.clock.restore();
        this.$el.remove();
    });

    it("1 - results on focus", function () {
        this.ls.$input.trigger("focusin");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
    });

    it("2 - responds to keyup", function () {
        this.ls.$input.trigger("keyup");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
    });

    it("3 - does not show with minimum length not met", function () {
        this.ls.$input.attr("value", "fo");
        this.ls.$input.trigger("keyup");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(1);
    });

    it("4 - focus out hides", function () {
        this.ls.$input.trigger("keyup");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);

        this.ls.$input.trigger("focusout");
        this.clock.tick(1000);

        expect(dom.is_visible(document.querySelector(".livesearch-results"))).toEqual(
            false
        );
    });

    it("5 - focus back in shows already searched", function () {
        this.ls.$input.trigger("keyup");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);

        this.ls.$input.trigger("focusout");
        this.clock.tick(1000);
        expect(dom.is_visible(document.querySelector(".livesearch-results"))).toEqual(
            false
        );

        this.ls.$input.trigger("focusin");
        this.clock.tick(1000);
        expect(dom.is_visible(document.querySelector(".livesearch-results"))).toEqual(
            true
        );
    });

    it("6 - should show next and prev", function () {
        this.ls.$input.trigger("keyup");
        this.clock.tick(1000);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
        expect(
            document.querySelectorAll(".livesearch-results li a.next").length
        ).toEqual(1);

        this.ls.doSearch(2);
        this.clock.tick(1000);

        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
        expect(
            document.querySelectorAll(".livesearch-results li a.prev").length
        ).toEqual(1);
    });
});
