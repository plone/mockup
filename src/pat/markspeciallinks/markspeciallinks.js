import $ from "jquery";
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "markspeciallinks",
    trigger: ".pat-markspeciallinks",
    parser: "mockup",
    defaults: {
        external_links_open_new_window: false,
        mark_special_links: true,
    },
    init: function () {
        var self = this,
            $el = self.$el;

        // first make external links open in a new window, afterwards do the
        // normal plone link wrapping in only the content area
        var elonw, msl, url, protocols, contentarea, res;

        if (typeof self.options.external_links_open_new_window === "string") {
            elonw =
                self.options.external_links_open_new_window.toLowerCase() ===
                "true";
        } else if (
            typeof self.options.external_links_open_new_window === "boolean"
        ) {
            elonw = self.options.external_links_open_new_window;
        }

        if (typeof self.options.mark_special_links === "string") {
            msl = self.options.mark_special_links.toLowerCase() === "true";
        } else if (typeof self.options.mark_special_links === "boolean") {
            msl = self.options.mark_special_links;
        }

        url = window.location.protocol + "//" + window.location.host;
        protocols = /^(mailto|ftp|news|irc|h323|sip|callto|https|feed|webcal)/;
        contentarea = $el;

        if (elonw) {
            // all http links (without the link-plain class), not within this site
            contentarea
                .find(
                    'a[href^="http"]:not(.link-plain):not([href^="' +
                        url +
                        '"])'
                )
                .attr("target", "_blank")
                .attr("rel", "noopener");
        }

        if (msl) {
            // All links with an http href (without the link-plain class), not within this site,
            // and no img children should be wrapped in a link-external span
            contentarea
                .find(
                    'a[href^="http:"]:not(.link-plain):not([href^="' +
                        url +
                        '"]):not(:has(img))'
                )
                .before('<i class="glyphicon link-external"></i>');
            // All links without an http href (without the link-plain class), not within this site,
            // and no img children should be wrapped in a link-[protocol] span
            contentarea
                .find(
                    'a[href]:not([href^="http:"]):not(.link-plain):not([href^="' +
                        url +
                        '"]):not(:has(img)):not([href^="#"])'
                )
                .each(function () {
                    // those without a http link may have another interesting protocol
                    // wrap these in a link-[protocol] span
                    res = protocols.exec($(this).attr("href"));
                    if (res) {
                        var iconclass = "glyphicon link-" + res[0];
                        $(this).before('<i class="' + iconclass + '"></i>');
                    }
                });
        }
    },
});
