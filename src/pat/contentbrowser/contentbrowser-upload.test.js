import utils from "@patternslib/patternslib/src/core/utils";
import Upload from "../upload/upload--implementation";
import {
    item,
    mockVocabulary,
    mountField,
    openBrowser,
    setupBrowserTests,
    waitFor,
} from "./test-helpers";

jest.mock("../upload/upload--implementation", () => jest.fn());

const image = (uid) => item(uid, { portal_type: "Image" });

// The options the browser hands to the upload pattern.
async function openUpload() {
    await openBrowser();
    (await waitFor("button.upload")).click();
    return await waitFor(() => Upload.mock.calls[0]?.[1]);
}

setupBrowserTests();

describe("Content Browser upload", () => {
    afterEach(() => {
        Upload.mockReset();
    });

    it("replaces a single selection with the upload in one change", async () => {
        let vocabulary = [image("old")];
        mockVocabulary(() => vocabulary);
        const { changes } = await mountField("old", {
            upload: true,
            maximumSelectionSize: 1,
        });
        await waitFor(".selected-item");
        const uploadOptions = await openUpload();

        vocabulary = [image("new")];
        uploadOptions.success(null, { UID: "new" });
        await utils.timeout(1);
        uploadOptions.queuecomplete();
        await waitFor(() => changes.length);
        await utils.timeout(10);

        expect(changes).toEqual(["new"]);
    });

    it("uploads below the root URL, not to the site's path twice", async () => {
        mockVocabulary([]);
        await mountField("", {
            upload: true,
            rootPath: "/plone",
            rootUrl: "http://localhost/plone",
            basePath: "/plone",
        });
        const uploadOptions = await openUpload();

        expect(uploadOptions.url).toBe("http://localhost/plone/@@fileUpload");
    });
});
