// Tracks long-running batch operations (copy/move/delete/workflow/tags/…) so
// the UI can show a progress indicator. Each operation is a task with a label
// and current/total counters; when total is 0 the bar renders indeterminate
// (single-request, server-side operations like @copy/@move where the client
// can't see per-item progress), otherwise it fills as items are processed.
//
// A task's `surface` decides *where* it shows: "status" in the status panel
// (the default — delete/workflow/tags/properties/rename), "dialog" in a
// self-closing modal (copy/paste), or "folder" as a busy overlay on the
// drop-target folder (drag-into-folder), keyed by `targetUrl`.

export type ProgressSurface = "status" | "dialog" | "folder";

export interface ProgressTask {
    id: number;
    label: string;
    current: number;
    total: number;
    surface: ProgressSurface;
    /** The folder url a "folder"-surface task is moving items into. */
    targetUrl?: string;
}

export interface ProgressOptions {
    surface?: ProgressSurface;
    targetUrl?: string;
}

/** Reports progress of a batch operation: items processed so far / total. */
export type ProgressFn = (current: number, total: number) => void;

export class ProgressStore {
    tasks = $state<ProgressTask[]>([]);
    private seq = 0;

    get active(): boolean {
        return this.tasks.length > 0;
    }

    /** Tasks shown in the status panel (the default surface). */
    get statusTasks(): ProgressTask[] {
        return this.tasks.filter((t) => t.surface === "status");
    }

    /** Tasks shown in the self-closing progress dialog (copy/paste). */
    get dialogTasks(): ProgressTask[] {
        return this.tasks.filter((t) => t.surface === "dialog");
    }

    /** The folder-surface task moving into `url`, if any (drag-into-folder). */
    folderTask(url: string): ProgressTask | undefined {
        return this.tasks.find((t) => t.surface === "folder" && t.targetUrl === url);
    }

    start(label: string, total = 0, opts: ProgressOptions = {}): number {
        const id = (this.seq += 1);
        this.tasks = [
            ...this.tasks,
            {
                id,
                label,
                current: 0,
                total,
                surface: opts.surface ?? "status",
                targetUrl: opts.targetUrl,
            },
        ];
        return id;
    }

    update(id: number, current: number, total: number): void {
        this.tasks = this.tasks.map((t) =>
            t.id === id ? { ...t, current, total } : t
        );
    }

    finish(id: number): void {
        this.tasks = this.tasks.filter((t) => t.id !== id);
    }

    /**
     * Run a long operation as a tracked task: start a task labelled `label`,
     * hand `fn` an `onProgress(current, total)` callback to report step counts,
     * and remove the task once the operation settles (success or error). `opts`
     * picks the surface (status panel / dialog / folder overlay).
     */
    async track<T>(
        label: string,
        fn: (onProgress: ProgressFn) => Promise<T>,
        opts: ProgressOptions = {}
    ): Promise<T> {
        const id = this.start(label, 0, opts);
        try {
            return await fn((current, total) => this.update(id, current, total));
        } finally {
            this.finish(id);
        }
    }

    clear(): void {
        this.tasks = [];
    }
}
