import { ListInteractions } from "./ListInteractions.svelte";

function item(id: string, extra: Record<string, unknown> = {}) {
    return { "@id": `http://nohost/plone/folder/${id}`, UID: id, Title: id, ...extra };
}

function makeContents(items: ReturnType<typeof item>[]) {
    return {
        items,
        sortOn: "getObjPositionInParent",
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

function make(
    items: ReturnType<typeof item>[],
    selection = makeSelection(),
    clipboard = makeClipboard(),
    upload = makeUpload()
) {
    const contents = makeContents(items);
    const interactions = new ListInteractions(
        contents as never,
        selection as never,
        clipboard as never,
        upload as never
    );
    return { interactions, contents, selection, clipboard, upload };
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

    it("highlights a folder drop target, but not itself or a non-folder", () => {
        const { interactions } = make([item("a"), item("f", { is_folderish: true })]);
        interactions.onDragStart(0);
        interactions.onDragEnter(1);
        expect(interactions.dropIndex).toBe(1);
        interactions.onDragEnter(0); // non-folder
        expect(interactions.dropIndex).toBe(-1);
    });

    it("canReorder only in manual-order mode", () => {
        const { interactions, contents } = make([item("a")]);
        expect(interactions.canReorder).toBe(true);
        contents.sortOn = "modified";
        expect(interactions.canReorder).toBe(false);
    });
});

describe("ListInteractions — onDrop", () => {
    it("moves a single dragged row into a folder and clears the selection", async () => {
        const { interactions, contents, selection } = make([
            item("a"),
            item("f", { is_folderish: true }),
        ]);
        interactions.onDragStart(0);
        await interactions.onDrop(1);
        expect(contents.moveIntoFolder).toHaveBeenCalledWith(
            "http://nohost/plone/folder/f",
            ["http://nohost/plone/folder/a"]
        );
        expect(selection.clear).toHaveBeenCalled();
        expect(interactions.dragIndex).toBe(-1);
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
        await interactions.onDrop(1);
        expect(contents.moveIntoFolder).toHaveBeenCalledWith("http://nohost/plone/folder/f", [
            "u1",
            "u2",
            "u3",
        ]);
    });

    it("live-previews the reorder as the drag passes a non-folder row", () => {
        const { interactions, contents } = make([item("a"), item("b"), item("c")]);
        interactions.onDragStart(0);
        interactions.onDragEnter(2);
        // The dragged row glides to slot 2 (flip animates the displaced rows) and
        // the drop will commit from there.
        expect(contents.movePreview).toHaveBeenCalledWith(
            "http://nohost/plone/folder/a",
            2
        );
        expect(interactions.dragIndex).toBe(2);
    });

    it("commits the previewed reorder on drop in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(0);
        interactions.onDragEnter(1); // live preview moves the dragged row to slot 1
        await interactions.onDrop(1);
        expect(contents.commitReorder).toHaveBeenCalledWith("a", 1, ["a", "b"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("does not reorder when not in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.onDragStart(0);
        interactions.onDragEnter(1);
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
        interactions.onDragEnter(2); // preview moved the rows
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
        interactions.onDragEnter(3); // drag past d
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
        interactions.onDragEnter(2);
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
        interactions.onDragEnter(2); // hover the other selected row in the block
        expect(contents.movePreviewBlock).not.toHaveBeenCalled();
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
