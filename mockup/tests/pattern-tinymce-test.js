define([
    "expect",
    "jquery",
    "sinon",
    "pat-registry",
    "tinymce",
    "mockup-patterns-tinymce",
], function (expect, $, sinon, registry, tinymce, TinyMCE) {
    "use strict";

    window.mocha.setup("bdd");
    $.fx.off = true;

    var createTinymce = function (options) {
        return registry.patterns.tinymce.init(
            $('<textarea class="pat-tinymce"></textarea>').appendTo("body"),
            options || {}
        );
    };

    describe("TinyMCE", function () {
        afterEach(function () {
            $("body").empty();
        });

        beforeEach(function () {
            this.server = sinon.fakeServer.create();
            this.server.autoRespond = true;
            this.clock = sinon.useFakeTimers();
            //this.server.respondImmediately = true;

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
                    })
                );
            });
            this.server.respondWith(/relateditems-test\.json/, function (
                xhr,
                id
            ) {
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
                    })
                );
            });
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
                    })
                );
            });
        });

        it("creates tinymce", function () {
            var $el = $(
                "<div>" +
                    '  <textarea class="pat-tinymce">' +
                    "  </textarea>" +
                    "</div>"
            ).appendTo("body");
            registry.scan($el);
            expect($el.children().length).to.be.greaterThan(1);
            tinymce.get(0).remove();
        });

        it("maintains an initial textarea value", function () {
            var $el = $(
                "<div>" +
                    '  <textarea class="pat-tinymce">' +
                    "    foobar" +
                    "  </textarea>" +
                    "</div>"
            ).appendTo("body");
            registry.scan($el);
            expect(tinymce.get(0).getContent()).to.be.equal("<p>foobar</p>");
            tinymce.get(0).remove();
        });

        it("loads buttons for plugins", function () {
            var $el = $(
                "<div>" +
                    '  <textarea class="pat-tinymce">' +
                    "  </textarea>" +
                    "</div>"
            ).appendTo("body");
            registry.scan($el);
            expect(tinymce.get(0).buttons).to.have.keys(
                "plonelink",
                "ploneimage"
            );
            tinymce.get(0).remove();
        });

        it("on form submit, save data to form", function () {
            var $container = $(
                "<form>" +
                    '  <textarea class="pat-tinymce">' +
                    "  </textarea>" +
                    "</form>"
            ).appendTo("body");

            var $el = $container.find("textarea");
            var tinymce = new TinyMCE($el);
            // TODO: This needs to be properly addressed. Manually setting tinymce
            //       as initialized is not correct, but it will have to do for now
            //       https://github.com/plone/mockup/pull/832#issuecomment-369113718
            tinymce.tiny.initialized = true;

            tinymce.tiny.setContent("<p>foobar</p>");
            $container.submit(function (e) {
                e.preventDefault();
            });
            $container.trigger("submit");

            expect($el.val()).to.equal("<p>foobar</p>");
        });

        it("test create correct url from metadata", function () {
            var tiny = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
            });
            var data = {
                UID: "foobar",
            };
            expect(tiny.generateUrl(data)).to.equal("resolveuid/foobar");
        });
        it("test creates correct url from metadata with append", function () {
            var tiny = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                appendToUrl: ".html",
            });
            var data = {
                UID: "foobar",
            };
            expect(tiny.generateUrl(data)).to.equal("resolveuid/foobar.html");
        });
        it("test parses correct attribute from url", function () {
            var tiny = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
            });
            expect(tiny.stripGeneratedUrl("resolveuid/foobar")).to.equal(
                "foobar"
            );
        });

        it("test parses correct attribute from url with appended value", function () {
            var tiny = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                appendToUrl: "/@@view",
            });
            expect(tiny.stripGeneratedUrl("resolveuid/foobar/@@view")).to.equal(
                "foobar"
            );
        });

        it("test get scale from url", function () {
            var pattern = createTinymce({
                prependToScalePart: "/somescale/",
            });
            expect(pattern.getScaleFromUrl("foobar/somescale/foobar")).to.equal(
                "foobar"
            );
        });

        it("test get scale return null if invalid", function () {
            var pattern = createTinymce({
                prependToScalePart: "/somescale/",
            });
            expect(pattern.getScaleFromUrl("foobar")).to.equal(null);
        });

        it("get scale handles edge case of image_ for plone", function () {
            var pattern = createTinymce({
                prependToScalePart: "/somescale",
            });
            expect(
                pattern.getScaleFromUrl("foobar/somescale/image_large")
            ).to.equal("large");
        });

        it("get scale with appended option", function () {
            var pattern = createTinymce({
                prependToScalePart: "/somescale/",
                appendToScalePart: "/@@view",
            });
            expect(
                pattern.getScaleFromUrl("foobar/somescale/large/@@view")
            ).to.equal("large");
        });

        it("get scale handles edge case of image_ for plone", function () {
            var pattern = createTinymce({
                prependToScalePart: "/somescale",
            });
            expect(
                pattern.getScaleFromUrl("foobar/somescale/image_large")
            ).to.equal("large");
        });

        it("test add link", function () {
            var pattern = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                relatedItems: {
                    ajaxvocabulary: "/data.json",
                },
            });
            pattern.addLinkClicked();
            pattern.linkModal.linkTypes.internal.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
                getIcon: "",
            });
            expect(pattern.linkModal.getLinkUrl()).to.equal(
                "resolveuid/foobar"
            );
        });

        it("test add external link", function () {
            var pattern = createTinymce();
            pattern.addLinkClicked();
            var modal = pattern.linkModal;
            modal.linkType = "external";
            modal.linkTypes.external.getEl().attr("value", "http://foobar");
            expect(pattern.linkModal.getLinkUrl()).to.equal("http://foobar");
        });
        it("test add email link", function () {
            var pattern = createTinymce();
            pattern.addLinkClicked();
            pattern.linkModal.linkType = "email";
            pattern.linkModal.linkTypes.email
                .getEl()
                .attr("value", "foo@bar.com");
            expect(pattern.linkModal.getLinkUrl()).to.equal(
                "mailto:foo@bar.com"
            );
        });
        it("test add image link", function () {
            var pattern = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                prependToScalePart: "/@@images/image/",
            });
            pattern.addImageClicked();
            pattern.imageModal.linkTypes.image.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
            });

            pattern.imageModal.linkType = "image";
            pattern.imageModal.$scale.find(
                '[value="thumb"]'
            )[0].selected = true;
            expect(pattern.imageModal.getLinkUrl()).to.equal(
                "resolveuid/foobar/@@images/image/thumb"
            );
        });
        it("test add image link upload", function () {
            var $el = $(
                '<textarea class="pat-tinymce" data-pat-tinymce=\'' +
                    "{" +
                    '  "relatedItems": {' +
                    '    "vocabularyUrl": "/relateditems-test.json"' +
                    "  }," +
                    '  "upload": {' +
                    '    "baseUrl": "/",' +
                    '    "relativePath": "upload"' +
                    "}" +
                    "}'></textarea>"
            ).appendTo("body");
            registry.scan($el);
            this.clock.tick(1000);
            var pattern = $el.data().patternTinymce;
            pattern.addImageClicked();
            $("#" + $("#tinylink-uploadImage").data().navref).click();
            expect(
                $("#tinylink-uploadImage").parent().hasClass("active")
            ).to.equal(true);
            var blob;
            try {
                blob = new Blob(["dummy data"], { type: "image/png" });
            } catch (err) {
                var BlobBuilder =
                    window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;
                var builder = new BlobBuilder();
                builder.append("dummy data");
                blob = builder.getBlob();
            }
            blob.name = "blah.png";
            pattern.imageModal.$upload
                .data()
                .patternUpload.dropzone.addFile(blob);
            $(".upload-all", pattern.imageModal.$upload).click();
            this.clock.tick(1000);

            expect($("#tinylink-image").parent().hasClass("active")).to.equal(
                true
            );
            expect(pattern.imageModal.getLinkUrl()).to.equal(
                "/blah.png/imagescale/large"
            );
        });
        it("test add image with custom scale", function () {
            var pattern = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                prependToScalePart: "/@@images/image/",
                imageScales:
                    '[{"title": "Custom Scale", "value": "customscale"}]',
            });
            pattern.addImageClicked();
            pattern.imageModal.linkTypes.image.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
            });
            pattern.imageModal.linkType = "image";
            expect(
                pattern.imageModal.$scale.html().indexOf("Custom Scale")
            ).to.be.greaterThan(-1);
            pattern.imageModal.$scale.find(
                '[value="customscale"]'
            )[0].selected = true;
            expect(pattern.imageModal.getLinkUrl()).to.equal(
                "resolveuid/foobar/@@images/image/customscale"
            );
        });
        it("test add image with and without caption", function () {
            var pattern = createTinymce({
                prependToUrl: "resolveuid/",
                linkAttribute: "UID",
                prependToScalePart: "/@@images/image/",
            });

            // Add an image caption.
            pattern.addImageClicked();
            pattern.imageModal.linkTypes.image.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
            });
            pattern.imageModal.$caption.val("hello.");
            pattern.imageModal.$button.click();
            var content = pattern.tiny.getContent();

            expect(content).to.contain("<figure><img");
            expect(content).to.contain("<figcaption>hello.</figcaption>");
            expect(content).to.contain("image-richtext"); // new image-richtext class.

            // Remove the image caption. The <img> isn't wrapped then in a <figure> tag.
            pattern.addImageClicked();
            pattern.imageModal.linkTypes.image.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
            });
            pattern.imageModal.$caption.val("");
            pattern.imageModal.$button.click();
            content = pattern.tiny.getContent();

            expect(content).to.not.contain("<figure>");
            expect(content).to.not.contain("<figcaption>");
            expect(content).to.contain("<img");
            expect(content).to.contain("image-richtext"); // new image-richtext class.

            // Use image captions from the image description.
            pattern.addImageClicked();
            pattern.imageModal.linkTypes.image.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
            });
            pattern.imageModal.$captionFromDescription.prop("checked", true);
            pattern.imageModal.$button.click();
            content = pattern.tiny.getContent();

            expect(content).to.not.contain("<figure>");
            expect(content).to.not.contain("<figcaption>");
            expect(content).to.contain("<img");
            expect(content).to.contain("image-richtext"); // new image-richtext class.
            expect(content).to.contain("captioned"); // new image-richtext class.
        });

        it("test adds data attributes", function () {
            var pattern = createTinymce();
            pattern.tiny.setContent("<p>blah</p>");
            pattern.tiny.selection.select(
                pattern.tiny.dom.getRoot().getElementsByTagName("p")[0]
            );
            pattern.addLinkClicked();

            pattern.linkModal.linkTypes.internal.getEl().select2("data", {
                UID: "foobar",
                portal_type: "Document",
                Title: "Foobar",
                path: "/foobar",
                getIcon: "",
            });
            pattern.linkModal.$button.trigger("click");
            expect(pattern.tiny.getContent()).to.contain('data-val="foobar"');
            expect(pattern.tiny.getContent()).to.contain(
                'data-linktype="internal"'
            );
        });

        it("test loading link also sets up related items correctly", function () {
            var pattern = createTinymce({
                relatedItems: {
                    vocabularyUrl: "/data.json",
                },
            });

            pattern.addLinkClicked();

            pattern.linkModal.linkTypes.internal.set("123sdfasdf");
            var val = pattern.linkModal.linkTypes.internal
                .getEl()
                .select2("data");
            /* XXX ajax not loading quickly enough here...
      expect(val.UID).to.equal('123sdfasdf');
      */
        });

        it("test reopen add link modal", function () {
            var pattern = createTinymce();
            pattern.addLinkClicked();
            pattern.linkModal.hide();
            expect(pattern.linkModal.modal.$modal.is(":visible")).to.equal(
                false
            );
            pattern.addLinkClicked();
            expect(pattern.linkModal.modal.$modal.is(":visible")).to.equal(
                true
            );
        });

        it("test reopen add image modal", function () {
            var pattern = createTinymce();
            pattern.addImageClicked();
            pattern.imageModal.hide();
            expect(pattern.imageModal.modal.$modal.is(":visible")).to.equal(
                false
            );
            pattern.addImageClicked();
            expect(pattern.imageModal.modal.$modal.is(":visible")).to.equal(
                true
            );
        });

        it("test loads existing link external values", function () {
            var pattern = createTinymce();

            pattern.tiny.setContent(
                '<a href="foobar" data-linktype="external" data-val="foobar">foobar</a>'
            );

            pattern.tiny.selection.select(
                pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
            );
            pattern.addLinkClicked();

            expect(pattern.linkModal.linkTypes.external.getEl().val()).to.equal(
                "foobar"
            );
            setTimeout(function () {
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper)
                        .length
                ).to.equal(1);
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper).data(
                        "linktype"
                    )
                ).to.equal("external");
            }, 100);
        });

        it("test loads existing link email values", function () {
            var pattern = createTinymce();

            pattern.tiny.setContent(
                '<a href="mailto:foo@bar.com" data-linktype="email" data-val="foo@bar.com">foobar</a>'
            );

            pattern.tiny.selection.select(
                pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
            );
            pattern.addLinkClicked();

            expect(pattern.linkModal.linkTypes.email.getEl().val()).to.equal(
                "foo@bar.com"
            );
            setTimeout(function () {
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper)
                        .length
                ).to.equal(1);
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper).data(
                        "linktype"
                    )
                ).to.equal("email");
            }, 100);
        });

        it("test anchor link adds existing anchors to list", function () {
            var pattern = createTinymce();

            pattern.tiny.setContent(
                '<a class="mceItemAnchor" name="foobar"></a>'
            );

            pattern.addLinkClicked();

            expect(
                pattern.linkModal.linkTypes.anchor.anchorNodes.length
            ).to.equal(1);
            setTimeout(function () {
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper)
                        .length
                ).to.equal(1);
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper).data(
                        "linktype"
                    )
                ).to.equal("anchor");
            }, 100);
        });

        it("test anchor link adds anchors from option", function () {
            var pattern = createTinymce({
                anchorSelector: "h1",
            });

            pattern.tiny.setContent("<h1>blah</h1>");
            pattern.addLinkClicked();
            expect(
                pattern.linkModal.linkTypes.anchor.anchorNodes.length
            ).to.equal(1);
        });

        it("test anchor get index", function () {
            var pattern = createTinymce({
                anchorSelector: "h1",
            });

            pattern.tiny.setContent("<h1>blah</h1><h1>foobar</h1>");
            pattern.addLinkClicked();
            expect(
                pattern.linkModal.linkTypes.anchor.getIndex("foobar")
            ).to.equal(1);
        });

        it("test anchor get url", function () {
            var pattern = createTinymce({
                anchorSelector: "h1",
            });

            pattern.tiny.setContent("<h1>blah</h1>");
            pattern.addLinkClicked();
            pattern.linkModal.linkTypes.anchor.$select.select2("data", "0");
            expect(pattern.linkModal.linkTypes.anchor.toUrl()).to.equal(
                "#blah"
            );
        });

        it("test tracks link type changes", function () {
            var pattern = createTinymce({
                anchorSelector: "h1",
            });

            pattern.addLinkClicked();
            pattern.linkModal.modal.$modal
                .find(".autotoc-nav a")
                .eq(1)
                .trigger("click");
            expect(pattern.linkModal.linkType).to.equal("upload");
        });

        it("test guess link when no data- attribute present", function () {
            var pattern = createTinymce();

            pattern.tiny.setContent('<a href="foobar">foobar</a>');

            pattern.tiny.selection.select(
                pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
            );
            pattern.addLinkClicked();

            expect(pattern.linkModal.linkTypes.external.getEl().val()).to.equal(
                "foobar"
            );
            setTimeout(function () {
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper)
                        .length
                ).to.equal(1);
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper).data(
                        "linktype"
                    )
                ).to.equal("external");
            }, 100);
        });

        it("test guess anchor when no data- attribute present", function () {
            var pattern = createTinymce();

            pattern.tiny.setContent(
                '<a href="#foobar">foobar</a><a class="mceItemAnchor" name="foobar"></a>'
            );

            pattern.tiny.selection.select(
                pattern.tiny.dom.getRoot().getElementsByTagName("a")[0]
            );
            pattern.addLinkClicked();

            expect(pattern.linkModal.linkTypes.anchor.toUrl()).to.equal(
                "#foobar"
            );
            setTimeout(function () {
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper)
                        .length
                ).to.equal(1);
                expect(
                    $("fieldset.active", pattern.linkModal.modal.$wrapper).data(
                        "linktype"
                    )
                ).to.equal("anchor");
            }, 100);
        });

        it("test inline tinyMCE roundtrip", function () {
            var $container = $(
                "<form>" +
                    '<textarea class="pat-tinymce" data-pat-tinymce=\'{"inline": true}\'>' +
                    "<h1>just testing</h1>" +
                    "</textarea>" +
                    "</form>"
            ).appendTo("body");
            registry.scan($container);

            var $el = $container.find("textarea");
            var id = $el.attr("id");

            var $editable = $container.find("#" + id + "-editable");

            // check, if everything is in place
            expect($editable.is("div")).to.be.equal(true);
            expect($editable.html()).to.be.equal($el.val());

            // check, if changes are submitted on form submit
            var changed_txt = "changed contents";
            $editable.html(changed_txt);
            var $form = $container.find("form");
            // Avoid error when running tests: "Some of your tests did a full page reload!"
            $container.submit(function (e) {
                e.preventDefault();
            });
            $container.trigger("submit");
            expect($el.val()).to.be.equal(changed_txt);
            tinymce.get(0).remove();
        });
    });
});
