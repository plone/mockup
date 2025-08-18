import tinymce from "tinymce/tinymce";
import TinyMCE from "./tinymce";
import $ from "jquery";
import sinon from "sinon";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import events from "@patternslib/patternslib/src/core/events";

$.fx.off = true;

var createTinymce = async function (options) {
    document.body.innerHTML = `
        <textarea class="pat-tinymce"></textarea>
    `;
    const textarea = document.querySelector("textarea");
    const instance = new TinyMCE(textarea, options || {});
    await events.await_pattern_init(instance);

    return instance;
};

const registry_scan = async () => {
    registry.scan(document.body);
    await utils.timeout(10);
};

describe("TinyMCE", function () {
    afterEach(function () {
        document.body.innerHTML = "";
        tinymce.activeEditor?.remove();
        this.server.restore();
    });

    beforeEach(function () {
        this.server = sinon.fakeServer.create();
        this.server.autoRespond = true;
        //this.server.respondImmediately = true;

        // eslint-disable-next-line no-unused-vars
        this.server.respondWith("POST", /upload/, function (xhr, id) {
            xhr.respond(
                200,
                { "content-Type": "application/json" },
                JSON.stringify({
                    url: "http://localhost:8000/blah.png",
                    UID: "sldlfkjsldkjlskdjf",
                    name: "blah.png",
                    filename: "blah.png",
                    portal_type: "Image",
                    size: 239292,
                }),
            );
        });

        // eslint-disable-next-line no-unused-vars
        this.server.respondWith(/relateditems-test\.json/, function (xhr, id) {
            var query = xhr.url.split("?")[1];
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i += 1) {
                var pair = vars[i].split("=");
                if (decodeURIComponent(pair[0]) === "query") {
                    query = $.parseJSON(decodeURIComponent(pair[1]));
                }
            }
            var results = [];
            for (var j = 0; j < query.criteria.length; j += 1) {
                if (query.criteria[j].i === "UID") {
                    results.push({
                        UID: query.criteria[j].v[0],
                        Title: "blah.png",
                        path: "/blah.png",
                        portal_type: "Image",
                    });
                }
            }
            xhr.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify({
                    total: results.length,
                    results: results,
                }),
            );
        });

        // eslint-disable-next-line no-unused-vars
        this.server.respondWith("GET", /data.json/, function (xhr, id) {
            var items = [
                {
                    UID: "123sdfasdf",
                    getURL: "http://localhost:8081/news/aggregator",
                    path: "/news/aggregator",
                    portal_type: "Collection",
                    Description: "Site News",
                    Title: "News",
                    getIcon: "",
                },
                {
                    UID: "fooasdfasdf1123asZ",
                    path: "/about",
                    getURL: "http://localhost:8081/about",
                    portal_type: "Document",
                    Description: "About",
                    Title: "About",
                    getIcon: "document.png",
                },
            ];

            if (xhr.url.indexOf("123sdfasdf") !== -1) {
                // ajax request for this one val
                items.pop();
            }
            xhr.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify({
                    total: items.length,
                    results: items,
                }),
            );
        });
    });

    it("creates tinymce", async function () {
        document.body.innerHTML = `
            <div><textarea class="pat-tinymce"></textarea></div>
            <div><input type="submit" value="save"></div>
        `;
        await registry_scan();
        expect(document.querySelectorAll(".tox-tinymce").length).toBe(1);
    });

    it.skip("maintains an initial textarea value", async function () {
        document.body.innerHTML = `<div><textarea class="pat-tinymce"><p>foobar</p></textarea></div>`;
        await registry_scan();
        var activeTiny = tinymce.activeEditor;
        expect(activeTiny.getContent()).toEqual("<p>foobar</p>");
    });

    it("loads buttons for plugins", async function () {
        var $el = $(
            "<div>" + '  <textarea class="pat-tinymce">' + "  </textarea>" + "</div>",
        ).appendTo("body");
        registry.scan($el);
        await utils.timeout(10);
        expect(tinymce.get(0).options.get("plugins")).toContain("ploneimage");
        expect(tinymce.get(0).options.get("plugins")).toContain("plonelink");
        expect(tinymce.get(0).options.get("toolbar")).toContain("plonelink");
        expect(tinymce.get(0).options.get("toolbar")).toContain("ploneimage");
    });

    it.skip("on form submit, save data to form", async function () {
        var $container = $(
            "<form>" + '  <textarea class="pat-tinymce">' + "  </textarea>" + "</form>",
        ).appendTo("body");

        var $el = $container.find("textarea");
        var tinymce = new TinyMCE($el);
        // TODO: This needs to be properly addressed. Manually setting tinymce
        //       as initialized is not correct, but it will have to do for now
        //       https://github.com/plone/mockup/pull/832#issuecomment-369113718
        tinymce.tiny.initialized = true;

        tinymce.tiny.setContent("<p>foobar</p>");
        $container.on("submit", function (e) {
            e.preventDefault();
        });
        $container.trigger("submit");

        expect($el.val()).toEqual("<p>foobar</p>");
    });

    it("test create correct url from metadata", async function () {
        var tiny = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
        });
        var data = {
            UID: "foobar",
        };
        expect(tiny.instance.generateUrl(data)).toEqual("resolveuid/foobar");
    });
    it("test creates correct url from metadata with append", async function () {
        var tiny = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
            appendToUrl: ".html",
        });
        var data = {
            UID: "foobar",
        };
        expect(tiny.instance.generateUrl(data)).toEqual("resolveuid/foobar.html");
    });
    it("test parses correct attribute from url", async function () {
        var tiny = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
        });
        expect(tiny.instance.stripGeneratedUrl("resolveuid/foobar")).toEqual("foobar");
    });

    it("test parses correct attribute from url with appended value", async function () {
        var tiny = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
            appendToUrl: "/@@view",
        });
        expect(tiny.instance.stripGeneratedUrl("resolveuid/foobar/@@view")).toEqual(
            "foobar",
        );
    });

    it("test get scale from url", async function () {
        var tiny = await createTinymce({
            prependToScalePart: "/somescale/",
        });
        expect(tiny.instance.getScaleFromUrl("foobar/somescale/foobar")).toEqual(
            "foobar",
        );
    });

    it("test get scale return null if invalid", async function () {
        var tiny = await createTinymce({
            prependToScalePart: "/somescale/",
        });
        expect(tiny.instance.getScaleFromUrl("foobar")).toEqual(null);
    });

    it("get scale handles edge case of image_ for plone", async function () {
        var tiny = await createTinymce({
            prependToScalePart: "/somescale",
        });
        expect(tiny.instance.getScaleFromUrl("foobar/somescale/image_large")).toEqual(
            "large",
        );
    });

    it("get scale with appended option", async function () {
        var tiny = await createTinymce({
            prependToScalePart: "/somescale/",
            appendToScalePart: "/@@view",
        });
        expect(tiny.instance.getScaleFromUrl("foobar/somescale/large/@@view")).toEqual(
            "large",
        );
    });

    it("get scale handles edge case of image_ for plone", async function () {
        var tiny = await createTinymce({
            prependToScalePart: "/somescale",
        });
        expect(tiny.instance.getScaleFromUrl("foobar/somescale/image_large")).toEqual(
            "large",
        );
    });

    it.skip("When parsing images from old Plone installations without picture-variants, TinyMCE‌'s image dialog falls back to data-scale", async function () {
        // TinyMCE contents without a picture variant but a data-scale, as it
        // was used in Plone 5.
        const pat_instance = await createTinymce({
            prependToScalePart: "/@@images/image/",
            imageScales: '[{"title": "Preview", "value": "preview"}]',
            pictureVariants: {
                preview: {
                    title: "Preview",
                    sourceset: [
                        {
                            scale: "preview",
                            media: "",
                        },
                    ],
                },
            },
        });

        // Await the TinyMCE initialization.
        await utils.timeout(0);
        const tiny = pat_instance.instance.tiny;

        tiny.setContent(`
            <img
                src="resolveuid/foobar/@@images/image/preview"
                data-scale="preview"
                alt="This is an alt"
                title="This is a title"
                data-caption="This is a caption"
            />
        `);

        // Select the image before opening the image dialog.
        const img = tiny.dom.getRoot().getElementsByTagName("img")[0];
        tiny.selection.select(img);

        pat_instance.instance.addImageClicked();

        // TODO: Finalize tests.
    });

    it("test inline tinyMCE", async function () {
        document.body.innerHTML = `
            <textarea class="pat-tinymce" data-pat-tinymce='{"inline": true}'></textarea>
            <input type="submit" value="save">
        `;
        await registry_scan();

        var el = document.querySelector("textarea");
        var id = el.id;

        var edit_el = document.getElementById(`${id}-editable`);
        var activeEditor = tinymce.activeEditor;

        // check, if everything is in place
        expect(edit_el.nodeName).toEqual("DIV");
        expect(activeEditor.getContent()).toEqual(el.innerHTML);

        // check, if changes are correct on element blur
        activeEditor.focus();
        var changed_txt = "changed contents";
        edit_el.innerHTML = changed_txt;
        document.querySelector("[type='submit']").focus();
        await utils.timeout(5);

        // TODO: need to figure out how to track changes with the new "change"
        // event when focus is moved away
        //expect(el.value).toEqual(changed_txt);
    });

    it.skip("test add link", async function () {
        var pattern = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
            relatedItems: {
                ajaxvocabulary: "/data.json",
            },
        });
        pattern.instance.addLinkClicked();
        pattern.instance.linkModal.linkTypes.internal.getEl().select2("data", {
            UID: "foobar",
            portal_type: "Document",
            Title: "Foobar",
            path: "/foobar",
            getIcon: "",
        });
        expect(pattern.instance.linkModal.getLinkUrl()).toEqual("resolveuid/foobar");
    });

    it.skip("test add external link", async function () {
        var pattern = await createTinymce();
        pattern.instance.addLinkClicked();
        var modal = pattern.instance.linkModal;
        modal.linkType = "external";
        modal.linkTypes.external.getEl().attr("value", "http://foobar");
        expect(modal.getLinkUrl()).toEqual("http://foobar");
    });

    it.skip("test add email link", async function () {
        var pattern = await createTinymce();
        pattern.instance.addLinkClicked();
        var modal = pattern.instance.linkModal;
        modal.linkType = "email";
        modal.linkTypes.email.getEl().attr("value", "foo@bar.com");
        expect(modal.getLinkUrl()).toEqual("mailto:foo@bar.com");
    });

    it.skip("test add image link", async function () {
        var pattern = await createTinymce({
            prependToUrl: "resolveuid/",
            linkAttribute: "UID",
            prependToScalePart: "/@@images/image/",
        });
        pattern.instance.addImageClicked();
        var modal = pattern.instance.imageModal;
        modal.linkTypes.image.getEl().select2("data", {
            UID: "foobar",
            portal_type: "Document",
            Title: "Foobar",
            path: "/foobar",
        });

        modal.linkType = "image";
        modal.$scale.find('[value="thumb"]')[0].selected = true;
        expect(modal.getLinkUrl()).toEqual("resolveuid/foobar/@@images/image/thumb");
    });

    it("test i18n language negotiation and translation loading", async () => {
        document.body.innerHTML = `<div><textarea class="pat-tinymce"><p>foobar</p></textarea></div>`;
        await registry_scan();
        // there is a translated accessibility information for the resize handle in the dom
        expect(document.body.innerHTML).toContain(
            'aria-label="Press the Up and Down arrow keys to resize the editor."',
        );

        // mockup/core/i18n reads language from <html lang="">
        document.documentElement.setAttribute("lang", "de");
        document.body.innerHTML = `<div><textarea class="pat-tinymce"><p>foobar</p></textarea></div>`;
        await registry_scan();
        expect(document.body.innerHTML).toContain(
            'aria-label="Ändern Sie die Größe des Editors, indem Sie die Pfeiltasten „Abwärts“ und „Aufwärts“ drücken."',
        );

        // set combined ISO code for Portuguese (Brazil)
        // this needs to be converted for tiny to pt_BR
        document.documentElement.setAttribute("lang", "pt-br");
        document.body.innerHTML = `<div><textarea class="pat-tinymce"><p>foobar</p></textarea></div>`;
        await registry_scan();
        expect(document.body.innerHTML).toContain(
            'aria-label="Use as teclas de seta acima e abaixo para redimensionar o editor."',
        );
    });

    // it("test add image link upload", function () {
    //     var $el = $(
    //         '<textarea class="pat-tinymce" data-pat-tinymce=\'' +
    //             "{" +
    //             '  "relatedItems": {' +
    //             '    "vocabularyUrl": "/relateditems-test.json"' +
    //             "  }," +
    //             '  "upload": {' +
    //             '    "baseUrl": "/",' +
    //             '    "relativePath": "upload"' +
    //             "}" +
    //             "}'></textarea>"
    //     ).appendTo("body");
    //     registry.scan($el);
    //     this.clock.tick(1000);
    //     var pattern = $el.data().patternTinymce;
    //     pattern.addImageClicked();
    //     $("#" + $("#tinylink-uploadImage").data().navref).trigger("click");
    //     expect($("#tinylink-uploadImage").parent().hasClass("active")).toEqual(true);
    //     var blob;
    //     try {
    //         blob = new Blob(["dummy data"], { type: "image/png" });
    //     } catch (err) {
    //         var BlobBuilder =
    //             window.BlobBuilder ||
    //             window.WebKitBlobBuilder ||
    //             window.MozBlobBuilder ||
    //             window.MSBlobBuilder;
    //         var builder = new BlobBuilder();
    //         builder.append("dummy data");
    //         blob = builder.getBlob();
    //     }
    //     blob.name = "blah.png";
    //     pattern.imageModal.$upload.data().patternUpload.dropzone.addFile(blob);
    //     $(".upload-all", pattern.imageModal.$upload).trigger("click");
    //     this.clock.tick(1000);

    //     expect($("#tinylink-image").parent().hasClass("active")).toEqual(true);
    //     expect(pattern.imageModal.getLinkUrl()).toEqual("/blah.png/imagescale/large");
    // });

    // it("test add image with custom scale", function () {
    //     var pattern = createTinymce({
    //         prependToUrl: "resolveuid/",
    //         linkAttribute: "UID",
    //         prependToScalePart: "/@@images/image/",
    //         imageScales: '[{"title": "Custom Scale", "value": "customscale"}]',
    //     });
    //     pattern.addImageClicked();
    //     pattern.imageModal.linkTypes.image.getEl().select2("data", {
    //         UID: "foobar",
    //         portal_type: "Document",
    //         Title: "Foobar",
    //         path: "/foobar",
    //     });
    //     pattern.imageModal.linkType = "image";
    //     expect(
    //         pattern.imageModal.$scale.html().indexOf("Custom Scale")
    //     ).to.be.greaterThan(-1);
    //     pattern.imageModal.$scale.find('[value="customscale"]')[0].selected = true;
    //     expect(pattern.imageModal.getLinkUrl()).toEqual(
    //         "resolveuid/foobar/@@images/image/customscale"
    //     );
    // });

    // it("test add image with and without caption", function () {
    //     var pattern = createTinymce({
    //         prependToUrl: "resolveuid/",
    //         linkAttribute: "UID",
    //         prependToScalePart: "/@@images/image/",
    //     });

    //     // Add an image caption.
    //     pattern.addImageClicked();
    //     pattern.imageModal.linkTypes.image.getEl().select2("data", {
    //         UID: "foobar",
    //         portal_type: "Document",
    //         Title: "Foobar",
    //         path: "/foobar",
    //     });
    //     pattern.imageModal.$caption.val("hello.");
    //     pattern.imageModal.$button.trigger("click");
    //     var content = pattern.tiny.getContent();

    //     expect(content).to.contain("<figure><img");
    //     expect(content).to.contain("<figcaption>hello.</figcaption>");
    //     expect(content).to.contain("image-richtext"); // new image-richtext class.

    //     // Remove the image caption. The <img> isn't wrapped then in a <figure> tag.
    //     pattern.addImageClicked();
    //     pattern.imageModal.linkTypes.image.getEl().select2("data", {
    //         UID: "foobar",
    //         portal_type: "Document",
    //         Title: "Foobar",
    //         path: "/foobar",
    //     });
    //     pattern.imageModal.$caption.val("");
    //     pattern.imageModal.$button.trigger("click");
    //     content = pattern.tiny.getContent();

    //     expect(content).to.not.contain("<figure>");
    //     expect(content).to.not.contain("<figcaption>");
    //     expect(content).to.contain("<img");
    //     expect(content).to.contain("image-richtext"); // new image-richtext class.

    //     // Use image captions from the image description.
    //     pattern.addImageClicked();
    //     pattern.imageModal.linkTypes.image.getEl().select2("data", {
    //         UID: "foobar",
    //         portal_type: "Document",
    //         Title: "Foobar",
    //         path: "/foobar",
    //     });
    //     pattern.imageModal.$captionFromDescription.prop("checked", true);
    //     pattern.imageModal.$button.trigger("click");
    //     content = pattern.tiny.getContent();

    //     expect(content).to.not.contain("<figure>");
    //     expect(content).to.not.contain("<figcaption>");
    //     expect(content).to.contain("<img");
    //     expect(content).to.contain("image-richtext"); // new image-richtext class.
    //     expect(content).to.contain("captioned"); // new image-richtext class.
    // });

    // it("test adds data attributes", function () {
    //     var pattern = createTinymce();
    //     pattern.tiny.setContent("<p>blah</p>");
    //     pattern.tiny.selection.select(
    //         pattern.tiny.dom.getRoot().getElementsByTagName("p")[0]
    //     );
    //     pattern.addLinkClicked();

    //     pattern.linkModal.linkTypes.internal.getEl().select2("data", {
    //         UID: "foobar",
    //         portal_type: "Document",
    //         Title: "Foobar",
    //         path: "/foobar",
    //         getIcon: "",
    //     });
    //     pattern.linkModal.$button.trigger("click");
    //     expect(pattern.tiny.getContent()).to.contain('data-val="foobar"');
    //     expect(pattern.tiny.getContent()).to.contain('data-linktype="internal"');
    // });

    // it("test loading link also sets up related items correctly", function () {
    //     var pattern = createTinymce({
    //         relatedItems: {
    //             vocabularyUrl: "/data.json",
    //         },
    //     });

    //     pattern.addLinkClicked();

    //     pattern.linkModal.linkTypes.internal.set("123sdfasdf");
    //     var val = pattern.linkModal.linkTypes.internal.getEl().select2("data");
    //     /* XXX ajax not loading quickly enough here...
    //   expect(val.UID).toEqual('123sdfasdf');
    //   */
    // });

    // it("test reopen add link modal", function () {
    //     var pattern = createTinymce();
    //     pattern.addLinkClicked();
    //     pattern.linkModal.hide();
    //     expect(pattern.linkModal.modal.$modal.is(":visible")).toEqual(false);
    //     pattern.addLinkClicked();
    //     expect(pattern.linkModal.modal.$modal.is(":visible")).toEqual(true);
    // });

    // it("test reopen add image modal", function () {
    //     var pattern = createTinymce();
    //     pattern.addImageClicked();
    //     pattern.imageModal.hide();
    //     expect(pattern.imageModal.modal.$modal.is(":visible")).toEqual(false);
    //     pattern.addImageClicked();
    //     expect(pattern.imageModal.modal.$modal.is(":visible")).toEqual(true);
    // });

    // it("test loads existing link external values", function () {
    //     var pattern = createTinymce();

    //     pattern.tiny.setContent(
    //         '<a href="foobar" data-linktype="external" data-val="foobar">foobar</a>'
    //     );

    //     pattern.tiny.selection.select(
    //         pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
    //     );
    //     pattern.addLinkClicked();

    //     expect(pattern.linkModal.linkTypes.external.getEl().val()).toEqual("foobar");
    //     setTimeout(function () {
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).length
    //         ).toEqual(1);
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).data("linktype")
    //         ).toEqual("external");
    //     }, 100);
    // });

    // it("test loads existing link email values", function () {
    //     var pattern = createTinymce();

    //     pattern.tiny.setContent(
    //         '<a href="mailto:foo@bar.com" data-linktype="email" data-val="foo@bar.com">foobar</a>'
    //     );

    //     pattern.tiny.selection.select(
    //         pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
    //     );
    //     pattern.addLinkClicked();

    //     expect(pattern.linkModal.linkTypes.email.getEl().val()).toEqual("foo@bar.com");
    //     setTimeout(function () {
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).length
    //         ).toEqual(1);
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).data("linktype")
    //         ).toEqual("email");
    //     }, 100);
    // });

    // it("test anchor link adds existing anchors to list", async function () {
    //     var pattern = await createTinymce();

    //     pattern.tiny.setContent('<a class="mceItemAnchor" name="foobar"></a>');

    //     pattern.instance.addLinkClicked();

    //     expect(pattern.instance.linkModal.linkTypes.anchor.anchorNodes.length).toEqual(1);
    //     setTimeout(function () {
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).length
    //         ).toEqual(1);
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).data("linktype")
    //         ).toEqual("anchor");
    //     }, 100);
    // });

    // it("test anchor link adds anchors from option", function () {
    //     var pattern = createTinymce({
    //         anchorSelector: "h1",
    //     });

    //     pattern.tiny.setContent("<h1>blah</h1>");
    //     pattern.addLinkClicked();
    //     expect(pattern.linkModal.linkTypes.anchor.anchorNodes.length).toEqual(1);
    // });

    // it("test anchor get index", function () {
    //     var pattern = createTinymce({
    //         anchorSelector: "h1",
    //     });

    //     pattern.tiny.setContent("<h1>blah</h1><h1>foobar</h1>");
    //     pattern.addLinkClicked();
    //     expect(pattern.linkModal.linkTypes.anchor.getIndex("foobar")).toEqual(1);
    // });

    // it("test anchor get url", function () {
    //     var pattern = createTinymce({
    //         anchorSelector: "h1",
    //     });

    //     pattern.tiny.setContent("<h1>blah</h1>");
    //     pattern.addLinkClicked();
    //     pattern.linkModal.linkTypes.anchor.$select.select2("data", "0");
    //     expect(pattern.linkModal.linkTypes.anchor.toUrl()).toEqual("#blah");
    // });

    // it("test tracks link type changes", function () {
    //     var pattern = createTinymce({
    //         anchorSelector: "h1",
    //     });

    //     pattern.addLinkClicked();
    //     pattern.linkModal.modal.$modal.find(".autotoc-nav a").eq(1).trigger("click");
    //     expect(pattern.linkModal.linkType).toEqual("upload");
    // });

    // it("test guess link when no data- attribute present", function () {
    //     var pattern = createTinymce();

    //     pattern.tiny.setContent('<a href="foobar">foobar</a>');

    //     pattern.tiny.selection.select(
    //         pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
    //     );
    //     pattern.addLinkClicked();

    //     expect(pattern.linkModal.linkTypes.external.getEl().val()).toEqual("foobar");
    //     setTimeout(function () {
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).length
    //         ).toEqual(1);
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).data("linktype")
    //         ).toEqual("external");
    //     }, 100);
    // });

    // it("test guess anchor when no data- attribute present", function () {
    //     var pattern = createTinymce();

    //     pattern.tiny.setContent(
    //         '<a href="#foobar">foobar</a><a class="mceItemAnchor" name="foobar"></a>'
    //     );

    //     pattern.tiny.selection.select(
    //         pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
    //     );
    //     pattern.addLinkClicked();

    //     expect(pattern.linkModal.linkTypes.anchor.toUrl()).toEqual("#foobar");
    //     setTimeout(function () {
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).length
    //         ).toEqual(1);
    //         expect(
    //             $("fieldset.active", pattern.linkModal.modal.$wrapper).data("linktype")
    //         ).toEqual("anchor");
    //     }, 100);
    // });
});
