import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import { reviewStateClass, reviewStateColor } from "./src/utils";

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

const item = (uid, review_state) => ({
    "UID": uid,
    "Title": uid,
    "@id": `http://localhost/plone/${uid}`,
    "path": `/plone/${uid}`,
    "portal_type": "Document",
    "getIcon": "",
    "is_folderish": false,
    "review_state": review_state,
    "getURL": `http://localhost/plone/${uid}`,
});

async function mountField(items, extraOptions = {}) {
    global.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ results: items, total: items.length }),
    }));
    const options = { vocabularyUrl, separator: ",", ...extraOptions };
    document.body.innerHTML = `
        <div id="contentbrowser-field">
            <input type="text" id="field" value="${items.map((it) => it.UID).join(",")}"
                   class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify(options)}'>
        </div>
    `;
    registry.scan(document.body);
    await utils.timeout(1);
    await utils.timeout(1);
}

const selected = (uid) => document.querySelector(`.selected-item[data-uuid="${uid}"]`);

describe("Content Browser review state helpers", () => {
    it("builds the state class like the structure pattern", () => {
        expect(reviewStateClass("private")).toEqual("state-private");
        expect(reviewStateClass("internally_published")).toEqual(
            "state-internally_published",
        );
        expect(reviewStateClass("my state")).toEqual("state-my-state");
        expect(reviewStateClass("")).toEqual("");
        expect(reviewStateClass(null)).toEqual("");
    });

    it("references the theme variable of the state", () => {
        expect(reviewStateColor("private")).toEqual("var(--plone-state-private)");
        expect(reviewStateColor("internally_published")).toEqual(
            "var(--plone-state-internally-published)",
        );
    });

    it("gives no color to items without workflow", () => {
        expect(reviewStateColor("")).toBeNull();
        expect(reviewStateColor(null)).toBeNull();
    });

    it("gives no color to the states of the second argument", () => {
        const unmarked = ["internally_published"];
        expect(reviewStateColor("internally_published", unmarked)).toBeNull();
        expect(reviewStateColor("published", unmarked)).toEqual(
            "var(--plone-state-published)",
        );
        expect(reviewStateColor("published", [])).toEqual(
            "var(--plone-state-published)",
        );
        expect(reviewStateColor("", [])).toBeNull();
    });
});

describe("Content Browser review state indicator", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
    });

    it("marks selected items which are not published", async () => {
        await mountField([
            item("uid-private", "private"),
            item("uid-internal", "internally_published"),
        ]);

        const marker = selected("uid-private").querySelector(".state-indicator");
        expect(marker).toBeTruthy();
        expect(marker.style.getPropertyValue("--state-color")).toEqual(
            "var(--plone-state-private)",
        );
        expect(marker.getAttribute("role")).toEqual("img");
        expect(marker.getAttribute("aria-label")).toContain("private");
        expect(marker.getAttribute("title")).toContain("private");

        expect(
            selected("uid-internal")
                .querySelector(".state-indicator")
                .style.getPropertyValue("--state-color"),
        ).toEqual("var(--plone-state-internally-published)");
    });

    it("sets the state class on selected items", async () => {
        await mountField([item("uid-private", "private")]);

        expect(selected("uid-private").classList.contains("state-private")).toBe(true);
    });

    it("does not mark published items and items without workflow", async () => {
        await mountField([item("uid-published", "published"), item("uid-file", null)]);

        expect(selected("uid-published").querySelector(".state-indicator")).toBeNull();
        expect(selected("uid-file").querySelector(".state-indicator")).toBeNull();
    });

    it("takes the states without a marker from the option unmarkedReviewStates", async () => {
        await mountField(
            [item("uid-published", "published"), item("uid-internal", "internal")],
            { unmarkedReviewStates: ["internal"] },
        );

        expect(selected("uid-published").querySelector(".state-indicator")).toBeTruthy();
        expect(selected("uid-internal").querySelector(".state-indicator")).toBeNull();
    });

    it("takes the option unmarkedReviewStates also as a comma separated string", async () => {
        await mountField(
            [item("uid-published", "published"), item("uid-internal", "internal")],
            { unmarkedReviewStates: "internal, private" },
        );

        expect(selected("uid-published").querySelector(".state-indicator")).toBeTruthy();
        expect(selected("uid-internal").querySelector(".state-indicator")).toBeNull();
    });
});
