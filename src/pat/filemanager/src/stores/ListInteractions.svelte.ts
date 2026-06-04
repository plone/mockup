import { objId } from "../api/operations.js";
import { _t } from "../utils/i18n";
import {
    captureDropEntries,
    entriesHaveDirectory,
    readDropManifest,
} from "../utils/dropentries";
import type { ClipboardStore } from "./ClipboardStore.svelte";
import type { ConfirmStore } from "./ConfirmStore.svelte";
import type { ContentsStore, ContentItem } from "./ContentsStore.svelte";
import type { FolderDropStore } from "./FolderDropStore.svelte";
import type { ProgressStore } from "./ProgressStore.svelte";
import type { SelectionStore } from "./SelectionStore.svelte";
import type { UploadStore } from "./UploadStore.svelte";
import type { DropZone } from "../utils/sortable";

// Shared list-interaction logic (selection clicks + drag) for any view that
// renders the listing. Extracted from ContentTable so the grid reuses exactly
// the same selection and drag-into-folder/reorder behaviour.
//
// The drag gesture itself is owned by sortablejs (see utils/sortable.ts); this
// controller only makes the decisions. sortablejs calls `dragStart`, `dragMove`
// and `dragEnd`, which translate a drag into one of three outcomes: a reorder
// within the listing, a move into a hovered folder, or a move into the parent
// container. External file drags (uploads) never involve sortablejs and are
// handled by the separate `on*Drag*`/`on*Drop` file handlers below.

export class ListInteractions {
    contents: ContentsStore;
    selection: SelectionStore;
    clipboard: ClipboardStore;
    upload?: UploadStore;
    confirm?: ConfirmStore;
    progress?: ProgressStore;
    folderDrop?: FolderDropStore;

    // `dragActive` is true while a sortablejs item drag is in progress, so the
    // file handlers below stand down and let sortablejs own the gesture.
    // `dropIndex` is the folderish item currently highlighted as a move-into
    // target; `fileDropIndex` is the folderish item highlighted while dragging
    // external files over it (upload into that subfolder); `anchorIndex` is the
    // pivot for shift-click range selection.
    dragActive = $state(false);
    dropIndex = $state(-1);
    fileDropIndex = $state(-1);
    anchorIndex = $state(-1);
    // Highlight for the grid's "up to parent" placeholder while an item drag or
    // an external file drag hovers it (drop = move/upload into the parent).
    parentDrop = $state(false);
    // A folder is a *solid* drop target: sortablejs never swaps it away, so its
    // three zones read reliably. When the pointer is on a folder's leading or
    // trailing edge (a reorder, not a move-into), `reorderIndex` marks that
    // folder's row and `reorderAfter` whether the drop line sits after it (else
    // before). The drop is committed by us in `dragEnd`, since sortablejs isn't
    // moving anything for a solid folder.
    reorderIndex = $state(-1);
    reorderAfter = $state(false);

    // Drag bookkeeping captured at drag start: the dragged row's model index,
    // its url, and the server order snapshotted then so a reorder drop commits a
    // single relative move against the order the server still has.
    private dragStartIndex = -1;
    private draggedId: string | null = null;
    private dragSubset: string[] = [];

    constructor(
        contents: ContentsStore,
        selection: SelectionStore,
        clipboard: ClipboardStore,
        upload?: UploadStore,
        confirm?: ConfirmStore,
        progress?: ProgressStore,
        folderDrop?: FolderDropStore
    ) {
        this.contents = contents;
        this.selection = selection;
        this.clipboard = clipboard;
        this.upload = upload;
        this.confirm = confirm;
        this.progress = progress;
        this.folderDrop = folderDrop;
    }

    /**
     * Ask the user to confirm an action. Uses the app's <dialog>-based
     * ConfirmStore when available, falling back to the native window.confirm.
     */
    private async confirmAction(
        message: string,
        confirmLabel: string
    ): Promise<boolean> {
        if (this.confirm) return this.confirm.ask(message, { confirmLabel });
        return window.confirm(message);
    }

    /** Reorder only makes sense while the listing is in manual-order mode. */
    get canReorder(): boolean {
        return this.contents.sortOn === "getObjPositionInParent";
    }

    // Clicks on these controls (links, buttons, the checkbox, its label) keep
    // their own behaviour and must not trigger row/card selection.
    private isInteractive(target: EventTarget | null): boolean {
        return Boolean(
            (target as HTMLElement | null)?.closest("a, button, input, label")
        );
    }

    // Plain → replace selection; ctrl/meta → toggle; shift → range from anchor.
    private applySelection(
        item: ContentItem,
        index: number,
        { range, toggle }: { range: boolean; toggle: boolean }
    ): void {
        if (range && this.anchorIndex >= 0) {
            this.selection.selectRange(this.contents.items, this.anchorIndex, index);
        } else if (toggle) {
            this.selection.toggle(item);
            this.anchorIndex = index;
        } else {
            this.selection.selectOnly(item);
            this.anchorIndex = index;
        }
    }

    onItemClick(event: MouseEvent, item: ContentItem, index: number): void {
        if (this.isInteractive(event.target)) return;
        this.applySelection(item, index, {
            range: event.shiftKey,
            toggle: event.ctrlKey || event.metaKey,
        });
    }

    /**
     * Grid cards act like big checkboxes: a plain click toggles the card's
     * selection, so clicking it again deselects it (mirroring Space and the
     * card's own checkbox); Shift extends the range from the anchor. The table
     * keeps onItemClick's click-to-replace model, where clicking a row selects
     * only it.
     */
    onCardClick(event: MouseEvent, item: ContentItem, index: number): void {
        if (this.isInteractive(event.target)) return;
        this.applySelection(item, index, {
            range: event.shiftKey,
            toggle: !event.shiftKey,
        });
    }

    /**
     * Keyboard model for a focusable grid card (the single tab stop per item;
     * its checkbox and title link are out of the tab order): Space selects
     * (modifier-aware), Enter opens. Skipped if focus is on a nested control.
     */
    onItemKeydown(event: KeyboardEvent, item: ContentItem, index: number): void {
        if (this.isInteractive(event.target)) return;
        if (event.key === " ") {
            event.preventDefault();
            // Space toggles the focused card (like its checkbox), so a second
            // press deselects it; Shift+Space extends the range from the anchor.
            this.applySelection(item, index, {
                range: event.shiftKey,
                toggle: true,
            });
        } else if (event.key === "Enter") {
            event.preventDefault();
            this.activate(item);
        }
    }

    /** Open an item from the keyboard: folders drill in-app, others navigate. */
    activate(item: ContentItem): void {
        if (item.is_folderish) {
            this.selection.clear();
            this.contents.navigateTo(item["@id"]);
            return;
        }
        window.location.assign(item["@id"]);
    }

    /** Stop shift-click from highlighting cell text while range-selecting. */
    onItemMouseDown(event: MouseEvent): void {
        if (event.shiftKey && !this.isInteractive(event.target)) {
            event.preventDefault();
        }
    }

    isCut(item: ContentItem): boolean {
        return (
            this.clipboard.op === "cut" && this.clipboard.sources.includes(item["@id"])
        );
    }

    // ── sortablejs drag hooks ────────────────────────────────────────────────
    // The action in utils/sortable.ts calls these; they hold no DOM references.

    /** A drag began on the listing item at model index `index`. */
    dragStart(index: number): void {
        this.dragActive = true;
        this.dragStartIndex = index;
        this.draggedId = this.contents.items[index]?.["@id"] ?? null;
        // Snapshot the server order now so a reorder drop commits a relative move
        // against the order the server still has.
        this.dragSubset = this.canReorder ? [...this.contents.currentIds] : [];
        this.dropIndex = -1;
        this.reorderIndex = -1;
        this.parentDrop = false;
        this.fileDropIndex = -1;
    }

    /**
     * A hover during the drag, over the listing item at model index
     * `relatedIndex` (-1 when not over an item). `zone` is where the pointer
     * sits over that item (only meaningful for a folder). Returns whether
     * sortablejs may reorder-swap for this hover:
     *
     *  - over the parent placeholder (tracked by the native handlers) → false,
     *    keep the list still so only the placeholder highlights;
     *  - over a folder (but the dragged item itself) → always false. A folder
     *    is a *solid* drop target: never letting sortablejs swap it keeps it
     *    still under the pointer, so its three zones read reliably (a swapping
     *    folder slides out from under you as you aim, which made the move-into
     *    highlight flicker). The wide middle `into` band highlights it as a
     *    move-into target; the thin `before`/`after` edge bands mark a reorder
     *    that `dragEnd` commits itself (sortablejs moved nothing);
     *  - otherwise reorder via sortablejs, but only in manual-order mode.
     */
    dragMove(relatedIndex: number, zone: DropZone = "into"): boolean {
        if (this.parentDrop) {
            this.dropIndex = -1;
            this.reorderIndex = -1;
            return false;
        }
        const target = relatedIndex >= 0 ? this.contents.items[relatedIndex] : undefined;
        if (target?.is_folderish && target["@id"] !== this.draggedId) {
            if (zone === "into") {
                this.dropIndex = relatedIndex;
                this.reorderIndex = -1;
            } else if (this.canReorder) {
                this.dropIndex = -1;
                this.reorderIndex = relatedIndex;
                this.reorderAfter = zone === "after";
            } else {
                this.dropIndex = -1;
                this.reorderIndex = -1;
            }
            return false;
        }
        this.dropIndex = -1;
        this.reorderIndex = -1;
        return this.canReorder;
    }

    /**
     * The drag ended. `delta` is the dragged row's net index shift within the
     * listing (sortablejs's newIndex − oldIndex). The last hover decided the
     * gesture, in precedence order: a parent-placeholder move, a move into a
     * folder, a reorder relative to a (solid) folder's edge, or — over a
     * non-folder — the plain sortablejs reorder. The last three only apply in
     * manual-order mode.
     */
    async dragEnd(delta: number): Promise<void> {
        const active = this.dragActive;
        const into = this.dropIndex;
        const parent = this.parentDrop;
        const from = this.dragStartIndex;
        const draggedId = this.draggedId;
        const subset = this.dragSubset;
        const edgeIndex = this.reorderIndex;
        const edgeAfter = this.reorderAfter;
        this.resetDrag();
        if (!active || from < 0 || !draggedId) return;
        const dragged = this.contents.items[from];
        if (!dragged) return;
        if (parent) {
            await this.moveToParent(dragged);
            return;
        }
        if (into >= 0 && into !== from) {
            const target = this.contents.items[into];
            if (target?.is_folderish) await this.moveToFolder(target, dragged);
            return;
        }
        if (!this.canReorder) return;
        // Reorder against a folder's edge: the folder stayed solid (sortablejs
        // moved nothing), so compute the dragged row's target slot ourselves
        // rather than trusting the sortablejs delta, which would be 0 here.
        if (edgeIndex >= 0 && edgeIndex !== from) {
            const edgeDelta = this.edgeReorderDelta(from, edgeIndex, edgeAfter);
            if (edgeDelta !== 0) {
                await this.contents.moveTo(objId(draggedId), edgeDelta, subset);
            }
            return;
        }
        if (delta === 0) return;
        await this.contents.moveTo(objId(draggedId), delta, subset);
    }

    /**
     * The net index shift to drop the dragged row (at model index `from`) just
     * before or after the folder at model index `folder`. Accounts for the gap
     * the dragged row leaves behind when it sits above the folder.
     */
    private edgeReorderDelta(from: number, folder: number, after: boolean): number {
        const adjusted = from < folder ? folder - 1 : folder;
        const target = after ? adjusted + 1 : adjusted;
        return target - from;
    }

    /** Clear all drag bookkeeping (shared by a committed drop and a cancel). */
    private resetDrag(): void {
        this.dragActive = false;
        this.dropIndex = -1;
        this.reorderIndex = -1;
        this.fileDropIndex = -1;
        this.parentDrop = false;
        this.dragStartIndex = -1;
        this.draggedId = null;
        this.dragSubset = [];
    }

    // The urls to move when dragging an item: the whole selection if the dragged
    // item is part of a multi-selection, otherwise just that item.
    private dragSources(dragged: ContentItem): string[] {
        if (this.selection.isSelected(dragged) && this.selection.count > 1) {
            return this.selection.urls;
        }
        return [dragged["@id"]];
    }

    /** Move the dragged sources (or whole selection) into `target` folder. */
    private async moveToFolder(
        target: ContentItem,
        dragged: ContentItem
    ): Promise<void> {
        const sources = this.dragSources(dragged);
        const folder = (target.Title as string) || objId(target["@id"]);
        // Moving into a folder takes the items out of the current listing, so
        // confirm before committing it.
        const ok = await this.confirmAction(
            _t('Move ${count} item(s) into "${folder}"?', {
                count: sources.length,
                folder,
            }),
            _t("Move")
        );
        if (!ok) return;
        // @move is a single server request, so the bar is indeterminate (no
        // per-item progress). Surface it as a busy overlay on the target row/card.
        const move = () => this.contents.moveIntoFolder(target["@id"], sources);
        if (this.progress) {
            await this.progress.track(
                _t('Moving ${count} item(s) into "${folder}"…', {
                    count: sources.length,
                    folder,
                }),
                move,
                { surface: "folder", targetUrl: target["@id"] }
            );
        } else {
            await move();
        }
        this.selection.clear();
    }

    /** Move the dragged sources (or whole selection) into the parent container. */
    private async moveToParent(dragged: ContentItem): Promise<void> {
        const parentUrl = this.contents.parentUrl;
        const sources = this.dragSources(dragged);
        if (!parentUrl || sources.length === 0) return;
        const ok = await this.confirmAction(
            _t("Move ${count} item(s) to the parent folder?", { count: sources.length }),
            _t("Move")
        );
        if (!ok) return;
        const move = () => this.contents.moveIntoFolder(parentUrl, sources);
        if (this.progress) {
            await this.progress.track(
                _t("Moving ${count} item(s) to the parent folder…", {
                    count: sources.length,
                }),
                move,
                { surface: "folder", targetUrl: parentUrl }
            );
        } else {
            await move();
        }
        this.selection.clear();
    }

    // ── external file drags (uploads) ────────────────────────────────────────
    // These travel through native DOM events on a row/card. While a sortablejs
    // item drag is active they stand down (`dragActive`); otherwise they route
    // an OS file drop into the hovered subfolder, or let it bubble to the upload
    // zone (current folder) for non-folder rows.

    private hasFiles(event: DragEvent): boolean {
        const types = event.dataTransfer?.types;
        return Boolean(types && Array.from(types).includes("Files"));
    }

    /**
     * The single entry point for an external (OS) file/folder drop, used by the
     * upload zone, subfolder rows and the parent placeholder. A plain file drop
     * takes today's path (immediate upload, no prompt). A drop that contains a
     * folder is read into a manifest, previewed for approval, and on approval
     * recreated + uploaded as a tree. `targetUrl` defaults to the current folder.
     *
     * `captureDropEntries` and the `files` read MUST stay in the synchronous
     * prefix (before the first await): the DataTransfer is only live while the
     * drop event is being dispatched, and this method is entered straight from
     * the native handler.
     */
    async handleExternalDrop(
        dataTransfer: DataTransfer | null,
        targetUrl?: string
    ): Promise<void> {
        const target = targetUrl ?? this.contents.contextUrl;
        const entries = captureDropEntries(dataTransfer);
        const files = Array.from(dataTransfer?.files ?? []);
        if (!this.upload) return;
        if (!entriesHaveDirectory(entries)) {
            // Flat file drop (or a browser without the entries API): unchanged.
            if (files.length) await this.upload.uploadFiles(files, targetUrl);
            return;
        }
        const manifest = await readDropManifest(entries);
        if (manifest.fileCount === 0 && manifest.folderCount === 0) return;
        const name = objId(target) || target;
        if (this.folderDrop && !(await this.folderDrop.preview(manifest, name))) {
            return;
        }
        await this.upload.uploadTree(target, manifest, this.contents.config.folderType);
    }

    onRowDragEnter(event: DragEvent, index: number): void {
        if (this.dragActive || !this.hasFiles(event)) return;
        const item = this.contents.items[index];
        this.fileDropIndex = item?.is_folderish ? index : -1;
    }

    onRowDragOver(event: DragEvent, index: number): void {
        if (this.dragActive || !this.hasFiles(event)) return;
        const item = this.contents.items[index];
        if (!item?.is_folderish) {
            // A non-folder row lets the drop bubble to the upload zone (current
            // folder); drop any lingering subfolder highlight.
            if (this.fileDropIndex === index) this.fileDropIndex = -1;
            return;
        }
        // A subfolder row claims the drop: allow it and mark the target.
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        this.fileDropIndex = index;
    }

    onRowDrop(event: DragEvent, index: number): void | Promise<void> {
        if (this.dragActive) return;
        return this.onFileDrop(event, index);
    }

    // The grid's "up to parent" placeholder card. While a sortablejs item drag
    // is active, hovering it marks `parentDrop` so the drop commits a move into
    // the parent (sortablejs's onEnd reads the flag); an external file drag
    // uploads into the parent instead.

    onParentDragEnter(event: DragEvent): void {
        if (this.dragActive) {
            this.parentDrop = true;
            this.dropIndex = -1;
            return;
        }
        if (this.hasFiles(event)) this.parentDrop = true;
    }

    onParentDragOver(event: DragEvent): void {
        if (this.dragActive) {
            event.preventDefault();
            // Re-affirm the highlight every dragover: dragleave fires when the
            // pointer crosses onto the placeholder's own children, clearing it,
            // so the steady stream of dragover events is what keeps it lit.
            this.parentDrop = true;
            this.dropIndex = -1;
            return;
        }
        if (!this.hasFiles(event)) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        this.parentDrop = true;
    }

    onParentDragLeave(): void {
        this.parentDrop = false;
    }

    async onParentDrop(event: DragEvent): Promise<void> {
        // Internal sortablejs drag → the move into the parent is committed by
        // dragEnd via the parentDrop flag; just accept the drop here so the
        // browser doesn't treat it as a navigation/file drop.
        if (this.dragActive) {
            event.preventDefault();
            return;
        }
        // External file/folder drag → upload into the parent folder.
        const parentUrl = this.contents.parentUrl;
        this.parentDrop = false;
        if (!this.hasFiles(event) || !parentUrl) return;
        event.preventDefault();
        await this.handleExternalDrop(event.dataTransfer, parentUrl);
    }

    /**
     * Upload files/folders dropped directly onto a subfolder row/card into that
     * folder. Calling preventDefault (without stopPropagation) marks the event
     * handled; the upload zone sees the same bubbling drop and uploads to the
     * current folder only when no subfolder claimed it.
     */
    async onFileDrop(event: DragEvent, index: number): Promise<void> {
        if (!this.hasFiles(event)) return;
        const item = this.contents.items[index];
        if (!item?.is_folderish) return;
        event.preventDefault();
        this.fileDropIndex = -1;
        await this.handleExternalDrop(event.dataTransfer, item["@id"]);
    }
}
