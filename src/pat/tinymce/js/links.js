import $ from "jquery";
import _ from "underscore";
import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";

import tinymce from "tinymce/tinymce";
import LinkTemplate from "../templates/link.xml";
import ImageTemplate from "../templates/image.xml";
import RelatedItems from "../../relateditems/relateditems";
import "../../autotoc/autotoc";
import "../../modal/modal";
import PatternUpload from "../../upload/upload";

var LinkType = Base.extend({
    name: "linktype",
    trigger: ".pat-linktype-dummy",
    defaults: {
        linkModal: null, // required
    },

    init: function () {
        this.linkModal = this.options.linkModal;
        this.tinypattern = this.options.tinypattern;
        this.tiny = this.tinypattern.tiny;
        this.dom = this.tiny.dom;
    },

    getEl: function () {
        return this.$el.find("input");
    },

    value: function () {
        return this.getEl().val().trim();
    },

    toUrl: function () {
        return this.value();
    },

    load: function (element) {
        let val = this.tiny.dom.getAttrib(element, "data-val");
        this.getEl().attr("value", val);
    },

    set: function (val) {
        var $el = this.getEl();
        $el.attr("value", val);
        $el.val(val);
    },

    attributes: function () {
        return {
            "data-val": this.value(),
        };
    },
    updateRelatedItems: function () {},
});

var ExternalLink = LinkType.extend({
    name: "externallinktype",
    trigger: ".pat-externallinktype-dummy",
    init: function () {
        LinkType.prototype.init.call(this);
        this.getEl().on("change", function () {
            // check here if we should automatically add in http:// to url
            var val = $(this).val();
            if (new RegExp("https?://").test(val)) {
                // already valid url
                return;
            }
            var domain = $(this).val().split("/")[0];
            if (domain.indexOf(".") !== -1) {
                $(this).val("http://" + val);
            }
        });
    },
});

var InternalLink = LinkType.extend({
    name: "internallinktype",
    trigger: ".pat-internallinktype-dummy",
    init: function () {
        if (!this.getEl().length) {
            return;
        }
        LinkType.prototype.init.call(this);
        this.getEl().addClass("pat-relateditems");
        this.createRelatedItems();
    },

    getEl: function () {
        return this.$el.find("input:not(.select2-input)");
    },

    createRelatedItems: function () {
        if (!this.getEl().length) {
            return;
        }
        var options = this.linkModal.options.relatedItems;
        options.upload = false; // ensure that related items upload is off.
        this.relatedItems = new RelatedItems(this.getEl(), options);
    },

    updateRelatedItems: function (val) {
        if (!this.relatedItems) {
            // prevent toolbar from being rendered twice
            this.createRelatedItems();
        }
        this.relatedItems.selectItem(val);
    },

    value: function () {
        var val = this.getEl().select2("data");
        if (val && typeof val === "object") {
            val = val[0];
        }
        return val;
    },

    toUrl: function () {
        var value = this.value();
        if (value) {
            return this.tinypattern.generateUrl(value);
        }
        return null;
    },
    load: function (element) {
        var val = this.tiny.dom.getAttrib(element, "data-val");
        if (val) {
            this.set(val);
        }
    },

    set: function (val) {
        var $el = this.getEl();
        $el.val(val).trigger("change");
        this.updateRelatedItems(val);
    },

    attributes: function () {
        var val = this.value();
        if (val) {
            return {
                "data-val": val.UID,
            };
        }
        return {};
    },
});

var UploadLink = LinkType.extend({
    name: "uploadlinktype",
    trigger: ".pat-uploadlinktype-dummy",
    /* need to do it a bit differently here.
       when a user uploads and tries to upload from
       it, you need to delegate to the real insert
       linke types */
    getDelegatedLinkType: function () {
        if (this.linkModal.linkType === "uploadImage") {
            return this.linkModal.linkTypes.image;
        } else {
            return this.linkModal.linkTypes.internal;
        }
    },
    toUrl: function () {
        return this.getDelegatedLinkType().toUrl();
    },
    attributes: function () {
        return this.getDelegatedLinkType().attributes();
    },
    set: function (val) {
        return this.getDelegatedLinkType().set(val);
    },
    load: function (element) {
        return this.getDelegatedLinkType().load(element);
    },
    value: function () {
        return this.getDelegatedLinkType().value();
    },
});

var ImageLink = InternalLink.extend({
    name: "imagelinktype",
    trigger: ".pat-imagelinktype-dummy",
    toUrl: function () {
        var value = this.value();
        return this.tinypattern.generateImageUrl(
            value,
            this.linkModal.getScaleFromSrcset(this.linkModal.$scale.val())
        );
    },
});

var EmailLink = LinkType.extend({
    name: "emaillinktype",
    trigger: ".pat-emaillinktype-dummy",
    toUrl: function () {
        var self = this;
        var val = self.value();
        if (val) {
            var subject = self.getSubject();
            var href = "mailto:" + val;
            if (subject) {
                href += "?subject=" + subject;
            }
            return href;
        }
        return null;
    },

    load: function (element) {
        LinkType.prototype.load.apply(this, [element]);
        this.linkModal.$subject.val(this.tiny.dom.getAttrib(element, "data-subject"));
    },

    getSubject: function () {
        return this.linkModal.$subject.val();
    },

    attributes: function () {
        var attribs = LinkType.prototype.attributes.call(this);
        attribs["data-subject"] = this.getSubject();
        return attribs;
    },
});

var AnchorLink = LinkType.extend({
    name: "anchorlinktype",
    trigger: ".pat-anchorlinktype-dummy",
    init: function () {
        LinkType.prototype.init.call(this);
        this.$select = this.$el.find("select");
        this.anchorNodes = [];
        this.anchorData = [];
        this.populate();
    },

    value: function () {
        var val = this.$select.select2("data");
        if (val && typeof val === "object") {
            val = val.id;
        }
        return val;
    },

    populate: function () {
        var self = this;
        self.$select.find("option").remove();
        self.anchorNodes = [];
        self.anchorData = [];
        var node, i, j, name, title;

        var nodes = self.tiny.dom.select(".mceItemAnchor,.mce-item-anchor");
        for (i = 0; i < nodes.length; i = i + 1) {
            node = nodes[i];
            name = self.tiny.dom.getAttrib(node, "name");
            if (!name) {
                name = self.tiny.dom.getAttrib(node, "id");
            }
            if (name !== "") {
                self.anchorNodes.push(node);
                self.anchorData.push({ name: name, title: name });
            }
        }

        nodes = self.tiny.dom.select(self.linkModal.options.anchorSelector);
        if (nodes.length > 0) {
            for (i = 0; i < nodes.length; i = i + 1) {
                node = nodes[i];
                title = $(node)
                    .text()
                    .replace(/^\s+|\s+$/g, "");
                if (title === "") {
                    continue;
                }
                name = title.toLowerCase().substring(0, 1024);
                name = name.replace(/[^a-z0-9]/g, "-");
                /* okay, ugly, but we need to first check that this anchor isn't already available */
                var found = false;
                for (j = 0; j < self.anchorNodes.length; j = j + 1) {
                    var anode = self.anchorData[j];
                    if (anode.name === name) {
                        found = true;
                        // so it's also found, let's update the title to be more presentable
                        anode.title = title;
                        break;
                    }
                }
                if (!found) {
                    self.anchorData.push({
                        name: name,
                        title: title,
                        newAnchor: true,
                    });
                    self.anchorNodes.push(node);
                }
            }
        }
        if (self.anchorNodes.length > 0) {
            for (i = 0; i < self.anchorData.length; i = i + 1) {
                var data = self.anchorData[i];
                self.$select.append(
                    '<option value="' + i + '">' + data.title + "</option>"
                );
            }
        } else {
            self.$select.append("<option>No anchors found..</option>");
        }
    },

    getIndex: function (name) {
        for (var i = 0; i < this.anchorData.length; i = i + 1) {
            var data = this.anchorData[i];
            if (data.name === name) {
                return i;
            }
        }
        return 0;
    },

    toUrl: function () {
        var val = this.value();
        if (val) {
            var index = parseInt(val, 10);
            var node = this.anchorNodes[index];
            var data = this.anchorData[index];
            if (data.newAnchor) {
                node.innerHTML =
                    '<a name="' +
                    data.name +
                    '" class="mce-item-anchor"></a>' +
                    node.innerHTML;
            }
            return "#" + data.name;
        }
        return null;
    },

    set: function (val) {
        var anchor = this.getIndex(val);
        this.$select.select2("data", "" + anchor);
    },
});

tinymce.PluginManager.add("ploneimage", function (editor) {
    editor.ui.registry.addButton("ploneimage", {
        icon: "image",
        text: "Insert image",
        tooltip: "Insert/edit image",
        onAction: editor.settings.addImageClicked,
        // stateSelector: "img:not([data-mce-object])",
    });
});

/* register the tinymce plugin */
tinymce.PluginManager.add("plonelink", function (editor) {
    editor.ui.registry.addButton("plonelink", {
        icon: "link",
        tooltip: "Insert/edit link",
        shortcut: "Ctrl+K",
        onAction: editor.settings.addLinkClicked,
        stateSelector: "a[href]",
    });

    editor.ui.registry.addButton("unlink", {
        icon: "unlink",
        tooltip: "Remove link",
        onAction: function () {
            editor.execCommand("unlink");
        },
        stateSelector: "a[href]",
    });

    // editor.ui.registry.addButton("Ctrl+K", "", editor.settings.addLinkClicked);

    // editor.ui.registry.addButton("plonelink", {
    //     icon: "link",
    //     text: "Insert link",
    //     shortcut: "Ctrl+K",
    //     onAction: editor.settings.addLinkClicked,
    //     stateSelector: "a[href]",
    //     context: "insert",
    //     prependToContext: true,
    // });
});

export default Base.extend({
    name: "linkmodal",
    trigger: ".pat-linkmodal",
    defaults: {
        anchorSelector: "h1,h2,h3",
        linkTypes: [
            /* available, none activate by default because these options
         * only get merged, not set.
        'internal',
        'upload',
        'external',
        'email',
        'anchor',
        'image'
        'externalImage'*/
        ],
        initialLinkType: "internal",
        text: {
            insertHeading: "Insert Link",
        },
        linkTypeClassMapping: {
            internal: InternalLink,
            upload: UploadLink,
            external: ExternalLink,
            email: EmailLink,
            anchor: AnchorLink,
            image: ImageLink,
            uploadImage: UploadLink,
            externalImage: LinkType,
        },
    },
    // XXX: this is a temporary work around for having separated templates.
    // Image modal is going to have its own modal class, funcs and template.
    linkTypeTemplateMapping: {
        internal: LinkTemplate,
        upload: LinkTemplate,
        external: LinkTemplate,
        email: LinkTemplate,
        anchor: LinkTemplate,
        image: ImageTemplate,
        uploadImage: ImageTemplate,
        externalImage: ImageTemplate,
    },

    template: function (data) {
        return _.template(this.linkTypeTemplateMapping[this.linkType])(data);
    },

    init: function () {
        var self = this;
        self.tinypattern = self.options.tinypattern;
        if (self.tinypattern.options.anchorSelector) {
            self.options.anchorSelector = self.tinypattern.options.anchorSelector;
        }
        self.tiny = self.tinypattern.tiny;
        self.dom = self.tiny.dom;
        self.linkType = self.options.initialLinkType;
        self.linkTypes = {};
        self.modal = registry.patterns["plone-modal"].init(self.$el, {
            html: self.generateModalHtml(),
            content: null,
            buttons: ".plone-btn",
            reloadWindowOnClose: false,
            templateOptions: {
                classDialog: "modal-dialog modal-lg",
                reloadWindowOnClose: false,
            },
            actionOptions: { reloadWindowOnClose: false },
            backdropOptions: {
                zIndex: "1340",
                closeOnClick: false,
            },
        });
        self.modal.on("shown", (e) => {
            self.modalShown.apply(self, [e]);
        });
    },

    isOnlyTextSelected: function () {
        /* pulled from TinyMCE link plugin */
        var html = this.tiny.selection.getContent();

        // Partial html and not a fully selected anchor element
        if (
            /</.test(html) &&
            (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf("href=") === -1)
        ) {
            return false;
        }

        if (this.anchorElm) {
            var nodes = this.anchorElm.childNodes;

            if (nodes.length === 0) {
                return false;
            }

            for (var ii = nodes.length - 1; ii >= 0; ii--) {
                if (nodes[ii].nodeType !== 3) {
                    return false;
                }
            }
        }

        return true;
    },

    generateModalHtml: function () {
        return this.template({
            options: this.options,
            upload: this.options.upload,
            text: this.options.text,
            insertHeading: this.options.text.insertHeading,
            insertImageHelp: this.options.text.insertImageHelp,
            uploadText: this.options.text.upload,
            insertLinkHelp: this.options.text.insertLinkHelp,
            internal: this.options.text.internal,
            external: this.options.text.external,
            anchor: this.options.text.anchor,
            anchorLabel: this.options.text.anchorLabel,
            target: this.options.text.target,
            linkTypes: this.options.linkTypes,
            externalText: this.options.text.externalText,
            emailText: this.options.text.email,
            subjectText: this.options.text.subject,
            targetList: this.options.targetList,
            titleText: this.options.text.title,
            internalImageText: this.options.text.internalImage,
            externalImage: this.options.text.externalImage,
            externalImageText: this.options.text.externalImageText,
            altText: this.options.text.alt,
            imageAlignText: this.options.text.imageAlign,
            captionFromDescriptionText: this.options.text.captionFromDescription,
            enableImageZoom: this.options.text.enableImageZoom,
            captionText: this.options.text.caption,
            scaleText: this.options.text.scale,
            pictureVariants: this.options.pictureVariants,
            imageCaptioningEnabled: this.options.imageCaptioningEnabled,
            cancelBtn: this.options.text.cancelBtn,
            insertBtn: this.options.text.insertBtn,
        });
    },

    isImageMode: function () {
        return ["image", "uploadImage", "externalImage"].indexOf(this.linkType) !== -1;
    },

    initElements: function () {
        var self = this;
        self.$target = $('select[name="target"]', self.modal.$modal);
        self.$button = $('.modal-footer input[name="insert"]', self.modal.$modal);
        self.$title = $('input[name="title"]', self.modal.$modal);
        self.$subject = $('input[name="subject"]', self.modal.$modal);

        self.$alt = $('input[name="alt"]', self.modal.$modal);
        self.$align = $('select[name="align"]', self.modal.$modal);
        self.$scale = $('select[name="scale"]', self.modal.$modal);
        self.$enableImageZoom = $('input[name="enableImageZoom"]', self.modal.$modal);
        self.$captionFromDescription = $(
            'input[name="captionFromDescription"]',
            self.modal.$modal
        );
        self.$caption = $('textarea[name="caption"]', self.modal.$modal);

        /* load up all the link types */
        _.each(self.options.linkTypes, function (type) {
            var $container = $(".linkType." + type + " .main", self.modal.$modal);
            if ($container.length) {
                self.linkTypes[type] = new self.options.linkTypeClassMapping[type](
                    $container,
                    {
                        linkModal: self,
                        tinypattern: self.tinypattern,
                    }
                );
            }
        });

        $(".autotoc-nav a", self.modal.$modal).on("click", function () {
            var $fieldset = $("fieldset.linkType", self.modal.$modal).eq(
                $(this).index()
            );
            var classes = $fieldset[0].className.split(/\s+/);
            _.each(classes, function (val) {
                if (_.indexOf(self.options.linkTypes, val) !== -1) {
                    self.linkType = val;
                }
            });
        });

        self.$captionFromDescription.on("change", function () {
            if (this.checked) {
                self.$caption.prop("disabled", true);
            } else {
                self.$caption.prop("disabled", false);
            }
        });
    },

    getLinkUrl: function () {
        // get the url, only get one uid
        return this.linkTypes[this.linkType].toUrl();
    },

    getValue: function () {
        return this.linkTypes[this.linkType].value();
    },

    updateAnchor: function (href) {
        var self = this;

        self.tiny.focus();
        self.tiny.selection.setRng(self.rng);

        var target = self.$target.val();
        var title = self.$title.val();
        var linkAttrs = $.extend(
            true,
            self.data,
            {
                "title": title ? title : null,
                "target": target ? target : null,
                "data-linkType": self.linkType,
                "href": href,
            },
            self.linkTypes[self.linkType].attributes()
        );
        if (self.anchorElm) {
            if (self.onlyText && linkAttrs.text !== self.initialText) {
                if ("innerText" in self.anchorElm) {
                    self.anchorElm.innerText = self.data.text;
                } else {
                    self.anchorElm.textContent = self.data.text;
                }
            }

            self.tiny.dom.setAttribs(self.anchorElm, linkAttrs);

            self.tiny.selection.select(self.anchorElm);
            self.tiny.undoManager.add();
        } else {
            if (self.onlyText) {
                self.tiny.insertContent(
                    self.tiny.dom.createHTML(
                        "a",
                        linkAttrs,
                        self.tiny.dom.encode(self.data.text)
                    )
                );
            } else {
                self.tiny.execCommand("mceInsertLink", false, linkAttrs);
            }
        }
    },

    focusElement: function (elm) {
        this.tiny.focus();
        this.tiny.selection.select(elm);
        this.tiny.nodeChanged();
    },

    getScaleFromSrcset: function (pictureVariant) {
        let pictureVariantsConfig = this.options.pictureVariants[pictureVariant];
        return pictureVariantsConfig.sourceset[
            pictureVariantsConfig.sourceset.length - 1
        ].scale;
    },

    updateImage: function (src) {
        var self = this;
        var title = self.$title.val();
        var captionFromDescription = self.$captionFromDescription.prop("checked");
        var enableImageZoom = self.$enableImageZoom.prop("checked");
        var caption = self.$caption.val();

        self.tiny.focus();
        self.tiny.selection.setRng(self.rng);
        var cssclasses = [
            "image-richtext",
            self.$align.val(),
        ];
        if(self.linkType !== "externalImage"){
            cssclasses.push("picture-variant-" + self.$scale.val())
        }
        if (captionFromDescription || caption) {
            cssclasses.push("captioned");
        }
        if (enableImageZoom) {
            cssclasses.push("zoomable");
        }
        var data = $.extend(
            true,
            {},
            {
                "src": src,
                "title": title ? title : null,
                "alt": self.$alt.val(),
                "class": cssclasses.join(" "),
                "data-linkType": self.linkType,
                "data-scale": self.getScaleFromSrcset(self.$scale.val()),
            },
            self.linkTypes[self.linkType].attributes()
        );
        if(self.linkType !== "externalImage"){
            data["data-picturevariant"] = self.$scale.val();
        }

        if (caption && !captionFromDescription) {
            data["data-captiontext"] = caption;
        }
        if (self.imgElm && !self.imgElm.getAttribute("data-mce-object")) {
            const imgWidth = self.dom.getAttrib(self.imgElm, "width");
            const imgHight = self.dom.getAttrib(self.imgElm, "height");
            if (imgWidth) {
                data.width = imgWidth;
            }
            if (imgHight) {
                data.height = imgHight;
            }
        } else {
            self.imgElm = null;
        }

        function waitLoad(imgElm) {
            imgElm.onload = imgElm.onerror = function () {
                imgElm.onload = imgElm.onerror = null;
                self.focusElement(imgElm);
            };
        }

        data.id = "__mcenew";
        var html_inner = self.dom.createHTML("img", data);
        var html_string;
        html_string = html_inner;
        self.tiny.insertContent(html_string);
        self.imgElm = self.dom.get("__mcenew");
        self.dom.setAttrib(self.imgElm, "id", null);

        waitLoad(self.imgElm);
        if (self.imgElm.complete) {
            self.focusElement(self.imgElm);
        }
    },

    // eslint-disable-next-line no-unused-vars
    modalShown: function (e) {
        var self = this;
        self.initElements();
        self.initData();
        // upload init
        if (self.options.upload) {
            self.$upload = $(".uploadify-me", self.modal.$modal);
            self.options.upload.relatedItems = $.extend(
                true,
                {},
                self.options.relatedItems
            );
            self.options.upload.relatedItems.selectableTypes = self.options.folderTypes;
            self.$upload.addClass("pat-upload");
            new PatternUpload(self.$upload, self.options.upload);
            self.$upload.on(
                "uploadAllCompleted",
                function (evt, data) {
                    if (self.linkTypes.image) {
                        self.linkTypes.image.set(data.data.UID);
                        $(
                            "#" + $("#tinylink-image", self.modal.$modal).data("navref")
                        ).trigger("click");
                    } else {
                        self.linkTypes.internal.set(data.data.UID);
                        $(
                            "#" +
                                $("#tinylink-internal", self.modal.$modal).data("navref")
                        ).trigger("click");
                    }
                }.bind(self)
            );
        }

        self.$button.off("click").on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.linkType = self.modal.$modal.find("fieldset.active").data("linktype");

            if (self.linkType === "uploadImage" || self.linkType === "upload") {
                var patUpload = self.$upload.data().patternUpload;
                if (patUpload.dropzone.files.length > 0) {
                    patUpload.processUpload();
                    // eslint-disable-next-line no-unused-vars
                    self.$upload.on("uploadAllCompleted", function (evt, data) {
                        var counter = 0;
                        var checkUpload = function () {
                            if (counter < 5 && !self.linkTypes[self.linkType].value()) {
                                counter += 1;
                                setTimeout(checkUpload, 100);
                                return;
                            } else {
                                var href = self.getLinkUrl();
                                self.updateImage(href);
                                self.hide();
                            }
                        };
                        checkUpload();
                    });
                }
            }
            var href;
            try {
                href = self.getLinkUrl();
            } catch (error) {
                return; // just cut out if no url
            }
            if (!href) {
                return; // just cut out if no url
            }
            if (self.isImageMode()) {
                self.updateImage(href);
            } else {
                /* regular anchor */
                self.updateAnchor(href);
            }
            self.hide();
        });
        $('.modal-footer input[name="cancel"]', self.modal.$modal).on("click", function (e) {
            e.preventDefault();
            self.hide();
        });
    },

    show: function () {
        this.modal.show();
    },

    hide: function () {
        this.modal.hide();
    },

    initData: function () {
        var self = this;

        self.data = {};
        // get selection BEFORE..
        // This is pulled from TinyMCE link plugin
        self.initialText = null;
        var value;
        self.rng = self.tiny.selection.getRng();
        self.selectedElm = self.tiny.selection.getNode();
        self.anchorElm = self.tiny.dom.getParent(self.selectedElm, "a[href]");
        self.onlyText = self.isOnlyTextSelected();

        self.data.text = self.initialText = self.anchorElm
            ? self.anchorElm.innerText || self.anchorElm.textContent
            : self.tiny.selection.getContent({ format: "text" });
        self.data.href = self.anchorElm
            ? self.tiny.dom.getAttrib(self.anchorElm, "href")
            : "";

        if (self.anchorElm) {
            self.data.target = self.tiny.dom.getAttrib(self.anchorElm, "target");
        } else if (self.tiny.settings.default_link_target) {
            self.data.target = self.tiny.settings.default_link_target;
        }

        if ((value = self.tiny.dom.getAttrib(self.anchorElm, "rel"))) {
            self.data.rel = value;
        }

        if ((value = self.tiny.dom.getAttrib(self.anchorElm, "class"))) {
            self.data["class"] = value;
        }

        if ((value = self.tiny.dom.getAttrib(self.anchorElm, "title"))) {
            self.data.title = value;
        }

        self.tiny.focus();
        self.anchorElm = self.dom.getParent(self.selectedElm, "a[href]");

        var linkType;
        if (self.isImageMode()) {
            var img;
            img = self.selectedElm;
            self.imgElm = img;

            var src = self.dom.getAttrib(self.imgElm, "src");
            var captionText = self.dom.getAttrib(self.imgElm, "data-captiontext");
            self.$title.val(self.dom.getAttrib(self.imgElm, "title"));
            self.$alt.val(self.dom.getAttrib(self.imgElm, "alt"));

            if ($(self.imgElm).hasClass("zoomable")) {
                self.$enableImageZoom.prop("checked", true);
            }
            if ($(self.imgElm).hasClass("captioned") && !captionText) {
                self.$captionFromDescription.prop("checked", true);
                self.$caption.prop("disabled", true);
            } else if ($(self.imgElm).hasClass("captioned") && captionText) {
                self.$captionFromDescription.prop("checked", false);
            } else {
                self.$captionFromDescription.prop("checked", false);
            }
            if (captionText) {
                self.$caption.val(captionText);
            }

            linkType = self.dom.getAttrib(self.imgElm, "data-linktype");
            if (linkType && linkType in self.linkTypes) {
                self.linkType = linkType;
                self.linkTypes[self.linkType].load(self.imgElm);
                // set scale selection in link modal:
                var pictureVariant = self.dom.getAttrib(
                    self.imgElm,
                    "data-picturevariant"
                );
                self.$scale.val(pictureVariant);
                $("#tinylink-" + self.linkType, self.modal.$modal).trigger("click");
            } else if (src) {
                self.guessImageLink(src);
            }
            var className = self.dom.getAttrib(self.imgElm, "class");
            var klasses = className.split(" ");
            for (var i = 0; i < klasses.length; i = i + 1) {
                var klass = klasses[i];
                for (var availClass in self.options.imageClasses) {
                    if (availClass.indexOf(klass) !== -1) {
                        self.$align.val(klass);
                    }
                }
            }
        } else if (self.anchorElm) {
            self.focusElement(self.anchorElm);
            var href = "";
            href = self.dom.getAttrib(self.anchorElm, "href");
            self.$target.val(self.dom.getAttrib(self.anchorElm, "target"));
            self.$title.val(self.dom.getAttrib(self.anchorElm, "title"));
            linkType = self.dom.getAttrib(self.anchorElm, "data-linktype");
            if (linkType) {
                self.linkType = linkType;
                self.linkTypes[self.linkType].load(self.anchorElm);
                var $panel = $("#tinylink-" + self.linkType, self.modal.$modal);
                // $('#tinylink-' + self.linkType, self.modal.$modal).trigger('click');
                if ($panel.length === 1) {
                    $("#" + $panel.data("autotoc-trigger-id")).trigger("click");
                }
            } else if (href) {
                self.guessAnchorLink(href);
            }
        }
    },

    guessImageLink: function (src) {
        if (src.indexOf(this.options.prependToScalePart) !== -1) {
            this.linkType = "image";
            // TODO: use data-scale attribute instead:
            this.$scale.val(this.tinypattern.getScaleFromUrl(src));
            this.linkTypes.image.set(this.tinypattern.stripGeneratedUrl(src));
        } else {
            this.linkType = "externalImage";
            this.linkTypes.externalImage.set(src);
        }
    },

    guessAnchorLink: function (href) {
        if (
            this.options.prependToUrl &&
            href.indexOf(this.options.prependToUrl) !== -1
        ) {
            // XXX if using default configuration, it gets more difficult
            // here to detect internal urls so this might need to change...
            this.linkType = "internal";
            this.linkTypes.internal.set(this.tinypattern.stripGeneratedUrl(href));
        } else if (href.indexOf("mailto:") !== -1) {
            this.linkType = "email";
            var email = href.substring("mailto:".length, href.length);
            var split = email.split("?subject=");
            this.linkTypes.email.set(split[0]);
            if (split.length > 1) {
                this.$subject.val(decodeURIComponent(split[1]));
            }
        } else if (href[0] === "#") {
            this.linkType = "anchor";
            this.linkTypes.anchor.set(href.substring(1));
        } else {
            this.linkType = "external";
            this.linkTypes.external.set(href);
        }
    },

    setSelectElement: function ($el, val) {
        $el.find("option:selected").prop("selected", false);
        if (val) {
            // update
            $el.find('option[value="' + val + '"]').prop("selected", true);
        }
    },

    reinitialize: function () {
        /*
         * This will probably be called before show is run.
         * It will overwrite the base html template given to
         * be able to privde default values for the overlay
         */
        this.modal.options.html = this.generateModalHtml();
    },
});
