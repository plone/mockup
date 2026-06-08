import {
    objId,
    pasteItems,
    deleteItem,
    deleteItems,
    moveItem,
    setDefaultPage,
    patchItem,
    patchItems,
    rearrangeFolder,
} from "./operations.js";
import { request } from "./client.js";

jest.mock("./client.js", () => ({ request: jest.fn() }));

const mockedRequest = request;

beforeEach(() => {
    mockedRequest.mockReset();
    mockedRequest.mockResolvedValue(null);
});

describe("objId", () => {
    it("returns the last path segment", () => {
        expect(objId("http://nohost/plone/folder/doc-1")).toBe("doc-1");
        expect(objId("/plone/folder/doc-1/")).toBe("doc-1");
        expect(objId("http://nohost/plone/folder/doc-1?foo=1")).toBe("doc-1");
        expect(objId("")).toBe("");
    });
});

describe("pasteItems", () => {
    it("POSTs to @move for a cut", async () => {
        await pasteItems({
            targetUrl: "http://nohost/plone/target",
            sources: ["http://nohost/plone/a", "http://nohost/plone/b"],
            op: "cut",
        });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/target/@move", {
            method: "POST",
            body: { source: ["http://nohost/plone/a", "http://nohost/plone/b"] },
        });
    });

    it("POSTs to @copy for a copy", async () => {
        await pasteItems({
            targetUrl: "http://nohost/plone/target",
            sources: ["http://nohost/plone/a"],
            op: "copy",
        });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/target/@copy", {
            method: "POST",
            body: { source: ["http://nohost/plone/a"] },
        });
    });
});

describe("deleteItem / deleteItems", () => {
    it("DELETEs a single item url", async () => {
        await deleteItem("http://nohost/plone/a");
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/a", { method: "DELETE" });
    });

    it("DELETEs each item in order", async () => {
        await deleteItems(["http://nohost/plone/a", "http://nohost/plone/b"]);
        expect(mockedRequest).toHaveBeenCalledTimes(2);
        expect(mockedRequest).toHaveBeenNthCalledWith(1, "http://nohost/plone/a", {
            method: "DELETE",
        });
        expect(mockedRequest).toHaveBeenNthCalledWith(2, "http://nohost/plone/b", {
            method: "DELETE",
        });
    });
});

describe("moveItem", () => {
    it("PATCHes the container with an ordering payload", async () => {
        await moveItem({ containerUrl: "http://nohost/plone/folder", id: "doc-1", delta: "top" });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/folder", {
            method: "PATCH",
            body: { ordering: { obj_id: "doc-1", delta: "top" } },
        });
    });

    it("includes subset_ids for relative reorders", async () => {
        await moveItem({
            containerUrl: "http://nohost/plone/folder",
            id: "doc-1",
            delta: 2,
            subsetIds: ["doc-1", "doc-2", "doc-3"],
        });
        const body = mockedRequest.mock.calls[0][1].body;
        expect(body.ordering).toEqual({
            obj_id: "doc-1",
            delta: 2,
            subset_ids: ["doc-1", "doc-2", "doc-3"],
        });
    });
});

describe("setDefaultPage", () => {
    it("PATCHes the container with default_page", async () => {
        await setDefaultPage({ containerUrl: "http://nohost/plone/folder", id: "doc-1" });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/folder", {
            method: "PATCH",
            body: { default_page: "doc-1" },
        });
    });
});

describe("patchItem / patchItems", () => {
    it("PATCHes one item with the given body", async () => {
        await patchItem("http://nohost/plone/a", { subjects: ["x"] });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/a", {
            method: "PATCH",
            body: { subjects: ["x"] },
        });
    });

    it("PATCHes each item in order with the same body", async () => {
        await patchItems(["http://nohost/plone/a", "http://nohost/plone/b"], { rights: "r" });
        expect(mockedRequest).toHaveBeenCalledTimes(2);
        expect(mockedRequest).toHaveBeenNthCalledWith(1, "http://nohost/plone/a", {
            method: "PATCH",
            body: { rights: "r" },
        });
        expect(mockedRequest).toHaveBeenNthCalledWith(2, "http://nohost/plone/b", {
            method: "PATCH",
            body: { rights: "r" },
        });
    });
});

describe("rearrangeFolder", () => {
    it("PATCHes the container with a sort payload (ascending)", async () => {
        await rearrangeFolder({
            containerUrl: "http://nohost/plone/folder",
            sortOn: "sortable_title",
            sortOrder: "ascending",
        });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/folder", {
            method: "PATCH",
            body: { sort: { on: "sortable_title", order: "ascending" } },
        });
    });

    it("PATCHes the container with a sort payload (descending)", async () => {
        await rearrangeFolder({
            containerUrl: "http://nohost/plone/folder",
            sortOn: "modified",
            sortOrder: "descending",
        });
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/folder", {
            method: "PATCH",
            body: { sort: { on: "modified", order: "descending" } },
        });
    });
});
