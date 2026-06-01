// Reading dropped OS folders from a native drop event.
//
// `event.dataTransfer.files` is a flat FileList that silently omits any dropped
// directories. To recreate a dropped folder tree we instead read
// `dataTransfer.items` through the (non-standard but universally shipped)
// `DataTransferItem.webkitGetAsEntry()` API, which yields FileSystemEntry
// objects we can walk recursively. The capture must happen synchronously during
// the drop event (the items list is only live then); the returned entry objects
// stay valid for the async walk afterwards.

/** One file found in the drop, with its folder path relative to the drop root. */
export interface DroppedFile {
    /** Folder segments, e.g. ["MyFolder", "img"]; empty for a loose root file. */
    path: string[];
    file: File;
}

/** The full picture of a folder drop: what to create and what to upload. */
export interface DropManifest {
    files: DroppedFile[];
    /** Relative folder paths ("MyFolder", "MyFolder/img"), parents before children. */
    dirs: string[];
    fileCount: number;
    folderCount: number;
    totalSize: number;
    /** True when the drop contained at least one directory. */
    hasDirectories: boolean;
}

// Minimal structural types for the entries API (lib.dom's typings vary across
// TS versions, so we describe just what we use rather than rely on globals).
interface FsEntry {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
}
interface FsFileEntry extends FsEntry {
    file(success: (file: File) => void, error?: (err: unknown) => void): void;
}
interface FsDirectoryEntry extends FsEntry {
    createReader(): FsDirectoryReader;
}
interface FsDirectoryReader {
    readEntries(success: (entries: FsEntry[]) => void, error?: (err: unknown) => void): void;
}

/**
 * Synchronously capture the top-level FileSystemEntry objects from a drop.
 * Call this from the drop handler's synchronous prefix — `dataTransfer.items`
 * is only readable while the event is being dispatched. Returns [] in browsers
 * without the entries API, so callers fall back to the flat-file path.
 */
export function captureDropEntries(dataTransfer: DataTransfer | null): FsEntry[] {
    const items = dataTransfer?.items;
    if (!items) return [];
    const entries: FsEntry[] = [];
    for (const item of Array.from(items)) {
        // webkitGetAsEntry is non-standard; guard its presence.
        const get = (item as DataTransferItem & {
            webkitGetAsEntry?: () => FsEntry | null;
        }).webkitGetAsEntry;
        const entry = get ? get.call(item) : null;
        if (entry) entries.push(entry);
    }
    return entries;
}

/** Whether any captured top-level entry is a directory (→ folder-drop flow). */
export function entriesHaveDirectory(entries: FsEntry[]): boolean {
    return entries.some((e) => e?.isDirectory);
}

/** Promisified FileSystemFileEntry.file(). */
function readFile(entry: FsFileEntry): Promise<File> {
    return new Promise((resolve, reject) => entry.file(resolve, reject));
}

/**
 * Read all children of a directory entry. The DirectoryReader is paginated:
 * each readEntries() returns a batch (often 100), and an empty batch signals the
 * end — so we keep calling until it drains.
 */
async function readDir(entry: FsDirectoryEntry): Promise<FsEntry[]> {
    const reader = entry.createReader();
    const all: FsEntry[] = [];
    for (;;) {
        const batch = await new Promise<FsEntry[]>((resolve, reject) =>
            reader.readEntries(resolve, reject)
        );
        if (batch.length === 0) break;
        all.push(...batch);
    }
    return all;
}

/**
 * Walk the captured entries into a DropManifest: every nested file (with its
 * relative folder path) plus every folder to create, parents-before-children.
 */
export async function readDropManifest(entries: FsEntry[]): Promise<DropManifest> {
    const files: DroppedFile[] = [];
    const dirs: string[] = [];
    const seenDirs = new Set<string>();
    let totalSize = 0;
    const hasDirectories = entriesHaveDirectory(entries);

    async function walk(entry: FsEntry, prefix: string[]): Promise<void> {
        if (entry.isFile) {
            const file = await readFile(entry as FsFileEntry);
            files.push({ path: prefix, file });
            totalSize += file.size || 0;
            return;
        }
        if (entry.isDirectory) {
            const dirPath = [...prefix, entry.name];
            const key = dirPath.join("/");
            // Record the folder before descending → parents land before children.
            if (!seenDirs.has(key)) {
                seenDirs.add(key);
                dirs.push(key);
            }
            const children = await readDir(entry as FsDirectoryEntry);
            for (const child of children) await walk(child, dirPath);
        }
    }

    for (const entry of entries) await walk(entry, []);

    return {
        files,
        dirs,
        fileCount: files.length,
        folderCount: dirs.length,
        totalSize,
        hasDirectories,
    };
}
