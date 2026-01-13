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

    it("Adds a warning, if the occurrences preview cannot be loaded.", async function () {
        // Without any test mock server, the occurrences preview cannot be loaded.
        document.body.innerHTML = `
            <input name="start" type="date" value="2026-01-01" />
            <textarea class="pat-recurrence"
                      data-pat-recurrence='{
                          "startField": "[name=start]"
                      }'
            ></textarea>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        const edit_btn = document.querySelector("[name=riedit]");
        edit_btn.click();

        const occurrences_preview = document.querySelector(
            ".rioccurrences .alert-warning",
        );
        expect(occurrences_preview).toBeTruthy();
        expect(occurrences_preview.textContent.trim()).toBe(
            "Cannot load the occurrences preview.",
        );
    });

    it("Initializes without the additional dates feature.", async function () {
        document.body.innerHTML = `
            <input name="start" type="date" value="2026-01-01" />
            <textarea class="pat-recurrence"
                      data-pat-recurrence='{
                          "startField": "[name=start]"
                      }'
            ></textarea>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        const edit_btn = document.querySelector("[name=riedit]");
        edit_btn.click();

        const add_occurrence = document.querySelector(".modal .riaddoccurrence");
        expect(add_occurrence).toBeFalsy();
    });

    it("Initializes with the additional dates feature.", async function () {
        document.body.innerHTML = `
            <input name="start" type="date" value="2026-01-01" />
            <textarea class="pat-recurrence"
                      data-pat-recurrence='{
                          "startField": "[name=start]",
                          "allowAdditionalDates": true
                      }'
            ></textarea>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        const edit_btn = document.querySelector("[name=riedit]");
        edit_btn.click();

        const add_occurrence = document.querySelector(".modal .riaddoccurrence");
        expect(add_occurrence).toBeTruthy();
    });
});
