import Cookies from "js-cookie";
import { ConfigStore } from "./ConfigStore.svelte";
import { ViewStore } from "./ViewStore.svelte";

function makeConfig(defaultView?: string) {
    return new ConfigStore({
        contextUrl: "http://nohost/plone/folder",
        defaultView,
    });
}

beforeEach(() => {
    for (const name of Object.keys(Cookies.get())) {
        Cookies.remove(name, { path: "/" });
    }
});

describe("ViewStore", () => {
    it("defaults to the table view", () => {
        const store = new ViewStore(makeConfig(), "");
        expect(store.mode).toBe("table");
        expect(store.available).toEqual(["table", "grid"]);
    });

    it("seeds the mode from config.defaultView", () => {
        const store = new ViewStore(makeConfig("grid"), "");
        expect(store.mode).toBe("grid");
    });

    it("ignores an invalid config.defaultView", () => {
        const store = new ViewStore(makeConfig("bogus"), "");
        expect(store.mode).toBe("table");
    });

    it("setMode switches and ignores unknown modes", () => {
        const store = new ViewStore(makeConfig(), "");
        store.setMode("grid");
        expect(store.mode).toBe("grid");
        store.setMode("bogus" as never);
        expect(store.mode).toBe("grid");
    });

    it("persists to and restores from a cookie", () => {
        const first = new ViewStore(makeConfig(), "pat-filemanager");
        first.setMode("grid");
        const second = new ViewStore(makeConfig(), "pat-filemanager");
        expect(second.mode).toBe("grid");
    });

    it("cookie takes precedence over config.defaultView", () => {
        const first = new ViewStore(makeConfig(), "pat-filemanager");
        first.setMode("grid");
        const second = new ViewStore(makeConfig("table"), "pat-filemanager");
        expect(second.mode).toBe("grid");
    });

    it("ignores a stale or invalid cookie value", () => {
        Cookies.set("pat-filemanager:view", JSON.stringify("bogus"), { path: "/" });
        const store = new ViewStore(makeConfig(), "pat-filemanager");
        expect(store.mode).toBe("table");
    });

    it("defaults the grid scale to medium", () => {
        const store = new ViewStore(makeConfig(), "");
        expect(store.gridScale).toBe("m");
        expect(store.scales).toEqual(["xs", "s", "m", "l", "xl"]);
    });

    it("setGridScale switches and ignores unknown scales", () => {
        const store = new ViewStore(makeConfig(), "");
        store.setGridScale("xl");
        expect(store.gridScale).toBe("xl");
        store.setGridScale("huge" as never);
        expect(store.gridScale).toBe("xl");
    });

    it("persists and restores the grid scale from a cookie", () => {
        const first = new ViewStore(makeConfig(), "pat-filemanager");
        first.setGridScale("xs");
        const second = new ViewStore(makeConfig(), "pat-filemanager");
        expect(second.gridScale).toBe("xs");
    });

    it("ignores a stale or invalid grid-scale cookie value", () => {
        Cookies.set("pat-filemanager:gridScale", JSON.stringify("huge"), { path: "/" });
        const store = new ViewStore(makeConfig(), "pat-filemanager");
        expect(store.gridScale).toBe("m");
    });
});
