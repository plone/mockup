import {
    captureDropEntries,
    entriesHaveDirectory,
    readDropManifest,
} from "./dropentries";

// Build fake FileSystemEntry objects mirroring the (non-standard) entries API.
function fileEntry(name: string, size: number) {
    return {
        isFile: true,
        isDirectory: false,
        name,
        file: (ok: (f: File) => void) => ok({ name, size } as unknown as File),
    };
}

/**
 * A directory entry whose reader returns its children in `batches` successive
 * readEntries() calls, then an empty batch — exercising the pagination drain.
 */
function dirEntry(name: string, children: unknown[], batches = 1) {
    return {
        isFile: false,
        isDirectory: true,
        name,
        createReader() {
            const chunks: unknown[][] = [];
            const per = Math.ceil(children.length / batches) || 0;
            for (let i = 0; i < children.length; i += per || 1) {
                chunks.push(children.slice(i, i + (per || 1)));
            }
            let call = 0;
            return {
                readEntries(ok: (e: unknown[]) => void) {
                    ok(chunks[call++] || []);
                },
            };
        },
    };
}

describe("dropentries", () => {
    describe("captureDropEntries", () => {
        it("maps items through webkitGetAsEntry and skips nulls", () => {
            const a = fileEntry("a.txt", 1);
            const dataTransfer = {
                items: [
                    { webkitGetAsEntry: () => a },
                    { webkitGetAsEntry: () => null },
                    {}, // no webkitGetAsEntry → ignored
                ],
            } as unknown as DataTransfer;
            expect(captureDropEntries(dataTransfer)).toEqual([a]);
        });

        it("returns [] without items or dataTransfer (no entries API)", () => {
            expect(captureDropEntries(null)).toEqual([]);
            expect(captureDropEntries({} as DataTransfer)).toEqual([]);
        });
    });

    describe("entriesHaveDirectory", () => {
        it("is true only when an entry is a directory", () => {
            expect(entriesHaveDirectory([fileEntry("a", 1)] as never)).toBe(false);
            expect(entriesHaveDirectory([dirEntry("d", [])] as never)).toBe(true);
        });
    });

    describe("readDropManifest", () => {
        it("walks a nested tree, recording dirs parents-first with file paths", async () => {
            // MyFolder/
            //   readme.txt (10)
            //   img/
            //     a.png (20)
            //     b.png (30)
            const tree = dirEntry("MyFolder", [
                fileEntry("readme.txt", 10),
                dirEntry("img", [fileEntry("a.png", 20), fileEntry("b.png", 30)]),
            ]);
            const manifest = await readDropManifest([tree] as never);

            expect(manifest.hasDirectories).toBe(true);
            expect(manifest.dirs).toEqual(["MyFolder", "MyFolder/img"]);
            expect(manifest.folderCount).toBe(2);
            expect(manifest.fileCount).toBe(3);
            expect(manifest.totalSize).toBe(60);

            const byName = Object.fromEntries(
                manifest.files.map((f) => [f.file.name, f.path.join("/")])
            );
            expect(byName["readme.txt"]).toBe("MyFolder");
            expect(byName["a.png"]).toBe("MyFolder/img");
            expect(byName["b.png"]).toBe("MyFolder/img");
        });

        it("drains a paginated directory reader fully", async () => {
            const tree = dirEntry(
                "Big",
                [fileEntry("1", 1), fileEntry("2", 1), fileEntry("3", 1)],
                3 // three readEntries() batches before the empty terminator
            );
            const manifest = await readDropManifest([tree] as never);
            expect(manifest.fileCount).toBe(3);
        });

        it("keeps loose root files at an empty path", async () => {
            const manifest = await readDropManifest([
                fileEntry("loose.txt", 5),
                dirEntry("F", [fileEntry("x", 1)]),
            ] as never);
            const loose = manifest.files.find((f) => f.file.name === "loose.txt");
            expect(loose?.path).toEqual([]);
            expect(manifest.dirs).toEqual(["F"]);
        });
    });
});
