import utils from "@patternslib/patternslib/src/core/utils";
import Sortable from "sortablejs";
import { unmount } from "svelte";
import {
    item,
    mockVocabulary,
    mountField,
    openBrowser,
    setupBrowserTests,
    waitFor,
} from "./test-helpers";

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

setupBrowserTests();

describe("Content Browser selection", () => {
    it("does not fire change while rendering the initial selection", async () => {
        mockVocabulary([item("uid-1"), item("uid-2")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        expect(document.querySelectorAll(".selected-item").length).toEqual(2);
        expect(input.value).toEqual("uid-1,uid-2");
        expect(changes).toEqual([]);
    });

    it("fires change when an item is unselected", async () => {
        mockVocabulary([item("uid-1"), item("uid-2")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        document.querySelector(".selected-item button[aria-label=remove]").click();
        await utils.timeout(1);

        expect(input.value).toEqual("uid-2");
        expect(changes).toEqual(["uid-2"]);
    });

    it("drops a selection which arrives after the field was destroyed", async () => {
        // The lookup of the selected items stays pending until `answer` is
        // called, as a slow server would keep it.
        let answer;
        const items = [item("uid-1"), item("uid-2")];
        global.fetch = jest.fn(
            () =>
                new Promise((resolve) => {
                    answer = () =>
                        resolve({
                            ok: true,
                            json: async () => ({ results: items, total: items.length }),
                        });
                }),
        );
        const { input, changes } = await mountField("uid-1,uid-2");
        await waitFor(() => answer);

        input["pattern-contentbrowser"].destroy();
        answer();
        await utils.timeout(1);

        expect(document.querySelectorAll(".selected-item").length).toEqual(0);
        expect(input.value).toEqual("uid-1,uid-2");
        expect(changes).toEqual([]);
    });
});

describe("Content Browser selection order", () => {
    it("writes a dragged order to the field", async () => {
        mockVocabulary([item("uid-1"), item("uid-2"), item("uid-3")]);
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
        mockVocabulary([item("uid-1"), item("uid-2"), item("uid-3")]);
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
        mockVocabulary([item("uid-1"), item("uid-2"), item("uid-3"), item("uid-4")]);
        const { input } = await mountField("uid-1,uid-2,uid-3");
        await utils.timeout(1);

        drag(0, 2);
        await utils.timeout(1);
        await openBrowser();
        (await waitFor(".contentItem[data-uuid=uid-4]")).click();
        (await waitFor(".selectLevel button")).click();
        await waitFor(() => input.value.includes("uid-4"));

        expect(input.value).toEqual("uid-2,uid-3,uid-1,uid-4");
        expect(shownUids()).toEqual(["uid-2", "uid-3", "uid-1", "uid-4"]);
    });

    it("releases the list when the field is unmounted", async () => {
        mockVocabulary([item("uid-1"), item("uid-2")]);
        const { input } = await mountField("uid-1,uid-2");
        await utils.timeout(1);
        const list = selectedList();
        expect(Boolean(Sortable.get(list))).toBe(true);

        await unmount(input["pattern-contentbrowser"].component_content_browser);

        expect(Boolean(Sortable.get(list))).toBe(false);
    });
});
