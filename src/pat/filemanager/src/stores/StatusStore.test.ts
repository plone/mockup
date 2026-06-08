import { StatusStore } from "./StatusStore.svelte";

describe("StatusStore", () => {
    it("adds messages with incrementing ids and the given kind", () => {
        const status = new StatusStore();
        status.success("done");
        status.error("oops");
        expect(status.messages).toEqual([
            { id: 1, kind: "success", text: "done" },
            { id: 2, kind: "error", text: "oops" },
        ]);
    });

    it("dismisses a single message by id", () => {
        const status = new StatusStore();
        status.info("a");
        status.warning("b");
        status.dismiss(1);
        expect(status.messages).toEqual([{ id: 2, kind: "warning", text: "b" }]);
    });

    it("clears all messages", () => {
        const status = new StatusStore();
        status.info("a");
        status.info("b");
        status.clear();
        expect(status.messages).toEqual([]);
    });
});
