import utils from "@patternslib/patternslib/src/core/utils";
import {
    item,
    mockVocabulary,
    mountField,
    openBrowser,
    setupBrowserTests,
    waitFor,
} from "./test-helpers";

jest.mock("../upload/upload--implementation", () => jest.fn());

setupBrowserTests();

describe("Content Browser scrolling", () => {
    // what is clicked, and the column which this adds
    it.each([
        ["preview", ".levelColumn .contentItem", ".preview"],
        ["upload form", "button.upload", ".upload-wrapper"],
    ])("scrolls to the %s once it is in the columns", async (name, trigger, column) => {
        mockVocabulary([item("uid-1")]);
        const scrolledWithColumn = [];
        Element.prototype.scrollTo.mockImplementation(() =>
            scrolledWithColumn.push(!!document.querySelector(column)),
        );
        await mountField("", { upload: true });
        await openBrowser();

        (await waitFor(trigger)).click();
        await waitFor(column);
        await utils.timeout(10);

        expect(scrolledWithColumn.at(-1)).toBe(true);
    });
});
