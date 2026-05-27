import { fetchQuerystringConfig, typeOptions } from "./querystring.js";
import { request } from "./client.js";

jest.mock("./client.js", () => ({ request: jest.fn() }));

const mockedRequest = request;

beforeEach(() => {
    mockedRequest.mockReset();
});

describe("fetchQuerystringConfig", () => {
    it("GETs @querystring and returns indexes + sortable_indexes", async () => {
        mockedRequest.mockResolvedValue({
            indexes: { portal_type: { title: "Type" } },
            sortable_indexes: { sortable_title: {} },
        });
        const config = await fetchQuerystringConfig("http://nohost/plone/folder");
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/folder/@querystring");
        expect(config.indexes.portal_type.title).toBe("Type");
        expect(config.sortable_indexes.sortable_title).toEqual({});
    });

    it("falls back to empty objects on a sparse reply", async () => {
        mockedRequest.mockResolvedValue({});
        const config = await fetchQuerystringConfig("http://nohost/plone");
        expect(config.indexes).toEqual({});
        expect(config.sortable_indexes).toEqual({});
    });
});

describe("typeOptions", () => {
    it("flattens portal_type vocabulary values to value/label pairs", () => {
        const config = {
            indexes: {
                portal_type: {
                    values: {
                        Document: { title: "Page" },
                        Folder: { title: "Folder" },
                    },
                },
            },
        };
        expect(typeOptions(config)).toEqual([
            { value: "Document", label: "Page" },
            { value: "Folder", label: "Folder" },
        ]);
    });

    it("falls back to the value when a title is missing", () => {
        const config = { indexes: { portal_type: { values: { News: {} } } } };
        expect(typeOptions(config)).toEqual([{ value: "News", label: "News" }]);
    });

    it("returns an empty list when portal_type has no values", () => {
        expect(typeOptions({ indexes: {} })).toEqual([]);
        expect(typeOptions(null)).toEqual([]);
    });
});
