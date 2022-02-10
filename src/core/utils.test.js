import $ from "jquery";
import { Logger } from "sass";
import utils from "./utils";

describe("utils", function () {
    describe("setId", function () {
        it('by default uses "id" as prefix', function () {
            var $el = $("<div>"),
                id = utils.setId($el);
            expect(id).toBeDefined();
            expect(typeof id).toBe("string");
            expect(id.indexOf("id")).toEqual(0);
        });

        it("can use a custom prefix", function () {
            var $el = $("<div>"),
                id = utils.setId($el, "myprefix");
            expect(id.indexOf("myprefix")).toEqual(0);
        });

        it("updates the id of an element with no id", function () {
            var $el = $("<div>"),
                id;
            utils.setId($el);
            id = $el.attr("id");
            expect(id).toBeDefined();
            expect(typeof id).toBe("string");
            expect(id).toContain("id");
        });

        it("replaces dots in ids with dashes", function () {
            var $el = $('<div id="something.with.dots"></div>'),
                id = utils.setId($el);
            id = $el.attr("id");
            expect(id).toEqual("something-with-dots");
        });
    });

    describe("parseBodyTag", function () {
        it("parses the body tag's content from a response", function () {
            var response = "<body><p>foo</p></body>",
                html = utils.parseBodyTag(response);
            expect(html).toEqual("<p>foo</p>");
        });

        it("returns an empty string for responses with an empty body", function () {
            var response = "<body></body>",
                html = utils.parseBodyTag(response);
            expect(html).toEqual("");
        });

        it("fails for empty responses", function () {
            var response = "",
                fn = function () {
                    utils.parseBodyTag(response);
                };
            expect(fn).toThrowError(TypeError);
        });

        it("fails for responses without a body tag", function () {
            var response = "<div>qux</div>",
                fn = function () {
                    utils.parseBodyTag(response);
                };
            expect(fn).toThrowError(TypeError);
        });

        it("parses the body tag's content from a response with multiple lines", function () {
            var response = "<body><h1>foo</h1>\n\t<p>bar\n</p></body>",
                html = utils.parseBodyTag(response);
            expect(html).toEqual("<h1>foo</h1>\n\t<p>bar\n</p>");
        });

        it("parses the body tag's content from a response with not ASCII chars (e.g. line separator)", function () {
            var response =
                    "<body><p>foo " + String.fromCharCode(8232) + " bar</p></body>",
                html = utils.parseBodyTag(response);
            expect(html).toEqual(
                "<p>foo " + String.fromCharCode(8232) + " bar</p>"
            );
        });
    });

    describe("bool", function () {
        it("returns true for truthy values", function () {
            expect(utils.bool(true)).toEqual(true);
            expect(utils.bool(1)).toEqual(true);
            expect(utils.bool("1")).toEqual(true);
            expect(utils.bool("true")).toEqual(true);
            expect(utils.bool(" true ")).toEqual(true);
            expect(utils.bool("TRUE")).toEqual(true);
            expect(utils.bool("True")).toEqual(true);
            expect(utils.bool(13)).toEqual(true);
            expect(utils.bool("foo")).toEqual(true);
        });

        it("returns false for falsy values", function () {
            expect(utils.bool("false")).toEqual(false);
            expect(utils.bool(" false ")).toEqual(false);
            expect(utils.bool("FALSE")).toEqual(false);
            expect(utils.bool("False")).toEqual(false);
            expect(utils.bool(false)).toEqual(false);
            expect(utils.bool("0")).toEqual(false);
            expect(utils.bool(0)).toEqual(false);
            expect(utils.bool("")).toEqual(false);
            expect(utils.bool(undefined)).toEqual(false);
            expect(utils.bool(null)).toEqual(false);
        });
    });

    describe("QueryHelper", function () {
        it("getQueryData correctly", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var qd = qh.getQueryData("foobar");
            expect(qd.query).toEqual(
                '{"criteria":[{"i":"SearchableText","o":"plone.app.querystring.operation.string.contains","v":"foobar*"}],"sort_on":"is_folderish","sort_order":"reverse"}'
            );
        });
        it("getQueryData use attributes correctly", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
                attributes: ["one", "two"],
            });
            var qd = qh.getQueryData("foobar");
            expect(qd.attributes).toEqual('["one","two"]');
        });
        it("getQueryData set batch", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var qd = qh.getQueryData("foobar", 1);
            expect(qd.batch).toEqual(
                '{"page":1,"size":' + qh.options.batchSize + "}"
            );
        });

        it("selectAjax gets data correctly", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var sa = qh.selectAjax();
            expect(sa.data("foobar").query).toEqual(
                '{"criteria":[{"i":"SearchableText","o":"plone.app.querystring.operation.string.contains","v":"foobar*"}],"sort_on":"is_folderish","sort_order":"reverse"}'
            );
        });
        it("selectAjax formats results correctly", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var sa = qh.selectAjax();
            var data = sa.results({ total: 100, results: [1, 2, 3] }, 1);
            expect(data.results.length).toEqual(3);
            expect(data.more).toEqual(true);
        });

        it("getUrl correct", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            expect(qh.getUrl()).toEqual(
                "http://foobar.com/?query=%7B%22criteria%22%3A%5B%5D%2C%22sort_on%22%3A%22is_folderish%22%2C%22sort_order%22%3A%22reverse%22%7D&attributes=%5B%22UID%22%2C%22Title%22%2C%22Description%22%2C%22getURL%22%2C%22portal_type%22%5D"
            );
        });
        it("getUrl correct and url query params already present", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/?foo=bar",
            });
            expect(qh.getUrl()).toEqual(
                "http://foobar.com/?foo=bar&query=%7B%22criteria%22%3A%5B%5D%2C%22sort_on%22%3A%22is_folderish%22%2C%22sort_order%22%3A%22reverse%22%7D&attributes=%5B%22UID%22%2C%22Title%22%2C%22Description%22%2C%22getURL%22%2C%22portal_type%22%5D"
            );
        });

        it("browsing adds path criteria", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/?foo=bar",
            });
            qh.pattern.browsing = true;
            expect(qh.getQueryData("foobar").query).toContain(
                "plone.app.querystring.operation.string.path"
            );
        });
    });

    describe("Loading", function () {
        it("creates element", function () {
            var loading = new utils.Loading();
            loading.show();
            expect($("." + loading.className).length).toEqual(1);
        });
        it("hidden on creation", function () {
            var loading = new utils.Loading();
            loading.show();
            loading.hide();
            expect(loading.$el[0].style.display).toBe("none");
        });
        it("shows loader", function () {
            var loading = new utils.Loading();
            loading.show();
            expect(loading.$el.is(":visible")).toEqual(true);
        });
        it("hide loader", function () {
            var loading = new utils.Loading();
            loading.show();
            loading.hide();
            expect(loading.$el[0].style.display).toBe("none");
        });
        it("test custom zIndex", function () {
            var loading = new utils.Loading({
                zIndex: function () {
                    return 99999;
                },
            });
            loading.show();
            expect(loading.$el[0].style.zIndex + "").toEqual("99999");
        });
        it("works with backdrop", function () {
            var initCalled = false;
            var showCalled = false;
            var fakeBackdrop = {
                init: function () {
                    initCalled = true;
                },
                show: function () {
                    showCalled = true;
                },
            };
            var loading = new utils.Loading({
                backdrop: fakeBackdrop,
            });
            loading.show();
            expect(initCalled).toEqual(true);
            expect(showCalled).toEqual(true);
            expect(fakeBackdrop.closeOnClick).toEqual(true);
            expect(fakeBackdrop.closeOnEsc).toEqual(true);
        });
    });

    describe("HTML manupulation", function () {
        it("escaping", function () {
            var escaped = utils.escapeHTML('<img src="logo.png" />');
            expect(escaped).toEqual('&lt;img src="logo.png" /&gt;');
        });

        it("removing", function () {
            var clean = utils.removeHTML("<p>Paragraph</p>");
            expect(clean).toEqual("Paragraph");
        });
    });
});
