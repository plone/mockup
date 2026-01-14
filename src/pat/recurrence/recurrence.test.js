import "./recurrence";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Recurrence", function () {
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("initialize empty reccurence modal", async function () {
        document.body.innerHTML = `
            <textarea class="pat-recurrence"></textarea>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll("div.ridisplay").length).toEqual(1);
        expect(
            document.querySelectorAll("div.ridisplay div.rioccurrences").length,
        ).toEqual(1);
        expect(document.querySelectorAll("div.riform div.rioccurrences").length).toEqual(
            1,
        );

        // initially hidden elements
        expect(
            document.querySelector("div.ridisplay div.rioccurrences").style.display,
        ).toEqual("none");
        expect(document.querySelector("div.riform").style.display).toEqual("none");
    });
});
