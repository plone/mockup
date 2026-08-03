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
import { api } from "./ploneClient.js";

jest.mock("./client.js", () => ({ request: jest.fn() }));

// pasteItems/deleteItem/moveItem now go through @plone/client via the api()
// proxy (resolves to the body, throws RestapiError); the rest stay on the
// native-fetch request(). Mock the proxy with stubbed services.
jest.mock("./ploneClient.js", () => {
    const stub = {
        moveContent: jest.fn(),
        copyContent: jest.fn(),
        deleteContent: jest.fn(),
        updateContent: jest.fn(),
    };
    return {
        api: () => stub,
        toPath: (url) => new URL(url).pathname.replace(/\/+$/, ""),
    };
});

const mockedRequest = request;
const c = api();

beforeEach(() => {
    mockedRequest.mockReset();
    mockedRequest.mockResolvedValue(null);
    for (const fn of [c.moveContent, c.copyContent, c.deleteContent, c.updateContent]) {
        fn.mockReset();
        fn.mockResolvedValue({});
    }
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
    it("moveContent for a cut, with portal-relative target path", async () => {
        await pasteItems({
            targetUrl: "http://nohost/plone/target",
            sources: ["http://nohost/plone/a", "http://nohost/plone/b"],
            op: "cut",
        });
        expect(c.moveContent).toHaveBeenCalledWith({
            path: "/plone/target",
            data: { source: ["http://nohost/plone/a", "http://nohost/plone/b"] },
        });
        expect(c.copyContent).not.toHaveBeenCalled();
    });

    it("copyContent for a copy", async () => {
        await pasteItems({
            targetUrl: "http://nohost/plone/target",
            sources: ["http://nohost/plone/a"],
            op: "copy",
        });
        expect(c.copyContent).toHaveBeenCalledWith({
            path: "/plone/target",
            data: { source: ["http://nohost/plone/a"] },
        });
        expect(c.moveContent).not.toHaveBeenCalled();
    });
});

describe("deleteItem / deleteItems", () => {
    it("deleteContent for a single item url", async () => {
        await deleteItem("http://nohost/plone/a");
        expect(c.deleteContent).toHaveBeenCalledWith({ path: "/plone/a" });
    });

    it("deletes each item in order", async () => {
        await deleteItems(["http://nohost/plone/a", "http://nohost/plone/b"]);
        expect(c.deleteContent).toHaveBeenCalledTimes(2);
        expect(c.deleteContent).toHaveBeenNthCalledWith(1, { path: "/plone/a" });
        expect(c.deleteContent).toHaveBeenNthCalledWith(2, { path: "/plone/b" });
    });
});

describe("moveItem", () => {
    it("updateContent with an ordering payload", async () => {
        await moveItem({ containerUrl: "http://nohost/plone/folder", id: "doc-1", delta: "top" });
        expect(c.updateContent).toHaveBeenCalledWith({
            path: "/plone/folder",
            data: { ordering: { obj_id: "doc-1", delta: "top" } },
        });
    });

    it("includes subset_ids for relative reorders", async () => {
        await moveItem({
            containerUrl: "http://nohost/plone/folder",
            id: "doc-1",
            delta: 2,
            subsetIds: ["doc-1", "doc-2", "doc-3"],
        });
        const data = c.updateContent.mock.calls[0][0].data;
        expect(data.ordering).toEqual({
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
