import { UploadStore } from "./UploadStore.svelte";
import { uploadFile } from "../api/upload.js";

jest.mock("../api/upload.js", () => ({
    uploadFile: jest.fn().mockResolvedValue(null),
}));

const mockedUpload = uploadFile as jest.Mock;

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
});

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
