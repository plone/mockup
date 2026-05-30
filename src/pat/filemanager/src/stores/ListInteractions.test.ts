import { ListInteractions } from "./ListInteractions.svelte";

function item(id: string, extra: Record<string, unknown> = {}) {
    return { "@id": `http://nohost/plone/folder/${id}`, UID: id, Title: id, ...extra };
}

function makeContents(items: ReturnType<typeof item>[]) {
    return {
        items,
        sortOn: "getObjPositionInParent",
        parentUrl: "http://nohost/plone" as string | null,
        get currentIds() {
            return items.map((it) => it["@id"].split("/").pop());
        },
        moveIntoFolder: jest.fn().mockResolvedValue(undefined),
        moveTo: jest.fn().mockResolvedValue(undefined),
        movePreview: jest.fn(),
        movePreviewBlock: jest.fn(),
        commitReorder: jest.fn().mockResolvedValue(undefined),
        commitReorderBlock: jest.fn().mockResolvedValue(undefined),
        load: jest.fn().mockResolvedValue(undefined),
        navigateTo: jest.fn().mockResolvedValue(undefined),
    };
}

/** A selection mock that reports the given object-ids (item.UID) as selected. */
function selectionFor(ids: string[]) {
    return {
        selectRange: jest.fn(),
        toggle: jest.fn(),
        selectOnly: jest.fn(),
        clear: jest.fn(),
        isSelected: jest.fn((it: { UID: string }) => ids.includes(it.UID)),
        count: ids.length,
        urls: ids.map((id) => `http://nohost/plone/folder/${id}`),
    };
}

function makeSelection() {
    return {
        selectRange: jest.fn(),
        toggle: jest.fn(),
        selectOnly: jest.fn(),
        clear: jest.fn(),
        isSelected: jest.fn().mockReturnValue(false),
        count: 0,
        urls: [] as string[],
    };
}

function makeClipboard(op: "cut" | "copy" | null = null, sources: string[] = []) {
    return { op, sources };
}

function makeUpload() {
    return { uploadFiles: jest.fn().mockResolvedValue({ ok: 1, failed: [] }) };
}

/** A confirm-store mock whose ask() resolves to `accept` (default: confirmed). */
function makeConfirm(accept = true) {
    return { ask: jest.fn().mockResolvedValue(accept) };
}

function make(
    items: ReturnType<typeof item>[],
    selection = makeSelection(),
    clipboard = makeClipboard(),
    upload = makeUpload(),
    confirm: ReturnType<typeof makeConfirm> | undefined = undefined
) {
    const contents = makeContents(items);
    const interactions = new ListInteractions(
        contents as never,
        selection as never,
        clipboard as never,
        upload as never,
        confirm as never
    );
    return { interactions, contents, selection, clipboard, upload, confirm };
}

// A minimal DragEvent carrying a `Files` payload (or not), with the bits the
// handlers read: dataTransfer.types/files/dropEffect and preventDefault.
function dragEvent(files: Array<{ name: string }> = []) {
    return {
        preventDefault: jest.fn(),
        dataTransfer: {
            types: ["Files"],
            files,
            dropEffect: "none",
        },
    } as unknown as DragEvent;
}

function nonFileDragEvent() {
    return {
        preventDefault: jest.fn(),
        dataTransfer: { types: ["text/plain"], files: [], dropEffect: "none" },
    } as unknown as DragEvent;
}

const clickEvent = (opts: Record<string, unknown> = {}) =>
    ({ target: null, ...opts }) as unknown as MouseEvent;
const keyEvent = (opts: Record<string, unknown> = {}) =>
    ({ target: null, preventDefault: jest.fn(), ...opts }) as unknown as KeyboardEvent;

describe("ListInteractions — selection clicks", () => {
    it("plain click selects only that item and sets the anchor", () => {
        const { interactions, selection, contents } = make([item("a"), item("b")]);
        interactions.onItemClick(clickEvent(), contents.items[0], 0);
        expect(selection.selectOnly).toHaveBeenCalledWith(contents.items[0]);
        expect(interactions.anchorIndex).toBe(0);
    });

    it("ctrl/meta click toggles the item and moves the anchor", () => {
        const { interactions, selection, contents } = make([item("a"), item("b")]);
        interactions.onItemClick(clickEvent({ ctrlKey: true }), contents.items[1], 1);
        expect(selection.toggle).toHaveBeenCalledWith(contents.items[1]);
        expect(interactions.anchorIndex).toBe(1);
    });

    it("shift click selects the range from the anchor", () => {
        const { interactions, selection, contents } = make([
            item("a"),
            item("b"),
            item("c"),
        ]);
        interactions.onItemClick(clickEvent(), contents.items[0], 0);
        interactions.onItemClick(clickEvent({ shiftKey: true }), contents.items[2], 2);
        expect(selection.selectRange).toHaveBeenCalledWith(contents.items, 0, 2);
    });

    it("ignores clicks on interactive descendants (links, checkbox, buttons)", () => {
        const { interactions, selection, contents } = make([item("a")]);
        const event = clickEvent({ target: { closest: () => ({}) } });
        interactions.onItemClick(event, contents.items[0], 0);
        expect(selection.selectOnly).not.toHaveBeenCalled();
    });

    it("grid card click toggles the card so a second click deselects it", () => {
        const { interactions, selection, contents } = make([item("a")]);
        interactions.onCardClick(clickEvent(), contents.items[0], 0);
        interactions.onCardClick(clickEvent(), contents.items[0], 0);
        expect(selection.toggle).toHaveBeenCalledTimes(2);
        expect(selection.toggle).toHaveBeenCalledWith(contents.items[0]);
        expect(selection.selectOnly).not.toHaveBeenCalled();
        expect(interactions.anchorIndex).toBe(0);
    });

    it("shift card click selects the range from the anchor", () => {
        const { interactions, selection, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onCardClick(clickEvent(), contents.items[0], 0); // anchor 0
        interactions.onCardClick(clickEvent({ shiftKey: true }), contents.items[2], 2);
        expect(selection.selectRange).toHaveBeenCalledWith(contents.items, 0, 2);
    });

    it("Space toggles the focused card so a second press deselects it", () => {
        const { interactions, selection, contents } = make([item("a")]);
        interactions.onItemKeydown(keyEvent({ key: " " }), contents.items[0], 0);
        interactions.onItemKeydown(keyEvent({ key: " " }), contents.items[0], 0);
        expect(selection.toggle).toHaveBeenCalledTimes(2);
        expect(selection.toggle).toHaveBeenCalledWith(contents.items[0]);
        expect(selection.selectOnly).not.toHaveBeenCalled();
    });

    it("Shift+Space extends the range from the anchor", () => {
        const { interactions, selection, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onItemClick(clickEvent(), contents.items[0], 0); // anchor 0
        interactions.onItemKeydown(keyEvent({ key: " ", shiftKey: true }), contents.items[2], 2);
        expect(selection.selectRange).toHaveBeenCalledWith(contents.items, 0, 2);
    });

    it("Enter opens a folder card in-app and clears the selection", () => {
        const folder = item("f", { is_folderish: true });
        const { interactions, selection, contents } = make([folder]);
        const enter = keyEvent({ key: "Enter" });
        interactions.onItemKeydown(enter, contents.items[0], 0);
        expect(enter.preventDefault).toHaveBeenCalled();
        expect(selection.clear).toHaveBeenCalled();
        expect(contents.navigateTo).toHaveBeenCalledWith(folder["@id"]);
    });

    it("ignores keys other than Space and Enter", () => {
        const { interactions, selection, contents } = make([item("a")]);
        const other = keyEvent({ key: "x" });
        interactions.onItemKeydown(other, contents.items[0], 0);
        expect(other.preventDefault).not.toHaveBeenCalled();
        expect(selection.selectOnly).not.toHaveBeenCalled();
    });
});

describe("ListInteractions — drag state", () => {
    it("tracks the dragged index and clears it on end", () => {
        const { interactions } = make([item("a"), item("b")]);
        expect(interactions.dragActive).toBe(false);
        interactions.onDragStart(1);
        expect(interactions.dragActive).toBe(true);
        expect(interactions.dragIndex).toBe(1);
        interactions.onDragEnd();
        expect(interactions.dragIndex).toBe(-1);
        expect(interactions.dropIndex).toBe(-1);
    });

    it("reports the drag direction so the grid can place the wrap marker", () => {
        const { interactions } = make([item("a"), item("b"), item("c"), item("d")]);
        interactions.onDragStart(0);
        expect(interactions.dragMovedForward).toBe(false); // not moved off the start
        interactions.onInternalHover(2, "reorder"); // drag a forward toward the end
        expect(interactions.dragMovedForward).toBe(true);

        interactions.onDragEnd();
        interactions.onDragStart(3);
        interactions.onInternalHover(1, "reorder"); // drag d backward toward the start
        expect(interactions.dragMovedForward).toBe(false);
    });

    it("highlights a folder drop target, but not itself or a non-folder", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into"); // central band of the folder
        expect(interactions.dropIndex).toBe(1);
        interactions.onInternalHover(0, "reorder"); // non-folder
        expect(interactions.dropIndex).toBe(-1);
    });

    it("reorders past a folder when hovering its edge band, not its centre", () => {
        const { interactions, contents } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "after"); // trailing band of the folder → reorder after it
        expect(interactions.dropIndex).toBe(-1);
        expect(interactions.dragIndex).toBe(2); // a lands after f
    });

    it("snaps a live preview back when the pointer enters a folder's centre band", () => {
        const { interactions, contents } = make([
            item("a"),
            item("b"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "reorder"); // dragging right past b → gap after it (2)
        expect(interactions.dragIndex).toBe(2);
        interactions.onInternalHover(2, "into"); // into the folder's centre band
        // The dragged row is restored to its start slot and the folder lights up.
        expect(contents.movePreview).toHaveBeenLastCalledWith(
            "http://nohost/plone/folder/a",
            0
        );
        expect(interactions.dragIndex).toBe(0);
        expect(interactions.dropIndex).toBe(2);
    });

    it("still moves into a folder after its edge band set the reorder preview", () => {
        // Regression: entering a folder through its edge sets dragIndex=index;
        // the move-into guard must key off the dragged id, not dragIndex, or the
        // centre band can never light up once the pointer crossed the edge.
        const { interactions } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "after"); // edge of the folder → reorder preview (gap 2)
        expect(interactions.dragIndex).toBe(2);
        interactions.onInternalHover(1, "into"); // same folder, now the centre band
        expect(interactions.dropIndex).toBe(1);
        expect(interactions.dragIndex).toBe(0); // preview snapped back
    });

    it("canReorder only in manual-order mode", () => {
        const { interactions, contents } = make([item("a")]);
        expect(interactions.canReorder).toBe(true);
        contents.sortOn = "modified";
        expect(interactions.canReorder).toBe(false);
    });
});

describe("ListInteractions — onDrop", () => {
    beforeEach(() => {
        // Dropping into a folder confirms first; default to accepting.
        window.confirm = jest.fn(() => true);
    });

    it("moves a single dragged row into a folder and clears the selection", async () => {
        const { interactions, contents, selection } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into"); // highlight the folder (central band)
        await interactions.onDrop(1);
        expect(contents.moveIntoFolder).toHaveBeenCalledWith(
            "http://nohost/plone/folder/f",
            ["http://nohost/plone/folder/a"]
        );
        expect(selection.clear).toHaveBeenCalled();
        expect(interactions.dragIndex).toBe(-1);
    });

    it("does not move into a folder when the confirmation is declined", async () => {
        window.confirm = jest.fn(() => false);
        const { interactions, contents, selection } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into");
        await interactions.onDrop(1);
        expect(window.confirm).toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
        expect(selection.clear).not.toHaveBeenCalled();
    });

    it("confirms the folder move through the dialog store when present", async () => {
        const confirm = makeConfirm(true);
        const { interactions, contents } = make(
            [item("a"), item("f", { is_folderish: true })],
            makeSelection(),
            makeClipboard(),
            makeUpload(),
            confirm
        );
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into");
        await interactions.onDrop(1);
        expect(confirm.ask).toHaveBeenCalled();
        expect(contents.moveIntoFolder).toHaveBeenCalled();
    });

    it("aborts the folder move when the dialog store is declined", async () => {
        const confirm = makeConfirm(false);
        const { interactions, contents } = make(
            [item("a"), item("f", { is_folderish: true })],
            makeSelection(),
            makeClipboard(),
            makeUpload(),
            confirm
        );
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into");
        await interactions.onDrop(1);
        expect(confirm.ask).toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("moves the whole selection into a folder when the dragged row is selected", async () => {
        const selection = makeSelection();
        selection.isSelected.mockReturnValue(true);
        selection.count = 3;
        selection.urls = ["u1", "u2", "u3"];
        const { interactions, contents } = make(
            [item("a"), item("f", { is_folderish: true })],
            selection
        );
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "into");
        await interactions.onDrop(1);
        expect(contents.moveIntoFolder).toHaveBeenCalledWith("http://nohost/plone/folder/f", [
            "u1",
            "u2",
            "u3",
        ]);
    });

    it("moves the dragged item into the parent on a parent-placeholder drop, then clears selection", async () => {
        const confirm = makeConfirm(true);
        const { interactions, contents, selection } = make(
            [item("a"), item("b")],
            makeSelection(),
            makeClipboard(),
            makeUpload(),
            confirm
        );
        interactions.onDragStart(0);
        interactions.onParentDragEnter(dragEvent());
        expect(interactions.parentDrop).toBe(true);
        await interactions.onParentDrop(dragEvent());
        expect(confirm.ask).toHaveBeenCalled();
        expect(contents.moveIntoFolder).toHaveBeenCalledWith("http://nohost/plone", [
            "http://nohost/plone/folder/a",
        ]);
        expect(selection.clear).toHaveBeenCalled();
        expect(interactions.parentDrop).toBe(false);
    });

    it("aborts the parent move when the confirmation is declined", async () => {
        const confirm = makeConfirm(false);
        const { interactions, contents } = make(
            [item("a"), item("b")],
            makeSelection(),
            makeClipboard(),
            makeUpload(),
            confirm
        );
        interactions.onDragStart(0);
        await interactions.onParentDrop(dragEvent());
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("uploads dropped files into the parent folder (no internal drag)", async () => {
        const { interactions, upload } = make([item("a")]);
        await interactions.onParentDrop(dragEvent([{ name: "x.txt" }]));
        expect(upload.uploadFiles).toHaveBeenCalledWith(
            [{ name: "x.txt" }],
            "http://nohost/plone"
        );
    });

    it("clears the parent highlight on drag leave", () => {
        const { interactions } = make([item("a")]);
        interactions.onDragStart(0);
        interactions.onParentDragEnter(dragEvent());
        interactions.onParentDragLeave();
        expect(interactions.parentDrop).toBe(false);
    });

    it("keeps the parent highlight lit across dragover (re-affirmed each event)", () => {
        // A dragleave onto the placeholder's children clears parentDrop; the
        // continuous dragover stream must restore it so the target stays lit.
        const { interactions } = make([item("a")]);
        interactions.onDragStart(0);
        interactions.onParentDragEnter(dragEvent());
        interactions.onParentDragLeave(); // crossed onto a child → cleared
        expect(interactions.parentDrop).toBe(false);
        const event = dragEvent();
        interactions.onParentDragOver(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(interactions.parentDrop).toBe(true);
    });

    it("live-previews the reorder as the drag passes a non-folder row", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onDragStart(0);
        interactions.onInternalHover(2, "reorder"); // dragging right past c → gap after it (3)
        // The marker sits in the gap after c (the side the drag is heading toward).
        expect(contents.movePreview).toHaveBeenCalledWith(
            "http://nohost/plone/folder/a",
            3
        );
        expect(interactions.dragIndex).toBe(3);
    });

    it("commits the previewed reorder on drop in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "reorder"); // live preview moves the dragged row to slot 1
        await interactions.onDrop(1);
        expect(contents.commitReorder).toHaveBeenCalledWith("a", 1, ["a", "b"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("commits a reorder AFTER a folder when dropped on its trailing band", async () => {
        // Regression: the trailing band must land the item *after* the folder,
        // not at the folder's own slot (which is "before" it).
        const { interactions, contents } = make([
            item("a"),
            item("b"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0); // drag a (index 0), folder f at index 2
        interactions.onInternalHover(2, "after");
        await interactions.onDrop(2);
        // f sits at index 1 once a is lifted; "after f" = slot 2 → delta +2.
        expect(contents.commitReorder).toHaveBeenCalledWith("a", 2, ["a", "b", "f"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("commits a reorder BEFORE a folder when dropped on its leading band", async () => {
        const { interactions, contents } = make([
            item("a"),
            item("b"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onInternalHover(2, "before");
        await interactions.onDrop(2);
        // "before f" = slot 1 → delta +1.
        expect(contents.commitReorder).toHaveBeenCalledWith("a", 1, ["a", "b", "f"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("does not reorder when not in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.onDragStart(0);
        interactions.onInternalHover(1, "reorder");
        await interactions.onDrop(1);
        expect(contents.movePreview).not.toHaveBeenCalled();
        expect(contents.commitReorder).not.toHaveBeenCalled();
    });

    it("is a no-op when dropping a row onto itself", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(1);
        await interactions.onDrop(1);
        expect(contents.commitReorder).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("is a no-op when no drag is in progress", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        await interactions.onDrop(1);
        expect(contents.commitReorder).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("restores the real order when a previewed drag is abandoned", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onDragStart(0);
        interactions.onInternalHover(2, "reorder"); // preview moved the rows
        interactions.onDragEnd(); // dropped outside / Esc — no commit
        expect(contents.commitReorder).not.toHaveBeenCalled();
        expect(contents.load).toHaveBeenCalledWith({ silent: true });
        expect(interactions.dragIndex).toBe(-1);
    });

    it("does not reload on a plain drag end with no preview", () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(0);
        interactions.onDragEnd();
        expect(contents.load).not.toHaveBeenCalled();
    });

    it("drags a contiguous selection as one block and commits it together", async () => {
        const selection = selectionFor(["b", "c"]);
        const { interactions, contents } = make(
            [item("a"), item("b"), item("c"), item("d")],
            selection
        );
        interactions.onDragStart(1); // grab the selected run {b, c}
        interactions.onInternalHover(3, "reorder"); // drag past d
        expect(contents.movePreviewBlock).toHaveBeenCalledWith(["b", "c"], 3);
        await interactions.onDrop(3);
        expect(contents.commitReorderBlock).toHaveBeenCalledWith(
            ["b", "c"],
            expect.any(Number),
            ["a", "b", "c", "d"]
        );
        expect(contents.commitReorder).not.toHaveBeenCalled();
    });

    it("falls back to a single-row move when the selection is not contiguous", async () => {
        const selection = selectionFor(["a", "c"]); // a gap at b
        const { interactions, contents } = make(
            [item("a"), item("b"), item("c")],
            selection
        );
        interactions.onDragStart(0);
        interactions.onInternalHover(2, "reorder");
        await interactions.onDrop(2);
        expect(contents.movePreviewBlock).not.toHaveBeenCalled();
        expect(contents.commitReorderBlock).not.toHaveBeenCalled();
        expect(contents.commitReorder).toHaveBeenCalled();
    });

    it("does not reorder a block inside itself while dragging over its own rows", () => {
        const selection = selectionFor(["b", "c"]);
        const { interactions, contents } = make(
            [item("a"), item("b"), item("c"), item("d")],
            selection
        );
        interactions.onDragStart(1);
        interactions.onInternalHover(2, "reorder"); // hover the other selected row in the block
        expect(contents.movePreviewBlock).not.toHaveBeenCalled();
    });
});

// A dragover event over an element of the given rect, with the pointer at the
// given fraction along an axis (the bits isIntoZone reads).
function overEvent(
    fraction: number,
    axis: "x" | "y",
    rect = { left: 0, top: 0, width: 100, height: 40 }
) {
    const clientX = axis === "x" ? rect.left + fraction * rect.width : 0;
    const clientY = axis === "y" ? rect.top + fraction * rect.height : 0;
    return {
        preventDefault: jest.fn(),
        clientX,
        clientY,
        currentTarget: { getBoundingClientRect: () => rect },
        dataTransfer: { types: ["text/plain"], files: [], dropEffect: "none" },
    } as unknown as DragEvent;
}

describe("ListInteractions — folder drop zones (dragover geometry)", () => {
    it("treats the centre of a folder row as move-into (table, y axis)", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.5, "y"), 1, "y");
        expect(interactions.dropIndex).toBe(1);
    });

    it("treats the leading edge of a folder as reorder-before (table, y axis)", () => {
        // a(0)  x(1)  f(2): drag a; the folder's top band → land a just before f.
        const { interactions } = make([
            item("a"),
            item("x"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.05, "y"), 2, "y"); // top band → before
        expect(interactions.dropIndex).toBe(-1);
        // Marker gap sits before f (index 2); the commit applies the removal shift.
        expect(interactions.dragIndex).toBe(2);
    });

    it("treats the trailing edge of a folder as reorder-after (table, y axis)", () => {
        const { interactions } = make([
            item("a"),
            item("x"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.95, "y"), 2, "y"); // bottom band → after
        expect(interactions.dropIndex).toBe(-1);
        expect(interactions.dragIndex).toBe(3); // marker gap after f (index 3)
    });

    it("uses the x axis for grid cards: the left edge reorders before", () => {
        const { interactions } = make([
            item("a"),
            item("x"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.05, "x"), 2, "x"); // left band → before
        expect(interactions.dropIndex).toBe(-1);
        expect(interactions.dragIndex).toBe(2); // marker gap before f (index 2)
    });

    it("uses the x axis for grid cards: the centre moves into the folder", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.5, "x"), 1, "x"); // centre
        expect(interactions.dropIndex).toBe(1);
    });

    it("always reorders over a non-folder row regardless of pointer position", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onDragStart(0);
        interactions.onRowDragOver(overEvent(0.5, "y"), 2, "y"); // dead centre
        expect(interactions.dropIndex).toBe(-1);
        expect(contents.movePreview).toHaveBeenCalledWith(
            "http://nohost/plone/folder/a",
            3
        );
    });
});

describe("ListInteractions — external file drags", () => {
    it("highlights a subfolder row and allows the drop while dragging files", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        const event = dragEvent();
        interactions.onRowDragOver(event, 1);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.dataTransfer!.dropEffect).toBe("copy");
        expect(interactions.fileDropIndex).toBe(1);
    });

    it("does not highlight or claim a non-folder row for file drags", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        const event = dragEvent();
        interactions.onRowDragOver(event, 0);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(interactions.fileDropIndex).toBe(-1);
    });

    it("drops the highlight when the file drag moves onto a non-folder row", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onRowDragEnter(dragEvent(), 1);
        expect(interactions.fileDropIndex).toBe(1);
        interactions.onRowDragEnter(dragEvent(), 0);
        expect(interactions.fileDropIndex).toBe(-1);
    });

    it("uploads files dropped onto a subfolder into that folder", async () => {
        const { interactions, upload } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        const event = dragEvent([{ name: "pic.png" }]);
        await interactions.onRowDrop(event, 1);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(upload.uploadFiles).toHaveBeenCalledWith(
            [{ name: "pic.png" }],
            "http://nohost/plone/folder/f"
        );
        expect(interactions.fileDropIndex).toBe(-1);
    });

    it("lets a file drop on a non-folder row bubble to the upload zone", async () => {
        const { interactions, upload } = make([item("a"), item("b")]);
        const event = dragEvent([{ name: "pic.png" }]);
        await interactions.onRowDrop(event, 0);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(upload.uploadFiles).not.toHaveBeenCalled();
    });

    it("ignores non-file drags in the file handlers", () => {
        const { interactions } = make([item("f", { is_folderish: true })]);
        const event = nonFileDragEvent();
        interactions.onRowDragOver(event, 0);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(interactions.fileDropIndex).toBe(-1);
    });

    it("internal drags still take precedence over file handling", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onDragStart(0);
        const event = dragEvent();
        interactions.onRowDragOver(event, 1);
        // internal-drag branch preventDefaults but leaves fileDropIndex alone
        expect(event.preventDefault).toHaveBeenCalled();
        expect(interactions.fileDropIndex).toBe(-1);
    });
});
