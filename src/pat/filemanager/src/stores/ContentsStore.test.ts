import $ from "jquery";
import Cookies from "js-cookie";
import { ConfigStore } from "./ConfigStore.svelte";
import { ContentsStore } from "./ContentsStore.svelte";
import { buildCriteria, searchContents } from "../api/contents.js";
import {
    pasteItems,
    deleteItems,
    moveItem,
    setDefaultPage,
    patchItem,
    rearrangeFolder,
} from "../api/operations.js";
import { transitionItem } from "../api/workflow.js";

jest.mock("../api/contents.js", () => ({
    buildCriteria: jest.fn(() => [{ i: "path", o: "op", v: "/plone/folder::1" }]),
    buildSubtreeCriteria: jest.fn((path: string) => [{ i: "path", o: "op", v: path }]),
    searchContents: jest.fn(),
}));

jest.mock("../api/operations.js", () => ({
    pasteItems: jest.fn().mockResolvedValue(undefined),
    deleteItems: jest.fn().mockResolvedValue(undefined),
    moveItem: jest.fn().mockResolvedValue(undefined),
    setDefaultPage: jest.fn().mockResolvedValue(undefined),
    patchItem: jest.fn().mockResolvedValue(undefined),
    rearrangeFolder: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../api/workflow.js", () => ({
    transitionItem: jest.fn().mockResolvedValue(undefined),
}));

const mockedSearch = searchContents as jest.Mock;
const mockedBuild = buildCriteria as jest.Mock;
const mockedPaste = pasteItems as jest.Mock;
const mockedDelete = deleteItems as jest.Mock;
const mockedMove = moveItem as jest.Mock;
const mockedDefaultPage = setDefaultPage as jest.Mock;
const mockedPatch = patchItem as jest.Mock;
const mockedRearrange = rearrangeFolder as jest.Mock;
const mockedTransition = transitionItem as jest.Mock;

function makeStore() {
    const config = new ConfigStore({
        contextUrl: "http://nohost/plone/folder",
        defaultBatchSize: 10,
    });
    return new ContentsStore(config);
}

beforeEach(() => {
    for (const name of Object.keys(Cookies.get())) {
        Cookies.remove(name, { path: "/" });
    }
    mockedSearch.mockReset();
    mockedBuild.mockClear();
    mockedPaste.mockClear();
    mockedDelete.mockClear();
    mockedMove.mockClear();
    mockedDefaultPage.mockClear();
    mockedPatch.mockClear();
    mockedPatch.mockResolvedValue(undefined);
    mockedRearrange.mockClear();
    mockedTransition.mockClear();
    mockedTransition.mockResolvedValue(undefined);
});

describe("ContentsStore", () => {
    it("seeds batch size and sort from config", () => {
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone/folder",
            defaultBatchSize: 50,
            sortOn: "effective",
            sortOrder: "descending",
        });
        const store = new ContentsStore(config);
        expect(store.bSize).toBe(50);
        expect(store.sortOn).toBe("effective");
        expect(store.sortOrder).toBe("descending");
    });

    it("canGoUp / parentUrl reflect the folder's position below the portal root", () => {
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone/folder",
            portalUrl: "http://nohost/plone",
        });
        const store = new ContentsStore(config);
        // One level down: parent is the portal root.
        expect(store.canGoUp).toBe(true);
        expect(store.parentUrl).toBe("http://nohost/plone");
        // Deeper: parent is the folder one level up (trailing slash ignored).
        store.contextUrl = "http://nohost/plone/folder/sub/";
        expect(store.parentUrl).toBe("http://nohost/plone/folder");
        // At the portal root: no parent.
        store.contextUrl = "http://nohost/plone";
        expect(store.canGoUp).toBe(false);
        expect(store.parentUrl).toBeNull();
    });

    it("loads items and total, toggling loading", async () => {
        mockedSearch.mockResolvedValue({
            items: [{ UID: "a" }, { UID: "b" }],
            total: 2,
        });
        const store = makeStore();
        const pending = store.load();
        expect(store.loading).toBe(true);
        await pending;
        expect(store.loading).toBe(false);
        expect(store.items).toHaveLength(2);
        expect(store.total).toBe(2);
        expect(mockedSearch).toHaveBeenCalledWith(
            expect.objectContaining({
                contextUrl: "http://nohost/plone/folder",
                bStart: 0,
                bSize: 10,
            })
        );
    });

    it("captures errors and clears the listing", async () => {
        mockedSearch.mockRejectedValue(new Error("boom"));
        const store = makeStore();
        await store.load();
        expect(store.error).toBeInstanceOf(Error);
        expect(store.error?.message).toBe("boom");
        expect(store.items).toEqual([]);
        expect(store.total).toBe(0);
        expect(store.loading).toBe(false);
    });

    it("sortBy sets ascending on a new column and resets the page", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.bStart = 30;
        await store.sortBy("modified");
        expect(store.sortOn).toBe("modified");
        expect(store.sortOrder).toBe("ascending");
        expect(store.bStart).toBe(0);
    });

    it("sortBy toggles order when re-clicking the same column", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.sortBy("modified");
        await store.sortBy("modified");
        expect(store.sortOrder).toBe("descending");
    });

    it("sortBy reloads silently, never toggling loading", async () => {
        // The silent reload keeps the keyed rows mounted so the re-sorted page
        // flips into place instead of remounting behind a "Loading…" placeholder.
        mockedSearch.mockResolvedValue({
            items: [{ UID: "a", "@id": "http://nohost/plone/folder/a" }],
            total: 1,
        });
        const store = makeStore();
        await store.load();
        const pending = store.sortBy("modified");
        expect(store.loading).toBe(false);
        await pending;
        expect(store.loading).toBe(false);
    });

    it("computes page count and clamps goToPage", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.total = 25; // 3 pages at bSize 10
        expect(store.pageCount).toBe(3);
        await store.goToPage(99);
        expect(store.currentPage).toBe(3);
        expect(store.bStart).toBe(20);
    });

    it("setBatchSize resets to the first page", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.bStart = 40;
        await store.setBatchSize(25);
        expect(store.bSize).toBe(25);
        expect(store.bStart).toBe(0);
    });

    it("persists the batch size to a cookie and restores it on a new store", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone/folder",
            defaultBatchSize: 10,
        });
        const first = new ContentsStore(config, "pat-filemanager");
        await first.setBatchSize(50);

        const second = new ContentsStore(config, "pat-filemanager");
        expect(second.bSize).toBe(50);
    });

    it("navigateTo re-points the folder, resets filters/page and reloads", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.bStart = 30;
        store.searchableText = "old";
        store.selectedTypes = ["Document"];

        await store.navigateTo("http://nohost/plone/folder/sub/?foo=bar");

        expect(store.contextUrl).toBe("http://nohost/plone/folder/sub");
        expect(store.contextPath).toBe("/plone/folder/sub");
        expect(store.searchableText).toBe("");
        expect(store.selectedTypes).toEqual([]);
        expect(store.bStart).toBe(0);
        expect(mockedBuild).toHaveBeenLastCalledWith(
            expect.objectContaining({ path: "/plone/folder/sub" })
        );
        expect(mockedSearch).toHaveBeenLastCalledWith(
            expect.objectContaining({ contextUrl: "http://nohost/plone/folder/sub" })
        );
    });

    it("navigateTo fires structure-url-changed for the toolbar with the portal-relative path", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone/folder",
            portalUrl: "http://nohost/plone",
        });
        const store = new ContentsStore(config);

        const handler = jest.fn();
        $("body").on("structure-url-changed", handler);
        try {
            await store.navigateTo("http://nohost/plone/folder/sub/?foo=bar");
        } finally {
            $("body").off("structure-url-changed", handler);
        }

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][1]).toBe("/folder/sub");
    });

    it("applyFilters feeds trimmed search text and types into the criteria", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.bStart = 30;
        await store.applyFilters({ searchableText: "  hello  ", selectedTypes: ["Document"] });
        expect(store.bStart).toBe(0);
        expect(store.hasActiveFilters).toBe(true);
        expect(mockedBuild).toHaveBeenLastCalledWith(
            expect.objectContaining({
                searchableText: "hello",
                portalTypes: ["Document"],
            })
        );
    });

    it("falls back to config portalTypes when no types are selected", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone/folder",
            portalTypes: ["News Item"],
        });
        const store = new ContentsStore(config);
        await store.load();
        expect(mockedBuild).toHaveBeenLastCalledWith(
            expect.objectContaining({ portalTypes: ["News Item"] })
        );
    });

    it("applyFilters feeds advanced extraCriteria into the catalog query", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        const extra = [{ i: "Subject", o: "op.selection.any", v: ["news"] }];
        store.bStart = 30;
        await store.applyFilters({ extraCriteria: extra });
        expect(store.bStart).toBe(0);
        expect(store.hasActiveFilters).toBe(true);
        expect(mockedBuild).toHaveBeenLastCalledWith(
            expect.objectContaining({ extraCriteria: extra })
        );
    });

    it("clearFilters resets search, types, extraCriteria and page", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.applyFilters({
            searchableText: "x",
            selectedTypes: ["Folder"],
            extraCriteria: [{ i: "Subject", o: "op", v: ["a"] }],
        });
        await store.clearFilters();
        expect(store.searchableText).toBe("");
        expect(store.selectedTypes).toEqual([]);
        expect(store.extraCriteria).toEqual([]);
        expect(store.hasActiveFilters).toBe(false);
        expect(store.bStart).toBe(0);
    });

    it("currentIds derives object ids from the loaded items", async () => {
        mockedSearch.mockResolvedValue({
            items: [
                { "@id": "http://nohost/plone/folder/a" },
                { "@id": "http://nohost/plone/folder/b/" },
            ],
            total: 2,
        });
        const store = makeStore();
        await store.load();
        expect(store.currentIds).toEqual(["a", "b"]);
    });

    it("fetchAllMatching loops pages until the total is collected", async () => {
        const page = (n: number) =>
            Array.from({ length: n }, (_, i) => ({ UID: `u${i}` }));
        mockedSearch
            .mockResolvedValueOnce({ items: page(1000), total: 1500 })
            .mockResolvedValueOnce({ items: page(500), total: 1500 });
        const store = makeStore();
        const all = await store.fetchAllMatching(["UID"]);
        expect(all).toHaveLength(1500);
        expect(mockedSearch).toHaveBeenCalledTimes(2);
        expect(mockedSearch.mock.calls[1][0].bStart).toBe(1000);
    });

    it("paste delegates to the target folder and reloads", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.paste("cut", ["http://nohost/plone/a"]);
        expect(mockedPaste).toHaveBeenCalledWith({
            targetUrl: "http://nohost/plone/folder",
            sources: ["http://nohost/plone/a"],
            op: "cut",
        });
        expect(mockedSearch).toHaveBeenCalled();
    });

    it("moveIntoFolder @moves sources into the target folder and reloads", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.moveIntoFolder("http://nohost/plone/folder/sub", [
            "http://nohost/plone/folder/a",
        ]);
        expect(mockedPaste).toHaveBeenCalledWith({
            targetUrl: "http://nohost/plone/folder/sub",
            sources: ["http://nohost/plone/folder/a"],
            op: "cut",
        });
        expect(mockedSearch).toHaveBeenCalled();
    });

    it("removeItems deletes urls then reloads, stepping back an empty page", async () => {
        // page 2 is empty after the delete, so it should fall back to page 1
        mockedSearch
            .mockResolvedValueOnce({ items: [], total: 5 })
            .mockResolvedValueOnce({ items: [{ UID: "x" }], total: 5 });
        const store = makeStore();
        store.bStart = 10;
        await store.removeItems(["http://nohost/plone/a"]);
        expect(mockedDelete).toHaveBeenCalledWith(
            ["http://nohost/plone/a"],
            undefined
        );
        expect(store.bStart).toBe(0);
    });

    it("moveTo reorders within the folder and reloads", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.moveTo("doc-1", "top");
        expect(mockedMove).toHaveBeenCalledWith({
            containerUrl: "http://nohost/plone/folder",
            id: "doc-1",
            delta: "top",
            subsetIds: undefined,
        });
        expect(mockedSearch).toHaveBeenCalled();
    });

    it("moveTo reorders items optimistically before the server responds", async () => {
        mockedSearch.mockResolvedValue({
            items: [
                { UID: "a", "@id": "http://nohost/plone/folder/a" },
                { UID: "b", "@id": "http://nohost/plone/folder/b" },
                { UID: "c", "@id": "http://nohost/plone/folder/c" },
            ],
            total: 3,
        });
        const store = makeStore();
        await store.load();
        // Move "a" down two slots; the local array updates synchronously so the
        // keyed rows can animate, before any server round-trip resolves.
        const pending = store.moveTo("a", 2, store.currentIds);
        expect(store.items.map((it) => it.UID)).toEqual(["b", "c", "a"]);
        await pending;
    });

    it("moveTo reconciles silently, never toggling loading", async () => {
        mockedSearch.mockResolvedValue({
            items: [{ UID: "a", "@id": "http://nohost/plone/folder/a" }],
            total: 1,
        });
        const store = makeStore();
        await store.load();
        const pending = store.moveTo("a", "bottom");
        expect(store.loading).toBe(false);
        await pending;
        expect(store.loading).toBe(false);
    });

    it("moveTo restores server truth when the reorder PATCH fails", async () => {
        mockedSearch.mockResolvedValue({
            items: [
                { UID: "a", "@id": "http://nohost/plone/folder/a" },
                { UID: "b", "@id": "http://nohost/plone/folder/b" },
            ],
            total: 2,
        });
        const store = makeStore();
        await store.load();
        mockedMove.mockRejectedValueOnce(new Error("nope"));
        await expect(store.moveTo("a", 1, store.currentIds)).rejects.toThrow("nope");
        // The failed move reloaded the authoritative order from the server.
        expect(store.items.map((it) => it.UID)).toEqual(["a", "b"]);
    });

    it("movePreview splices an item to a new slot without touching the server", async () => {
        mockedSearch.mockResolvedValue({
            items: [
                { UID: "a", "@id": "http://nohost/plone/folder/a" },
                { UID: "b", "@id": "http://nohost/plone/folder/b" },
                { UID: "c", "@id": "http://nohost/plone/folder/c" },
            ],
            total: 3,
        });
        const store = makeStore();
        await store.load();
        store.movePreview("a", 2);
        expect(store.items.map((it) => it.UID)).toEqual(["b", "c", "a"]);
        expect(mockedMove).not.toHaveBeenCalled();
    });

    it("commitReorder PATCHes the net shift and reconciles silently", async () => {
        mockedSearch.mockResolvedValue({
            items: [{ UID: "a", "@id": "http://nohost/plone/folder/a" }],
            total: 1,
        });
        const store = makeStore();
        await store.load();
        const pending = store.commitReorder("a", 2, ["a", "b", "c"]);
        expect(store.loading).toBe(false); // silent reconcile, rows stay mounted
        await pending;
        expect(mockedMove).toHaveBeenCalledWith({
            containerUrl: "http://nohost/plone/folder",
            id: "a",
            delta: 2,
            subsetIds: ["a", "b", "c"],
        });
    });

    it("commitReorder is a no-op when the net shift is zero", async () => {
        const store = makeStore();
        await store.commitReorder("a", 0, ["a", "b"]);
        expect(mockedMove).not.toHaveBeenCalled();
    });

    it("movePreviewBlock lifts a contiguous run and re-inserts it as one", async () => {
        mockedSearch.mockResolvedValue({
            items: ["a", "b", "c", "d", "e"].map((id) => ({
                UID: id,
                "@id": `http://nohost/plone/folder/${id}`,
            })),
            total: 5,
        });
        const store = makeStore();
        await store.load();
        store.movePreviewBlock(["b", "c"], 3);
        expect(store.items.map((it) => it.UID)).toEqual(["a", "d", "e", "b", "c"]);
        expect(mockedMove).not.toHaveBeenCalled();
    });

    it("commitReorderBlock moves a block down as a sequence of single moves", async () => {
        mockedSearch.mockResolvedValue({
            items: ["a", "b", "c", "d", "e"].map((id) => ({
                UID: id,
                "@id": `http://nohost/plone/folder/${id}`,
            })),
            total: 5,
        });
        const store = makeStore();
        await store.load();
        // Move {b, c} to start at index 3 → trailing item first so placed rows
        // aren't disturbed, each subset matching the live server order.
        await store.commitReorderBlock(["b", "c"], 3, ["a", "b", "c", "d", "e"]);
        expect(mockedMove.mock.calls.map((c) => c[0])).toEqual([
            {
                containerUrl: "http://nohost/plone/folder",
                id: "c",
                delta: 2,
                subsetIds: ["a", "b", "c", "d", "e"],
            },
            {
                containerUrl: "http://nohost/plone/folder",
                id: "b",
                delta: 2,
                subsetIds: ["a", "b", "d", "e", "c"],
            },
        ]);
    });

    it("commitReorderBlock moves a block up top-down", async () => {
        mockedSearch.mockResolvedValue({
            items: ["a", "b", "c", "d", "e"].map((id) => ({
                UID: id,
                "@id": `http://nohost/plone/folder/${id}`,
            })),
            total: 5,
        });
        const store = makeStore();
        await store.load();
        await store.commitReorderBlock(["c", "d"], 1, ["a", "b", "c", "d", "e"]);
        expect(mockedMove.mock.calls.map((c) => c[0])).toEqual([
            {
                containerUrl: "http://nohost/plone/folder",
                id: "c",
                delta: -1,
                subsetIds: ["a", "b", "c", "d", "e"],
            },
            {
                containerUrl: "http://nohost/plone/folder",
                id: "d",
                delta: -1,
                subsetIds: ["a", "c", "b", "d", "e"],
            },
        ]);
    });

    it("commitReorderBlock is a no-op when the block does not move", async () => {
        const store = makeStore();
        await store.commitReorderBlock(["b", "c"], 1, ["a", "b", "c", "d"]);
        expect(mockedMove).not.toHaveBeenCalled();
    });

    it("makeDefaultPage sets the container default page", async () => {
        const store = makeStore();
        await store.makeDefaultPage("doc-1");
        expect(mockedDefaultPage).toHaveBeenCalledWith({
            containerUrl: "http://nohost/plone/folder",
            id: "doc-1",
        });
    });

    it("rearrange PATCHes the container and reloads in manual-order mode", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        store.sortOn = "Title";
        await store.rearrange("sortable_title", "ascending");
        expect(mockedRearrange).toHaveBeenCalledWith({
            containerUrl: "http://nohost/plone/folder",
            sortOn: "sortable_title",
            sortOrder: "ascending",
        });
        expect(store.sortOn).toBe("getObjPositionInParent");
        expect(store.sortOrder).toBe("ascending");
        expect(store.bStart).toBe(0);
        expect(mockedSearch).toHaveBeenCalled();
    });

    it("rearrange supports descending order", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.rearrange("modified", "descending");
        expect(mockedRearrange).toHaveBeenCalledWith({
            containerUrl: "http://nohost/plone/folder",
            sortOn: "modified",
            sortOrder: "descending",
        });
    });

    it("applyWorkflow transitions each item and reports a summary", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        const result = await store.applyWorkflow(
            [
                { url: "http://nohost/plone/a", title: "A", isFolderish: false },
                { url: "http://nohost/plone/b", title: "B", isFolderish: true },
            ],
            { transition: "publish", comment: "go", includeChildren: true }
        );
        expect(mockedTransition).toHaveBeenCalledTimes(2);
        expect(mockedTransition).toHaveBeenNthCalledWith(1, {
            itemUrl: "http://nohost/plone/a",
            transition: "publish",
            comment: "go",
            includeChildren: true,
        });
        expect(result).toEqual({ ok: 2, failed: [] });
        expect(mockedSearch).toHaveBeenCalled();
    });

    it("applyWorkflow records per-item failures without aborting", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        mockedTransition
            .mockRejectedValueOnce(new Error("not allowed"))
            .mockResolvedValueOnce(undefined);
        const store = makeStore();
        const result = await store.applyWorkflow(
            [
                { url: "http://nohost/plone/a", title: "A", isFolderish: false },
                { url: "http://nohost/plone/b", title: "B", isFolderish: false },
            ],
            { transition: "publish" }
        );
        expect(result.ok).toBe(1);
        expect(result.failed).toEqual([{ title: "A", error: "not allowed" }]);
    });

    it("applyTags computes per-item subjects (remove then add)", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.applyTags(
            [
                {
                    url: "http://nohost/plone/a",
                    title: "A",
                    isFolderish: false,
                    subjects: ["keep", "drop"],
                },
            ],
            { add: ["new"], remove: ["drop"] }
        );
        expect(mockedPatch).toHaveBeenCalledWith("http://nohost/plone/a", {
            subjects: ["keep", "new"],
        });
    });

    it("applyProperties patches each item and recurses into folders", async () => {
        // first call: the recursive descendant sweep; later calls: reload()
        mockedSearch
            .mockResolvedValueOnce({
                items: [{ "@id": "http://nohost/plone/folder/sub/child" }],
                total: 1,
            })
            .mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        const result = await store.applyProperties(
            [
                { url: "http://nohost/plone/folder/sub", title: "Sub", isFolderish: true },
            ],
            { rights: "CC" },
            true
        );
        expect(mockedPatch).toHaveBeenCalledWith("http://nohost/plone/folder/sub", {
            rights: "CC",
        });
        expect(mockedPatch).toHaveBeenCalledWith("http://nohost/plone/folder/sub/child", {
            rights: "CC",
        });
        expect(result.ok).toBe(1);
    });

    it("applyProperties without recursion patches only the selected item", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        await store.applyProperties(
            [{ url: "http://nohost/plone/folder/sub", title: "Sub", isFolderish: true }],
            { rights: "CC" },
            false
        );
        expect(mockedPatch).toHaveBeenCalledTimes(1);
    });

    it("renameItems patches id and title per item", async () => {
        mockedSearch.mockResolvedValue({ items: [], total: 0 });
        const store = makeStore();
        const result = await store.renameItems([
            { url: "http://nohost/plone/a", id: "a-new", title: "A New" },
        ]);
        expect(mockedPatch).toHaveBeenCalledWith("http://nohost/plone/a", {
            id: "a-new",
            title: "A New",
        });
        expect(result).toEqual({ ok: 1, failed: [] });
    });
});

describe("ConfigStore", () => {
    it("derives contextPath from the url and strips trailing slashes", () => {
        const config = new ConfigStore({ contextUrl: "http://nohost/plone/folder/" });
        expect(config.contextUrl).toBe("http://nohost/plone/folder");
        expect(config.contextPath).toBe("/plone/folder");
    });

    it("falls back to default active/available columns", () => {
        const config = new ConfigStore({ contextUrl: "http://nohost/plone" });
        expect(config.activeColumns).toContain("Title");
        expect(config.availableColumns).toContain("Subject");
    });

    it("resolves a column definition by key", () => {
        const config = new ConfigStore({ contextUrl: "http://nohost/plone" });
        expect(config.column("ModificationDate").type).toBe("date");
        expect(config.column("unknown")).toEqual({
            key: "unknown",
            label: "unknown",
            type: "text",
        });
    });

    it("appends /view only for view-action types (default File/Image)", () => {
        const config = new ConfigStore({ contextUrl: "http://nohost/plone" });
        expect(config.viewActionTypes).toEqual(["File", "Image"]);
        expect(
            config.viewUrl({ "@id": "http://nohost/plone/f.pdf", portal_type: "File" })
        ).toBe("http://nohost/plone/f.pdf/view");
        expect(
            config.viewUrl({ "@id": "http://nohost/plone/img", portal_type: "Image" })
        ).toBe("http://nohost/plone/img/view");
        expect(
            config.viewUrl({ "@id": "http://nohost/plone/doc", portal_type: "Document" })
        ).toBe("http://nohost/plone/doc");
        // Missing portal_type → no /view (don't guess).
        expect(config.viewUrl({ "@id": "http://nohost/plone/x" })).toBe(
            "http://nohost/plone/x"
        );
    });

    it("honours a custom viewActionTypes list", () => {
        const config = new ConfigStore({
            contextUrl: "http://nohost/plone",
            viewActionTypes: ["Blob"],
        });
        expect(
            config.viewUrl({ "@id": "http://nohost/plone/b", portal_type: "Blob" })
        ).toBe("http://nohost/plone/b/view");
        // File is no longer in the list when overridden.
        expect(
            config.viewUrl({ "@id": "http://nohost/plone/f", portal_type: "File" })
        ).toBe("http://nohost/plone/f");
    });
});
