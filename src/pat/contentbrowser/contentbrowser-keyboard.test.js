import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

const item = (uid) => ({
    UID: uid,
    Title: uid,
    "@id": `http://localhost/plone/${uid}`,
    path: `/plone/${uid}`,
    portal_type: "Document",
    getIcon: "",
    is_folderish: false,
    review_state: "published",
    getURL: `http://localhost/plone/${uid}`,
});

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

async function openBrowser(items) {
    global.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ results: items, total: items.length }),
    }));
    document.body.innerHTML = `
        <input type="text" class="pat-contentbrowser"
               data-pat-contentbrowser='${JSON.stringify({ vocabularyUrl, upload: true })}'>
    `;
    registry.scan(document.body);
    const opener = await waitFor(".content-browser-selected-items-wrapper a.btn");
    opener.click();
    await waitFor(".content-browser button.upload");
    return opener;
}

const keydown = (key) =>
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });

describe("Content Browser keyboard", () => {
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

    it("lets Tab leave a content item", async () => {
        await openBrowser([item("one"), item("two")]);
        const first = await waitFor(".contentItem");

        const tab = keydown("Tab");
        first.dispatchEvent(tab);
        const down = keydown("ArrowDown");
        first.dispatchEvent(down);

        expect(tab.defaultPrevented).toBe(false);
        expect(down.defaultPrevented).toBe(true);
    });

    it("has one tab stop per column", async () => {
        await openBrowser([item("one"), item("two"), item("three")]);
        await waitFor(".contentItem");
        const tabindexes = () =>
            [...document.querySelectorAll(".contentItem")].map((el) => el.tabIndex);
        expect(tabindexes()).toEqual([0, -1, -1]);

        document.querySelectorAll(".contentItem")[1].click();
        await utils.timeout(1);

        expect(tabindexes()).toEqual([-1, 0, -1]);
    });

    it("opens the upload form on activation, not on any key", async () => {
        await openBrowser([]);
        const upload = document.querySelector(".content-browser button.upload");

        upload.dispatchEvent(keydown("Tab"));
        await utils.timeout(10);
        expect(document.querySelector(".upload-wrapper")).toBe(null);

        upload.click();
        await waitFor(".upload-wrapper");
    });

    it("moves the focus to the upload form's Browse button", async () => {
        await openBrowser([]);
        const upload = document.querySelector(".content-browser button.upload");
        upload.focus();
        upload.click();

        const browse = await waitFor(".upload-wrapper button.browse");
        await utils.timeout(1);

        expect(document.activeElement).toBe(browse);
    });

    it("closes on Escape from its toolbar and hands the focus back", async () => {
        const opener = await openBrowser([item("one")]);
        const filter = document.querySelector(".content-browser input[name=filter]");
        filter.focus();

        filter.dispatchEvent(keydown("Escape"));
        await utils.timeout(10);

        expect(document.activeElement).toBe(opener);
    });
});
