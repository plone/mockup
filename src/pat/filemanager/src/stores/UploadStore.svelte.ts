import { createFolder, uploadFile } from "../api/upload.js";
import type { ContentsStore } from "./ContentsStore.svelte";
import type { DropManifest } from "../utils/dropentries";

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
     * Upload the given files, one after another, then reload the listing.
     * Per-file failures are collected rather than aborting the batch. Targets
     * the current folder unless `targetUrl` names another container — e.g. a
     * subfolder the files were dropped directly onto.
     */
    async uploadFiles(files: File[], targetUrl?: string): Promise<UploadResult> {
        const list = Array.from(files);
        if (list.length === 0) return { ok: 0, failed: [] };
        const folderUrl = targetUrl ?? this.contents.contextUrl;

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
                    await uploadFile(folderUrl, file, {
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

    /**
     * Recreate a dropped folder tree under `targetUrl` and upload its files.
     * Folders are created parents-first (`manifest.dirs` is already ordered) and
     * each created container's real `@id` is mapped by its relative path, so a
     * Plone-normalised id never breaks the mapping of children. Files then
     * upload into their mapped folder url, reusing the same per-file `entries`
     * progress UI as `uploadFiles`. Folder-create failures surface as error
     * entries and orphan their descendants (those files error out too) without
     * aborting the rest of the batch. The listing reloads once at the end.
     */
    async uploadTree(
        targetUrl: string,
        manifest: DropManifest,
        folderType = "Folder"
    ): Promise<UploadResult> {
        const failed: UploadResult["failed"] = [];
        const urlByPath = new Map<string, string>([["", targetUrl]]);
        this.active = true;
        try {
            // 1. Recreate the folder structure, parents before children.
            for (const dir of manifest.dirs) {
                const segs = dir.split("/");
                const name = segs[segs.length - 1];
                const parentUrl = urlByPath.get(segs.slice(0, -1).join("/"));
                if (!parentUrl) {
                    // Parent folder failed earlier → can't place this one either.
                    this.pushError(dir, `Parent folder for "${dir}" was not created`);
                    failed.push({
                        name: dir,
                        error: `Parent folder for "${dir}" was not created`,
                    });
                    continue;
                }
                try {
                    const created = await createFolder(parentUrl, {
                        title: name,
                        type: folderType,
                    });
                    urlByPath.set(dir, created["@id"]);
                } catch (e) {
                    const error = (e as Error).message;
                    this.pushError(dir, error);
                    failed.push({ name: dir, error });
                }
            }

            // 2. Upload each file into its (recreated) folder.
            const created: UploadEntry[] = manifest.files.map((df) => ({
                id: (this.seq += 1),
                name: df.path.length ? `${df.path.join("/")}/${df.file.name}` : df.file.name,
                size: df.file.size,
                loaded: 0,
                status: "uploading",
            }));
            this.entries = [...this.entries, ...created];

            for (let i = 0; i < manifest.files.length; i++) {
                const { path, file } = manifest.files[i];
                const entry = created[i];
                const folderUrl = urlByPath.get(path.join("/"));
                if (!folderUrl) {
                    const error = `Folder "${path.join("/")}" was not created`;
                    this.patch(entry.id, { status: "error", error });
                    failed.push({ name: entry.name, error });
                    continue;
                }
                try {
                    await uploadFile(folderUrl, file, {
                        onProgress: (loaded: number) => this.patch(entry.id, { loaded }),
                    });
                    this.patch(entry.id, { status: "done", loaded: file.size });
                } catch (e) {
                    const error = (e as Error).message;
                    this.patch(entry.id, { status: "error", error });
                    failed.push({ name: entry.name, error });
                }
            }
            await this.contents.load();
        } finally {
            this.active = false;
        }
        const total = manifest.dirs.length + manifest.files.length;
        return { ok: total - failed.length, failed };
    }

    /** Record a failed folder creation as an error entry in the progress panel. */
    private pushError(name: string, error: string): void {
        this.entries = [
            ...this.entries,
            { id: (this.seq += 1), name, size: 0, loaded: 0, status: "error", error },
        ];
    }

    /** Drop finished entries, keeping any still uploading. */
    clearFinished(): void {
        this.entries = this.entries.filter((e) => e.status === "uploading");
    }

    clear(): void {
        this.entries = [];
    }
}
