import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import Sortable from "sortablejs";
import { unmount } from "svelte";

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

// The selected items are looked up with a POST which names their UIDs,
// everything else lists the whole vocabulary.
function mockVocabulary(items) {
    global.fetch = jest.fn(async (url, options = {}) => {
        const body = decodeURIComponent(String(options.body || ""));
        const results =
            options.method === "POST"
                ? items.filter((it) => body.includes(it.UID))
                : items;
        return {
            ok: true,
            json: async () => ({ results, total: results.length }),
        };
    });
}

async function mountField(value) {
    const options = { vocabularyUrl };
    document.body.innerHTML = `
        <div id="contentbrowser-field">
            <input type="text" id="field" value="${value}" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify(options)}'>
        </div>
    `;
    const input = document.getElementById("field");
    const changes = [];
    input.addEventListener("change", () => changes.push(input.value));
    registry.scan(document.body);
    await utils.timeout(1);
    return { input, changes };
}

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

const selectedList = () => document.querySelector(".content-browser-selected-items");

const shownUids = () =>
    [...selectedList().querySelectorAll(".selected-item")].map((el) => el.dataset.uuid);

// What Sortable does on a drop: it has moved the node already when it
// reports the indexes.
function drag(from, to) {
    const list = selectedList();
    const sortable = Sortable.get(list);
    const rows = [...list.querySelectorAll(":scope > div")];
    const item = rows[from];
    sortable.option("onStart")?.({ item });
    list.insertBefore(item, to > from ? rows[to].nextSibling : rows[to]);
    sortable.option("onUpdate")({
        target: list,
        from: list,
        to: list,
        item,
        oldDraggableIndex: from,
        newDraggableIndex: to,
    });
}

describe("Content Browser selection", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
    });

    it("does not fire change while rendering the initial selection", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        expect(document.querySelectorAll(".selected-item").length).toEqual(2);
        expect(input.value).toEqual("uid-1,uid-2");
        expect(changes).toEqual([]);
    });

    it("fires change when an item is unselected", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        document.querySelector(".selected-item button[aria-label=remove]").click();
        await utils.timeout(1);

        expect(input.value).toEqual("uid-2");
        expect(changes).toEqual(["uid-2"]);
    });
});

describe("Content Browser selection order", () => {
    beforeEach(() => {
        // jsdom has neither, and the browser's transition needs animate()
        Element.prototype.scrollTo = jest.fn();
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
    });

    it("writes a dragged order to the field", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two"), item("uid-3", "Three")]);
        const { input, changes } = await mountField("uid-1,uid-2,uid-3");
        await utils.timeout(1);

        drag(0, 2);
        await utils.timeout(1);

        expect(input.value).toEqual("uid-2,uid-3,uid-1");
        expect(changes).toEqual(["uid-2,uid-3,uid-1"]);
        expect(shownUids()).toEqual(["uid-2", "uid-3", "uid-1"]);

        drag(2, 1);
        await utils.timeout(1);

        expect(input.value).toEqual("uid-2,uid-1,uid-3");
        expect(shownUids()).toEqual(["uid-2", "uid-1", "uid-3"]);
    });

    it("keeps a dragged order when an item is removed", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two"), item("uid-3", "Three")]);
        const { input } = await mountField("uid-1,uid-2,uid-3");
        await utils.timeout(1);

        drag(0, 2);
        await utils.timeout(1);
        document
            .querySelector(".selected-item[data-uuid=uid-2] button[aria-label=remove]")
            .click();
        await utils.timeout(1);

        expect(input.value).toEqual("uid-3,uid-1");
        expect(shownUids()).toEqual(["uid-3", "uid-1"]);
    });

    it("keeps a dragged order when an item is added", async () => {
        mockVocabulary([
            item("uid-1", "One"),
            item("uid-2", "Two"),
            item("uid-3", "Three"),
            item("uid-4", "Four"),
        ]);
        const { input } = await mountField("uid-1,uid-2,uid-3");
        await utils.timeout(1);

        drag(0, 2);
        await utils.timeout(1);
        document.querySelector(".content-browser-selected-items-wrapper a.btn").click();
        (await waitFor(() => document.querySelector(".contentItem[data-uuid=uid-4]"))).click();
        (await waitFor(() => document.querySelector(".selectLevel button"))).click();
        await waitFor(() => input.value.includes("uid-4"));

        expect(input.value).toEqual("uid-2,uid-3,uid-1,uid-4");
        expect(shownUids()).toEqual(["uid-2", "uid-3", "uid-1", "uid-4"]);
    });

    it("releases the list when the field is unmounted", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two")]);
        const { input } = await mountField("uid-1,uid-2");
        await utils.timeout(1);
        const list = selectedList();
        expect(Boolean(Sortable.get(list))).toBe(true);

        await unmount(input["pattern-contentbrowser"].component_content_browser);

        expect(Boolean(Sortable.get(list))).toBe(false);
    });
});
