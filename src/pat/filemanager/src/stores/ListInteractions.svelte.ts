import { objId } from "../api/operations.js";
import { _t } from "../utils/i18n";
import type { ClipboardStore } from "./ClipboardStore.svelte";
import type { ConfirmStore } from "./ConfirmStore.svelte";
import type { ContentsStore, ContentItem } from "./ContentsStore.svelte";
import type { ProgressStore } from "./ProgressStore.svelte";
import type { SelectionStore } from "./SelectionStore.svelte";
import type { UploadStore } from "./UploadStore.svelte";

// Shared list-interaction logic (selection clicks + native HTML5 drag) for any
// view that renders the listing. Extracted from ContentTable so the grid reuses
// exactly the same selection and drag-into-folder/reorder behaviour. The
// rendered element (a <tr> in the table, a card in the grid) still lives in each
// view because animate:flip must sit on the immediate child of a keyed each and
// is invalid on a component (spec §20.2) — only the behaviour is shared.

export class ListInteractions {
    contents: ContentsStore;
    selection: SelectionStore;
    clipboard: ClipboardStore;
    upload?: UploadStore;
    confirm?: ConfirmStore;
    progress?: ProgressStore;

    // `dragIndex >= 0` marks an internal drag in progress, so items claim the
    // drop instead of letting external file drags bubble to the upload zone;
    // `dropIndex` is the folderish item currently highlighted as a move-into
    // target; `fileDropIndex` is the folderish item highlighted while dragging
    // external files over it (upload into that subfolder); `anchorIndex` is the
    // pivot for shift-click range selection.
    dragIndex = $state(-1);
    dropIndex = $state(-1);
    fileDropIndex = $state(-1);
    anchorIndex = $state(-1);
    // Highlight for the grid's "up to parent" placeholder while an item drag or
    // an external file drag hovers it (drop = move/upload into the parent).
    parentDrop = $state(false);

    // Drag-reorder bookkeeping for the live preview: where the drag began, the
    // dragged item's url (stable while the rows shuffle under it), and the
    // server order snapshotted at drag start so the drop can be committed as a
    // single relative move. `dragIndex` tracks the dragged row's *current* slot
    // as `movePreview` shuffles it; `dragStartIndex` stays put for the delta.
    private dragStartIndex = -1;
    private draggedId: string | null = null;
    private dragSubset: string[] = [];
    // When the dragged row is part of a contiguous run of selected rows, the
    // object-ids of that whole run (in listing order) so the drag moves them as
    // one block; null for a plain single-row drag.
    private dragBlock: string[] | null = null;

    constructor(
        contents: ContentsStore,
        selection: SelectionStore,
        clipboard: ClipboardStore,
        upload?: UploadStore,
        confirm?: ConfirmStore,
        progress?: ProgressStore
    ) {
        this.contents = contents;
        this.selection = selection;
        this.clipboard = clipboard;
        this.upload = upload;
        this.confirm = confirm;
        this.progress = progress;
    }

    /**
     * Ask the user to confirm an action. Uses the app's <dialog>-based
     * ConfirmStore when available, falling back to the native window.confirm.
     */
    private async confirmAction(message: string, confirmLabel: string): Promise<boolean> {
        if (this.confirm) return this.confirm.ask(message, { confirmLabel });
        return window.confirm(message);
    }

    get dragActive(): boolean {
        return this.dragIndex >= 0;
    }

    /** Reorder only makes sense while the listing is in manual-order mode. */
    get canReorder(): boolean {
        return this.contents.sortOn === "getObjPositionInParent";
    }

    // Clicks on these controls (links, buttons, the checkbox, its label) keep
    // their own behaviour and must not trigger row/card selection.
    private isInteractive(target: EventTarget | null): boolean {
        return Boolean((target as HTMLElement | null)?.closest("a, button, input, label"));
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
        return this.clipboard.op === "cut" && this.clipboard.sources.includes(item["@id"]);
    }

    onDragStart(index: number): void {
        this.dragIndex = index;
        this.dragStartIndex = index;
        this.draggedId = this.contents.items[index]?.["@id"] ?? null;
        // Snapshot the server order now, before any live preview shuffles it, so
        // the drop commits a relative move against the order the server still has.
        this.dragSubset = this.canReorder ? [...this.contents.currentIds] : [];
        // If the whole selection is a contiguous run that includes this row, drag
        // it as one block; otherwise fall back to a single-row drag.
        this.dragBlock = this.canReorder ? this.contiguousBlock(index) : null;
        this.fileDropIndex = -1;
    }

    /**
     * The object-ids (in listing order) of a contiguous run of selected rows
     * that includes `index`, but only when that run is the entire selection and
     * holds at least two rows. Returns null otherwise, so non-contiguous or
     * partly off-page selections drop back to moving just the dragged row.
     */
    private contiguousBlock(index: number): string[] | null {
        const items = this.contents.items;
        const dragged = items[index];
        if (!dragged || !this.selection.isSelected(dragged) || this.selection.count < 2) {
            return null;
        }
        const selected: number[] = [];
        items.forEach((it, i) => {
            if (this.selection.isSelected(it)) selected.push(i);
        });
        // Every selected item must be on this page and form one unbroken run.
        if (selected.length !== this.selection.count) return null;
        const min = selected[0];
        const max = selected[selected.length - 1];
        if (max - min + 1 !== selected.length) return null;
        return items.slice(min, max + 1).map((it) => objId(it["@id"]));
    }

    onDragEnd(): void {
        // `onDrop` clears `dragStartIndex` synchronously, so reaching here with it
        // still set means the drag was abandoned (Esc / dropped outside). If a
        // live preview had reordered the rows, reload to restore the real order.
        const abandoned = this.dragStartIndex >= 0;
        const previewed = abandoned && this.dragIndex !== this.dragStartIndex;
        this.resetDrag();
        if (previewed) void this.contents.load({ silent: true });
    }

    /** Clear all drag bookkeeping (shared by a committed drop and a cancel). */
    private resetDrag(): void {
        this.dragIndex = -1;
        this.dropIndex = -1;
        this.fileDropIndex = -1;
        this.dragStartIndex = -1;
        this.draggedId = null;
        this.dragSubset = [];
        this.dragBlock = null;
    }

    onDragEnter(index: number): void {
        const target = this.contents.items[index];
        // Hovering a folder (other than the dragged row) offers a move-into-folder
        // drop: highlight it and leave the order untouched.
        if (target?.is_folderish && index !== this.dragIndex) {
            this.dropIndex = index;
            return;
        }
        this.dropIndex = -1;
        if (!this.canReorder || !this.draggedId || index === this.dragIndex) return;
        // Hovering another row in our own block is a no-op (you can't drop a block
        // inside itself).
        if (this.dragBlock && this.dragBlock.includes(objId(this.contents.items[index]?.["@id"] ?? ""))) {
            return;
        }
        // Live-reorder so the rows make room as the cursor passes over them — flip
        // animates the shift. A contiguous selection moves as one block; a single
        // row lands on `index`. Subsequent enters on the dragged row's new slot
        // are a no-op (the guard above), so the rows don't oscillate.
        if (this.dragBlock) {
            this.contents.movePreviewBlock(this.dragBlock, index);
            this.dragIndex = this.contents.currentIds.indexOf(objId(this.draggedId));
        } else {
            this.contents.movePreview(this.draggedId, index);
            this.dragIndex = index;
        }
    }

    // The urls to move when dragging an item: the whole selection if the dragged
    // item is part of a multi-selection, otherwise just that item.
    private dragSources(dragged: ContentItem): string[] {
        if (this.selection.isSelected(dragged) && this.selection.count > 1) {
            return this.selection.urls;
        }
        return [dragged["@id"]];
    }

    async onDrop(index: number): Promise<void> {
        const from = this.dragStartIndex;
        const draggedId = this.draggedId;
        const subset = this.dragSubset;
        const block = this.dragBlock;
        // Where the dragged row sits now, after any live preview reorder.
        const to = this.dragIndex;
        // Clear synchronously so the dragend that follows this drop knows the drop
        // was handled and doesn't undo the committed reorder.
        this.resetDrag();
        if (from < 0 || !draggedId) return;
        const target = this.contents.items[index];
        // Dropping onto a folderish item (other than the dragged one) moves into
        // it (the whole selection, when the dragged row is selected). No live
        // preview runs while hovering a folder, so commit nothing here.
        if (target?.is_folderish && index !== from) {
            const dragged = this.contents.items.find((it) => it["@id"] === draggedId);
            if (dragged) {
                const sources = this.dragSources(dragged);
                const folder = (target.Title as string) || objId(target["@id"]);
                // Moving into a folder takes the items out of the current listing,
                // so confirm before committing it.
                const ok = await this.confirmAction(
                    _t('Move ${count} item(s) into "${folder}"?', {
                        count: sources.length,
                        folder,
                    }),
                    _t("Move")
                );
                if (ok) {
                    await this.contents.moveIntoFolder(target["@id"], sources);
                    this.selection.clear();
                }
            }
            return;
        }
        if (!this.canReorder) return;
        // Persist the previewed reorder. The rows already moved; the commit only
        // PATCHes the net shift against the order the server still had at drag
        // start. A contiguous selection commits as a block (one move per row).
        if (block) {
            const finalStart = this.contents.currentIds.indexOf(block[0]);
            await this.contents.commitReorderBlock(block, finalStart, subset);
        } else if (to !== from) {
            await this.contents.commitReorder(objId(draggedId), to - from, subset);
        }
    }

    private hasFiles(event: DragEvent): boolean {
        const types = event.dataTransfer?.types;
        return Boolean(types && Array.from(types).includes("Files"));
    }

    // Internal item drags (reorder / move-into-folder) and external file drags
    // (upload into a subfolder) travel through the same DOM events on a row or
    // card, so these dispatchers route each event by whether an internal drag
    // is in progress, keeping both views' markup to a single set of handlers.

    onRowDragEnter(event: DragEvent, index: number): void {
        if (this.dragActive) {
            this.onDragEnter(index);
            return;
        }
        if (!this.hasFiles(event)) return;
        const item = this.contents.items[index];
        this.fileDropIndex = item?.is_folderish ? index : -1;
    }

    onRowDragOver(event: DragEvent, index: number): void {
        if (this.dragActive) {
            event.preventDefault();
            return;
        }
        if (!this.hasFiles(event)) return;
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
        if (this.dragActive) {
            event.preventDefault();
            return this.onDrop(index);
        }
        return this.onFileDrop(event, index);
    }

    // The grid's "up to parent" placeholder card. An internal item drag dropped
    // onto it moves the dragged sources into the parent container; an external
    // file drag uploads into the parent. Mirrors the subfolder handlers but the
    // target is `contents.parentUrl` rather than a listed item.

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
        const parentUrl = this.contents.parentUrl;
        // Internal item drag → move the dragged sources into the parent.
        if (this.dragActive) {
            event.preventDefault();
            const draggedId = this.draggedId;
            const dragged = draggedId
                ? this.contents.items.find((it) => it["@id"] === draggedId)
                : null;
            const sources = dragged ? this.dragSources(dragged) : [];
            this.resetDrag();
            this.parentDrop = false;
            if (!parentUrl || sources.length === 0) return;
            const ok = await this.confirmAction(
                _t("Move ${count} item(s) to the parent folder?", {
                    count: sources.length,
                }),
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
            return;
        }
        // External file drag → upload into the parent folder.
        this.parentDrop = false;
        if (!this.hasFiles(event) || !parentUrl) return;
        event.preventDefault();
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0 || !this.upload) return;
        await this.upload.uploadFiles(files, parentUrl);
    }

    /**
     * Upload files dropped directly onto a subfolder row/card into that folder.
     * Calling preventDefault (without stopPropagation) marks the event handled;
     * the upload zone sees the same bubbling drop and uploads to the current
     * folder only when no subfolder claimed it.
     */
    async onFileDrop(event: DragEvent, index: number): Promise<void> {
        if (!this.hasFiles(event)) return;
        const item = this.contents.items[index];
        if (!item?.is_folderish) return;
        event.preventDefault();
        this.fileDropIndex = -1;
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0 || !this.upload) return;
        await this.upload.uploadFiles(files, item["@id"]);
    }
}
