import { cookieStorage, type KeyValueStore } from "../utils/storage";
import type { ConfigStore } from "./ConfigStore.svelte";

// Which listing view is rendered. The batch layer (toolbar, filter, pagination,
// upload, modals) is view-independent, so switching only swaps the rendered
// component. `available` is a list so a future "miller" view (reusing
// pat-contentbrowser) slots in without reworking the switcher (see spec §20.8).

export type ViewMode = "table" | "grid";

export class ViewStore {
    config: ConfigStore;
    private storage: KeyValueStore | null;
    available: ViewMode[] = ["table", "grid"];
    mode = $state<ViewMode>("table");

    constructor(config: ConfigStore, storageKey = "pat-filemanager") {
        this.config = config;
        this.storage = storageKey ? cookieStorage(storageKey) : null;
        // Seed order: cookie → config.defaultView → "table".
        const saved = this.storage?.get("view");
        this.mode = this.isValid(saved)
            ? saved
            : this.isValid(config.defaultView)
              ? config.defaultView
              : "table";
    }

    private isValid(mode: unknown): mode is ViewMode {
        return typeof mode === "string" && this.available.includes(mode as ViewMode);
    }

    setMode(mode: ViewMode): void {
        if (!this.isValid(mode) || mode === this.mode) return;
        this.mode = mode;
        this.storage?.set("view", mode);
    }
}
