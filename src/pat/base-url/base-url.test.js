import "@patternslib/patternslib/src/core/polyfills";
import utils from "@patternslib/patternslib/src/core/utils";
import Pattern from "./base-url";

describe("pat-base-url tests", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly", async () => {
        document.body.dataset.baseUrl = "http://localhost/not/okay"

        new Pattern(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(document.body.dataset.baseUrl).toBe("http://localhost/not/okay");
        history.pushState(null, "", "/okay/okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay/okay");
    });

    it("Cleans the URL from views and traversal URLs.", async () => {
        new Pattern(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        history.pushState(null, "", "/okay/@@okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/++okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/folder_contents");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/edit");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/view");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/#okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/?okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");

        history.pushState(null, "", "/okay/?okay#okay");
        expect(document.body.dataset.baseUrl).toBe("http://localhost/okay");
    });
});
