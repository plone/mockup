import $ from "jquery";
import "./passwordstrength";
import registry from "@patternslib/patternslib/src/core/registry";

/* ==========================
TEST: Password strength
========================== */

describe("Password strength", function () {
    function fakeZxcvbn(input, strings) {
        window.providedStrings = strings;
        return {
            score: Math.min(input.length, 4),
        };
    }

    function getScripts() {
        return [].map
            .call(document.getElementsByTagName("script"), function (s) {
                return s.src;
            })
            .filter(function (src) {
                return src.indexOf("zxcvbn") !== -1;
            });
    }

    it("adds markup below input element", function () {
        var $el = document.createElement("div");
        $el.innerHTML =
            '<div><input type="password" class="pat-passwordstrength" /></div>';
        window.zxcvbn = fakeZxcvbn;
        registry.scan($el);
        expect($el.querySelectorAll(".progress").length).toEqual(1);
        expect($el.querySelectorAll(".progress-bar").length).toEqual(1);
    });

    it("tries to load zxcvbn once if not available", function () {
        var $el2 = document.createElement("div");
        var $el = document.createElement("div");
        $el.innerHTML =
            '<div><input type="password" class="pat-passwordstrength" data-pat-passwordstrength="zxcvbn: http://example.com/zxcvbn.js" /></div>';

        window.zxcvbn = undefined;
        expect(getScripts().length).toEqual(0);
        registry.scan($el);
        expect(getScripts().length).toEqual(1);
        expect(getScripts()).toContain("http://example.com/zxcvbn.js");

        $el2.innerHTML =
            '<div><input type="password" class="pat-passwordstrength" data-pat-passwordstrength="zxcvbn: http://example.com/zxcvbn.js" /></div>';
        registry.scan($el2);
        expect(getScripts().length).toEqual(1);
        expect(getScripts()).toContain("http://example.com/zxcvbn.js");
    });

    it("sets level based on the entered password", function () {
        var $el = document.createElement("div");
        $el.innerHTML =
            '<div><input type="password" class="pat-passwordstrength" /></div>';
        window.zxcvbn = fakeZxcvbn;
        registry.scan($el);

        function returnKeyUp() {
            const event = new KeyboardEvent("keyup", {});
            return event;
        }

        $el.querySelectorAll("input[type=password]")[0].setAttribute("value", "a");
        $el.querySelectorAll("input[type=password]")[0].dispatchEvent(returnKeyUp());

        expect($el.querySelectorAll(".progress-bar")[0].getAttribute("class")).toEqual(
            "progress-bar w-25 bg-danger"
        );
        expect(window.providedStrings.length).toEqual(0);

        $el.querySelectorAll("input[type=password]")[0].setAttribute("value", "aa");
        $el.querySelectorAll("input[type=password]")[0].dispatchEvent(returnKeyUp());
        expect($el.querySelectorAll(".progress-bar")[0].getAttribute("class")).toEqual(
            "progress-bar w-50 bg-warning"
        );
        expect(window.providedStrings.length).toEqual(0);

        $el.querySelectorAll("input[type=password]")[0].setAttribute("value", "aaa");
        $el.querySelectorAll("input[type=password]")[0].dispatchEvent(returnKeyUp());
        expect($el.querySelectorAll(".progress-bar")[0].getAttribute("class")).toEqual(
            "progress-bar w-75 bg-warning"
        );
        expect(window.providedStrings.length).toEqual(0);

        $el.querySelectorAll("input[type=password]")[0].setAttribute("value", "aaaa");
        $el.querySelectorAll("input[type=password]")[0].dispatchEvent(returnKeyUp());

        expect($el.querySelectorAll(".progress-bar")[0].getAttribute("class")).toEqual(
            "progress-bar w-100 bg-success"
        );
        expect(window.providedStrings.length).toEqual(0);
    });

    it("provides zxcvbn with other form field values", function () {
        var $el = $(
            "<form>" +
                '<input type="input" name="username" value="bob_geldof" />' +
                '<input type="password" class="pat-passwordstrength" />' +
                '<input type="checkbox" name="spam_me" checked="yes">' +
                "</form>"
        );
        window.zxcvbn = fakeZxcvbn;
        registry.scan($el);

        $el.find("input[type=password]").attr("value", "a").trigger("keyup");
        expect($el.find(".progress-bar").attr("class")).toEqual(
            "progress-bar w-25 bg-danger"
        );
        expect(window.providedStrings.length).toEqual(2);
        expect(window.providedStrings).toContain("bob_geldof");
        expect(window.providedStrings).toContain("on");
    });
});
