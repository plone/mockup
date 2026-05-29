import { objId } from "../api/operations.js";
import type { ClipboardStore } from "./ClipboardStore.svelte";
import type { ContentsStore, ContentItem } from "./ContentsStore.svelte";
import type { SelectionStore } from "./SelectionStore.svelte";

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

    // `dragIndex >= 0` marks an internal drag in progress, so items claim the
    // drop instead of letting external file drags bubble to the upload zone;
    // `dropIndex` is the folderish item currently highlighted as a move-into
    // target; `anchorIndex` is the pivot for shift-click range selection.
    dragIndex = $state(-1);
    dropIndex = $state(-1);
    anchorIndex = $state(-1);

    constructor(contents: ContentsStore, selection: SelectionStore, clipboard: ClipboardStore) {
        this.contents = contents;
        this.selection = selection;
        this.clipboard = clipboard;
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
    }

    onDragEnd(): void {
        this.dragIndex = -1;
        this.dropIndex = -1;
    }

    onDragEnter(index: number): void {
        const target = this.contents.items[index];
        this.dropIndex = target?.is_folderish && index !== this.dragIndex ? index : -1;
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
        const from = this.dragIndex;
        this.dragIndex = -1;
        this.dropIndex = -1;
        if (from < 0) return;
        const target = this.contents.items[index];
        const dragged = this.contents.items[from];
        // Dropping onto a folderish item (other than itself) moves into it.
        if (target?.is_folderish && index !== from) {
            await this.contents.moveIntoFolder(target["@id"], this.dragSources(dragged));
            this.selection.clear();
            return;
        }
        // Otherwise reorder, when the listing is in manual-order mode.
        if (from === index || !this.canReorder) return;
        await this.contents.moveTo(objId(dragged["@id"]), index - from, this.contents.currentIds);
    }
}
