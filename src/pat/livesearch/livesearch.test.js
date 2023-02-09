import Livesearch from "./livesearch";
import $ from "jquery";
import sinon from "sinon";
import utils from "@patternslib/patternslib/src/core/utils";

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

        this.$el = $(`
            <form class="pat-livesearch">
                <input type="text" value="foobar" />
            </form>
        `).appendTo($("body"));

        this.ls = new Livesearch(this.$el, {
            ajaxUrl: "livesearch.json",
            quietMillis: 1,
            timeoutHide: 1,
        });
    });

    afterEach(function () {
        $("body").empty();
        this.server.restore();
        this.$el.remove();
    });

    it("1 - results on focus", async function () {
        this.ls.$input.trigger("focusin");
        await utils.timeout(10);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
    });

    it("2 - responds to keyup", async function () {
        this.ls.$input.trigger("keyup");
        await utils.timeout(100);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
    });

    it("3 - does not show with minimum length not met", async function () {
        this.ls.$input.attr("value", "fo");
        this.ls.$input.trigger("keyup");
        await utils.timeout(1);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(1);
    });

    it("4 - focus out hides", async function () {
        this.ls.$input.trigger("keyup");
        await utils.timeout(100);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);

        this.ls.$input.trigger("focusout");
        await utils.timeout(10);

        const results = document.querySelector(".livesearch-results");
        expect(results.classList.contains("d-none")).toBe(true);
    });

    it("5 - focus back in shows already searched", async function () {
        this.ls.$input.trigger("keyup");
        await utils.timeout(100);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);

        this.ls.$input.trigger("focusout");
        await utils.timeout(1);

        const results = document.querySelector(".livesearch-results");
        expect(results.classList.contains("d-none")).toBe(true);

        this.ls.$input.trigger("focusin");
        await utils.timeout(1);
        expect(results.classList.contains("d-none")).toBe(false);
    });

    it("6 - should show next and prev", async function () {
        this.ls.$input.trigger("keyup");
        await utils.timeout(100);
        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
        expect(
            document.querySelectorAll(".livesearch-results li a.next").length
        ).toEqual(1);

        this.ls.doSearch(2);
        await utils.timeout(10);

        expect(document.querySelectorAll(".livesearch-results li").length).toEqual(9);
        expect(
            document.querySelectorAll(".livesearch-results li a.prev").length
        ).toEqual(1);
    });
});
