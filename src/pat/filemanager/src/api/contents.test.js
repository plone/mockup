import { buildCriteria, searchContents } from "./contents";
import { request, RestapiError } from "./client";

function mockFetch({ status = 200, json = {}, text } = {}) {
    const body = text !== undefined ? text : JSON.stringify(json);
    global.fetch = jest.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        text: () => Promise.resolve(body),
    });
}

afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
});

describe("buildCriteria", () => {
    it("scopes to direct children by default", () => {
        const criteria = buildCriteria({ path: "/plone/folder" });
        expect(criteria).toEqual([
            {
                i: "path",
                o: "plone.app.querystring.operation.string.path",
                v: "/plone/folder::1",
            },
        ]);
    });

    it("adds portal_type and SearchableText criteria", () => {
        const criteria = buildCriteria({
            path: "/plone/folder",
            portalTypes: ["Document", "Folder"],
            searchableText: "hello",
        });
        expect(criteria).toContainEqual({
            i: "portal_type",
            o: "plone.app.querystring.operation.selection.any",
            v: ["Document", "Folder"],
        });
        expect(criteria).toContainEqual({
            i: "SearchableText",
            o: "plone.app.querystring.operation.string.contains",
            v: "hello",
        });
    });

    it("appends extra criteria from the filter widget", () => {
        const extra = { i: "review_state", o: "x", v: "published" };
        const criteria = buildCriteria({ path: "/p", extraCriteria: [extra] });
        expect(criteria[criteria.length - 1]).toBe(extra);
    });
});

describe("searchContents", () => {
    it("POSTs query, sort, batch and metadata_fields in the JSON body", async () => {
        mockFetch({
            json: {
                items: [{ UID: "a" }, { UID: "b" }],
                items_total: 42,
                batching: { next: "..." },
            },
        });

        const result = await searchContents({
            contextUrl: "http://nohost/plone/folder",
            criteria: buildCriteria({ path: "/plone/folder" }),
            sortOn: "effective",
            sortOrder: "descending",
            bStart: 25,
            bSize: 25,
            metadataFields: ["EffectiveDate", "image_scales"],
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, init] = global.fetch.mock.calls[0];
        expect(url).toBe("http://nohost/plone/folder/@querystring-search");
        expect(init.method).toBe("POST");
        const sentBody = JSON.parse(init.body);
        expect(sentBody.sort_on).toBe("effective");
        expect(sentBody.sort_order).toBe("descending");
        expect(sentBody.b_start).toBe(25);
        expect(sentBody.b_size).toBe(25);
        expect(sentBody.metadata_fields).toEqual(["EffectiveDate", "image_scales"]);
        expect(sentBody.query[0].i).toBe("path");

        expect(result.items).toHaveLength(2);
        expect(result.total).toBe(42);
        expect(result.batching).toEqual({ next: "..." });
    });

    it("omits sort params when not provided", async () => {
        mockFetch({ json: { items: [], items_total: 0 } });
        await searchContents({
            contextUrl: "http://nohost/plone",
            criteria: [],
        });
        const sentBody = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect("sort_on" in sentBody).toBe(false);
        expect("sort_order" in sentBody).toBe(false);
    });
});

describe("client.request", () => {
    it("returns null for 204 No Content", async () => {
        mockFetch({ status: 204, text: "" });
        const result = await request("http://nohost/plone/item", {
            method: "DELETE",
        });
        expect(result).toBeNull();
    });

    it("throws RestapiError with status and parsed message on failure", async () => {
        mockFetch({
            status: 400,
            json: { error: { type: "BadRequest", message: "Invalid query." } },
        });
        await expect(
            request("http://nohost/plone/@querystring-search", { method: "POST", body: {} })
        ).rejects.toMatchObject({
            name: "RestapiError",
            status: 400,
            message: "Invalid query.",
        });
    });

    it("serializes body as JSON and appends array params", async () => {
        mockFetch({ json: {} });
        await request("http://nohost/plone/@search", {
            params: { metadata_fields: ["a", "b"], sort_on: "modified" },
        });
        const url = global.fetch.mock.calls[0][0];
        expect(url).toContain("metadata_fields=a");
        expect(url).toContain("metadata_fields=b");
        expect(url).toContain("sort_on=modified");
    });
});
