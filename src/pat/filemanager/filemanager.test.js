import Pattern, { parser } from "./filemanager";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-filemanager registration", () => {
    it("registers with the .pat-filemanager trigger", () => {
        expect(Pattern.name).toBe("filemanager");
        expect(Pattern.trigger).toBe(".pat-filemanager");
        expect(registry.patterns.filemanager).toBe(Pattern);
    });

    it("parses listing options from the data attribute", () => {
        const el = document.createElement("div");
        const opts = {
            contextUrl: "http://nohost/plone/folder",
            defaultBatchSize: 50,
            sortOn: "effective",
            sortOrder: "descending",
            activeColumns: ["Title", "review_state"],
        };
        el.setAttribute("data-pat-filemanager", JSON.stringify(opts));

        const parsed = parser.parse(el, {});
        expect(parsed.contextUrl).toBe("http://nohost/plone/folder");
        expect(parsed.defaultBatchSize).toBe(50);
        expect(parsed.sortOn).toBe("effective");
        expect(parsed.sortOrder).toBe("descending");
        expect(parsed.activeColumns).toEqual(["Title", "review_state"]);
    });

    // Component mount requires Svelte 5 ESM compilation, which this CJS jest
    // setup does not exercise (see contentbrowser.test.js). Kept skipped.
    it.skip("mounts the app on scan", async () => {
        document.body.innerHTML = `
            <div class="pat-filemanager"
                 data-pat-filemanager='{"context-url":"http://nohost/plone"}'></div>`;
        registry.scan(document.body);
        await utils.timeout(1);
        expect(document.querySelectorAll(".pat-filemanager-app").length).toEqual(1);
    });
});
