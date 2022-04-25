import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import I18n from "../../core/i18n";
import _t from "../../core/i18n-wrapper";
import utils from "../../core/utils";

let LinkModal = null;

export default Base.extend({
    name: "tinymce",
    trigger: ".pat-tinymce",
    parser: "mockup",
    defaults: {
        upload: {
            uploadMultiple: false,
            maxFiles: 1,
            showTitle: false,
        },
        relatedItems: {
            // UID attribute is required here since we're working with related items
            attributes: [
                "UID",
                "Title",
                "portal_type",
                "path",
                "getURL",
                "getIcon",
                "is_folderish",
                "review_state",
            ],
            batchSize: 20,
            basePath: "/",
            vocabularyUrl: null,
            width: 500,
            maximumSelectionSize: 1,
            placeholder: _t("Search for item on site..."),
        },
        text: {
            insertBtn: _t("Insert"), // so this can be configurable for different languages
            cancelBtn: _t("Cancel"),
            insertHeading: _t("Insert link"),
            title: _t("Title"),
            internal: _t("Internal"),
            external: _t("External"),
            externalText: _t(
                "External URL (can be relative within this site or absolute if it starts with http:// or https://)"
            ),
            email: _t("Email Address"),
            anchor: _t("Anchor"),
            anchorLabel: _t("Select an anchor"),
            target: _t("Target"),
            subject: _t("Email Subject (optional)"),
            image: _t("Image"),
            imageAlign: _t("Align"),
            enableImageZoom: _t("Enable image zoom"),
            scale: _t("Size"),
            alt: _t("Alternative Text"),
            insertImageHelp: _t(
                "Specify an image. It can be on this site already (Internal Image), an image you upload (Upload), or from an external site (External Image)."
            ),
            internalImage: _t("Internal Image"),
            externalImage: _t("External Image"),
            externalImageText: _t(
                "External Image URL (can be relative within this site or absolute if it starts with http:// or https://)"
            ),
            upload: _t("Upload"),
            insertLinkHelp: _t(
                "Specify the object to link to. It can be on this site already (Internal), an object you upload (Upload), from an external site (External), an email address (Email), or an anchor on this page (Anchor)."
            ),
            captionFromDescription: _t("Show Image Caption from Image Description"),
            caption: _t("Image Caption"),
        },
        // URL generation options
        loadingBaseUrl: "++plone++static/tinybase",
        prependToUrl: "",
        appendToUrl: "",
        linkAttribute: "path", // attribute to get link value from data
        prependToScalePart: "/imagescale/",
        appendToScalePart: "",
        appendToOriginalScalePart: "",
        // defaultScale: "large",
        defaultSrcset: "medium",
        imageCaptioningEnabled: true,
        imageSrcsets: {
            large: {
                "title": "Large",
                "preview": "++theme++barceloneta/static/preview-image-large.png",
                "use-in-editor": true,
                "sourceset": [
                    {
                        scale: "teaser",
                        media: "(min-width:768px) and (orientation:portrait)",
                    },
                    {
                        scale: "large",
                        media: "(min-width:768px)",
                    },
                    {
                        scale: "larger",
                        media: "(min-width:992px)",
                    },
                    {
                        scale: "great",
                        media: "(min-width:1200px)",
                    },
                    {
                        scale: "huge",
                        media: "(min-width:1400px)",
                    },
                    {
                        scale: "huge",
                    },
                ],
            },
            medium: {
                title: "Medium",
                preview: "++theme++barceloneta/static/preview-image-medium.png",
                sourceset: [
                    {
                        scale: "larger",
                    },
                ],
            },
            small: {
                title: "Small",
                preview: "++theme++barceloneta/static/preview-image-small.png",
                sourceset: [
                    {
                        scale: "preview",
                    },
                ],
            },
        },
        imageClasses: {
            "image-inline": _t("Inline"),
            "image-right": _t("Right"),
            "image-left": _t("Left"),
        },
        targetList: [
            { text: _t("Open in this window / frame"), value: "" },
            { text: _t("Open in new window"), value: "_blank" },
            { text: _t("Open in parent window / frame"), value: "_parent" },
            {
                text: _t("Open in top frame (replaces all frames)"),
                value: "_top",
            },
        ],
        imageTypes: ["Image"],
        folderTypes: ["Folder", "Plone Site"],
        tiny: {
            //content_css:
            //    "/base/node_modules/tinymce-builded/js/tinymce/skins/lightgray/content.min.css",
            theme: "silver",
            plugins: [
                "advlist",
                "autolink",
                "lists",
                "charmap",
                "print",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "contextmenu",
                "paste",
                "plonelink",
                "ploneimage",
            ],
            menubar: "edit table format tools view insert",
            toolbar:
                "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | unlink plonelink ploneimage",
            //'autoresize_max_height': 900,
            height: 400,
        },
        inline: false,
    },
    init: async function () {
        const implementation = (await import("./tinymce--implementation")).default;
        this.instance = new implementation(this.el, this.options);
        this.instance.init();
    },
    destroy: function () {
        this.instance.destroy();
    },
});
