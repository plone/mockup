import { cookieStorage, type KeyValueStore } from "../utils/storage";
import type { ConfigStore } from "./ConfigStore.svelte";

// Which listing view is rendered. The batch layer (toolbar, filter, pagination,
// upload, modals) is view-independent, so switching only swaps the rendered
// component. `available` is a list so a future "miller" view (reusing
// pat-contentbrowser) slots in without reworking the switcher (see spec §20.8).

export type ViewMode = "table" | "grid";

// Grid image scale: five discrete stages driven by the size slider. The values
// double as the CSS class suffix (`.grid-size-xs|s|m|l|xl`) that picks the card
// min-width, so the slider stays pure presentation with no inline styles.
export type GridScale = "xs" | "s" | "m" | "l" | "xl";

export class ViewStore {
    config: ConfigStore;
    private storage: KeyValueStore | null;
    available: ViewMode[] = ["table", "grid"];
    scales: GridScale[] = ["xs", "s", "m", "l", "xl"];
    mode = $state<ViewMode>("table");
    gridScale = $state<GridScale>("m");

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
        // Grid scale is a pure cookie preference (medium by default).
        const savedScale = this.storage?.get("gridScale");
        if (this.isScale(savedScale)) this.gridScale = savedScale;
    }

    private isValid(mode: unknown): mode is ViewMode {
        return typeof mode === "string" && this.available.includes(mode as ViewMode);
    }

    private isScale(scale: unknown): scale is GridScale {
        return typeof scale === "string" && this.scales.includes(scale as GridScale);
    }

    setMode(mode: ViewMode): void {
        if (!this.isValid(mode) || mode === this.mode) return;
        this.mode = mode;
        this.storage?.set("view", mode);
    }

    setGridScale(scale: GridScale): void {
        if (!this.isScale(scale) || scale === this.gridScale) return;
        this.gridScale = scale;
        this.storage?.set("gridScale", scale);
    }
}
