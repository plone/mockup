import Pattern from "./toolbar";

describe("Toolbar", function () {
    it("Initializes correctly", function () {
        document.body.innerHTML = `
            <div id="edit-zone">
                <div class="pat-toolbar" />
            </div>
        `;
        const el = document.body.querySelector(".pat-toolbar");
        new Pattern(el);
        expect(el.classList.contains("initialized")).toBe(true);
    });
});
