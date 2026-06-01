import { FolderDropStore } from "./FolderDropStore.svelte";
import type { DropManifest } from "../utils/dropentries";

const manifest = {
    files: [],
    dirs: ["F"],
    fileCount: 0,
    folderCount: 1,
    totalSize: 0,
    hasDirectories: true,
} as DropManifest;

describe("FolderDropStore", () => {
    it("opens on preview and resolves true on approve", async () => {
        const store = new FolderDropStore();
        const decision = store.preview(manifest, "Target");
        expect(store.isOpen).toBe(true);
        expect(store.targetName).toBe("Target");
        store.approve();
        expect(await decision).toBe(true);
        expect(store.isOpen).toBe(false);
    });

    it("resolves false on cancel", async () => {
        const store = new FolderDropStore();
        const decision = store.preview(manifest, "Target");
        store.cancel();
        expect(await decision).toBe(false);
        expect(store.isOpen).toBe(false);
    });

    it("supersedes a pending preview, resolving the first false", async () => {
        const store = new FolderDropStore();
        const first = store.preview(manifest, "A");
        const second = store.preview(manifest, "B");
        expect(await first).toBe(false);
        expect(store.targetName).toBe("B");
        store.approve();
        expect(await second).toBe(true);
    });
});
