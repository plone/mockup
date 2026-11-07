import "@patternslib/patternslib/src/core/polyfills";
import utils from "@patternslib/patternslib/src/core/utils";
import Pattern from "./base-url";

describe("pat-base-url tests", () => {
    let pattern_instance;

    beforeEach(() => {
        // Clean up any existing attributes
        delete document.body.dataset.baseUrl;
        delete document.body.dataset.viewUrl;
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete document.body.dataset.baseUrl;
        delete document.body.dataset.viewUrl;
        if (pattern_instance) {
            pattern_instance = null;
        }
    });

    it("is initialized correctly", async () => {
        pattern_instance = new Pattern(document.body);
        await utils.timeout(1); // wait a tick for async to settle

        // Check that the pattern instance exists
        expect(pattern_instance).toBeDefined();
        expect(pattern_instance.el).toBe(document.body);
    });

    it("extracts base-url and view-url from HTML string", () => {
        pattern_instance = new Pattern(document.body);

        const html_string = `
            <!DOCTYPE html>
            <html>
                <head><title>Test</title></head>
                <body data-base-url="http://example.com/content" data-view-url="http://example.com/content/view">
                    <div>Content</div>
                </body>
            </html>
        `;

        const result = pattern_instance.extract_data_attributes(html_string);

        expect(result.base_url).toBe("http://example.com/content");
        expect(result.view_url).toBe("http://example.com/content/view");
    });

    it("handles HTML string without data attributes", () => {
        pattern_instance = new Pattern(document.body);

        const html_string = `
            <!DOCTYPE html>
            <html>
                <head><title>Test</title></head>
                <body>
                    <div>Content</div>
                </body>
            </html>
        `;

        const result = pattern_instance.extract_data_attributes(html_string);

        expect(result.base_url).toBeNull();
        expect(result.view_url).toBeNull();
    });

    it("handles empty or invalid HTML string", () => {
        pattern_instance = new Pattern(document.body);

        expect(pattern_instance.extract_data_attributes("")).toEqual({
            base_url: null,
            view_url: null,
        });

        expect(pattern_instance.extract_data_attributes(null)).toEqual({
            base_url: null,
            view_url: null,
        });

        expect(pattern_instance.extract_data_attributes(undefined)).toEqual({
            base_url: null,
            view_url: null,
        });
    });

    it("sets base-url and view-url from pat-inject-before-history-update event", async () => {
        pattern_instance = new Pattern(document.body);
        await utils.timeout(1); // wait for initialization

        const response_html = `
            <!DOCTYPE html>
            <html>
                <head><title>Test</title></head>
                <body data-base-url="http://example.com/new-base" data-view-url="http://example.com/new-view">
                    <div>New content</div>
                </body>
            </html>
        `;

        // Mock jqxhr object
        const mock_jqxhr = {
            responseText: response_html,
        };

        // Dispatch the event that the pattern listens to
        const custom_event = new CustomEvent("pat-inject-before-history-update", {
            detail: {
                jqxhr: mock_jqxhr,
            },
        });

        document.dispatchEvent(custom_event);

        expect(document.body.dataset.baseUrl).toBe("http://example.com/new-base");
        expect(document.body.dataset.viewUrl).toBe("http://example.com/new-view");
    });

    it("removes attributes when no data attributes are found in response", async () => {
        // Set initial values
        document.body.dataset.baseUrl = "http://example.com/old-base";
        document.body.dataset.viewUrl = "http://example.com/old-view";

        pattern_instance = new Pattern(document.body);
        await utils.timeout(1); // wait for initialization

        const response_html = `
            <!DOCTYPE html>
            <html>
                <head><title>Test</title></head>
                <body>
                    <div>Content without data attributes</div>
                </body>
            </html>
        `;

        const mock_jqxhr = {
            responseText: response_html,
        };

        const custom_event = new CustomEvent("pat-inject-before-history-update", {
            detail: {
                jqxhr: mock_jqxhr,
            },
        });

        document.dispatchEvent(custom_event);

        // Attributes should be removed when null values are set
        expect(document.body.hasAttribute("data-base-url")).toBe(false);
        expect(document.body.hasAttribute("data-view-url")).toBe(false);
    });

    it("handles event without jqxhr or responseText", async () => {
        // Set initial values
        document.body.dataset.baseUrl = "http://example.com/initial";
        document.body.dataset.viewUrl = "http://example.com/initial-view";

        pattern_instance = new Pattern(document.body);
        await utils.timeout(1); // wait for initialization

        // Event without detail
        const custom_event1 = new CustomEvent("pat-inject-before-history-update");
        document.dispatchEvent(custom_event1);

        // Attributes should be removed when null values are processed
        expect(document.body.hasAttribute("data-base-url")).toBe(false);
        expect(document.body.hasAttribute("data-view-url")).toBe(false);

        // Reset for next test
        document.body.dataset.baseUrl = "http://example.com/reset";
        document.body.dataset.viewUrl = "http://example.com/reset-view";

        // Event with detail but no jqxhr
        const custom_event2 = new CustomEvent("pat-inject-before-history-update", {
            detail: {},
        });
        document.dispatchEvent(custom_event2);

        // Attributes should be removed again
        expect(document.body.hasAttribute("data-base-url")).toBe(false);
        expect(document.body.hasAttribute("data-view-url")).toBe(false);
    });

    it("handles malformed HTML gracefully", async () => {
        pattern_instance = new Pattern(document.body);
        await utils.timeout(1); // wait for initialization

        const malformed_html = "<div>Incomplete HTML without body tag";

        const mock_jqxhr = {
            responseText: malformed_html,
        };

        const custom_event = new CustomEvent("pat-inject-before-history-update", {
            detail: {
                jqxhr: mock_jqxhr,
            },
        });

        // Should not throw an error
        expect(() => {
            document.dispatchEvent(custom_event);
        }).not.toThrow();

        // Should remove attributes since no valid body with data attributes was found
        expect(document.body.hasAttribute("data-base-url")).toBe(false);
        expect(document.body.hasAttribute("data-view-url")).toBe(false);
    });

    it("only extracts from body tag, not other elements", () => {
        pattern_instance = new Pattern(document.body);

        const html_string = `
            <!DOCTYPE html>
            <html>
                <head><title>Test</title></head>
                <body>
                    <div data-base-url="http://wrong.com/div" data-view-url="http://wrong.com/div-view">
                        Div with data attributes (should be ignored)
                    </div>
                </body>
            </html>
        `;

        const result = pattern_instance.extract_data_attributes(html_string);

        expect(result.base_url).toBeNull();
        expect(result.view_url).toBeNull();
    });
});
