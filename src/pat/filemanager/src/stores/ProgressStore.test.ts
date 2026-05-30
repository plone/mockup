import { ProgressStore } from "./ProgressStore.svelte";

describe("ProgressStore", () => {
    it("starts tasks with incrementing ids and zeroed counters", () => {
        const progress = new ProgressStore();
        const id = progress.start("Deleting…", 3);
        expect(id).toBe(1);
        expect(progress.active).toBe(true);
        expect(progress.tasks).toEqual([
            {
                id: 1,
                label: "Deleting…",
                current: 0,
                total: 3,
                surface: "status",
                targetUrl: undefined,
            },
        ]);
    });

    it("defaults total to 0 for indeterminate tasks", () => {
        const progress = new ProgressStore();
        progress.start("Copying…");
        expect(progress.tasks[0].total).toBe(0);
    });

    it("updates a task's current and total by id", () => {
        const progress = new ProgressStore();
        const id = progress.start("Deleting…", 3);
        progress.update(id, 2, 3);
        expect(progress.tasks[0]).toEqual({
            id,
            label: "Deleting…",
            current: 2,
            total: 3,
            surface: "status",
            targetUrl: undefined,
        });
    });

    it("finishes a single task by id, leaving the rest", () => {
        const progress = new ProgressStore();
        const a = progress.start("a");
        progress.start("b");
        progress.finish(a);
        expect(progress.tasks.map((t) => t.label)).toEqual(["b"]);
        expect(progress.active).toBe(true);
    });

    it("is inactive once all tasks finish", () => {
        const progress = new ProgressStore();
        const id = progress.start("a");
        progress.finish(id);
        expect(progress.active).toBe(false);
    });

    it("track() runs fn with a progress callback and clears the task afterwards", async () => {
        const progress = new ProgressStore();
        const seen: Array<[number, number]> = [];
        const result = await progress.track("Working…", async (onProgress) => {
            expect(progress.active).toBe(true);
            onProgress(1, 2);
            seen.push([progress.tasks[0].current, progress.tasks[0].total]);
            onProgress(2, 2);
            seen.push([progress.tasks[0].current, progress.tasks[0].total]);
            return "ok";
        });
        expect(result).toBe("ok");
        expect(seen).toEqual([
            [1, 2],
            [2, 2],
        ]);
        expect(progress.active).toBe(false);
    });

    it("track() clears the task even when fn throws", async () => {
        const progress = new ProgressStore();
        await expect(
            progress.track("Working…", async () => {
                throw new Error("boom");
            })
        ).rejects.toThrow("boom");
        expect(progress.active).toBe(false);
    });

    it("clears all tasks", () => {
        const progress = new ProgressStore();
        progress.start("a");
        progress.start("b");
        progress.clear();
        expect(progress.tasks).toEqual([]);
    });

    it("defaults the surface to status", () => {
        const progress = new ProgressStore();
        progress.start("a");
        expect(progress.tasks[0].surface).toBe("status");
    });

    it("partitions tasks by surface", () => {
        const progress = new ProgressStore();
        progress.start("del", 2);
        progress.start("paste", 0, { surface: "dialog" });
        progress.start("move", 0, {
            surface: "folder",
            targetUrl: "http://nohost/plone/folder",
        });
        expect(progress.statusTasks.map((t) => t.label)).toEqual(["del"]);
        expect(progress.dialogTasks.map((t) => t.label)).toEqual(["paste"]);
        expect(progress.folderTask("http://nohost/plone/folder")?.label).toBe(
            "move"
        );
        expect(progress.folderTask("http://nohost/plone/other")).toBeUndefined();
    });

    it("track() forwards surface options to the task", async () => {
        const progress = new ProgressStore();
        let surfaceWhileRunning = "";
        await progress.track(
            "Copying…",
            async () => {
                surfaceWhileRunning = progress.dialogTasks[0]?.surface ?? "";
            },
            { surface: "dialog" }
        );
        expect(surfaceWhileRunning).toBe("dialog");
        expect(progress.active).toBe(false);
    });
});
