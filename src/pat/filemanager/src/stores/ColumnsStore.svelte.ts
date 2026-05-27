import store from "@patternslib/patternslib/src/core/store";
import type { ColumnDef, ConfigStore } from "./ConfigStore.svelte";

// Reactive visible-columns state: which columns are shown and in what order.
// Initialized from ConfigStore (the pattern's active-columns option), then
// user toggles/reorders are persisted to localStorage via the patternslib
// store, replacing the legacy cookie-based column config.

export class ColumnsStore {
    config: ConfigStore;
    active = $state<string[]>([]);
    private storage: { get(name: string): unknown; set(name: string, value: unknown): void } | null;

    constructor(config: ConfigStore, storageKey = "pat-filemanager") {
        this.config = config;
        this.storage = storageKey ? store.local(storageKey) : null;

        const saved = this.storage?.get("activeColumns");
        const restored = Array.isArray(saved) ? this.sanitize(saved as string[]) : [];
        this.active = restored.length ? restored : [...config.activeColumns];
    }

    /** Keep only known, available keys and drop duplicates, preserving order. */
    private sanitize(keys: string[]): string[] {
        const seen = new Set<string>();
        return keys.filter((key) => {
            if (seen.has(key) || !this.config.availableColumns.includes(key)) return false;
            seen.add(key);
            return true;
        });
    }

    get available(): string[] {
        return this.config.availableColumns;
    }

    get inactive(): string[] {
        return this.available.filter((key) => !this.active.includes(key));
    }

    /** Active columns resolved to their definitions, in display order. */
    get columns(): ColumnDef[] {
        return this.active.map((key) => this.config.column(key));
    }

    isActive(key: string): boolean {
        return this.active.includes(key);
    }

    /** Show/hide a column. Hiding the last visible column is refused. */
    toggle(key: string): void {
        if (this.active.includes(key)) {
            if (this.active.length <= 1) return;
            this.active = this.active.filter((k) => k !== key);
        } else if (this.available.includes(key)) {
            this.active = [...this.active, key];
        }
        this.persist();
    }

    /** Shift an active column by `delta` positions (clamped to the list). */
    move(key: string, delta: number): void {
        const from = this.active.indexOf(key);
        if (from < 0) return;
        const to = from + delta;
        if (to < 0 || to >= this.active.length) return;
        const next = [...this.active];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        this.active = next;
        this.persist();
    }

    reset(): void {
        this.active = [...this.config.activeColumns];
        this.persist();
    }

    private persist(): void {
        this.storage?.set("activeColumns", this.active);
    }
}
