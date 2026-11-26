import { get, writable } from "svelte/store";
import utils from "@patternslib/patternslib/src/core/utils";
import contentStore from "./src/ContentStore";
import { request } from "./src/utils";
import {
    item,
    mockVocabulary,
    mountField,
    openBrowser,
    setupBrowserTests,
    waitFor,
} from "./test-helpers";

jest.mock("./src/utils", () => ({
    ...jest.requireActual("./src/utils"),
    request: jest.fn(),
}));

describe("Content Browser search results", () => {
    const pageSize = 2;
    const total = 5;
    let store;

    const uids = () => get(store)[0].results.map((it) => it.UID);

    beforeEach(() => {
        // Each page has its own items: "<search term>-<page>-<number>".
        request.mockImplementation(async ({ page = 1, searchTerm = "" }) => ({
            total: total,
            results: [1, 2].map((number) => ({
                UID: `${searchTerm}-${page}-${number}`,
            })),
        }));
        store = contentStore(
            { mode: "search", rootPath: "/plone", pageSize, selectableTypes: [] },
            writable({}),
        );
    });

    afterEach(() => {
        request.mockReset();
    });

    it("loads the first page again instead of appending it", async () => {
        // The browser asks for the first page each time it is opened.
        await store.get({ path: "/plone" });
        await store.get({ path: "/plone" });
        expect(uids()).toEqual(["-1-1", "-1-2"]);
    });

    it("starts over for the same search term", async () => {
        await store.get({ searchTerm: "one" });
        await store.get({ searchTerm: "one", page: 2 });
        await store.get({ searchTerm: "one" });
        expect(uids()).toEqual(["*one*-1-1", "*one*-1-2"]);
        expect(get(store)[0].page).toBe(1);
    });

    it("appends the next page", async () => {
        await store.get({});
        await store.get({ page: 2 });
        expect(uids()).toEqual(["-1-1", "-1-2", "-2-1", "-2-2"]);
        expect(get(store)[0].load_more).toBe(true);

        await store.get({ page: 3 });
        expect(uids().length).toBe(6);
        expect(get(store)[0].load_more).toBe(false);
    });

    it("does not append a page twice", async () => {
        await store.get({});
        await store.get({ page: 2 });
        request.mockClear();
        await store.get({ page: 2 });
        expect(uids()).toEqual(["-1-1", "-1-2", "-2-1", "-2-2"]);
        expect(request).not.toHaveBeenCalled();
    });

    it("does not append a page twice when it is asked for at the same time", async () => {
        await store.get({});
        await Promise.all([store.get({ page: 2 }), store.get({ page: 2 })]);
        expect(uids()).toEqual(["-1-1", "-1-2", "-2-1", "-2-2"]);
    });

    it("does not append a page of another search", async () => {
        await store.get({ searchTerm: "one" });
        await store.get({ searchTerm: "two", page: 2 });
        expect(uids()).toEqual(["*one*-1-1", "*one*-1-2"]);
    });
});

describe("Content Browser in search mode", () => {
    setupBrowserTests();

    const items = () => document.querySelectorAll(".content-browser .contentItem");

    beforeEach(() => {
        // The store of the browser loads for real here.
        request.mockImplementation(jest.requireActual("./src/utils").request);
    });

    it("lists its items once when it is opened again", async () => {
        mockVocabulary([item("one"), item("two")]);
        await mountField("", { mode: "search" });

        await openBrowser();
        await waitFor(".content-browser .contentItem");
        expect(items().length).toBe(2);

        const requests = () => global.fetch.mock.calls.length;
        const opened = requests();

        document
            .querySelector(".content-browser input[name=filter]")
            .dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
            );
        await utils.timeout(20);
        // closing does not load the items again
        expect(requests()).toBe(opened);

        // jsdom does not finish the transition which removes the browser,
        // so wait for the request of the second opening instead.
        await openBrowser();
        await waitFor(() => requests() > opened);
        await utils.timeout(20);
        expect(requests()).toBe(opened + 1);
        expect(items().length).toBe(2);
    });
});
