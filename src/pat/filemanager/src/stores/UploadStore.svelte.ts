import { uploadFile } from "../api/upload.js";
import type { ContentsStore } from "./ContentsStore.svelte";

// Tracks in-flight uploads for one folder view. Each picked/dropped file gets an
// entry with live progress; uploadFiles() pushes them to the current folder via
// the upload api and reloads the listing once done.

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadEntry {
    id: number;
    name: string;
    size: number;
    loaded: number;
    status: UploadStatus;
    error?: string;
}

export interface UploadResult {
    ok: number;
    failed: Array<{ name: string; error: string }>;
}

export class UploadStore {
    contents: ContentsStore;
    entries = $state<UploadEntry[]>([]);
    active = $state(false);
    private seq = 0;

    constructor(contents: ContentsStore) {
        this.contents = contents;
    }

    get totalSize(): number {
        return this.entries.reduce((sum, e) => sum + e.size, 0);
    }

    get loadedSize(): number {
        return this.entries.reduce((sum, e) => sum + e.loaded, 0);
    }

    /** Overall progress across the current entries, 0..1. */
    get progress(): number {
        const total = this.totalSize;
        return total > 0 ? this.loadedSize / total : 0;
    }

    private patch(id: number, change: Partial<UploadEntry>): void {
        this.entries = this.entries.map((e) => (e.id === id ? { ...e, ...change } : e));
    }

    /**
     * Upload the given files into the current folder, one after another, then
     * reload the listing. Per-file failures are collected rather than aborting
     * the batch.
     */
    async uploadFiles(files: File[]): Promise<UploadResult> {
        const list = Array.from(files);
        if (list.length === 0) return { ok: 0, failed: [] };

        const created: UploadEntry[] = list.map((file) => ({
            id: (this.seq += 1),
            name: file.name,
            size: file.size,
            loaded: 0,
            status: "uploading",
        }));
        this.entries = [...this.entries, ...created];
        this.active = true;

        const failed: UploadResult["failed"] = [];
        try {
            for (let i = 0; i < list.length; i++) {
                const file = list[i];
                const entry = created[i];
                try {
                    await uploadFile(this.contents.contextUrl, file, {
                        onProgress: (loaded: number) => this.patch(entry.id, { loaded }),
                    });
                    this.patch(entry.id, { status: "done", loaded: file.size });
                } catch (e) {
                    const error = (e as Error).message;
                    this.patch(entry.id, { status: "error", error });
                    failed.push({ name: file.name, error });
                }
            }
            await this.contents.load();
        } finally {
            this.active = false;
        }
        return { ok: list.length - failed.length, failed };
    }

    /** Drop finished entries, keeping any still uploading. */
    clearFinished(): void {
        this.entries = this.entries.filter((e) => e.status === "uploading");
    }

    clear(): void {
        this.entries = [];
    }
}
