import Pattern from "./contentbrowser";
import plone_registry from "@plone/registry";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

const DEFAULT_KEY = "pat-contentbrowser.SelectedItem";

// The jest setup cannot compile Svelte components, so stand in for the
// default component with a plain function.
const mockDefaultSelectedItem = () => "default SelectedItem";
jest.mock("./src/SelectedItem.svelte", () => ({
    __esModule: true,
    default: mockDefaultSelectedItem,
}));


describe("Content Browser", () => {
    beforeEach(() => {
        let options = {
            vocabularyUrl: "/contentbrowser-test.json",
        }
        document.body.innerHTML = `
            <div id="contentbrowser-field">
                <input type="text" value="" class="pat-contentbrowser" data-pat-contentbrowser="${JSON.stringify(options)}">
            </div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it.skip("create contentbrowser pattern without preselection", async function () {
        expect(document.querySelectorAll(".content-browser-wrapper").length).toEqual(0);

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".content-browser-wrapper").length).toEqual(1);
    });

});

describe("Content Browser default components", () => {
    afterEach(() => {
        delete plone_registry.components[DEFAULT_KEY];
    });

    it("registers the default SelectedItem component", async function () {
        expect(plone_registry.getComponent(DEFAULT_KEY).component).toBeUndefined();

        await Pattern.register_default_components();

        expect(plone_registry.getComponent(DEFAULT_KEY).component).toBe(
            mockDefaultSelectedItem,
        );
    });

    it("keeps a component an add-on registered under the default key", async function () {
        const custom = () => "custom SelectedItem";
        plone_registry.registerComponent({ name: DEFAULT_KEY, component: custom });

        await Pattern.register_default_components();

        expect(plone_registry.getComponent(DEFAULT_KEY).component).toBe(custom);
    });

    it("does not overwrite the add-on component on repeated initialization", async function () {
        const custom = () => "custom SelectedItem";
        plone_registry.registerComponent({ name: DEFAULT_KEY, component: custom });

        await Pattern.register_default_components();
        await Pattern.register_default_components();

        expect(plone_registry.getComponent(DEFAULT_KEY).component).toBe(custom);
    });
});
