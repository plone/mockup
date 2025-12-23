// Set the base URL based on the current location, listening on navigation changes.
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import registry from "@patternslib/patternslib/src/core/registry";
import events from "@patternslib/patternslib/src/core/events";

class Pattern extends BasePattern {
    static name = "pat-base-url";
    static trigger = "body";

    init() {
        events.add_event_listener(
            window.navigation,
            "navigate",
            "thet-base-url--set",
            this.set_base_url.bind(this)
        );
    }

    set_base_url() {
        let url = window.location.href;

        // Split the following words from the URL as we want to get the
        // contents absolute URL.
        const split_words = [
            // NOTE: order matters.
            "/@@", // also catches @@folder_contents and @@edit
            "/++", // traversal urls.
            "/folder_contents",
            "/edit",
            "/view",
            "#",
            "?",
        ];

        // Split all split words out of url
        url = split_words.reduce((url_, split_) => url_.split(split_)[0], url);
        // Remove the trailing slash
        if (url[url.length -1] === "/") {
            url = url.substring(0, url.length - 1)
        }

        // Set the contents absolute URL on `data-base-url`.
        document.body.dataset.baseUrl = url;
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
