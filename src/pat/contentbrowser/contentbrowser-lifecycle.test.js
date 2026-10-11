import Pattern from "./contentbrowser";
import { mount, unmount } from "svelte";
import utils from "@patternslib/patternslib/src/core/utils";

// init() imports the svelte runtime and the components lazily; it stays
// pending until those imports resolve. Stand in for all of them.
jest.mock("svelte", () => ({ mount: jest.fn(() => ({})), unmount: jest.fn() }));
jest.mock("./src/App.svelte", () => ({ __esModule: true, default: () => {} }));
jest.mock("./src/SelectedItem.svelte", () => ({ __esModule: true, default: () => {} }));

describe("Content Browser lifecycle", () => {
    let pattern;

    beforeEach(() => {
        document.body.innerHTML = '<div><input id="reference" style="display: inline"></div>';
        // Built without the constructor, which would start init() itself.
        pattern = Object.assign(Object.create(Pattern.prototype), {
            el: document.getElementById("reference"),
            name: "contentbrowser",
            options: { vocabularyUrl: "/contentbrowser-test.json" },
        });
        mount.mockClear();
        unmount.mockClear();
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("does not mount a widget destroyed while it loads", async () => {
        const initializing = pattern.init();
        pattern.destroy();
        await initializing;
        expect(mount).not.toHaveBeenCalled();
        expect(document.querySelector(".content-browser-wrapper")).toBeNull();
    });

    it("does not mount a widget removed while it loads", async () => {
        const initializing = pattern.init();
        pattern.el.remove();
        await initializing;
        expect(mount).not.toHaveBeenCalled();
    });

    it("mounts a widget inserted while it loads", async () => {
        const parent = pattern.el.parentNode;
        pattern.el.remove();
        const initializing = pattern.init();
        parent.appendChild(pattern.el);
        await initializing;
        expect(mount).toHaveBeenCalledTimes(1);
    });

    it("unmounts once, removes its wrapper and shows the input again", async () => {
        await pattern.init();
        const component = mount.mock.results[0].value;
        pattern.destroy();
        pattern.destroy();
        expect(unmount).toHaveBeenCalledTimes(1);
        expect(unmount).toHaveBeenCalledWith(component);
        expect(document.querySelector(".content-browser-wrapper")).toBeNull();
        expect(pattern.el.style.display).toBe("inline");
    });

    describe("instantiated again on the same input", () => {
        const options = { vocabularyUrl: "/contentbrowser-test.json" };
        let input;

        beforeEach(() => {
            input = pattern.el;
        });

        it("releases an input destroyed before init() ran", async () => {
            // BasePattern runs init() on a timer, which destroy() can't cancel.
            new Pattern(input, options).destroy();
            await utils.timeout(1);
            expect(input.style.display).toBe("inline");
            expect(input["pattern-contentbrowser"]).toBeUndefined();

            new Pattern(input, options);
            await utils.timeout(1);
            expect(mount).toHaveBeenCalledTimes(1);
        });

        it("mounts when its destroyed predecessor has not run init() yet", async () => {
            new Pattern(input, options).destroy();
            const successor = new Pattern(input, options);
            await utils.timeout(1);
            expect(mount).toHaveBeenCalledTimes(1);
            expect(input["pattern-contentbrowser"]).toBe(successor);
        });

        it("releases an input removed while it loads", async () => {
            const parent = input.parentNode;
            input["pattern-contentbrowser"] = pattern;
            const initializing = pattern.init();
            input.remove();
            await initializing;
            expect(input.style.display).toBe("inline");
            expect(input["pattern-contentbrowser"]).toBeUndefined();

            parent.appendChild(input);
            new Pattern(input, options);
            await utils.timeout(1);
            expect(mount).toHaveBeenCalledTimes(1);
        });
    });
});
