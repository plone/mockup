import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

const vocabularyUrl = "http://localhost/plone/@@getVocabulary";

const item = (uid, title) => ({
    UID: uid,
    Title: title,
    "@id": `http://localhost/plone/${uid}`,
    path: `/plone/${uid}`,
    portal_type: "Document",
    getIcon: "",
    is_folderish: false,
    review_state: "published",
    getURL: `http://localhost/plone/${uid}`,
});

function mockVocabulary(items) {
    global.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ results: items, total: items.length }),
    }));
}

async function mountField(value) {
    const options = { vocabularyUrl };
    document.body.innerHTML = `
        <div id="contentbrowser-field">
            <input type="text" id="field" value="${value}" class="pat-contentbrowser"
                   data-pat-contentbrowser='${JSON.stringify(options)}'>
        </div>
    `;
    const input = document.getElementById("field");
    const changes = [];
    input.addEventListener("change", () => changes.push(input.value));
    registry.scan(document.body);
    await utils.timeout(1);
    return { input, changes };
}

describe("Content Browser selection", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
    });

    it("does not fire change while rendering the initial selection", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        expect(document.querySelectorAll(".selected-item").length).toEqual(2);
        expect(input.value).toEqual("uid-1,uid-2");
        expect(changes).toEqual([]);
    });

    it("fires change when an item is unselected", async () => {
        mockVocabulary([item("uid-1", "One"), item("uid-2", "Two")]);
        const { input, changes } = await mountField("uid-1,uid-2");
        await utils.timeout(1);

        document.querySelector(".selected-item button[aria-label=remove]").click();
        await utils.timeout(1);

        expect(input.value).toEqual("uid-2");
        expect(changes).toEqual(["uid-2"]);
    });
});
