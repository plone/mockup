import { ListInteractions } from "./ListInteractions.svelte";

function item(id: string, extra: Record<string, unknown> = {}) {
    return {
        "@id": `http://nohost/plone/folder/${id}`,
        "UID": id,
        "Title": id,
        ...extra,
    };
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
    ({ target: null, ...opts } as unknown as MouseEvent);
const keyEvent = (opts: Record<string, unknown> = {}) =>
    ({ target: null, preventDefault: jest.fn(), ...opts } as unknown as KeyboardEvent);

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
        const { interactions, selection, contents } = make([
            item("a"),
            item("b"),
            item("c"),
        ]);
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
        const { interactions, selection, contents } = make([
            item("a"),
            item("b"),
            item("c"),
        ]);
        interactions.onItemClick(clickEvent(), contents.items[0], 0); // anchor 0
        interactions.onItemKeydown(
            keyEvent({ key: " ", shiftKey: true }),
            contents.items[2],
            2
        );
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
    it("marks a drag active on start and clears all bookkeeping on end", async () => {
        const { interactions } = make([item("a"), item("b")]);
        expect(interactions.dragActive).toBe(false);
        interactions.dragStart(1);
        expect(interactions.dragActive).toBe(true);
        await interactions.dragEnd(0);
        expect(interactions.dragActive).toBe(false);
        expect(interactions.dropIndex).toBe(-1);
        expect(interactions.parentDrop).toBe(false);
    });
});

describe("ListInteractions — dragMove (hover decisions)", () => {
    it("highlights a hovered folder as a move-into target and never swaps with it", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.dragStart(0);
        const allow = interactions.dragMove(1); // hovering the folder
        expect(interactions.dropIndex).toBe(1);
        // Folders are solid drop targets: sortablejs must not reorder-swap with
        // one, so it stays put under the pointer and dropping in is reliable.
        expect(allow).toBe(false);
    });

    it("never highlights the dragged folder itself (and may reorder past it)", () => {
        const { interactions } = make([item("f", { is_folderish: true }), item("a")]);
        interactions.dragStart(0); // grab the folder
        const allow = interactions.dragMove(0);
        expect(interactions.dropIndex).toBe(-1);
        expect(allow).toBe(true);
    });

    it("never highlights a non-folder row as a move-into target (reorder there)", () => {
        const { interactions } = make([item("a"), item("b")]);
        interactions.dragStart(0);
        const allow = interactions.dragMove(1);
        expect(interactions.dropIndex).toBe(-1);
        expect(allow).toBe(true); // manual-order mode allows the reorder
    });

    it("lets the parent placeholder win and keeps the list still", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.dragStart(0);
        interactions.onParentDragEnter(dragEvent()); // parentDrop set by the up-card
        const allow = interactions.dragMove(1); // even over a folder
        expect(allow).toBe(false);
        expect(interactions.dropIndex).toBe(-1);
    });

    it("does not allow a reorder when not in manual-order mode", () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.dragStart(0);
        const allow = interactions.dragMove(1);
        expect(allow).toBe(false);
        expect(interactions.dropIndex).toBe(-1);
    });
});

describe("ListInteractions — dragEnd (moves & reorder)", () => {
    beforeEach(() => {
        // Dropping into a folder confirms first; default to accepting.
        window.confirm = jest.fn(() => true);
    });

    it("moves a single dragged row into a folder and clears the selection", async () => {
        const { interactions, contents, selection } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.dragStart(0);
        interactions.dragMove(1); // highlight the folder (central band)
        await interactions.dragEnd(0); // no reorder happened → delta 0
        expect(contents.moveIntoFolder).toHaveBeenCalledWith(
            "http://nohost/plone/folder/f",
            ["http://nohost/plone/folder/a"]
        );
        expect(selection.clear).toHaveBeenCalled();
        expect(interactions.dragActive).toBe(false);
    });

    it("does not move into a folder when the confirmation is declined", async () => {
        window.confirm = jest.fn(() => false);
        const { interactions, contents, selection } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.dragStart(0);
        interactions.dragMove(1);
        await interactions.dragEnd(0);
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
        interactions.dragStart(0);
        interactions.dragMove(1);
        await interactions.dragEnd(0);
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
        interactions.dragStart(0);
        interactions.dragMove(1);
        await interactions.dragEnd(0);
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
        interactions.dragStart(0);
        interactions.dragMove(1);
        await interactions.dragEnd(0);
        expect(contents.moveIntoFolder).toHaveBeenCalledWith(
            "http://nohost/plone/folder/f",
            ["u1", "u2", "u3"]
        );
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
        interactions.dragStart(0);
        interactions.onParentDragEnter(dragEvent());
        expect(interactions.parentDrop).toBe(true);
        // The up-card drop is a no-op marker; dragEnd commits the parent move.
        await interactions.onParentDrop(dragEvent());
        await interactions.dragEnd(0);
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
        interactions.dragStart(0);
        interactions.onParentDragEnter(dragEvent());
        await interactions.dragEnd(0);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("commits a reorder to the dragged row's new slot in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.dragStart(0);
        interactions.dragMove(1); // reorder hover past b
        await interactions.dragEnd(1); // sortablejs moved a one slot down
        expect(contents.moveTo).toHaveBeenCalledWith("a", 1, ["a", "b"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("commits a backward reorder with a negative delta", async () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.dragStart(2); // grab c
        interactions.dragMove(0);
        await interactions.dragEnd(-2); // c moved to the top
        expect(contents.moveTo).toHaveBeenCalledWith("c", -2, ["a", "b", "c"]);
    });

    it("does not reorder when not in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.dragStart(0);
        await interactions.dragEnd(1);
        expect(contents.moveTo).not.toHaveBeenCalled();
    });

    it("is a no-op when the row did not move (delta 0)", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.dragStart(1);
        await interactions.dragEnd(0);
        expect(contents.moveTo).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("is a no-op when no drag is in progress", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        await interactions.dragEnd(1);
        expect(contents.moveTo).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });
});

describe("ListInteractions — keyboard move-mode", () => {
    it("toggles move-mode for a card, but only in manual-order mode", () => {
        const { interactions } = make([item("a"), item("b")]);
        expect(interactions.isMoving(item("a"))).toBe(false);
        interactions.toggleMoveMode(item("a"));
        expect(interactions.isMoving(item("a"))).toBe(true);
        // A second toggle leaves move-mode again.
        interactions.toggleMoveMode(item("a"));
        expect(interactions.isMoving(item("a"))).toBe(false);
    });

    it("does not enter move-mode when the listing is not manually ordered", () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.toggleMoveMode(item("a"));
        expect(interactions.isMoving(item("a"))).toBe(false);
    });

    it("only one card is in move-mode at a time", () => {
        const { interactions } = make([item("a"), item("b")]);
        interactions.toggleMoveMode(item("a"));
        interactions.toggleMoveMode(item("b"));
        expect(interactions.isMoving(item("a"))).toBe(false);
        expect(interactions.isMoving(item("b"))).toBe(true);
    });

    it("ArrowDown steps the move-mode card one slot forward", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.toggleMoveMode(item("a"));
        interactions.onItemKeydown(keyEvent({ key: "ArrowDown" }), item("a"), 0);
        expect(contents.moveTo).toHaveBeenCalledWith("a", 1, ["a", "b", "c"]);
    });

    it("ArrowUp steps the move-mode card one slot backward", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.toggleMoveMode(item("c"));
        interactions.onItemKeydown(keyEvent({ key: "ArrowUp" }), item("c"), 2);
        expect(contents.moveTo).toHaveBeenCalledWith("c", -1, ["a", "b", "c"]);
    });

    it("ArrowLeft/ArrowRight mirror Up/Down in the 2-D grid", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.toggleMoveMode(item("b"));
        interactions.onItemKeydown(keyEvent({ key: "ArrowRight" }), item("b"), 1);
        interactions.onItemKeydown(keyEvent({ key: "ArrowLeft" }), item("b"), 1);
        expect(contents.moveTo).toHaveBeenNthCalledWith(1, "b", 1, ["a", "b", "c"]);
        expect(contents.moveTo).toHaveBeenNthCalledWith(2, "b", -1, ["a", "b", "c"]);
    });

    it("ignores a step past either end of the listing", () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.toggleMoveMode(item("a"));
        interactions.onItemKeydown(keyEvent({ key: "ArrowUp" }), item("a"), 0); // already first
        interactions.toggleMoveMode(item("b"));
        interactions.onItemKeydown(keyEvent({ key: "ArrowDown" }), item("b"), 1); // already last
        expect(contents.moveTo).not.toHaveBeenCalled();
    });

    it("Escape and Enter leave move-mode without moving", () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.toggleMoveMode(item("a"));
        interactions.onItemKeydown(keyEvent({ key: "Escape" }), item("a"), 0);
        expect(interactions.isMoving(item("a"))).toBe(false);
        interactions.toggleMoveMode(item("b"));
        interactions.onItemKeydown(keyEvent({ key: "Enter" }), item("b"), 1);
        expect(interactions.isMoving(item("b"))).toBe(false);
        expect(contents.moveTo).not.toHaveBeenCalled();
    });

    it("does not select or open while a card is in move-mode", () => {
        const { interactions, selection } = make([item("a"), item("b")]);
        interactions.toggleMoveMode(item("a"));
        // Space would normally toggle selection; in move-mode it is suspended.
        interactions.onItemKeydown(keyEvent({ key: " " }), item("a"), 0);
        expect(selection.toggle).not.toHaveBeenCalled();
    });
});

describe("ListInteractions — parent placeholder highlight", () => {
    it("clears the parent highlight on drag leave", () => {
        const { interactions } = make([item("a")]);
        interactions.dragStart(0);
        interactions.onParentDragEnter(dragEvent());
        interactions.onParentDragLeave();
        expect(interactions.parentDrop).toBe(false);
    });

    it("keeps the parent highlight lit across dragover (re-affirmed each event)", () => {
        // A dragleave onto the placeholder's children clears parentDrop; the
        // continuous dragover stream must restore it so the target stays lit.
        const { interactions } = make([item("a")]);
        interactions.dragStart(0);
        interactions.onParentDragEnter(dragEvent());
        interactions.onParentDragLeave(); // crossed onto a child → cleared
        expect(interactions.parentDrop).toBe(false);
        const event = dragEvent();
        interactions.onParentDragOver(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(interactions.parentDrop).toBe(true);
    });

    it("uploads dropped files into the parent folder (no internal drag)", async () => {
        const { interactions, upload } = make([item("a")]);
        await interactions.onParentDrop(dragEvent([{ name: "x.txt" }]));
        expect(upload.uploadFiles).toHaveBeenCalledWith(
            [{ name: "x.txt" }],
            "http://nohost/plone"
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

    it("file handlers stand down while a sortablejs item drag is active", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.dragStart(0);
        const event = dragEvent();
        interactions.onRowDragOver(event, 1);
        // sortablejs owns the internal drag; the file handler does nothing.
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(interactions.fileDropIndex).toBe(-1);
    });
});
