import "./markspeciallinks";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

    /* ==========================
   TEST: MarkSpecialLinks
  ========================== */

    describe("MarkSpecialLinks", function () {

        beforeEach(function () {
            this.$el = $(
                "" +
                    '<div class="pat-markspeciallinks">' +
                    '  <p>Find out What&#39s new in <a href="http://www.plone.org">Plone</a>.<br>' +
                    '     Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.' +
                    "  </p>" +
                    "</div>" +
                    '<div class="pat-markspeciallinks" data-pat-markspeciallinks="external_links_open_new_window: true">' +
                    '  <p>Find out What&#39s new in <a href="http://www.plone.org">Plone</a>.<br>' +
                    '     Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.' +
                    "  </p>" +
                    "</div>" +
                    '<div class="pat-markspeciallinks" data-pat-markspeciallinks="mark_special_links: false">' +
                    '  <p>Find out What&#39s new in <a href="http://www.plone.org">Plone</a>.<br>' +
                    '     Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.' +
                    "  </p>" +
                    "</div>" +
                    '<div class="icons pat-markspeciallinks">' +
                    "    <ul>" +
                    '      <li><a href="http://www.plone.org">http</a></li>' +
                    '      <li><a href="https://www.plone.org">https</a></li>' +
                    '      <li><a href="mailto:info@plone.org">mailto</a></li>' +
                    '      <li><a href="ftp://www.plone.org">ftp</a></li>' +
                    '      <li><a href="news://www.plone.org">news</a></li>' +
                    '      <li><a href="irc://www.plone.org">irc</a></li>' +
                    '      <li><a href="h323://www.plone.org">h323</a></li>' +
                    '      <li><a href="sip://www.plone.org">sip</a></li>' +
                    '      <li><a href="callto://www.plone.org">callto</a></li>' +
                    '      <li><a href="feed://www.plone.org">feed</a></li>' +
                    '      <li><a href="webcal://www.plone.org">webcal</a></li>' +
                    "    </ul>" +
                    "</div>" +
                    '<div class="anchors pat-markspeciallinks">' +
                    '  <p>Find out What&#39s new in <a href="#anchor">Plone</a>.<br>' +
                    '     Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.' +
                    "  </p>" +
                    "</div>"
            );
            // const url = "https://www.plone.org/";
            // location = window.location;
            // const mockLocation = new URL(url);
            // mockLocation.replace = jest.fn();
            // delete window.location;
            // window.location = mockLocation;
        });
        it("normal external links have target=_blank", async function () {
            const util = require('util');
            await utils.timeout(1);
            registry.scan(this.$el);
            await utils.timeout(1);
            var link = this.$el.find("a");
            // expect(window.location.url).toEqual(url);
            expect(link.eq(0).attr("target") === undefined).toEqual(true);
            expect(link.eq(1).attr("target") === undefined).toEqual(true);
            expect(link.eq(2).attr("target")).toEqual("_blank");
            expect(link.eq(3).attr("target") === undefined).toEqual(true);
            expect(link.eq(0).prev()[0].tagName).toEqual("I");
            expect(link.eq(1).prev()[0].tagName).not.toEqual("I");
            expect(link.eq(4).prev().length).toEqual(0);
            expect(link.eq(5).prev()[0].tagName).not.toEqual("I");
        });
        it("check for correct icon classes per protocol", function () {
            registry.scan(this.$el);
            var listel = this.$el.next(".icons").find("li");
            expect(listel.eq(0).find("i").hasClass("link-external")).toEqual(true);
            expect(listel.eq(1).find("i").hasClass("link-https")).toEqual(true);
            expect(listel.eq(2).find("i").hasClass("link-mailto")).toEqual(true);
            expect(listel.eq(3).find("i").hasClass("link-ftp")).toEqual(true);
            expect(listel.eq(4).find("i").hasClass("link-news")).toEqual(true);
            expect(listel.eq(5).find("i").hasClass("link-irc")).toEqual(true);
            expect(listel.eq(6).find("i").hasClass("link-h323")).toEqual(true);
            expect(listel.eq(7).find("i").hasClass("link-sip")).toEqual(true);
            expect(listel.eq(8).find("i").hasClass("link-callto")).toEqual(true);
            expect(listel.eq(9).find("i").hasClass("link-feed")).toEqual(true);
            expect(listel.eq(10).find("i").hasClass("link-webcal")).toEqual(true);
        });
        it("do not show the lock icon for anchor links", function () {
            registry.scan(this.$el);
            var link = this.$el.next(".anchors").find("p").find("a");
            expect(link.eq(0).prev().length).toEqual(0);
        });
    });
