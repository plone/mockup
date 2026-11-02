import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

async function waitFor(selector) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
        await utils.timeout(10);
    }
    throw new Error(`${selector} did not appear`);
}

describe("Content Browser upload", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
    });

    it("scrolls to the upload form once it is in the columns", async () => {
        global.fetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({ results: [], total: 0 }),
        }));
        const scrolledWithForm = [];
        Element.prototype.scrollTo = jest.fn(() =>
            scrolledWithForm.push(!!document.querySelector(".upload-wrapper")),
        );
        // jsdom has neither, and the sheet's transition needs animate()
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
        document.body.innerHTML = `
            <input type="text" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify({ vocabularyUrl, upload: true })}'>
        `;
        registry.scan(document.body);
        await utils.timeout(1);
        (await waitFor(".content-browser-selected-items-wrapper a.btn")).click();
        (await waitFor("button.upload")).click();
        await waitFor(".upload-wrapper");
        await utils.timeout(10);

        expect(scrolledWithForm.at(-1)).toBe(true);
    });
});
