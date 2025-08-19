import Base from "@patternslib/patternslib/src/core/base";
import events from "@patternslib/patternslib/src/core/events";
import registry from "@patternslib/patternslib/src/core/registry";
import $ from "jquery";
import _ from "underscore";

import tinymce from "tinymce/tinymce";
import "../../autotoc/autotoc";
import "../../modal/modal";
import ImageTemplate from "../templates/image.xml";
import LinkTemplate from "../templates/link.xml";

const LinkType = Base.extend({
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
        return this.el.querySelector("input");
    },

    value: function () {
        return this.getEl().value.trim();
    },

    toUrl: function () {
        return this.value();
    },

    load: function (element) {
        let val = this.tiny.dom.getAttrib(element, "data-val");
        this.set(val);
    },

    set: function (val) {
        this.getEl().setAttribute("value", val);
    },

    attributes: function () {
        return {
            "data-val": this.value(),
        };
    },
    updateRelatedItems: function () {},
});

const ExternalLink = LinkType.extend({
    name: "externallinktype",
    trigger: ".pat-externallinktype-dummy",
    init: function () {
        LinkType.prototype.init.call(this);
        // selectedItemsNode.addEventListener("change", readSelectedItemsFromInput);
        this.getEl().addEventListener("change", (e) => {
            // check here if we should automatically add in http:// to url
            const val = $(e.target).val();
            if (new RegExp("https?://").test(val)) {
                // already valid url
                return;
            }
            const domain = val.split("/")[0];
            if (domain.indexOf(".") !== -1) {
                $(e.target).val("http://" + val);
            }
        });
    },
    load: function (element) {
        let val = this.tiny.dom.getAttrib(element, "data-val");
        this.set(val);
    },
});

const InternalLink = LinkType.extend({
    name: "internallinktype",
    trigger: ".pat-internallinktype-dummy",
    init: async function () {
        const linkEl = this.getEl();
        if (!linkEl) {
            return;
        }
        LinkType.prototype.init.call(this);
        await this.createContentBrowser();
    },

    getEl: function () {
        return this.el.querySelector("input");
    },

    createContentBrowser: async function () {
        const options = {
            selection: [],
            ...this.linkModal.options?.relatedItems,
        };
        options["maximum-selection-size"] = 1;
        // enable upload in ContentBrowser instead of separate tab
        options["upload"] = 1;
        const inputEl = this.getEl();
        const element = this.tiny.selection.getNode();
        const linkType = this.tiny.dom.getAttrib(element, "data-linktype");
        if (linkType === "internal" || linkType === "image") {
            options.selection.push(this.tiny.dom.getAttrib(element, "data-val"));
        }
        const ContentBrowser = (await import("../../contentbrowser/contentbrowser"))
            .default;
        this.contentBrowserPattern = new ContentBrowser(inputEl, options);
    },

    toUrl: function () {
        const value = this.value();
        if (value) {
            return this.tinypattern.generateUrl(value);
        }
        return null;
    },
});

const UploadLink = LinkType.extend({
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

const ImageLink = InternalLink.extend({
    name: "imagelinktype",
    trigger: ".pat-imagelinktype-dummy",
    toUrl: function () {
        const value = this.value();
        return this.tinypattern.generateImageUrl(
            value,
            this.linkModal.getScaleFromSrcset(this.linkModal.$scale.val()),
        );
    },
});

const EmailLink = LinkType.extend({
    name: "emaillinktype",
    trigger: ".pat-emaillinktype-dummy",
    toUrl: function () {
        const val = this.value();
        if (val) {
            const subject = this.getSubject();
            let href = "mailto:" + val;
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
        const attribs = LinkType.prototype.attributes.call(this);
        attribs["data-subject"] = this.getSubject();
        return attribs;
    },
});

const AnchorLink = LinkType.extend({
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
        const val = this.$select.select2("data");
        if (val && typeof val === "object") {
            return val.id;
        }
        return val;
    },

    populate: function () {
        this.$select.find("option").remove();
        this.anchorNodes = [];
        this.anchorData = [];

        let nodes = this.tiny.dom.select(".mceItemAnchor,.mce-item-anchor");
        for (const node of nodes) {
            let name = this.tiny.dom.getAttrib(node, "name");
            if (!name) {
                name = this.tiny.dom.getAttrib(node, "id");
            }
            if (name !== "") {
                this.anchorNodes.push(node);
                this.anchorData.push({ name: name, title: name });
            }
        }

        nodes = this.tiny.dom.select(this.linkModal.options.anchorSelector);
        if (nodes.length > 0) {
            for (const node of nodes) {
                const title = $(node)
                    .text()
                    .replace(/^\s+|\s+$/g, "");
                if (title === "") {
                    continue;
                }
                let name = title.toLowerCase().substring(0, 1024);
                name = name.replace(/[^a-z0-9]/g, "-");
                /* okay, ugly, but we need to first check that this anchor isn't already available */
                let found = false;
                for (let cnt = 0; cnt < this.anchorNodes.length; cnt++) {
                    let anode = this.anchorData[cnt];
                    if (anode.name === name) {
                        found = true;
                        // so it's also found, let's update the title to be more presentable
                        anode.title = title;
                        break;
                    }
                }
                if (!found) {
                    this.anchorData.push({
                        name: name,
                        title: title,
                        newAnchor: true,
                    });
                    this.anchorNodes.push(node);
                }
            }
        }
        if (this.anchorNodes.length > 0) {
            for (const [index, data] of this.anchorData.entries()) {
                this.$select.append(`<option value="${index}">${data.title}</option>`);
            }
        } else {
            this.$select.append("<option>No anchors found..</option>");
        }
    },

    getIndex: function (name) {
        for (const [index, data] of this.anchorData.entries()) {
            if (data.name === name) {
                return index;
            }
        }
        return 0;
    },

    toUrl: function () {
        const val = this.value();
        if (val) {
            const index = parseInt(val, 10);
            const node = this.anchorNodes[index];
            const data = this.anchorData[index];
            if (data.newAnchor) {
                node.innerHTML = `<a name="${data.name}" class="mce-item-anchor"></a>${node.innerHTML}`;
            }
            return `#${data.name}`;
        }
        return null;
    },

    set: function (val) {
        const anchor = this.getIndex(val);
        this.$select.select2("data", "" + anchor);
    },
});

const add_image = (editor) => {
    // in case of inline mode we need the node where the pattern is instantinated
    // not the tinymce editable div ("-editable")
    const pattern_inst = document.getElementById(editor.id.replace("-editable", ""))[
        "pattern-tinymce"
    ].instance;
    pattern_inst.addImageClicked();
};

const add_link = (editor) => {
    const pattern_inst = document.getElementById(editor.id.replace("-editable", ""))[
        "pattern-tinymce"
    ].instance;
    pattern_inst.addLinkClicked();
};

// image plugin
// eslint-disable-next-line no-unused-vars
tinymce.PluginManager.add("ploneimage", (editor, url) => {
    editor.ui.registry.addButton("ploneimage", {
        icon: "image",
        text: "Insert image",
        tooltip: "Insert/edit image",
        onAction: () => {
            add_image(editor);
        },
        // stateSelector: "img:not([data-mce-object])",
    });
    editor.ui.registry.addMenuItem("ploneimage", {
        icon: "image",
        text: "Insert image",
        onAction: () => {
            add_image(editor);
        },
        // stateSelector: "img:not([data-mce-object])",
    });
});

// link plugin
// eslint-disable-next-line no-unused-vars
tinymce.PluginManager.add("plonelink", (editor, url) => {
    editor.ui.registry.addButton("plonelink", {
        icon: "link",
        tooltip: "Insert/edit link",
        shortcut: "Ctrl+K",
        onAction: () => {
            add_link(editor);
        },
        stateSelector: "a[href]",
    });
    editor.ui.registry.addMenuItem("plonelink", {
        icon: "link",
        text: "Insert link",
        shortcut: "Ctrl+K",
        onAction: () => {
            add_link(editor);
        },
        stateSelector: "a[href]",
    });

    editor.ui.registry.addButton("unlink", {
        icon: "unlink",
        tooltip: "Remove link",
        // eslint-disable-next-line no-unused-vars
        onAction: (api) => {
            editor.execCommand("unlink");
        },
        stateSelector: "a[href]",
    });
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
        this.tinypattern = this.options.tinypattern;
        if (this.tinypattern.options.anchorSelector) {
            this.options.anchorSelector = this.tinypattern.options.anchorSelector;
        }
        this.tiny = this.tinypattern.tiny;
        this.dom = this.tiny.dom;
        this.linkType = this.options.initialLinkType;
        this.linkTypes = {};
        this.modal = registry.patterns["plone-modal"].init(this.$el, {
            html: this.generateModalHtml(),
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
        this.modal.on("shown", (e) => {
            this.modalShown.apply(this, [e]);
        });
    },

    isOnlyTextSelected: function () {
        /* pulled from TinyMCE link plugin */
        const html = this.tiny.selection.getContent();

        // Partial html and not a fully selected anchor element
        if (
            /</.test(html) &&
            (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf("href=") === -1)
        ) {
            return false;
        }

        if (this.anchorElm) {
            const nodes = this.anchorElm.childNodes;

            if (nodes.length === 0) {
                return false;
            }

            for (let ii = nodes.length - 1; ii >= 0; ii--) {
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

    initElements: async function () {
        this.$target = $('select[name="target"]', this.modal.$modal);
        this.$button = $('.modal-footer input[name="insert"]', this.modal.$modal);
        this.$title = $('input[name="title"]', this.modal.$modal);
        this.$subject = $('input[name="subject"]', this.modal.$modal);

        this.$alt = $('input[name="alt"]', this.modal.$modal);
        this.$align = $('select[name="align"]', this.modal.$modal);
        this.$scale = $('select[name="scale"]', this.modal.$modal);
        this.$selectedItems = $("input.pat-contentbrowser", this.modal.$modal);
        this.$enableImageZoom = $('input[name="enableImageZoom"]', this.modal.$modal);
        this.$captionFromDescription = $(
            'input[name="captionFromDescription"]',
            this.modal.$modal,
        );
        this.$caption = $('textarea[name="caption"]', this.modal.$modal);

        /* load up all the link types */
        for (const type of this.options.linkTypes) {
            const $container = $(".linkType." + type + " .main", this.modal.$modal);
            if ($container.length) {
                const instance = new this.options.linkTypeClassMapping[type](
                    $container,
                    {
                        linkModal: this,
                        tinypattern: this.tinypattern,
                    },
                );
                await events.await_pattern_init(instance);
                this.linkTypes[type] = instance;
            }
        }

        $(".autotoc-nav a", this.modal.$modal).on("click", (e) => {
            const $fieldset = $("fieldset.linkType", this.modal.$modal).eq(
                $(e.target).index(),
            );
            const classes = $fieldset[0].className.split(/\s+/);
            _.each(classes, (val) => {
                if (_.indexOf(this.options.linkTypes, val) !== -1) {
                    this.linkType = val;
                }
            });
        });

        this.$captionFromDescription.on("change", (e) => {
            if (e.target.checked) {
                this.$caption.prop("disabled", true);
            } else {
                this.$caption.prop("disabled", false);
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
        this.tiny.focus();
        this.tiny.selection.setRng(this.rng);

        const target = this.$target.val();
        const title = this.$title.val();
        const linkAttrs = $.extend(
            true,
            this.data,
            {
                "title": title ? title : null,
                "target": target ? target : null,
                "data-linkType": this.linkType,
                "href": href,
            },
            this.linkTypes[this.linkType].attributes(),
        );
        if (this.anchorElm) {
            if (this.onlyText && linkAttrs.text !== this.initialText) {
                if ("innerText" in this.anchorElm) {
                    this.anchorElm.innerText = this.data.text;
                } else {
                    this.anchorElm.textContent = this.data.text;
                }
            }

            this.tiny.dom.setAttribs(this.anchorElm, linkAttrs);

            this.tiny.selection.select(this.anchorElm);
            this.tiny.undoManager.add();
        } else {
            if (this.onlyText) {
                this.tiny.insertContent(
                    this.tiny.dom.createHTML(
                        "a",
                        linkAttrs,
                        this.tiny.dom.encode(this.data.text),
                    ),
                );
            } else {
                this.tiny.execCommand("mceInsertLink", false, linkAttrs);
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
        console.log(`updateImage: ${src}`);
        const title = this.$title.val();
        const captionFromDescription = this.$captionFromDescription.prop("checked");
        const enableImageZoom = this.$enableImageZoom.prop("checked");
        const caption = this.$caption.val();

        this.tiny.focus();
        this.tiny.selection.setRng(this.rng);
        const cssclasses = ["image-richtext"];
        if (this.$align.val()) {
            cssclasses.push(this.$align.val());
        }
        if (this.linkType !== "externalImage") {
            cssclasses.push("picture-variant-" + this.$scale.val());
        }
        if (captionFromDescription || caption) {
            cssclasses.push("captioned");
        }
        if (enableImageZoom) {
            cssclasses.push("zoomable");
        }
        const data = {
            "src": src,
            "title": title ? title : null,
            "alt": this.$alt.val(),
            "class": cssclasses.join(" "),
            "data-linkType": this.linkType,
            "data-scale": this.getScaleFromSrcset(this.$scale.val()),
            ...this.linkTypes[this.linkType].attributes(),
        };

        if (this.linkType !== "externalImage") {
            data["data-picturevariant"] = this.$scale.val();
        }

        if (caption && !captionFromDescription) {
            data["data-captiontext"] = caption;
        }
        if (this.imgElm && !this.imgElm.getAttribute("data-mce-object")) {
            const imgWidth = this.dom.getAttrib(this.imgElm, "width");
            const imgHeight = this.dom.getAttrib(this.imgElm, "height");
            if (imgWidth) {
                data.width = imgWidth;
            }
            if (imgHeight) {
                data.height = imgHeight;
            }
        } else {
            this.imgElm = null;
        }

        const waitLoad = (imgElm) => {
            imgElm.onload = imgElm.onerror = () => {
                imgElm.onload = imgElm.onerror = null;
                this.focusElement(imgElm);
            };
        };

        const newImgElm = this.dom.create("img", data);

        if (this.imgElm && this.imgElm.tagName.toLowerCase() == "img") {
            this.imgElm.replaceWith(newImgElm);
        } else {
            this.rng.insertNode(newImgElm);
        }
        this.imgElm = newImgElm;

        waitLoad(this.imgElm);
        if (this.imgElm.complete) {
            this.focusElement(this.imgElm);
        }
    },

    // eslint-disable-next-line no-unused-vars
    modalShown: async function (e) {
        await this.initElements();
        this.initData();
        // upload init
        // if (this.options.upload) {
        //     this.$upload = $(".uploadify-me", this.modal.$modal);
        //     this.options.upload.relatedItems = $.extend(
        //         true,
        //         {},
        //         this.options.relatedItems
        //     );
        //     this.options.upload.relatedItems.selectableTypes = this.options.folderTypes;
        //     this.$upload.addClass("pat-upload");
        //     new PatternUpload(this.$upload, this.options.upload);
        //     this.$upload.on(
        //         "uploadAllCompleted",
        //         (evt, data) => {
        //             if (this.linkTypes.image) {
        //                 this.linkTypes.image.set(data.data.UID);
        //                 $(
        //                     "#" + $("#tinylink-image", this.modal.$modal).data("navref")
        //                 ).trigger("click");
        //             } else {
        //                 this.linkTypes.internal.set(data.data.UID);
        //                 $(
        //                     "#" +
        //                         $("#tinylink-internal", this.modal.$modal).data("navref")
        //                 ).trigger("click");
        //             }
        //         }
        //     );
        // }

        this.$button.off("click").on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.linkType = this.modal.$modal.find("fieldset.active").data("linktype");
            // if (this.linkType === "uploadImage" || this.linkType === "upload") {
            //     const patUpload = this.$upload.data().patternUpload;
            //     if (patUpload.dropzone.files.length > 0) {
            //         patUpload.processUpload();
            //         // eslint-disable-next-line no-unused-vars
            //         this.$upload.on("uploadAllCompleted", (evt, data) => {
            //             let counter = 0;
            //             const checkUpload = () => {
            //                 if (counter < 5 && !this.linkTypes[this.linkType].value()) {
            //                     counter += 1;
            //                     setTimeout(checkUpload, 100);
            //                     return;
            //                 } else {
            //                     const href = this.getLinkUrl();
            //                     this.updateImage(href);
            //                     this.hide();
            //                 }
            //             };
            //             checkUpload();
            //         });
            //     }
            // }
            let href;
            try {
                href = this.getLinkUrl();
            } catch (error) {
                console.log(error);
                return; // just cut out if no url
            }
            if (!href) {
                return; // just cut out if no url
            }
            if (this.isImageMode()) {
                this.updateImage(href);
            } else {
                /* regular anchor */
                this.updateAnchor(href);
            }
            this.hide();
        });
        $('.modal-footer input[name="cancel"]', this.modal.$modal).on("click", (e) => {
            e.preventDefault();
            this.hide();
        });
    },

    show: function () {
        this.modal.show();
    },

    hide: function () {
        this.modal.hide();
    },

    initData: function () {
        this.data = {};
        // get selection BEFORE..
        // This is pulled from TinyMCE link plugin
        this.initialText = null;
        let value;
        this.rng = this.tiny.selection.getRng();
        this.selectedElm = this.tiny.selection.getNode();
        this.anchorElm = this.tiny.dom.getParent(this.selectedElm, "a[href]");
        this.onlyText = this.isOnlyTextSelected();

        this.data.text = this.initialText = this.anchorElm
            ? this.anchorElm.innerText || this.anchorElm.textContent
            : this.tiny.selection.getContent({ format: "text" });
        this.data.href = this.anchorElm
            ? this.tiny.dom.getAttrib(this.anchorElm, "href")
            : "";

        if (this.anchorElm) {
            this.data.target = this.tiny.dom.getAttrib(this.anchorElm, "target");
        } else if (this.tiny.options.get("link_default_target")) {
            this.data.target = this.tiny.options.get("link_default_target");
        }

        if ((value = this.tiny.dom.getAttrib(this.anchorElm, "rel"))) {
            this.data.rel = value;
        }

        if ((value = this.tiny.dom.getAttrib(this.anchorElm, "class"))) {
            this.data["class"] = value;
        }

        if ((value = this.tiny.dom.getAttrib(this.anchorElm, "title"))) {
            this.data.title = value;
        }

        this.tiny.focus();
        this.anchorElm = this.dom.getParent(this.selectedElm, "a[href]");

        if (this.isImageMode()) {
            this.imgElm = this.selectedElm;

            const src = this.dom.getAttrib(this.imgElm, "src");
            const captionText = this.dom.getAttrib(this.imgElm, "data-captiontext");
            this.$title.val(this.dom.getAttrib(this.imgElm, "title"));
            this.$alt.val(this.dom.getAttrib(this.imgElm, "alt"));

            if ($(this.imgElm).hasClass("zoomable")) {
                this.$enableImageZoom.prop("checked", true);
            }
            if ($(this.imgElm).hasClass("captioned") && !captionText) {
                this.$captionFromDescription.prop("checked", true);
                this.$caption.prop("disabled", true);
            } else if ($(this.imgElm).hasClass("captioned") && captionText) {
                this.$captionFromDescription.prop("checked", false);
            } else {
                this.$captionFromDescription.prop("checked", false);
            }
            if (captionText) {
                this.$caption.val(captionText);
            }

            const linkType = this.dom.getAttrib(this.imgElm, "data-linktype");
            if (linkType && linkType in this.linkTypes) {
                this.linkType = linkType;
                this.linkTypes[this.linkType].load(this.imgElm);

                // set scale selection in link modal:
                const pictureVariant = this.dom.getAttrib(
                    this.imgElm,
                    "data-picturevariant",
                );
                this.$scale.val(pictureVariant);

                // const selectedImageUid = this.dom.getAttrib(
                //     this.imgElm,
                //     "data-val"
                // );
                // this.$selectedItems.val()

                $("#tinylink-" + this.linkType, this.modal.$modal).trigger("click");
            } else if (src) {
                this.guessImageLink(src);
            }
            const className = this.dom.getAttrib(this.imgElm, "class");
            const klasses = className.split(" ");
            for (const klass of klasses) {
                for (const availClass in this.options.imageClasses) {
                    if (availClass.indexOf(klass) !== -1) {
                        this.$align.val(klass);
                    }
                }
            }
        } else if (this.anchorElm) {
            this.focusElement(this.anchorElm);
            const href = this.dom.getAttrib(this.anchorElm, "href");
            this.$target.val(this.dom.getAttrib(this.anchorElm, "target"));
            this.$title.val(this.dom.getAttrib(this.anchorElm, "title"));
            const linkType = this.dom.getAttrib(this.anchorElm, "data-linktype");
            if (linkType) {
                this.linkType = linkType;
                this.linkTypes[this.linkType].load(this.anchorElm);
                const $panel = $("#tinylink-" + this.linkType, this.modal.$modal);
                // $('#tinylink-' + this.linkType, this.modal.$modal).trigger('click');
                if ($panel.length === 1) {
                    $("#" + $panel.data("autotoc-trigger-id")).trigger("click");
                }
            } else if (href) {
                this.guessAnchorLink(href);
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
        console.log("href: " + href);
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
            const email = href.substring("mailto:".length, href.length);
            const split = email.split("?subject=");
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

    // setSelectElement: function ($el, val) {
    //     $el.find("option:selected").prop("selected", false);
    //     if (val) {
    //         // update
    //         $el.find('option[value="' + val + '"]').prop("selected", true);
    //     }
    // },

    reinitialize: function () {
        /*
         * This will probably be called before show is run.
         * It will overwrite the base html template given to
         * be able to privde default values for the overlay
         */
        this.modal.options.html = this.generateModalHtml();
    },
});
