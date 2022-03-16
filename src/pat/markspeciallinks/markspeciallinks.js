import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import utils from "../../core/utils";

export default Base.extend({
    name: "markspeciallinks",
    trigger: ".pat-markspeciallinks",
    parser: "mockup",

    defaults: {
        external_links_open_new_window: false,
        mark_special_links: true,
    },

    protocol_icon_map: {
        // For a list of supported default protocol hander, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler#permitted_schemes
        https: "link-45deg",
        http: "link-45deg",
        ftp: "cloud-download", // deprecated
        callto: "telephone", // non-standard for skype
        bitcoin: "credit-card", // no bitcoin icon yet
        geo: "geo-alt",
        im: "chat",
        irc: "chat",
        ircs: "chat",
        magnet: "link-45deg",
        mailto: "envelope",
        mms: "chat",
        news: "newspaper",
        nntp: "newspaper",
        openpgp4fpr: "key",
        sip: "telephone",
        sms: "chat",
        smsto: "chat",
        ssh: "lock",
        tel: "telephone",
        urn: "link-45deg",
        webcal: "calendar",
        wtai: "telephone",
        xmpp: "chat",
    },

    async init() {
        // first make external links open in a new window, afterwards do the
        // normal plone link wrapping in only the content area

        let open_new_window = false;
        if (typeof this.options.external_links_open_new_window === "string") {
            open_new_window =
                this.options.external_links_open_new_window.toLowerCase() === "true";
        } else if (typeof this.options.external_links_open_new_window === "boolean") {
            open_new_window = this.options.external_links_open_new_window;
        }

        let mark_special_links = false;
        if (typeof this.options.mark_special_links === "string") {
            mark_special_links =
                this.options.mark_special_links.toLowerCase() === "true";
        } else if (typeof this.options.mark_special_links === "boolean") {
            mark_special_links = this.options.mark_special_links;
        }

        if (mark_special_links) {
            import("./markspeciallinks.scss");
        }

        // All links with an http href (without the link-plain class), not within this site,
        // and no img children should be wrapped in a link-external span
        const url = window.location.protocol + "//" + window.location.host;
        const links = this.el.querySelectorAll(
            `a[href]:not(.link-plain):not([href^="${url}"]):not([href^="#"])`
        );
        //:not(:has(img))
        for (const link of links) {
            let link_url;
            try {
                link_url = new URL(link.getAttribute("href"));
            } catch (e) {
                if (e instanceof TypeError) {
                    // Not a valid URL.
                    // Ignore and continue.
                    continue;
                }
            }
            if (open_new_window && link_url.protocol.startsWith("http")) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener");
            }

            if (mark_special_links) {
                const icon = this.protocol_icon_map[link_url.protocol.split(":")[0]];
                if (icon) {
                    const icon_el = await utils.resolveIcon(
                        icon,
                        true,
                        "markspeciallinks__icon"
                    );
                    link.parentNode.insertBefore(icon_el, link);
                }
            }
        }
    },
});
