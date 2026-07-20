import $ from "jquery";
import Modal from "./modal--implementation";

// The tinymce link modal (pat-tinymce js/links.js) constructs the modal
// imperatively (`new Modal(...)`) and calls show() synchronously right after.
// The implementation must therefore be a constructable pattern that exposes
// its methods synchronously — not a config object grafted asynchronously by
// the thin modal.js registration module.
describe("modal implementation", function () {
    let $el;
    beforeEach(function () {
        $el = $("<div/>").appendTo("body");
    });
    afterEach(function () {
        $el.remove();
    });

    it("is constructable and exposes its methods synchronously", function () {
        const modal = new Modal($el, { html: "<div>content</div>" });
        expect(typeof modal.show).toBe("function");
        expect(typeof modal.hide).toBe("function");
    });
});
