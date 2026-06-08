import { UploadStore } from "./UploadStore.svelte";
import { uploadFile, createFolder } from "../api/upload.js";
import type { DropManifest } from "../utils/dropentries";

jest.mock("../api/upload.js", () => ({
    uploadFile: jest.fn().mockResolvedValue(null),
    createFolder: jest.fn(),
}));

const mockedUpload = uploadFile as jest.Mock;
const mockedCreateFolder = createFolder as jest.Mock;

function makeContents() {
    return {
        contextUrl: "http://nohost/plone/folder",
        load: jest.fn().mockResolvedValue(undefined),
    };
}

function makeFile(name: string, size: number, type = "text/plain") {
    return { name, size, type } as unknown as File;
}

beforeEach(() => {
    mockedUpload.mockReset();
    mockedUpload.mockResolvedValue(null);
    mockedCreateFolder.mockReset();
    // Default: echo a created folder url derived from parent + title.
    mockedCreateFolder.mockImplementation((parent: string, { title }) =>
        Promise.resolve({ "@id": `${parent}/${title}` })
    );
});

function makeManifest(files: DropManifest["files"], dirs: string[]): DropManifest {
    return {
        files,
        dirs,
        fileCount: files.length,
        folderCount: dirs.length,
        totalSize: files.reduce((s, f) => s + f.file.size, 0),
        hasDirectories: dirs.length > 0,
    };
}

describe("UploadStore", () => {
    it("uploads each file to the current folder and reloads", async () => {
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        const result = await store.uploadFiles([
            makeFile("a.txt", 10),
            makeFile("b.txt", 20),
        ]);

        expect(mockedUpload).toHaveBeenCalledTimes(2);
        expect(mockedUpload.mock.calls[0][0]).toBe("http://nohost/plone/folder");
        expect(mockedUpload.mock.calls[0][1].name).toBe("a.txt");
        expect(contents.load).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ ok: 2, failed: [] });
        expect(store.active).toBe(false);
        expect(store.entries.every((e) => e.status === "done")).toBe(true);
    });

    it("uploads into a given target folder instead of the current one", async () => {
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        await store.uploadFiles(
            [makeFile("a.txt", 10)],
            "http://nohost/plone/folder/sub"
        );
        expect(mockedUpload.mock.calls[0][0]).toBe("http://nohost/plone/folder/sub");
        expect(contents.load).toHaveBeenCalledTimes(1);
    });

    it("records per-file failures without aborting the batch", async () => {
        mockedUpload
            .mockRejectedValueOnce(new Error("boom"))
            .mockResolvedValueOnce(null);
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        const result = await store.uploadFiles([
            makeFile("bad.txt", 5),
            makeFile("good.txt", 5),
        ]);

        expect(result.ok).toBe(1);
        expect(result.failed).toEqual([{ name: "bad.txt", error: "boom" }]);
        expect(store.entries.find((e) => e.name === "bad.txt")?.status).toBe("error");
        expect(store.entries.find((e) => e.name === "good.txt")?.status).toBe("done");
        // a failed upload still triggers a reload
        expect(contents.load).toHaveBeenCalledTimes(1);
    });

    it("tracks progress per entry via the onProgress callback", async () => {
        mockedUpload.mockImplementation((_url, file, opts) => {
            opts.onProgress(file.size);
            return Promise.resolve(null);
        });
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        await store.uploadFiles([makeFile("a.txt", 42)]);
        expect(store.entries[0].loaded).toBe(42);
        expect(store.progress).toBe(1);
    });

    it("does nothing for an empty file list", async () => {
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        const result = await store.uploadFiles([]);
        expect(result).toEqual({ ok: 0, failed: [] });
        expect(mockedUpload).not.toHaveBeenCalled();
        expect(contents.load).not.toHaveBeenCalled();
    });

    it("clearFinished keeps only still-uploading entries", async () => {
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        await store.uploadFiles([makeFile("a.txt", 5)]);
        expect(store.entries).toHaveLength(1);
        store.clearFinished();
        expect(store.entries).toHaveLength(0);
    });
});

describe("UploadStore.uploadTree", () => {
    it("creates folders parents-first and uploads files into them", async () => {
        const contents = makeContents();
        const store = new UploadStore(contents as never);
        const target = "http://nohost/plone/folder";
        const manifest = makeManifest(
            [
                { path: ["MyFolder"], file: makeFile("readme.txt", 10) },
                { path: ["MyFolder", "img"], file: makeFile("a.png", 20) },
            ],
            ["MyFolder", "MyFolder/img"]
        );

        const result = await store.uploadTree(target, manifest);

        // Folders created parents-first, each under its mapped parent url.
        expect(mockedCreateFolder).toHaveBeenCalledTimes(2);
        expect(mockedCreateFolder.mock.calls[0][0]).toBe(target);
        expect(mockedCreateFolder.mock.calls[0][1]).toEqual({
            title: "MyFolder",
            type: "Folder",
        });
        expect(mockedCreateFolder.mock.calls[1][0]).toBe(`${target}/MyFolder`);

        // Files uploaded into their recreated folder urls.
        expect(mockedUpload.mock.calls[0][0]).toBe(`${target}/MyFolder`);
        expect(mockedUpload.mock.calls[1][0]).toBe(`${target}/MyFolder/img`);

        expect(contents.load).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ ok: 4, failed: [] });
        expect(store.active).toBe(false);
    });

    it("passes a custom folder type through to createFolder", async () => {
        const store = new UploadStore(makeContents() as never);
        const manifest = makeManifest([], ["F"]);
        await store.uploadTree("http://nohost/plone/folder", manifest, "myfolder");
        expect(mockedCreateFolder.mock.calls[0][1].type).toBe("myfolder");
    });

    it("orphans descendants when a folder fails, without aborting the batch", async () => {
        // "MyFolder" fails to create → its child folder and files can't be placed.
        mockedCreateFolder.mockImplementation((parent: string, { title }) => {
            if (title === "MyFolder") return Promise.reject(new Error("boom"));
            return Promise.resolve({ "@id": `${parent}/${title}` });
        });
        const store = new UploadStore(makeContents() as never);
        const manifest = makeManifest(
            [{ path: ["MyFolder"], file: makeFile("readme.txt", 10) }],
            ["MyFolder", "MyFolder/img"]
        );

        const result = await store.uploadTree("http://nohost/plone/folder", manifest);

        // No file upload attempted (its folder never existed).
        expect(mockedUpload).not.toHaveBeenCalled();
        // Both the failed folder, its orphaned child folder, and the file fail.
        expect(result.ok).toBe(0);
        expect(result.failed).toHaveLength(3);
        // The failure still surfaced as error entries in the progress panel.
        expect(store.entries.some((e) => e.status === "error")).toBe(true);
    });
});
