import { mount, flushSync, tick } from "svelte";
import QueryBuilder from "./QueryBuilder.svelte";

// Component test for the advanced query builder: adding rows, picking an index /
// operation, and that complete criteria (and only complete ones) reach onApply
// as plone.app.querystring {i, o, v} triples. Runs via the custom CJS .svelte
// transformer (tools/jest-svelte-component.cjs).

const config = {
    indexes: {
        SearchableText: {
            title: "Text",
            group: "Text",
            enabled: true,
            operations: ["op.contains"],
            operators: { "op.contains": { title: "Contains", widget: "StringWidget" } },
        },
        portal_type: {
            title: "Type",
            group: "Metadata",
            enabled: true,
            operations: ["op.any"],
            operators: { "op.any": { title: "Any of", widget: "MultipleSelectionWidget" } },
            values: { Document: { title: "Page" }, Folder: { title: "Folder" } },
        },
    },
};

function render({ criteria = [], onApply = jest.fn() } = {}) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const inst = mount(QueryBuilder, {
        target,
        props: { config, criteria, onApply },
    });
    return { target, inst, onApply };
}

function setSelect(el, value) {
    el.value = value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
}

afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
});

describe("QueryBuilder", () => {
    it("shows an empty hint and an Add criteria button initially", () => {
        const { target } = render();
        expect(target.querySelector(".filemanager-querybuilder-empty")).toBeTruthy();
        expect(target.querySelector(".filemanager-querybuilder-add")).toBeTruthy();
    });

    it("adds a row and lists the enabled indexes grouped", async () => {
        const { target } = render();
        target.querySelector(".filemanager-querybuilder-add").click();
        flushSync();
        await tick();
        const index = target.querySelector(".filemanager-querybuilder-index");
        expect(index).toBeTruthy();
        const groups = [...index.querySelectorAll("optgroup")].map((g) => g.label);
        expect(groups).toEqual(["Text", "Metadata"]);
    });

    it("does not emit an incomplete criterion (index but empty value)", async () => {
        const { target, onApply } = render();
        target.querySelector(".filemanager-querybuilder-add").click();
        flushSync();
        await tick();
        setSelect(target.querySelector(".filemanager-querybuilder-index"), "SearchableText");
        // index + operation are set, but the StringWidget value is still empty
        expect(onApply).toHaveBeenLastCalledWith([]);
    });

    it("emits a complete {i, o, v} criterion once a value is entered", async () => {
        const { target, onApply } = render();
        target.querySelector(".filemanager-querybuilder-add").click();
        flushSync();
        await tick();
        setSelect(target.querySelector(".filemanager-querybuilder-index"), "SearchableText");
        const value = target.querySelector("input.filemanager-querybuilder-value");
        value.value = "hello";
        // input updates the bound row.v, change triggers the emit
        value.dispatchEvent(new Event("input", { bubbles: true }));
        value.dispatchEvent(new Event("change", { bubbles: true }));
        flushSync();
        expect(onApply).toHaveBeenLastCalledWith([
            { i: "SearchableText", o: "op.contains", v: "hello" },
        ]);
    });

    it("seeds rows from incoming criteria and removes them", async () => {
        const { target, onApply } = render({
            criteria: [{ i: "SearchableText", o: "op.contains", v: "seed" }],
        });
        expect(target.querySelector("input.filemanager-querybuilder-value").value).toBe("seed");
        target.querySelector(".filemanager-querybuilder-remove").click();
        flushSync();
        expect(onApply).toHaveBeenLastCalledWith([]);
    });
});
