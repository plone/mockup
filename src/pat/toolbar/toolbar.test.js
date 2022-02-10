import "./toolbar";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Toolbar", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <div id="edit-zone">
                <div class="offcanvas-toggler">
                    <a class="toggler-hover" data-bs-toggle="offcanvas" href="#edit-zone"></a>
                </div>
                <div class="pat-toolbar offcanvas" />
            </div>
        `;
    });

    afterEach(function () {
        document.body.outerHTML = "";
    });

    it("Initializes correctly", async function () {
        expect(document.body.querySelectorAll(".pat-toolbar.initialized").length).toBe(0);
        registry.scan(document.body);
        await utils.timeout(1);
        expect(document.body.querySelectorAll(".pat-toolbar.initialized").length).toBe(1);
    });
});
