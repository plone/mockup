// Set the base URL based on the current location, listening on navigation changes.
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import registry from "@patternslib/patternslib/src/core/registry";
import events from "@patternslib/patternslib/src/core/events";

class Pattern extends BasePattern {
    static name = "pat-base-url";
    static trigger = "body";

    // Sort this pattern very early.
    // It needs to get active before any other patterns, as some depend on a
    // `data-base-url` value on the body tag.
    static order = 10;

    init() {
        events.add_event_listener(
            document,
            "pat-inject-before-history-update",
            "base-url--set",
            (ev) => this.set_base_url(ev),
        );
    }

    extract_data_attributes(html_string) {
        if (!html_string) {
            return { base_url: null, view_url: null };
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(html_string, "text/html");
        const body = doc.body;

        return {
            base_url: body?.getAttribute("data-base-url") || null,
            view_url: body?.getAttribute("data-view-url") || null,
        };
    }

    set_base_url(ev) {
        const html_string = ev?.detail?.jqxhr?.responseText;
        const data_attributes = this.extract_data_attributes(html_string);

        // Set data-base-url - or remove it, if not set.
        if (data_attributes.base_url !== null) {
            document.body.dataset.baseUrl = data_attributes.base_url;
        } else {
            delete document.body.dataset.baseUrl;
        }

        // Set data-view-url - or remove it, if not set.
        if (data_attributes.view_url !== null) {
            document.body.dataset.viewUrl = data_attributes.view_url;
        } else {
            delete document.body.dataset.viewUrl;
        }
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
