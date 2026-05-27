import jQuery from "jquery";
import { buildCriteria, buildSubtreeCriteria, searchContents } from "../api/contents.js";
import {
    pasteItems,
    deleteItems,
    moveItem,
    setDefaultPage,
    patchItem,
} from "../api/operations.js";
import { transitionItem } from "../api/workflow.js";
import { cookieStorage, type KeyValueStore } from "../utils/storage";
import type { ConfigStore } from "./ConfigStore.svelte";

/** Minimal shape the batch actions need from a selected item. */
export interface BatchItem {
    url: string;
    title: string;
    isFolderish: boolean;
    subjects?: string[];
}

/** Outcome of a batch operation: how many succeeded and which items failed. */
export interface BatchResult {
    ok: number;
    failed: Array<{ title: string; error: string }>;
}

// Reactive listing state for one folder view. Sorting and batching are pushed
// to the catalog (via @querystring-search), so a column sort re-queries and
// orders the whole result set rather than only the current page.

export interface ContentItem {
    "@id": string;
    UID?: string;
    Title?: string;
    portal_type?: string;
    review_state?: string;
    is_folderish?: boolean;
    image_scales?: Record<string, unknown>;
    [key: string]: unknown;
}

export class ContentsStore {
    config: ConfigStore;
    private storage: KeyValueStore | null;

    items = $state<ContentItem[]>([]);
    total = $state(0);
    loading = $state(false);
    error = $state<Error | null>(null);

    // The folder currently being browsed. Seeded from config but mutable, so
    // drilling into a subfolder (or clicking a breadcrumb) re-points every
    // restapi call without remounting the pattern.
    contextUrl = $state("");
    contextPath = $state("");

    bStart = $state(0);
    bSize = $state(25);
    sortOn = $state("getObjPositionInParent");
    sortOrder = $state<"ascending" | "descending">("ascending");

    searchableText = $state("");
    selectedTypes = $state<string[]>([]);

    constructor(config: ConfigStore, storageKey = "pat-filemanager") {
        this.config = config;
        this.storage = storageKey ? cookieStorage(storageKey) : null;
        this.contextUrl = config.contextUrl;
        this.contextPath = config.contextPath;
        const savedSize = this.storage?.get("batchSize");
        this.bSize =
            typeof savedSize === "number" && savedSize > 0
                ? savedSize
                : config.defaultBatchSize;
        this.sortOn = config.sortOn;
        this.sortOrder = config.sortOrder;
    }

    /**
     * Browse into another folder (or breadcrumb ancestor) without leaving the
     * SPA: re-point the location, drop filters/paging that were scoped to the
     * old folder, and reload. The caller is responsible for clearing any
     * cross-folder selection (selection state lives in SelectionStore).
     */
    navigateTo(url: string): Promise<void> {
        const clean = url.split(/[?#]/)[0].replace(/\/+$/, "");
        this.contextUrl = clean;
        this.contextPath = new URL(clean, this.config.contextUrl).pathname.replace(
            /\/+$/,
            ""
        );
        this.searchableText = "";
        this.selectedTypes = [];
        this.bStart = 0;
        // Tell the Plone toolbar to re-render for the new context, the same way
        // pat-structure does it (toolbar.js listens on body for this event and
        // appends the portal-root-relative path to data-portal-url).
        const portalUrl = this.config.portalUrl;
        const toolbarPath = clean.startsWith(portalUrl)
            ? clean.slice(portalUrl.length)
            : new URL(clean, this.config.contextUrl).pathname.replace(/\/+$/, "");
        jQuery("body").trigger("structure-url-changed", [toolbarPath]);
        return this.load();
    }

    get currentPage(): number {
        return Math.floor(this.bStart / this.bSize) + 1;
    }

    get pageCount(): number {
        return Math.max(1, Math.ceil(this.total / this.bSize));
    }

    get hasActiveFilters(): boolean {
        return this.searchableText.trim().length > 0 || this.selectedTypes.length > 0;
    }

    /** The querystring criteria for the current filter state. */
    private buildQuery(): ReturnType<typeof buildCriteria> {
        const portalTypes = this.selectedTypes.length
            ? this.selectedTypes
            : this.config.portalTypes;
        return buildCriteria({
            path: this.contextPath,
            portalTypes,
            searchableText: this.searchableText.trim(),
            searchIndex: this.config.searchIndex,
        });
    }

    async load({ silent = false }: { silent?: boolean } = {}): Promise<void> {
        // A silent reload reconciles with the server without flipping `loading`,
        // which would swap the listing for the "Loading…" placeholder and tear
        // down the keyed rows — killing the row reorder (flip) animation.
        if (!silent) this.loading = true;
        this.error = null;
        try {
            const criteria = this.buildQuery();
            const { items, total } = await searchContents({
                contextUrl: this.contextUrl,
                criteria,
                sortOn: this.sortOn,
                sortOrder: this.sortOrder,
                bStart: this.bStart,
                bSize: this.bSize,
            });
            this.items = items as ContentItem[];
            this.total = total;
        } catch (e) {
            this.error = e as Error;
            this.items = [];
            this.total = 0;
        } finally {
            if (!silent) this.loading = false;
        }
    }

    /** Toggle/ set the sort column and reload from the first page. */
    sortBy(sortIndex: string): Promise<void> {
        if (this.sortOn === sortIndex) {
            this.sortOrder = this.sortOrder === "ascending" ? "descending" : "ascending";
        } else {
            this.sortOn = sortIndex;
            this.sortOrder = "ascending";
        }
        this.bStart = 0;
        return this.load();
    }

    goToPage(page: number): Promise<void> {
        const target = Math.min(Math.max(1, page), this.pageCount);
        this.bStart = (target - 1) * this.bSize;
        return this.load();
    }

    setBatchSize(size: number): Promise<void> {
        this.bSize = size;
        this.bStart = 0;
        this.storage?.set("batchSize", size);
        return this.load();
    }

    /** Update one or more filters and reload from the first page. */
    applyFilters({
        searchableText,
        selectedTypes,
    }: {
        searchableText?: string;
        selectedTypes?: string[];
    }): Promise<void> {
        if (searchableText !== undefined) this.searchableText = searchableText;
        if (selectedTypes !== undefined) this.selectedTypes = selectedTypes;
        this.bStart = 0;
        return this.load();
    }

    clearFilters(): Promise<void> {
        this.searchableText = "";
        this.selectedTypes = [];
        this.bStart = 0;
        return this.load();
    }

    /** The object id (last path segment) of a content url. */
    private objIdOf(url: string): string {
        return url.split(/[?#]/)[0].replace(/\/+$/, "").split("/").pop() || "";
    }

    /** Object ids of the currently shown page, in display order. */
    get currentIds(): string[] {
        return this.items.map((it) => this.objIdOf(it["@id"]));
    }

    /**
     * Page through the whole current query (ignoring batching) and return every
     * matching item. Used by the "select all in query" sweep; defaults to a
     * UID-only projection to keep the payload small.
     */
    async fetchAllMatching(metadataFields = ["UID"]): Promise<ContentItem[]> {
        const criteria = this.buildQuery();
        const pageSize = 1000;
        const all: ContentItem[] = [];
        let bStart = 0;
        // Loop until we've collected the reported total (or a page comes back empty).
        for (;;) {
            const { items, total } = await searchContents({
                contextUrl: this.contextUrl,
                criteria,
                sortOn: this.sortOn,
                sortOrder: this.sortOrder,
                bStart,
                bSize: pageSize,
                limit: 1_000_000,
                metadataFields,
            });
            all.push(...(items as ContentItem[]));
            bStart += pageSize;
            if (items.length === 0 || all.length >= total) break;
        }
        return all;
    }

    /** Reload the listing, stepping back a page if the current one emptied out. */
    private async reloadAfterMutation(): Promise<void> {
        await this.load();
        if (this.bStart > 0 && this.items.length === 0) {
            await this.goToPage(this.pageCount);
        }
    }

    /** Paste the clipboard into this folder via @move (cut) / @copy (copy). */
    async paste(op: "cut" | "copy", sources: string[]): Promise<void> {
        await pasteItems({ targetUrl: this.contextUrl, sources, op });
        await this.reloadAfterMutation();
    }

    /**
     * Move items into a different folder (drag-into-folder) via @move, then
     * reload. `targetUrl` is the destination container; `sources` the dragged
     * item urls (a single row or the whole current selection).
     */
    async moveIntoFolder(targetUrl: string, sources: string[]): Promise<void> {
        await pasteItems({ targetUrl, sources, op: "cut" });
        await this.reloadAfterMutation();
    }

    /** Delete the given item urls, then reload. */
    async removeItems(urls: string[]): Promise<void> {
        await deleteItems(urls);
        await this.reloadAfterMutation();
    }

    /**
     * Reorder one item within the visible page, optimistically. We splice the
     * item into its new slot first so the keyed rows animate (flip) immediately,
     * then PATCH the server and reconcile with a silent reload. The optimistic
     * order already matches what the server produces for relative/`subset_ids`
     * moves, so the reconcile is a no-op visually; on failure we restore truth.
     */
    async moveTo(
        id: string,
        delta: "top" | "bottom" | number,
        subsetIds?: string[]
    ): Promise<void> {
        this.reorderLocally(id, delta);
        try {
            await moveItem({ containerUrl: this.contextUrl, id, delta, subsetIds });
        } catch (e) {
            await this.load();
            throw e;
        }
        await this.load({ silent: true });
    }

    /** Move an item to its new slot within `items` (mirrors the server reorder). */
    private reorderLocally(id: string, delta: "top" | "bottom" | number): void {
        const from = this.items.findIndex((it) => this.objIdOf(it["@id"]) === id);
        if (from < 0) return;
        const last = this.items.length - 1;
        const raw =
            delta === "top" ? 0 : delta === "bottom" ? last : from + delta;
        const to = Math.max(0, Math.min(last, raw));
        if (to === from) return;
        const next = [...this.items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        this.items = next;
    }

    /** Set one child as this folder's default page. */
    async makeDefaultPage(id: string): Promise<void> {
        await setDefaultPage({ containerUrl: this.contextUrl, id });
    }

    /**
     * Every descendant url beneath an item (excludes the item itself, which
     * @querystring-search drops as the context UID). Used by recursive
     * properties; workflow recursion is handled server-side instead.
     */
    private async fetchDescendantUrls(itemUrl: string): Promise<string[]> {
        const path = new URL(itemUrl, this.config.contextUrl).pathname.replace(/\/+$/, "");
        const criteria = buildSubtreeCriteria(path);
        const pageSize = 1000;
        const urls: string[] = [];
        let bStart = 0;
        for (;;) {
            const { items, total } = await searchContents({
                contextUrl: itemUrl,
                criteria,
                bStart,
                bSize: pageSize,
                limit: 1_000_000,
                metadataFields: ["UID"],
            });
            urls.push(...(items as ContentItem[]).map((it) => it["@id"]));
            bStart += pageSize;
            if (items.length === 0 || urls.length >= total) break;
        }
        return urls;
    }

    /**
     * Apply a workflow transition to each item, then reload. Recursion is
     * server-side (`include_children`). Items where the transition is not
     * applicable answer 400 and are recorded as failures rather than aborting.
     */
    async applyWorkflow(
        items: BatchItem[],
        opts: { transition: string; comment?: string; includeChildren?: boolean }
    ): Promise<BatchResult> {
        const failed: BatchResult["failed"] = [];
        for (const it of items) {
            try {
                await transitionItem({
                    itemUrl: it.url,
                    transition: opts.transition,
                    comment: opts.comment,
                    includeChildren: opts.includeChildren,
                });
            } catch (e) {
                failed.push({ title: it.title, error: (e as Error).message });
            }
        }
        await this.load();
        return { ok: items.length - failed.length, failed };
    }

    /**
     * Add/remove tags per item (Volto semantics: the new subject set is the
     * item's existing subjects minus `remove` plus `add`), then reload.
     */
    async applyTags(
        items: BatchItem[],
        { add = [], remove = [] }: { add?: string[]; remove?: string[] }
    ): Promise<BatchResult> {
        const failed: BatchResult["failed"] = [];
        for (const it of items) {
            const subjects = [
                ...new Set(
                    (it.subjects || []).filter((s) => !remove.includes(s)).concat(add)
                ),
            ];
            try {
                await patchItem(it.url, { subjects });
            } catch (e) {
                failed.push({ title: it.title, error: (e as Error).message });
            }
        }
        await this.load();
        return { ok: items.length - failed.length, failed };
    }

    /**
     * PATCH a set of metadata properties onto each item, optionally recursing
     * into every descendant of folderish items, then reload.
     */
    async applyProperties(
        items: BatchItem[],
        props: Record<string, unknown>,
        recursive = false
    ): Promise<BatchResult> {
        const failed: BatchResult["failed"] = [];
        for (const it of items) {
            try {
                await patchItem(it.url, props);
            } catch (e) {
                failed.push({ title: it.title, error: (e as Error).message });
                continue;
            }
            if (recursive && it.isFolderish) {
                const descendants = await this.fetchDescendantUrls(it.url);
                for (const url of descendants) {
                    try {
                        await patchItem(url, props);
                    } catch (e) {
                        failed.push({ title: url, error: (e as Error).message });
                    }
                }
            }
        }
        await this.load();
        return { ok: items.length - failed.length, failed };
    }

    /**
     * Rename items (Volto-style: PATCH `{id, title}` per item), then reload.
     * NOTE: this is sequential and non-atomic — see spec §14 for the caveat and
     * the recommended plone.restapi bulk-rename improvement.
     */
    async renameItems(
        renames: Array<{ url: string; id: string; title: string }>
    ): Promise<BatchResult> {
        const failed: BatchResult["failed"] = [];
        for (const r of renames) {
            try {
                await patchItem(r.url, { id: r.id, title: r.title });
            } catch (e) {
                failed.push({ title: r.title, error: (e as Error).message });
            }
        }
        await this.load();
        return { ok: renames.length - failed.length, failed };
    }
}
