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
        navigateTo: jest.fn().mockResolvedValue(undefined),
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

function make(
    items: ReturnType<typeof item>[],
    selection = makeSelection(),
    clipboard = makeClipboard()
) {
    const contents = makeContents(items);
    const interactions = new ListInteractions(
        contents as never,
        selection as never,
        clipboard as never
    );
    return { interactions, contents, selection, clipboard };
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

    it("reorders when dropping on a non-folder row in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(0);
        await interactions.onDrop(1);
        expect(contents.moveTo).toHaveBeenCalledWith("a", 1, ["a", "b"]);
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("does not reorder when not in manual-order mode", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        contents.sortOn = "modified";
        interactions.onDragStart(0);
        await interactions.onDrop(1);
        expect(contents.moveTo).not.toHaveBeenCalled();
    });

    it("is a no-op when dropping a row onto itself", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        interactions.onDragStart(1);
        await interactions.onDrop(1);
        expect(contents.moveTo).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });

    it("is a no-op when no drag is in progress", async () => {
        const { interactions, contents } = make([item("a"), item("b")]);
        await interactions.onDrop(1);
        expect(contents.moveTo).not.toHaveBeenCalled();
        expect(contents.moveIntoFolder).not.toHaveBeenCalled();
    });
});
