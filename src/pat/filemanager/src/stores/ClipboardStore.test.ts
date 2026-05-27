import { ClipboardStore } from "./ClipboardStore.svelte";

const items = [
    { url: "http://nohost/plone/a", title: "A" },
    { url: "http://nohost/plone/b", title: "B" },
];

describe("ClipboardStore", () => {
    it("starts empty", () => {
        const clip = new ClipboardStore();
        expect(clip.isEmpty).toBe(true);
        expect(clip.op).toBeNull();
        expect(clip.count).toBe(0);
    });

    it("records a cut and exposes the source urls", () => {
        const clip = new ClipboardStore();
        clip.cut(items);
        expect(clip.op).toBe("cut");
        expect(clip.count).toBe(2);
        expect(clip.sources).toEqual(["http://nohost/plone/a", "http://nohost/plone/b"]);
        expect(clip.isEmpty).toBe(false);
    });

    it("records a copy", () => {
        const clip = new ClipboardStore();
        clip.copy(items);
        expect(clip.op).toBe("copy");
        expect(clip.sources).toHaveLength(2);
    });

    it("clear empties the buffer", () => {
        const clip = new ClipboardStore();
        clip.cut(items);
        clip.clear();
        expect(clip.isEmpty).toBe(true);
        expect(clip.op).toBeNull();
    });

    it("copies the input array (later mutation does not leak in)", () => {
        const clip = new ClipboardStore();
        const input = [...items];
        clip.cut(input);
        input.push({ url: "http://nohost/plone/c", title: "C" });
        expect(clip.count).toBe(2);
    });
});
