import {
    fetchQuerystringConfig,
    typeOptions,
    enabledIndexes,
    operatorsForIndex,
    widgetFor,
    selectionValues,
    hasValue,
} from "./querystring.js";
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

const sampleConfig = {
    indexes: {
        SearchableText: {
            title: "Text",
            group: "Text",
            enabled: true,
            operations: ["plone.app.querystring.operation.string.contains"],
            operators: {
                "plone.app.querystring.operation.string.contains": {
                    title: "Contains",
                    widget: "StringWidget",
                },
            },
        },
        portal_type: {
            title: "Type",
            group: "Metadata",
            enabled: true,
            operations: ["plone.app.querystring.operation.selection.any"],
            operators: {
                "plone.app.querystring.operation.selection.any": {
                    title: "Any of",
                    widget: "MultipleSelectionWidget",
                },
            },
            values: { Document: { title: "Page" }, Folder: {} },
        },
        sortable_title: {
            title: "Sortable Title",
            group: "Text",
            enabled: false,
            operations: ["plone.app.querystring.operation.string.is"],
            operators: {},
        },
    },
};

describe("enabledIndexes", () => {
    it("lists only enabled indexes with operations, keeping their group", () => {
        expect(enabledIndexes(sampleConfig)).toEqual([
            { value: "SearchableText", title: "Text", group: "Text" },
            { value: "portal_type", title: "Type", group: "Metadata" },
        ]);
    });

    it("returns an empty list for a missing config", () => {
        expect(enabledIndexes(null)).toEqual([]);
        expect(enabledIndexes({ indexes: {} })).toEqual([]);
    });
});

describe("operatorsForIndex", () => {
    it("maps an index's operations to value/title/widget", () => {
        expect(operatorsForIndex(sampleConfig, "SearchableText")).toEqual([
            {
                value: "plone.app.querystring.operation.string.contains",
                title: "Contains",
                widget: "StringWidget",
            },
        ]);
    });

    it("returns an empty list for an unknown index", () => {
        expect(operatorsForIndex(sampleConfig, "nope")).toEqual([]);
    });
});

describe("widgetFor", () => {
    it("resolves the value widget for an index/operation pair", () => {
        expect(
            widgetFor(sampleConfig, "portal_type", "plone.app.querystring.operation.selection.any")
        ).toBe("MultipleSelectionWidget");
    });

    it("returns null when there is no widget", () => {
        expect(widgetFor(sampleConfig, "portal_type", "nope")).toBeNull();
        expect(widgetFor(sampleConfig, "nope", "nope")).toBeNull();
    });
});

describe("selectionValues", () => {
    it("flattens an index vocabulary to value/label pairs", () => {
        expect(selectionValues(sampleConfig, "portal_type")).toEqual([
            { value: "Document", label: "Page" },
            { value: "Folder", label: "Folder" },
        ]);
    });

    it("returns an empty list when the index has no vocabulary", () => {
        expect(selectionValues(sampleConfig, "SearchableText")).toEqual([]);
    });
});

describe("hasValue", () => {
    it("treats a missing widget as always satisfied", () => {
        expect(hasValue(null, "")).toBe(true);
        expect(hasValue(null, undefined)).toBe(true);
    });

    it("requires a non-empty scalar value", () => {
        expect(hasValue("StringWidget", "")).toBe(false);
        expect(hasValue("StringWidget", "x")).toBe(true);
    });

    it("requires at least one entry for array values", () => {
        expect(hasValue("MultipleSelectionWidget", [])).toBe(false);
        expect(hasValue("DateRangeWidget", ["", ""])).toBe(false);
        expect(hasValue("MultipleSelectionWidget", ["news"])).toBe(true);
    });
});
