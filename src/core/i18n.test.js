import I18n from "./i18n";
import sinon from "sinon";

describe("I18N", function () {
    describe("configure", function () {
        var i18n = new I18n();
        it("ttl", function () {
            i18n.configure({ ttl: 10 });
            expect(i18n.ttl).toEqual(10);
        });
        it("baseUrl", function () {
            i18n.configure({ baseUrl: "/something" });
            expect(i18n.baseUrl).toEqual("/something");
            i18n.configure({ baseUrl: "/plonejsi18n" });
        });
    });

    describe("getUrl", function () {
        it("correct params", function () {
            var i18n = new I18n();
            i18n.configure({ baseUrl: "/foobar" });
            expect(i18n.getUrl("foobar", "es")).toEqual(
                "/foobar?domain=foobar&language=es"
            );
            i18n.configure({ baseUrl: "/plonejsi18n" });
        });
    });

    describe("MessageFactory", function () {
        it("loads default message if no catalog", function () {
            var i18n = new I18n();
            var _ = i18n.MessageFactory("foobar");
            expect(_("foobar")).toEqual("foobar");
        });

        it("loads from stored catalog", function () {
            var i18n = new I18n();
            i18n.configure({
                currentLanguage: "en",
                catalogs: {
                    foobar: {
                        en: {
                            foo: "bar",
                        },
                    },
                },
            });
            var _ = i18n.MessageFactory("foobar");
            expect(_("foo")).toEqual("bar");
            i18n.configure({
                catalogs: {},
                currentLanguage: null,
            });
        });

        it("loads from server", function () {
            var i18n = new I18n();
            var server = sinon.fakeServer.create();
            server.autoRespond = true;
            var clock = sinon.useFakeTimers();

            server.respondWith("GET", /plonejsi18n/, function (xhr) {
                xhr.respond(
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify({
                        foo: "bar",
                    })
                );
            });
            i18n.configure({
                currentLanguage: "en",
                baseUrl: "/plonejsi18n",
            });
            i18n.loadCatalog("foobar");
            clock.tick(500);
            var _ = i18n.MessageFactory("foobar");
            expect(_("foo")).toEqual("bar");
            clock.restore();
        });

        it("handles country specific translations", function () {
            var i18n = new I18n();
            var server = sinon.fakeServer.create();
            server.autoRespond = true;
            var clock = sinon.useFakeTimers();

            server.respondWith("GET", /plonejsi18n/, function (xhr) {
                xhr.respond(
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify({
                        foo: "bar-us",
                    })
                );
            });
            i18n.configure({
                currentLanguage: "en-us",
                baseUrl: "/plonejsi18n",
            });
            i18n.loadCatalog("foobar-us");
            clock.tick(500);
            var _ = i18n.MessageFactory("foobar-us");
            expect(_("foo")).toEqual("bar-us");
            clock.restore();
        });
    });
});
