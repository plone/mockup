import Pattern, { parser, injectCriticalCss } from "./filemanager";
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

    describe("critical CSS", () => {
        afterEach(() => {
            document.getElementById("pat-filemanager-critical-css")?.remove();
        });

        it("injects the chrome-hiding rule synchronously into the head", () => {
            expect(
                document.getElementById("pat-filemanager-critical-css")
            ).toBeNull();

            injectCriticalCss();

            const style = document.getElementById("pat-filemanager-critical-css");
            expect(style).not.toBeNull();
            expect(style.parentNode).toBe(document.head);
            expect(style.textContent).toContain("body:has(.pat-filemanager)");
            expect(style.textContent).toContain("display: none;");
        });

        it("includes a loading spinner shown until the app mounts", () => {
            injectCriticalCss();

            const css = document.getElementById(
                "pat-filemanager-critical-css"
            ).textContent;
            // Spinner is gated on the absence of the mounted app root, so it
            // disappears the moment Svelte renders .pat-filemanager-app.
            expect(css).toContain(
                ".pat-filemanager:not(:has(.pat-filemanager-app))::after"
            );
            expect(css).toContain("@keyframes pat-filemanager-spin");
            expect(css).toContain("animation: pat-filemanager-spin");
        });

        it("is idempotent — repeated calls add only one style element", () => {
            injectCriticalCss();
            injectCriticalCss();
            injectCriticalCss();

            expect(
                document.querySelectorAll("#pat-filemanager-critical-css").length
            ).toBe(1);
        });
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
