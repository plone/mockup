import { SelectionStore, toSelected } from "./SelectionStore.svelte";

function item(uid: string, extra: Record<string, unknown> = {}) {
    return {
        "@id": `http://nohost/plone/folder/${uid}`,
        UID: uid,
        Title: uid.toUpperCase(),
        ...extra,
    };
}

function makeStore(allMatching: ReturnType<typeof item>[] = []) {
    const contents = {
        fetchAllMatching: jest.fn().mockResolvedValue(allMatching),
    };
    const store = new SelectionStore(contents as never);
    return { store, contents };
}

describe("toSelected", () => {
    it("derives id, title and folderishness from an item", () => {
        const sel = toSelected(
            item("doc-1", { is_folderish: true, Title: "Doc One", Subject: ["x", "y"] })
        );
        expect(sel).toEqual({
            uid: "doc-1",
            url: "http://nohost/plone/folder/doc-1",
            id: "doc-1",
            title: "Doc One",
            isFolderish: true,
            subjects: ["x", "y"],
        });
    });

    it("defaults subjects to an empty array when Subject is missing", () => {
        const sel = toSelected(item("doc-1"));
        expect(sel.subjects).toEqual([]);
    });

    it("falls back to the @id when UID is missing", () => {
        const sel = toSelected({ "@id": "http://nohost/plone/folder/x" } as never);
        expect(sel.uid).toBe("http://nohost/plone/folder/x");
        expect(sel.id).toBe("x");
        expect(sel.title).toBe("x");
    });
});

describe("SelectionStore", () => {
    it("toggles a single item on and off", () => {
        const { store } = makeStore();
        const it = item("a");
        store.toggle(it);
        expect(store.isSelected(it)).toBe(true);
        expect(store.count).toBe(1);
        expect(store.urls).toEqual(["http://nohost/plone/folder/a"]);
        store.toggle(it);
        expect(store.isSelected(it)).toBe(false);
        expect(store.isEmpty).toBe(true);
    });

    it("setPage selects and clears all given items", () => {
        const { store } = makeStore();
        const page = [item("a"), item("b")];
        store.setPage(page, true);
        expect(store.allSelected(page)).toBe(true);
        expect(store.count).toBe(2);
        store.setPage(page, false);
        expect(store.count).toBe(0);
    });

    it("allSelected is false for an empty page", () => {
        const { store } = makeStore();
        expect(store.allSelected([])).toBe(false);
    });

    it("selectAllInQuery sweeps and switches to all mode", async () => {
        const { store, contents } = makeStore([item("a"), item("b"), item("c")]);
        await store.selectAllInQuery();
        expect(contents.fetchAllMatching).toHaveBeenCalledWith([
            "UID",
            "is_folderish",
            "Title",
            "Subject",
        ]);
        expect(store.count).toBe(3);
        expect(store.mode).toBe("all");
        expect(store.sweeping).toBe(false);
    });

    it("toggling after an all-sweep reverts to page mode", async () => {
        const { store } = makeStore([item("a"), item("b")]);
        await store.selectAllInQuery();
        store.toggle(item("a"));
        expect(store.mode).toBe("page");
        expect(store.count).toBe(1);
    });

    it("clear empties the selection and resets the mode", async () => {
        const { store } = makeStore([item("a")]);
        await store.selectAllInQuery();
        store.clear();
        expect(store.isEmpty).toBe(true);
        expect(store.mode).toBe("page");
    });
});
