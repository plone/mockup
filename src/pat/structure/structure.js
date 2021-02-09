import $ from "jquery";
import _ from "underscore";
import Base from "patternslib/src/core/base";
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

        /*
        As the options operate on a merging basis per new attribute
        (key/value pairs) on the option Object in a recursive fashion,
        array items are also treated as Objects so that custom options
        are replaced starting from index 0 up to the length of the
        array.  In the case of buttons, custom buttons are simply
        replaced starting from the first one.  The following defines the
        customized attributes that should be replaced wholesale, with
        the default version prefixed with `_default_`.
      */

        attributes: null,
        _default_attributes: [
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

        activeColumns: null,
        _default_activeColumns: [
            "ModificationDate",
            "EffectiveDate",
            "review_state",
        ],

        availableColumns: null,
        _default_availableColumns: {
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

        typeToViewAction: null,
        _default_typeToViewAction: {
            File: "/view",
            Image: "/view",
            Blob: "/view",
        },

        defaultPageTypes: null,
        _default_defaultPageTypes: [
            "Document",
            "Event",
            "News Item",
            "Collection",
        ],

        momentFormat: "L LT",
        rearrange: {
            properties: {
                id: "ID",
                sortable_title: "Title",
            },
            url: "/rearrange",
        },
        moveUrl: null,

        buttons: null,
        _default_buttons: [
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
    init: async function () {
        var self = this;

        /*
        This part replaces the undefined (null) values in the user
        modifiable attributes with the default values.

        May want to consider moving the _default_* values out of the
        options object.
      */
        var replaceDefaults = [
            "attributes",
            "activeColumns",
            "availableColumns",
            "buttons",
            "typeToViewAction",
            "defaultPageTypes",
        ];
        _.each(replaceDefaults, function (idx) {
            if (self.options[idx] === null) {
                self.options[idx] = self.options["_default_" + idx];
            }
        });

        self.browsing = true; // so all queries will be correct with QueryHelper
        self.options.collectionUrl = self.options.vocabularyUrl;
        self.options.pattern = self;

        // the ``attributes`` options key is not compatible with backbone,
        // but queryHelper that will be constructed by the default
        // ResultCollection will expect this to be passed into it.
        self.options.queryHelperAttributes = self.options.attributes;
        delete self.options.attributes;

        self.view = await new AppView(self.options);
        self.$el.append(self.view.render().$el);
    },
});