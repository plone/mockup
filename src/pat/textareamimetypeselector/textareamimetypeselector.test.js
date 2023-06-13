import "./textareamimetypeselector";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Textarea MimeType Selector", function () {
    var initBody = async function (inline) {
        document.body.innerHTML += `
            <textarea name="text">hello world</textarea>
            <select
                name="text.mimeType"
                class="pat-textareamimetypeselector"
                data-pat-textareamimetypeselector='{
                  "textareaName": "text",
                  "widgets": {
                    "text/html": {
                      "pattern": "tinymce",
                      "patternOptions": {
                        "tiny": {
                          "plugins": [],
                          "menubar": "edit format tools",
                          "toolbar": " "
                        },
                        "inline": ${inline}
                      }
                    }
                  }
                }'>
              <option value="text/html">text/html</option>
              <option value="text/plain" selected="selected">text/plain</option>
            </select>`;

        registry.scan(document.body);
        await utils.timeout(2);
    };

    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("Switching changes widget", async function () {
        await initBody(false);

        var el = document.querySelector("[name='text.mimeType']");
        var textarea = document.querySelector("[name='text']");

        // Initially, text/plain is selected and textarea should be visible.
        expect(window.getComputedStyle(textarea).display).toEqual("inline-block");
        // But TinyMCE shouldn't be there
        expect(document.querySelectorAll(".tox-tinymce").length).toEqual(0);
        // Value should be at it's initial state
        expect(textarea.value).toEqual("hello world");

        // Now, select text/html
        el.value = "text/html";
        el.dispatchEvent(new Event("input"));
        await utils.timeout(2);

        // Textarea should be hidden
        expect(window.getComputedStyle(textarea).display).toEqual("none");
        // And TinyMCE should be shown
        const tinymce = document.querySelector(".tox-tinymce");
        expect(window.getComputedStyle(tinymce).display).toEqual("block");

        // Switching back to text/plain should destroy TinyMCE
        el.value = "text/plain";
        el.dispatchEvent(new Event("input"));
        await utils.timeout(2);

        expect(window.getComputedStyle(textarea).display).toEqual("inline-block");
        expect(document.querySelectorAll(".tox-tinymce").length).toEqual(0);

        // Unfortunately, TinyMCE changes the value just by loading TinyMCE.
        expect(textarea.value).toEqual("hello world");
    });

    it("Switching changes widget with inline TinyMCE", async function () {
        await initBody(true);

        var el = document.querySelector("[name='text.mimeType']");
        var textarea = document.querySelector("[name='text']");

        // Initially, text/plain is selected and textarea should be visible.
        expect(window.getComputedStyle(textarea).display).toEqual("inline-block");
        // But TinyMCE shouldn't be there
        expect(
            document.querySelectorAll(".mce-content-body[contenteditable='true']").length
        ).toEqual(0);
        // Value should be at it's initial state
        expect(textarea.value).toEqual("hello world");

        // change the contenteditable's value
        textarea.value = "hello mellow";

        // Now, select text/html
        el.value = "text/html";
        el.dispatchEvent(new Event("input"));
        await utils.timeout(5);

        // Textarea should be hidden
        expect(window.getComputedStyle(textarea).display).toEqual("none");
        // And TinyMCE should be shown
        let tinymce = document.querySelector(".mce-content-body");
        expect(window.getComputedStyle(tinymce).display).toEqual("block");

        // Switching back to text/plain should destroy TinyMCE
        el.value = "text/plain";
        el.dispatchEvent(new Event("input"));
        await utils.timeout(2);

        expect(window.getComputedStyle(textarea).display).toEqual("inline-block");
        expect(
            document.querySelectorAll(".mce-content-body[contenteditable='true']").length
        ).toEqual(0);

        // Unfortunately, TinyMCE changes the value just by loading TinyMCE.
        expect(textarea.value).toEqual("<p>hello mellow</p>");

        // switching back to TinyMCE loads it again
        el.value = "text/html";
        el.dispatchEvent(new Event("input"));
        await utils.timeout(2);

        expect(window.getComputedStyle(textarea).display).toEqual("none");
        tinymce = document.querySelector(".mce-content-body");
        expect(window.getComputedStyle(tinymce).display).toEqual("block");
    });
});
