import Base from "@patternslib/patternslib/src/core/base";
import AppView from "./js/views/app";

export default Base.extend({
    name: "structure",
    trigger: ".pat-structure",
    parser: "mockup",
    defaults: {
        // for implementing history changes
        // Example: {base: 'http://mysite.com', appended: '/folder_contents'}
        urlStructure: null,
        vocabularyUrl: null,
        indexOptionsUrl: null, // for querystring widget
        contextInfoUrl: null, // for add new dropdown and other info
        setDefaultPageUrl: null,
        menuOptions: null, // default action menu options per item.
        backdropSelector: ".plone-modal", // Element upon which to apply backdrops used for popovers

        activeColumnsCookie: "activeColumns",

        attributes: [
            "CreationDate",
            "EffectiveDate",
            "ExpirationDate",
            "exclude_from_nav",
            "getIcon",
            "getMimeIcon",
            "getObjSize",
            "getURL",
            "id",
            "is_folderish",
            "last_comment_date",
            "ModificationDate",
            "path",
            "portal_type",
            "review_state",
            "Subject",
            "Title",
            "total_comments",
            "UID",
        ],

        activeColumns: ["ModificationDate", "EffectiveDate", "review_state"],

        availableColumns: {
            id: "ID",
            ModificationDate: "Last modified",
            EffectiveDate: "Published",
            ExpirationDate: "Expiration",
            CreationDate: "Created",
            review_state: "Review state",
            Subject: "Tags",
            portal_type: "Type",
            is_folderish: "Folder",
            exclude_from_nav: "Excluded from navigation",
            getObjSize: "Object Size",
            last_comment_date: "Last comment date",
            total_comments: "Total comments",
        },

        typeToViewAction: {
            File: "/view",
            Image: "/view",
            Blob: "/view",
        },

        defaultPageTypes: ["Document", "Event", "News Item", "Collection"],

        momentFormat: "L LT",
        rearrange: {
            properties: {
                id: "ID",
                sortable_title: "Title",
            },
            url: "/rearrange",
        },
        moveUrl: null,

        buttons: [
            {
                tooltip: "Cut",
                title: "Cut",
                url: "/cut",
            },
            {
                tooltip: "Copy",
                title: "Copy",
                url: "/copy",
            },
            {
                tooltip: "Paste",
                title: "Paste",
                url: "/paste",
            },
            {
                tooltip: "Delete",
                title: "Delete",
                url: "/delete",
                context: "danger",
                icon: "trash",
            },
            {
                tooltip: "Workflow",
                title: "Workflow",
                url: "/workflow",
            },
            {
                tooltip: "Tags",
                title: "Tags",
                url: "/tags",
            },
            {
                tooltip: "Properties",
                title: "Properties",
                url: "/properties",
            },
            {
                tooltip: "Rename",
                title: "Rename",
                url: "/rename",
            },
        ],

        datatables_options: {},

        upload: {
            uploadMultiple: true,
            showTitle: true,
        },
    },

    async init() {
        import("./structure.scss");
        import("bootstrap/js/src/dropdown");

        this.browsing = true; // so all queries will be correct with QueryHelper
        this.options.collectionUrl = this.options.vocabularyUrl;
        this.options.pattern = this;

        // the ``attributes`` options key is not compatible with backbone,
        // but queryHelper that will be constructed by the default
        // ResultCollection will expect this to be passed into it.
        this.options.queryHelperAttributes = this.options.attributes;
        delete this.options.attributes;

        this.view = await new AppView(this.options);
        await this.view.render();
        this.$el.append(this.view.$el);
    },
});
