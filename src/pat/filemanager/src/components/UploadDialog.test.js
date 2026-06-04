import { mount, unmount, flushSync } from "svelte";
import UploadDialog from "./UploadDialog.svelte";

// Component test for the upload progress/result dialog: it shows a loading
// indicator while the file list is still being gathered, the per-file list once
// entries exist, and a close button only when the batch is no longer busy.
// Runs via the custom CJS .svelte transformer (tools/jest-svelte-component.cjs).

function makeUpload(overrides = {}) {
    return {
        entries: [],
        active: false,
        preparing: false,
        clearFinished: jest.fn(),
        get busy() {
            return this.active || this.preparing;
        },
        ...overrides,
    };
}

function render(upload) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const context = new Map([["upload", upload]]);
    const inst = mount(UploadDialog, { target, context });
    flushSync();
    return { target, inst };
}

afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
});

describe("UploadDialog", () => {
    it("shows the loading indicator while reading a dropped tree", () => {
        const { target, inst } = render(makeUpload({ preparing: true }));
        const loading = target.querySelector(".filemanager-upload-loading");
        expect(loading).not.toBeNull();
        expect(loading.querySelector("progress")).not.toBeNull();
        // No per-file list and no close button while busy.
        expect(target.querySelector(".filemanager-upload-list")).toBeNull();
        expect(target.querySelector(".filemanager-modal-close")).toBeNull();
        unmount(inst);
    });

    it("lists per-file entries with progress while uploading", () => {
        const upload = makeUpload({
            active: true,
            entries: [
                { id: 1, name: "a.txt", size: 100, loaded: 50, status: "uploading" },
                { id: 2, name: "b.txt", size: 200, loaded: 200, status: "done" },
            ],
        });
        const { target, inst } = render(upload);
        const items = target.querySelectorAll(".filemanager-upload-item");
        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain("a.txt");
        expect(items[0].querySelector("progress")).not.toBeNull();
        expect(items[1].classList.contains("is-done")).toBe(true);
        // Still busy → no close button.
        expect(target.querySelector(".filemanager-modal-close")).toBeNull();
        unmount(inst);
    });

    it("offers a close button that clears finished entries when done", () => {
        const upload = makeUpload({
            active: false,
            entries: [
                { id: 1, name: "a.txt", size: 100, loaded: 100, status: "done" },
            ],
        });
        const { target, inst } = render(upload);
        const close = target.querySelector(".filemanager-modal-close");
        expect(close).not.toBeNull();
        close.click();
        flushSync();
        expect(upload.clearFinished).toHaveBeenCalled();
        unmount(inst);
    });

    it("surfaces the per-file error message for failed entries", () => {
        const upload = makeUpload({
            active: false,
            entries: [
                { id: 1, name: "a.txt", size: 100, loaded: 0, status: "error", error: "boom" },
            ],
        });
        const { target, inst } = render(upload);
        const item = target.querySelector(".filemanager-upload-item.is-error");
        expect(item).not.toBeNull();
        expect(item.querySelector(".filemanager-upload-error").textContent).toContain("boom");
        unmount(inst);
    });
});
