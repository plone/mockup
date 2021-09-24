import "./passwordstrength";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

// window.mocha.setup("bdd");
// $.fx.off = true;

/* ==========================
TEST: Password strength
========================== */

describe("Password strength", function () {
var orig_setTimeout = window.setTimeout;

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

beforeEach(function () {
    window.setTimeout = function (fun, interval) {
	window.providedInterval = interval;
	fun();
	return 0;
    };
});

afterEach(function () {
    window.setTimeout = orig_setTimeout;
});

it("adds markup below input element", function () {
    var $el = $(
	'<div><input type="password" class="pat-passwordstrength" /></div>'
    );
    window.zxcvbn = fakeZxcvbn;
    registry.scan($el);

    expect($el.find(".progress").length).toEqual(1);
    expect($el.find(".progress-bar").length).toEqual(1);
});

it("tries to load zxcvbn once if not available", function () {
    var $el2,
	$el = $(
	    '<div><input type="password" class="pat-passwordstrength" data-pat-passwordstrength="zxcvbn: http://example.com/zxcvbn.js" /></div>'
	);
    window.zxcvbn = undefined;
    expect(getScripts().length).toEqual(0);
    registry.scan($el);
    expect(getScripts().length).toEqual(1);
    expect(getScripts()).toContain("http://example.com/zxcvbn.js");

    $el.find("input[type=password]").attr("value", "a").trigger("keyup");
    expect(getScripts().length).toEqual(1);
    $el.find("input[type=password]").attr("value", "aa").trigger("keyup");
    expect(getScripts().length).toEqual(1);
    $el.find("input[type=password]").attr("value", "aaa").trigger("keyup");
    expect(getScripts().length).toEqual(1);
    expect(getScripts()).toContain("http://example.com/zxcvbn.js");

    $el2 = $(
	'<div><input type="password" class="pat-passwordstrength" data-pat-passwordstrength="zxcvbn: http://example.com/zxcvbn.js" /></div>'
    );
    registry.scan($el2);
    expect(getScripts().length).toEqual(1);
    expect(getScripts()).toContain("http://example.com/zxcvbn.js");
});

it("sets level based on the entered password", function () {
    var $el = $(
	'<div><input type="password" class="pat-passwordstrength" /></div>'
    );
    window.zxcvbn = fakeZxcvbn;
    registry.scan($el);

    $el.find("input[type=password]").attr("value", "a").trigger("keyup");
    expect($el.find(".progress-bar").attr("class")).toEqual(
	"progress-bar w-25 bg-danger"
    );
    expect(window.providedStrings.length).toEqual(0);
    expect(window.providedInterval).toEqual(500);

    $el.find("input[type=password]").attr("value", "aA1!bB$").trigger("keyup");
    expect($el.find(".progress-bar").attr("class")).toEqual(
	"progress-bar w-50 bg-warning"
    );
    expect(window.providedStrings.length).toEqual(0);
    expect(window.providedInterval).toEqual(500);
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
	"progress-bar w-0 bg-transparent"
    );
    expect(window.providedStrings.length).toEqual(2);
    expect(window.providedStrings).toContain("bob_geldof");
    expect(window.providedStrings).toContain("on");
});
});
