import $ from "jquery";
import bootstrap_icons from "bootstrap-icons/package.json";
import utils, { ICON_CACHE } from "./utils";

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
            var $el = $('<div id="something.with.dots"></div>');
            utils.setId($el);
            var id = $el.attr("id");
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
            expect(fn).toThrow(TypeError);
        });

        it("fails for responses without a body tag", function () {
            var response = "<div>qux</div>",
                fn = function () {
                    utils.parseBodyTag(response);
                };
            expect(fn).toThrow(TypeError);
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
            expect(html).toEqual("<p>foo " + String.fromCharCode(8232) + " bar</p>");
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
        it("getCriterias keeps non-ASCII term raw (encode-exactly-once)", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var criterias = qh.getCriterias("täst");
            expect(criterias[0].v).toEqual("täst*");
            expect(criterias[0].v).not.toContain("%");
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
            expect(qd.batch).toEqual('{"page":1,"size":' + qh.options.batchSize + "}");
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

        it("getCriterias keeps non-ASCII terms raw (encode-exactly-once)", function () {
            var qh = new utils.QueryHelper({
                vocabularyUrl: "http://foobar.com/",
            });
            var criterias = qh.getCriterias("täst");
            var crit = criterias[criterias.length - 1];
            expect(crit.v).toEqual("täst*");
            expect(crit.v).not.toContain("%");
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

    describe("resolveIcon", function () {
        const house_svg = '<svg class="bi bi-house"></svg>';
        const resolver_url = "http://nohost/plone/@@iconresolver/house";
        const plone_url = "http://nohost/plone/++plone++bootstrap-icons/house.svg";
        const cdn_url = `https://cdn.jsdelivr.net/npm/bootstrap-icons@${bootstrap_icons.version}/icons/house.svg`;

        const found = { ok: true, status: 200, text: async () => house_svg };
        const error_page = (status) => ({
            ok: false,
            status: status,
            text: async () => "<html><body>Error</body></html>",
        });

        // Answer each URL with its entry in ``responses``, anything else
        // with a 404 error page. A list answers one request per entry and
        // repeats the last one.
        const serve = (responses) => {
            global.fetch = jest.fn(async (url) => {
                let response = responses[url] ?? error_page(404);
                if (Array.isArray(response)) {
                    response = response.length > 1 ? response.shift() : response[0];
                }
                if (response instanceof Error) {
                    throw response;
                }
                return response;
            });
        };
        const fetched_urls = () => global.fetch.mock.calls.map((call) => call[0]);

        beforeEach(function () {
            ICON_CACHE.clear();
        });

        afterEach(function () {
            delete global.fetch;
            document.body.removeAttribute("data-portal-url");
        });

        it("falls back to the Plone bootstrap-icons resource", async function () {
            document.body.setAttribute("data-portal-url", "http://nohost/plone");
            serve({ [plone_url]: found });

            const icon = await utils.resolveIcon("house");

            expect(icon).toBe(house_svg);
            expect(fetched_urls()).toEqual([resolver_url, plone_url]);
        });

        it("falls back to the pinned bootstrap-icons CDN without Plone", async function () {
            serve({ [cdn_url]: found });

            const icon = await utils.resolveIcon("house");

            expect(icon).toBe(house_svg);
            expect(fetched_urls()).toEqual([cdn_url]);
        });

        it("does not request an icon which is not in the iconmap", async function () {
            serve({});

            expect(await utils.resolveIcon("no-such-icon")).toBe("");
            expect(fetched_urls()).toEqual([]);
        });

        it("prefers the icon of the iconresolver", async function () {
            const custom_svg = '<svg class="custom"></svg>';
            document.body.setAttribute("data-portal-url", "http://nohost/plone");
            serve({
                [resolver_url]: { ok: true, status: 200, text: async () => custom_svg },
                [plone_url]: found,
            });

            expect(await utils.resolveIcon("house")).toBe(custom_svg);
            expect(fetched_urls()).toEqual([resolver_url]);
        });

        it("does not use a page which is not an icon", async function () {
            // E.g. a login form, which is answered with status 200.
            const login_page = {
                ok: true,
                status: 200,
                text: async () => "<html><body>Please log in</body></html>",
            };
            document.body.setAttribute("data-portal-url", "http://nohost/plone");
            serve({ [resolver_url]: login_page, [plone_url]: login_page });

            expect(await utils.resolveIcon("house")).toBe("");
        });

        it("shares one request between concurrent calls", async function () {
            serve({ [cdn_url]: found });

            const icons = await Promise.all([
                utils.resolveIcon("house"),
                utils.resolveIcon("house"),
            ]);

            expect(icons).toEqual([house_svg, house_svg]);
            expect(fetched_urls()).toEqual([cdn_url]);
        });

        it("loads an icon only once", async function () {
            serve({ [cdn_url]: found });

            await utils.resolveIcon("house");
            await utils.resolveIcon("house");

            expect(fetched_urls()).toEqual([cdn_url]);
        });

        it("retries an icon after a network error", async function () {
            serve({ [cdn_url]: [new TypeError("Failed to fetch"), found] });
            jest.spyOn(console, "warn").mockImplementation(() => {});

            expect(await utils.resolveIcon("house")).toBe("");
            expect(await utils.resolveIcon("house")).toBe(house_svg);
            expect(fetched_urls()).toEqual([cdn_url, cdn_url]);

            console.warn.mockRestore();
        });

        it("retries an icon after a server error", async function () {
            document.body.setAttribute("data-portal-url", "http://nohost/plone");
            serve({
                [resolver_url]: [error_page(503), found],
                [plone_url]: error_page(503),
            });

            expect(await utils.resolveIcon("house")).toBe("");
            expect(await utils.resolveIcon("house")).toBe(house_svg);
            expect(fetched_urls()).toEqual([resolver_url, plone_url, resolver_url]);
        });

        it("does not retry an icon which does not exist", async function () {
            serve({});

            expect(await utils.resolveIcon("house")).toBe("");
            expect(await utils.resolveIcon("house")).toBe("");
            expect(fetched_urls()).toEqual([cdn_url]);
        });
    });
});
