import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

const item = (uid, title) => ({
    UID: uid,
    Title: title,
    "@id": `http://localhost/plone/${uid}`,
    path: `/plone/${uid}`,
    portal_type: "Document",
    getIcon: "",
    is_folderish: false,
    review_state: "published",
    getURL: `http://localhost/plone/${uid}`,
});

function mockVocabulary(items) {
    global.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ results: items, total: items.length }),
    }));
}

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

describe("Content Browser preview", () => {
    beforeEach(() => {
        // jsdom has neither, and the sheet's transition needs animate()
        Element.prototype.scrollTo = jest.fn();
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
    });

    it("scrolls to the preview once it is in the columns", async () => {
        mockVocabulary([item("uid-1", "One")]);
        const scrolledWithPreview = [];
        Element.prototype.scrollTo.mockImplementation(() =>
            scrolledWithPreview.push(!!document.querySelector(".preview")),
        );
        document.body.innerHTML = `
            <input type="text" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify({ vocabularyUrl })}'>
        `;
        registry.scan(document.body);
        await utils.timeout(1);
        (await waitFor(".content-browser-selected-items-wrapper a.btn")).click();
        (await waitFor(".levelColumn .contentItem")).click();
        await waitFor(".preview");
        await utils.timeout(10);

        expect(scrolledWithPreview.at(-1)).toBe(true);
    });
});
