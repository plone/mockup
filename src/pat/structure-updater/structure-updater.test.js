import "./structure-updater";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("StructureUpdater", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <div class="template-folder_contents" data-pat-structureupdater='{
                "titleSelector": "h1",
                "descriptionSelector": "p.lead"
            }'>
             <h1>Title</h1>
             <p class="lead">Description</p>
            </div>
        `;

        this.$el = $(".pat-autotoc");
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("change title and description on event", async function () {
        expect(document.querySelectorAll("nav").length).toEqual(0);

        registry.scan(document.body);
        await utils.timeout(1);

        $(document.body).trigger("context-info-loaded", {
            "object": {
                "Title": "New Title",
                "Description": "Changed Description"
            }
        })

        expect(document.querySelector("h1").innerHTML).toEqual("New Title");
        expect(document.querySelector("p.lead").innerHTML).toEqual("Changed Description");
    });
});
