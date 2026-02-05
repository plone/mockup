// Extra test setup.

// provide jquery
import jquery from "jquery";
global.$ = global.jQuery = jquery;

jquery.expr.pseudos.visible = function () {
    // Fix jQuery ":visible" selector always returns false in JSDOM.
    // https://github.com/jsdom/jsdom/issues/1048#issuecomment-401599392
    return true;
};

// BBB: jQuery4 backports for select2
jquery.isFunction = function (obj) {
    return typeof obj === "function";
};
jquery.isArray = function (obj) {
    return Array.isArray
        ? Array.isArray(obj)
        : Object.prototype.toString.call(obj) === "[object Array]";
};
jquery.trim = function (str) {
    return str == null ? "" : String.prototype.trim.call(str);
};

// Do not output error messages
import logging from "@patternslib/patternslib/src/core/logging";
logging.setLevel(50);
// level: FATAL

// patch dom.is_visible to not rely on jest-unavailable offsetWidth/Height
import dom from "@patternslib/patternslib/src/core/dom";
dom.is_visible = (el) => {
    return !el.hidden && el.style.display !== "none";
};

// Attach datatables to jQuery, as in tests it is not done by just importing.
window.dt = require("datatables.net")();

// Import the css.escape polyfill for jsdom.
import "css.escape";

// Add structuredClone polyfill for jsdom.
// See: https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = val => {
    return JSON.parse(JSON.stringify(val))
}
