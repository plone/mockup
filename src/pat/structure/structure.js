import Base from "@patternslib/patternslib/src/core/base";

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

        language: "en",
        dateFormat: {
            dateStyle: "medium",
            timeStyle: "medium",
        },
        rearrange: {
            properties: {
                id: "ID",
                sortable_title: "Title",
                // icon: "plone-rearrange",
            },
            url: "/rearrange",
        },
        moveUrl: null,

        buttons: [
            {
                tooltip: "Cut",
                url: "/cut",
                icon: "plone-cut",
            },
            {
                tooltip: "Copy",
                url: "/copy",
                icon: "plone-copy",
            },
            {
                tooltip: "Paste",
                url: "/paste",
                icon: "plone-paste",
            },
            {
                tooltip: "Delete",
                url: "/delete",
                context: "danger",
                icon: "plone-delete",
            },
            {
                tooltip: "Workflow",
                url: "/workflow",
                icon: "plone-lock",
            },
            {
                tooltip: "Tags",
                url: "/tags",
                icon: "tags",
            },
            {
                tooltip: "Properties",
                url: "/properties",
                icon: "plone-edit",
            },
            {
                tooltip: "Rename",
                url: "/rename",
                icon: "plone-rename",
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
        (await import("bootstrap")).Dropdown;

        const _ = (await import("underscore")).default;
        const Backbone = (await import("backbone")).default;
        window._ = _;
        window.Backbone = Backbone;

        const AppView = (await import("./js/views/app")).default;

        this.browsing = true; // so all queries will be correct with QueryHelper
        this.options.collectionUrl = this.options.vocabularyUrl;
        this.options.pattern = this;
        this.options.language =
            document.querySelector("html").getAttribute("lang") || "en";

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
