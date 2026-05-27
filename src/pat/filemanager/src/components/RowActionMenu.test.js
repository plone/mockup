import { mount, unmount, flushSync, tick } from "svelte";
import RowActionMenu from "./RowActionMenu.svelte";

// Component test for the row action menu, focused on the keyboard-accessible
// reorder controls (Move up / Move down / Move to top / Move to bottom) and the
// conditions under which they are enabled. Runs via the custom CJS .svelte
// transformer (tools/jest-svelte-component.cjs); svelte-jester cannot run here.

function makeContents(overrides = {}) {
    return {
        sortOn: "getObjPositionInParent",
        items: [{}, {}, {}],
        currentIds: ["a", "b", "c"],
        moveTo: jest.fn().mockResolvedValue(undefined),
        makeDefaultPage: jest.fn().mockResolvedValue(undefined),
        ...overrides,
    };
}

function render({ index = 1, item, contents, clipboard } = {}) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const context = new Map([
        ["contents", contents ?? makeContents()],
        ["clipboard", clipboard ?? { cut: jest.fn(), copy: jest.fn() }],
    ]);
    const resolvedItem = item ?? {
        "@id": "http://nohost/plone/folder/b",
        Title: "B",
        UID: "uid-b",
    };
    const inst = mount(RowActionMenu, {
        target,
        props: { item: resolvedItem, index },
        context,
    });
    return { target, inst, context };
}

async function open(target) {
    target.querySelector(".filemanager-rowmenu-toggle").click();
    flushSync();
    await tick();
}

function menuItem(target, label) {
    return [...target.querySelectorAll('[role="menuitem"]')].find(
        (el) => el.textContent.trim() === label
    );
}

afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
});

describe("RowActionMenu reorder controls", () => {
    it("disables Move up / Move to top on the first row", async () => {
        const { target, inst } = render({ index: 0 });
        await open(target);
        expect(menuItem(target, "Move up").disabled).toBe(true);
        expect(menuItem(target, "Move to top").disabled).toBe(true);
        expect(menuItem(target, "Move down").disabled).toBe(false);
        expect(menuItem(target, "Move to bottom").disabled).toBe(false);
        unmount(inst);
    });

    it("disables Move down / Move to bottom on the last row", async () => {
        const { target, inst } = render({ index: 2 });
        await open(target);
        expect(menuItem(target, "Move down").disabled).toBe(true);
        expect(menuItem(target, "Move to bottom").disabled).toBe(true);
        expect(menuItem(target, "Move up").disabled).toBe(false);
        expect(menuItem(target, "Move to top").disabled).toBe(false);
        unmount(inst);
    });

    it("enables all reorder controls on a middle row", async () => {
        const { target, inst } = render({ index: 1 });
        await open(target);
        for (const label of ["Move up", "Move down", "Move to top", "Move to bottom"]) {
            expect(menuItem(target, label).disabled).toBe(false);
        }
        unmount(inst);
    });

    it("disables every reorder control when not in manual-order mode", async () => {
        const contents = makeContents({ sortOn: "sortable_title" });
        const { target, inst } = render({ index: 1, contents });
        await open(target);
        for (const label of ["Move up", "Move down", "Move to top", "Move to bottom"]) {
            expect(menuItem(target, label).disabled).toBe(true);
        }
        unmount(inst);
    });

    it("moves a row up one step within the visible page", async () => {
        const contents = makeContents();
        const { target, inst } = render({ index: 1, contents });
        await open(target);
        menuItem(target, "Move up").click();
        flushSync();
        expect(contents.moveTo).toHaveBeenCalledWith("b", -1, ["a", "b", "c"]);
        unmount(inst);
    });

    it("moves a row down one step within the visible page", async () => {
        const contents = makeContents();
        const { target, inst } = render({ index: 1, contents });
        await open(target);
        menuItem(target, "Move down").click();
        flushSync();
        expect(contents.moveTo).toHaveBeenCalledWith("b", 1, ["a", "b", "c"]);
        unmount(inst);
    });

    it("uses absolute deltas (no subset) for Move to top / bottom", async () => {
        const contents = makeContents();
        const { target, inst } = render({ index: 1, contents });
        await open(target);
        menuItem(target, "Move to top").click();
        flushSync();
        expect(contents.moveTo).toHaveBeenCalledWith("b", "top");
        unmount(inst);
    });

    it("closes the menu after a reorder action", async () => {
        const { target, inst } = render({ index: 1 });
        await open(target);
        expect(target.querySelector('[role="menu"]')).toBeTruthy();
        menuItem(target, "Move up").click();
        flushSync();
        await tick();
        expect(target.querySelector('[role="menu"]')).toBeNull();
        unmount(inst);
    });
});
