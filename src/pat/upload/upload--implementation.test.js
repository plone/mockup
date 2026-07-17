import $ from "jquery";
import Upload from "./upload--implementation";

// pat-structure, pat-relateditems and the contentbrowser app construct upload
// imperatively (`new Upload(el, options)`) and use the instance right away.
// The implementation must therefore be a constructable pattern that exposes its
// methods synchronously — not a config object grafted asynchronously by the thin
// upload.js registration module.
describe("upload implementation", function () {
    let $el;
    beforeEach(function () {
        $el = $('<div class="pat-upload"/>').appendTo("body");
    });
    afterEach(function () {
        $el.remove();
    });

    it("is constructable and exposes its methods synchronously", function () {
        const upload = new Upload($el, { url: "/upload", currentPath: "/a" });
        expect(typeof upload.setPath).toBe("function");
        expect(typeof upload.getUrl).toBe("function");
    });
});
