import type { ContentsStore, ContentItem } from "./ContentsStore.svelte";

// Tracks which items are selected for batch actions. Two modes:
//  - "page": individually toggled / whole-page checkbox (only loaded items)
//  - "all":  everything matching the current query, gathered by a paged
//            UID-only sweep (like the legacy selectAll) so actions can span
//            pages without loading every batch into the table.

export interface SelectedItem {
    uid: string;
    url: string;
    id: string;
    title: string;
    isFolderish: boolean;
    subjects: string[];
}

export function toSelected(item: ContentItem): SelectedItem {
    const url = item["@id"];
    const id = url.split(/[?#]/)[0].replace(/\/+$/, "").split("/").pop() || "";
    return {
        uid: (item.UID as string) || url,
        url,
        id,
        title: (item.Title as string) || id,
        isFolderish: Boolean(item.is_folderish),
        subjects: Array.isArray(item.Subject) ? (item.Subject as string[]) : [],
    };
}

export class SelectionStore {
    contents: ContentsStore;
    selected = $state<Record<string, SelectedItem>>({});
    mode = $state<"page" | "all">("page");
    sweeping = $state(false);

    constructor(contents: ContentsStore) {
        this.contents = contents;
    }

    get count(): number {
        return Object.keys(this.selected).length;
    }

    get isEmpty(): boolean {
        return this.count === 0;
    }

    get items(): SelectedItem[] {
        return Object.values(this.selected);
    }

    get urls(): string[] {
        return this.items.map((it) => it.url);
    }

    private keyOf(item: ContentItem): string {
        return (item.UID as string) || item["@id"];
    }

    isSelected(item: ContentItem): boolean {
        return this.keyOf(item) in this.selected;
    }

    /** Are all of the given (page) items currently selected? */
    allSelected(items: ContentItem[]): boolean {
        return items.length > 0 && items.every((it) => this.keyOf(it) in this.selected);
    }

    /** Toggle one item; reverts an "all-in-query" selection to page mode. */
    toggle(item: ContentItem): void {
        const sel = toSelected(item);
        const next = { ...this.selected };
        if (sel.uid in next) {
            delete next[sel.uid];
        } else {
            next[sel.uid] = sel;
        }
        this.selected = next;
        this.mode = "page";
    }

    /** Select or deselect every item on the current page. */
    setPage(items: ContentItem[], checked: boolean): void {
        const next = { ...this.selected };
        for (const it of items) {
            const sel = toSelected(it);
            if (checked) next[sel.uid] = sel;
            else delete next[sel.uid];
        }
        this.selected = next;
        this.mode = "page";
    }

    /** Sweep the whole query (all pages) and select every match. */
    async selectAllInQuery(): Promise<void> {
        this.sweeping = true;
        try {
            const items = await this.contents.fetchAllMatching([
                "UID",
                "is_folderish",
                "Title",
                "Subject",
            ]);
            const next: Record<string, SelectedItem> = {};
            for (const it of items) {
                const sel = toSelected(it);
                next[sel.uid] = sel;
            }
            this.selected = next;
            this.mode = "all";
        } finally {
            this.sweeping = false;
        }
    }

    clear(): void {
        this.selected = {};
        this.mode = "page";
    }
}
