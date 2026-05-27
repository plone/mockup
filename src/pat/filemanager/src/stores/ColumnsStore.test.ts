import { ConfigStore } from "./ConfigStore.svelte";
import { ColumnsStore } from "./ColumnsStore.svelte";

function makeConfig() {
    return new ConfigStore({
        contextUrl: "http://nohost/plone/folder",
        activeColumns: ["Title", "review_state", "ModificationDate"],
        availableColumns: ["image", "Title", "review_state", "ModificationDate", "Subject"],
    });
}

beforeEach(() => {
    window.localStorage.clear();
});

describe("ColumnsStore", () => {
    it("initializes active columns from config", () => {
        const store = new ColumnsStore(makeConfig(), "");
        expect(store.active).toEqual(["Title", "review_state", "ModificationDate"]);
        expect(store.inactive).toEqual(["image", "Subject"]);
    });

    it("toggle adds an inactive column and removes an active one", () => {
        const store = new ColumnsStore(makeConfig(), "");
        store.toggle("Subject");
        expect(store.active).toContain("Subject");
        store.toggle("review_state");
        expect(store.active).not.toContain("review_state");
    });

    it("refuses to hide the last visible column", () => {
        const store = new ColumnsStore(makeConfig(), "");
        store.active = ["Title"];
        store.toggle("Title");
        expect(store.active).toEqual(["Title"]);
    });

    it("ignores toggling unknown keys", () => {
        const store = new ColumnsStore(makeConfig(), "");
        store.toggle("does_not_exist");
        expect(store.active).not.toContain("does_not_exist");
    });

    it("move reorders within the active list and clamps at the edges", () => {
        const store = new ColumnsStore(makeConfig(), "");
        store.move("ModificationDate", -1);
        expect(store.active).toEqual(["Title", "ModificationDate", "review_state"]);
        store.move("Title", -1); // already first, no-op
        expect(store.active).toEqual(["Title", "ModificationDate", "review_state"]);
    });

    it("reset restores the configured active columns", () => {
        const store = new ColumnsStore(makeConfig(), "");
        store.toggle("Subject");
        store.move("Subject", -3);
        store.reset();
        expect(store.active).toEqual(["Title", "review_state", "ModificationDate"]);
    });

    it("persists to and restores from localStorage", () => {
        const first = new ColumnsStore(makeConfig(), "pat-filemanager");
        first.toggle("Subject");
        const second = new ColumnsStore(makeConfig(), "pat-filemanager");
        expect(second.active).toContain("Subject");
    });

    it("drops stale or unavailable keys when restoring", () => {
        window.localStorage.setItem(
            "pat-filemanager:activeColumns",
            JSON.stringify(["Title", "gone", "Title"])
        );
        const store = new ColumnsStore(makeConfig(), "pat-filemanager");
        expect(store.active).toEqual(["Title"]);
    });

    it("columns getter resolves keys to definitions in order", () => {
        const store = new ColumnsStore(makeConfig(), "");
        expect(store.columns.map((c) => c.key)).toEqual([
            "Title",
            "review_state",
            "ModificationDate",
        ]);
    });
});
