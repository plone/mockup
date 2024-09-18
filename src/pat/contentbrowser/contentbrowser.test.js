import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";


describe("Content Browser", () => {
    beforeEach(() => {
        let options = {
            vocabularyUrl: "/contentbrowser-test.json",
        }
        document.body.innerHTML = `
            <div id="contentbrowser-field">
                <input type="text" value="" class="pat-contentbrowser" data-pat-contentbrowser="${JSON.stringify(options)}">
            </div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it.skip("create contentbrowser pattern without preselection", async function () {
        expect(document.querySelectorAll(".content-browser-wrapper").length).toEqual(0);

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".content-browser-wrapper").length).toEqual(1);
    });

});
