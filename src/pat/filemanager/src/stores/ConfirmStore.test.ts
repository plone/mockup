import { ConfirmStore } from "./ConfirmStore.svelte";

describe("ConfirmStore", () => {
    it("opens with the message/label and resolves true on confirm", async () => {
        const store = new ConfirmStore();
        const pending = store.ask("Move 2 items?", { confirmLabel: "Move" });
        expect(store.isOpen).toBe(true);
        expect(store.message).toBe("Move 2 items?");
        expect(store.confirmLabel).toBe("Move");
        store.confirm();
        await expect(pending).resolves.toBe(true);
        expect(store.isOpen).toBe(false);
    });

    it("resolves false on cancel and closes", async () => {
        const store = new ConfirmStore();
        const pending = store.ask("Sure?");
        store.cancel();
        await expect(pending).resolves.toBe(false);
        expect(store.isOpen).toBe(false);
    });

    it("supersedes a pending prompt, resolving the old one false", async () => {
        const store = new ConfirmStore();
        const first = store.ask("First?");
        const second = store.ask("Second?");
        expect(store.message).toBe("Second?");
        await expect(first).resolves.toBe(false);
        store.confirm();
        await expect(second).resolves.toBe(true);
    });

    it("carries the danger flag", () => {
        const store = new ConfirmStore();
        store.ask("Delete?", { danger: true });
        expect(store.danger).toBe(true);
    });
});
