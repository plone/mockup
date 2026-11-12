import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import Upload from "../upload/upload--implementation";

jest.mock("../upload/upload--implementation", () => jest.fn());

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

const image = (uid) => ({
    UID: uid,
    Title: uid,
    "@id": `http://localhost/plone/${uid}`,
    path: `/plone/${uid}`,
    portal_type: "Image",
    getIcon: "",
    is_folderish: false,
    review_state: "published",
    getURL: `http://localhost/plone/${uid}`,
});

let vocabulary = [];

async function waitFor(find) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const found = find();
        if (found) {
            return found;
        }
        await utils.timeout(10);
    }
    throw new Error(`${find} found nothing`);
}

describe("Content Browser upload", () => {
    beforeEach(() => {
        global.fetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({ results: vocabulary, total: vocabulary.length }),
        }));
        // jsdom has neither, and the sheet's transition needs animate()
        Element.prototype.scrollTo = jest.fn();
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
        Upload.mockReset();
    });

    it("replaces a single selection with the upload in one change", async () => {
        vocabulary = [image("old")];
        const options = { vocabularyUrl, upload: true, maximumSelectionSize: 1 };
        document.body.innerHTML = `
            <input type="text" id="field" value="old" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify(options)}'>
        `;
        const input = document.getElementById("field");
        const changes = [];
        input.addEventListener("change", () => changes.push(input.value));
        registry.scan(document.body);
        await waitFor(() => document.querySelector(".selected-item"));

        document.querySelector(".content-browser-selected-items-wrapper a.btn").click();
        (await waitFor(() => document.querySelector("button.upload"))).click();
        const uploadOptions = await waitFor(() => Upload.mock.calls[0]?.[1]);

        vocabulary = [image("new")];
        uploadOptions.success(null, { UID: "new" });
        await utils.timeout(1);
        uploadOptions.queuecomplete();
        await waitFor(() => changes.length);
        await utils.timeout(10);

        expect(changes).toEqual(["new"]);
    });

    it("uploads below the root URL, not to the site's path twice", async () => {
        vocabulary = [];
        const options = {
            vocabularyUrl,
            upload: true,
            rootPath: "/plone",
            rootUrl: "http://localhost/plone",
            basePath: "/plone",
        };
        document.body.innerHTML = `
            <input type="text" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify(options)}'>
        `;
        registry.scan(document.body);
        (await waitFor(() =>
            document.querySelector(".content-browser-selected-items-wrapper a.btn"),
        )).click();
        (await waitFor(() => document.querySelector("button.upload"))).click();
        const uploadOptions = await waitFor(() => Upload.mock.calls[0]?.[1]);

        expect(uploadOptions.baseUrl).toBe("http://localhost/plone");
        expect(uploadOptions.currentPath).toBe("");
    });
});
