import $ from "jquery";
import i18n from "../../core/i18n";
import Base from "@patternslib/patternslib/src/core/base";

let Moment;

var currentLanguage = new i18n().currentLanguage;
var localeLoaded = false;
var patMomentInstances = [];

// From https://github.com/moment/moment/blob/3147fbc/src/test/moment/format.js#L463-L468
var MOMENT_LOCALES =
    "ar-sa ar-tn ar az be bg bn bo br bs ca cs cv cy da de-at de dv el " +
    "en-au en-ca en-gb en-ie en-nz eo es et eu fa fi fo fr-ca fr-ch fr fy " +
    "gd gl he hi hr hu hy-am id is it ja jv ka kk km ko lb lo lt lv me mk ml " +
    "mr ms-my ms my nb ne nl nn pl pt-br pt ro ru se si sk sl sq sr-cyrl " +
    "sr sv sw ta te th tl-ph tlh tr tzl tzm-latn tzm uk uz vi zh-cn zh-tw";

function isLangSupported(lang) {
    return MOMENT_LOCALES.split(" ").indexOf(lang) !== -1;
}

function lazyLoadMomentLocale() {
    var LANG_FALLBACK = "en";

    if (currentLanguage === LANG_FALLBACK) {
        // English locale is built-in, no need to load, so let's exit early
        // to avoid computing fallback, which happens at every loaded page
        localeLoaded = true;
        return;
    }

    // Format language as expect by Moment.js, neither POSIX (like TinyMCE) nor IETF
    var lang = currentLanguage.replace("_", "-").toLowerCase();

    // Use language code as fallback, otherwise built-in English locale
    lang = isLangSupported(lang) ? lang : lang.split("-")[0];
    lang = isLangSupported(lang) ? lang : LANG_FALLBACK;
    if (lang === LANG_FALLBACK) {
        localeLoaded = true;
        return;
    }

    //require(["moment-url/" + lang], function () {
    //    localeLoaded = true;
    //    for (var i = 0; i < patMomentInstances.length; i++) {
    //        var patMoment = patMomentInstances[i];
    //        patMoment.init();
    //    }
    //    patMomentInstances = [];
    //});
}

lazyLoadMomentLocale();

export default Base.extend({
    name: "moment",
    trigger: ".pat-moment",
    parser: "mockup",
    moment_i18n_map: { no: "nb" }, // convert Plone language codes to moment codes.
    defaults: {
        // selector of elements to format dates for
        selector: null,
        // also available options are relative, calendar
        format: "LLL",
        setTitle: false,
    },
    convert: function ($el) {
        var self = this;
        var date = $el.attr("data-date");
        if (!date) {
            date = $.trim($el.html());
            if (date && date !== "None") {
                $el.attr("data-date", date);
            }
        }
        if (!date || date === "None") {
            return;
        }
        if (currentLanguage in self.moment_i18n_map) {
            currentLanguage = self.moment_i18n_map[currentLanguage];
        }
        Moment.locale([currentLanguage, "en"]);
        date = Moment(date);
        if (!date.isValid()) {
            return;
        }
        if (self.options.setTitle) {
            $el.attr("title", date.format("LLLL"));
        }
        if (self.options.format === "relative") {
            date = date.fromNow();
        } else if (self.options.format === "calendar") {
            date = date.calendar();
        } else {
            date = date.format(self.options.format);
        }
        if (date) {
            $el.html(date);
        }
    },
    init: async function () {
        Moment = await import("moment");
        Moment = Moment.default;

        var self = this;
        if (!localeLoaded) {
            // The locale has not finished to load yet, we will execute the init
            // again once the locale is loaded.
            patMomentInstances.push(self);
            return;
        }
        if (self.options.selector) {
            self.$el.find(self.options.selector).each(function () {
                self.convert($(this));
            });
        } else {
            self.convert(self.$el);
        }
    },
});
