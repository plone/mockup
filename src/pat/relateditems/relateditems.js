import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import Base from "@patternslib/patternslib/src/core/base";
import _t from "../../core/i18n-wrapper";
import utils from "../../core/utils";
import registry from "@patternslib/patternslib/src/core/registry";
import Select2 from "../select2/select2";

const KEY = {
    LEFT: 37,
    RIGHT: 39,
};

export default Base.extend({
    name: "relateditems",
    trigger: ".pat-relateditems",
    parser: "mockup",
    currentPath: undefined,
    selectedUIDs: [],
    openAfterInit: undefined,
    defaults: {
        // main option
        vocabularyUrl: null, // must be set to work

        // more options
        attributes: [
            "UID",
            "Title",
            "portal_type",
            "path",
            "getURL",
            "getIcon",
            "is_folderish",
            "review_state",
        ], // used by utils.QueryHelper
        basePath: "",
        pageSize: 10,
        browsing: undefined,
        closeOnSelect: true,
        contextPath: undefined,
        dropdownCssClass: "pat-relateditems-dropdown",
        favorites: [],
        recentlyUsed: false,
        recentlyUsedMaxItems: 20,
        recentlyUsedKey: "relateditems_recentlyused",
        maximumSelectionSize: -1,
        minimumInputLength: 0,
        mode: "browse", // possible values are 'auto', 'search' and 'browse'.
        orderable: true, // mockup-patterns-select2
        pathOperator: "plone.app.querystring.operation.string.path",
        rootPath: "/",
        rootUrl: "", // default to be relative.
        scanSelection: false, // False, to no unnecessarily use CPU time on this.
        selectableTypes: null, // null means everything is selectable, otherwise a list of strings to match types that are selectable
        separator: ",",
        sortOn: null,
        sortOrder: "ascending",
        tokenSeparators: [",", " "],
        upload: false,
        uploadAllowView: undefined,

        // templates
        breadcrumbTemplateSelector: null,
        favoriteTemplateSelector: null,
        recentlyusedTemplateSelector: null,
        resultTemplateSelector: null,
        selectionTemplateSelector: null,
        toolbarTemplateSelector: null,

        // needed
        multiple: true,
    },

    recentlyUsed: function (filterSelectable) {
        var ret = utils.storage.get(this.options.recentlyUsedKey) || [];
        // hard-limit to 1000 entries
        ret = ret.slice(ret.length - 1000, ret.length);
        if (filterSelectable) {
            // Filter out only selectable items.
            // This is used only to create the list of items to be displayed.
            // the list to be stored is unfiltered and can be reused among
            // different instances of this widget with different settings.
            ret.filter(this.isSelectable.bind(this));
        }
        // max is applied AFTER filtering selectable items.
        var max = parseInt(this.options.recentlyUsedMaxItems, 10);
        if (max) {
            // return the slice from the end, as we want to display newest items first.
            ret = ret.slice(ret.length - max, ret.length);
        }
        return ret;
    },

    applyTemplate: function (tpl, item) {
        var self = this;
        var template;
        if (self.options[tpl + "TemplateSelector"]) {
            template = $(self.options[tpl + "TemplateSelector"]).html();
            if (!template) {
                template = self[tpl + "Template"];
            }
        } else {
            template = self[tpl + "Template"];
        }
        // let's give all the options possible to the template generation
        var options = $.extend(true, {}, self.options, item, {
            browsing: self.browsing,
            open_folder: _t("Open folder"),
            current_directory: _t("current directory:"),
            one_level_up: _t("Go one level up"),
        });
        options._item = item;
        return _.template(template)(options);
    },

    setAjax: function () {
        var ajax = {
            url: this.options.vocabularyUrl,
            dataType: "JSON",
            quietMillis: 500,

            data: function (term, page) {
                var criterias = [];
                if (term) {
                    term = "*" + term + "*";
                    criterias.push({
                        i: "SearchableText",
                        o: "plone.app.querystring.operation.string.contains",
                        v: term,
                    });
                }

                // We don't restrict for selectable types while browsing...
                if (!this.browsing && this.options.selectableTypes) {
                    criterias.push({
                        i: "portal_type",
                        o: "plone.app.querystring.operation.selection.any",
                        v: this.options.selectableTypes,
                    });
                }

                criterias.push({
                    i: "path",
                    o: this.options.pathOperator,
                    v:
                        this.options.rootPath +
                        this.currentPath +
                        (this.browsing ? "::1" : ""),
                });

                var sort_on = this.options.sortOn;
                var sort_order = sort_on ? this.options.sortOrder : null;
                if (this.browsing && sort_on === null) {
                    sort_on = "getObjPositionInParent";
                    sort_order = "ascending";
                }

                var data = {
                    query: JSON.stringify({
                        criteria: criterias,
                        sort_on: sort_on,
                        sort_order: sort_order,
                    }),
                    attributes: JSON.stringify(this.options.attributes),
                    batch: JSON.stringify({
                        page: page ? page : 1,
                        size: this.options.pageSize,
                    }),
                };
                return data;
            }.bind(this),

            results: function (data, page) {
                var more = page * this.options.pageSize < data.total;
                var results = data.results;

                this.selectedUIDs = ($(this.el).select2("data") || []).map(function (
                    el
                ) {
                    // populate current selection. Reuse in formatResult
                    return el.UID;
                });

                // Filter out items:
                // While browsing: always include folderish items
                // Browsing and searching: Only include selectable items which are not already selected, and all folders
                // even if they're selected, as we need them available for browsing/selecting their children
                results = results.filter(
                    function (item) {
                        if (
                            (this.browsing && item.is_folderish) ||
                            (this.isSelectable(item) &&
                                this.selectedUIDs.indexOf(item.UID) === -1)
                        ) {
                            return true;
                        }
                        return false;
                    }.bind(this)
                );

                // Extend ``data`` with a ``oneLevelUp`` item when browsing
                var path = this.currentPath.split("/");
                if (
                    page === 1 && // Show level up only on top.
                    this.browsing && // only level up when browsing
                    path.length > 1 && // do not try to level up one level under root.
                    this.currentPath !== "/" // do not try to level up beyond root
                ) {
                    results = [
                        {
                            oneLevelUp: true,
                            Title: _t("One level up"),
                            path: path.slice(0, path.length - 1).join("/") || "/",
                            currentPath: this.currentPath,
                            is_folderish: true,
                            selectable: false,
                        },
                    ].concat(results);
                }
                return {
                    results: results,
                    more: more,
                };
            }.bind(this),
        };
        this.options.ajax = ajax;
    },

    renderToolbar: async function () {
        var self = this;
        var path = self.currentPath;
        var html;

        var paths = path.split("/");
        var itemPath = "";
        var itemsHtml = "";
        _.each(paths, function (node) {
            if (node !== "") {
                var item = {};
                item.path = itemPath = itemPath + "/" + node;
                item.text = node;
                itemsHtml = itemsHtml + self.applyTemplate("breadcrumb", item);
            }
        });

        // favorites
        var favoritesHtml = "";
        _.each(self.options.favorites, function (item) {
            var item_copy = _.clone(item);
            item_copy.path = item_copy.path.substr(self.options.rootPath.length) || "/";
            favoritesHtml = favoritesHtml + self.applyTemplate("favorite", item_copy);
        });

        var recentlyUsedHtml = "";
        if (self.options.recentlyUsed) {
            var recentlyUsed = self.recentlyUsed(true); // filter out only those items which can actually be selected
            _.each(recentlyUsed.reverse(), function (item) {
                // reverse to get newest first.
                recentlyUsedHtml =
                    recentlyUsedHtml + self.applyTemplate("recentlyused", item);
            });
        }

        html = self.applyTemplate("toolbar", {
            items: itemsHtml,
            favItems: favoritesHtml,
            favText: _t("Favorites"),
            searchText: _t("Current path:"),
            searchModeText: _t("Search"),
            browseModeText: _t("Browse"),
            recentlyUsedItems: recentlyUsedHtml,
            recentlyUsedText: _t("Recently Used"),
            icon_root: await utils.resolveIcon("house-fill"),
            icon_recently_used: await utils.resolveIcon("grid-fill"),
            icon_favorites: await utils.resolveIcon("star-fill"),
            icon_upload: await utils.resolveIcon("cloud-arrow-up"),
            upload: this.options.upload,
            upload_text: _t("Upload"),
        });

        self.$toolbar.html(html);

        // unbind mouseup event from select2 to override the behavior:
        $(".pat-relateditems-dropdown").unbind("mouseup");
        $(".pat-relateditems-dropdown").bind("mouseup", function (e) {
            e.stopPropagation();
        });

        $("button.mode.search", self.$toolbar).on("click", function (e) {
            e.preventDefault();
            if (self.browsing) {
                $("button.mode.search", self.$toolbar).toggleClass(
                    "btn-primary btn-default"
                );
                $("button.mode.browse", self.$toolbar).toggleClass(
                    "btn-primary btn-default"
                );
                self.browsing = false;
                if ($(self.el).select2("data").length > 0) {
                    // Have to call after initialization
                    self.openAfterInit = true;
                }
                if (!self.openAfterInit) {
                    $(self.el).select2("close");
                    $(self.el).select2("open");
                }
            } else {
                // just open result list
                $(self.el).select2("close");
                $(self.el).select2("open");
            }
        });

        $("button.mode.browse", self.$toolbar).on("click", function (e) {
            e.preventDefault();
            if (!self.browsing) {
                $("button.mode.search", self.$toolbar).toggleClass(
                    "btn-primary btn-default"
                );
                $("button.mode.browse", self.$toolbar).toggleClass(
                    "btn-primary btn-default"
                );
                self.browsing = true;
                if ($(self.el).select2("data").length > 0) {
                    // Have to call after initialization
                    self.openAfterInit = true;
                }
                if (!self.openAfterInit) {
                    $(self.el).select2("close");
                    $(self.el).select2("open");
                }
            } else {
                // just open result list
                $(self.el).select2("close");
                $(self.el).select2("open");
            }
        });

        $("a.crumb", self.$toolbar).on("click", function (e) {
            e.preventDefault();
            self.browseTo($(this).attr("href"));
        });

        $("a.fav", self.$toolbar).on("click", function (e) {
            e.preventDefault();
            self.browseTo($(this).attr("href"));
        });

        if (self.options.recentlyUsed) {
            $(".pat-relateditems-recentlyused-select", self.$toolbar).on(
                "click",
                function (event) {
                    event.preventDefault();
                    var uid = $(this).data("uid");
                    var item = self.recentlyUsed().filter(function (it) {
                        return it.UID === uid;
                    });
                    if (item.length > 0) {
                        item = item[0];
                    } else {
                        return;
                    }
                    self.selectItem(item);
                    if (self.options.maximumSelectionSize > 0) {
                        var items = $(self.el).select2("data");
                        if (items.length >= self.options.maximumSelectionSize) {
                            return;
                        }
                    }
                }
            );
        }

        async function initUploadView(disabled) {
            let Upload = await import("../upload/upload");
            Upload = Upload.default;

            const upload_button = self.$toolbar[0].querySelector(".upload button");
            upload_button.disabled = disabled;

            const upload_el = self.$toolbar[0].querySelector(".upload .pat-upload");

            const upload_config = {
                success: (e, response) => {
                    const uid = response.UID;
                    if (uid) {
                        const query = new utils.QueryHelper({
                            vocabularyUrl: self.options.vocabularyUrl,
                            attributes: self.options.attributes,
                        });
                        query.search(
                            "UID",
                            "plone.app.querystring.operation.selection.is",
                            uid,
                            (e) => {
                                var data = self.$el.select2("data");
                                data.push.apply(data, e.results);
                                self.$el.select2("data", data, true);
                                self.emit("selected");
                                self.popover.hide();
                            },
                            false
                        );
                    }
                },
                uloadMultiple: true,
                allowPathSelection: false,
                relativePath: "fileUpload",
                baseUrl: self.options.rootUrl,
            };
            const upload = new Upload($(upload_el), upload_config);

            upload_button.addEventListener("show.bs.dropdown", () => {
                if (self.currentPath !== upload.currentPath) {
                    upload.setPath(self.currentPath);
                }
            });
        }

        // upload
        if (
            self.options.upload &&
            utils.featureSupport.dragAndDrop() &&
            utils.featureSupport.fileApi()
        ) {
            if (self.options.uploadAllowView) {
                // Check, if uploads are allowed in current context
                $.ajax({
                    url: self.options.uploadAllowView,
                    // url: self.currentUrl() + self.options.uploadAllowView,  // not working yet
                    dataType: "JSON",
                    data: {
                        path: self.options.rootPath + self.currentPath,
                    },
                    type: "GET",
                    success: function (result) {
                        initUploadView(!result.allowUpload);
                    },
                });
            } else {
                // just initialize upload view without checking, if uploads are allowed.
                initUploadView();
            }
        }
    },

    browseTo: function (path) {
        var self = this;
        self.emit("before-browse");
        self.currentPath = path;
        $(self.el).select2("close");
        self.renderToolbar();
        $(self.el).select2("open");
        self.emit("after-browse");
    },

    selectItem: function (item) {
        var self = this;
        self.emit("selecting");
        var data = $(self.el).select2("data");
        data.push(item);
        $(self.el).select2("data", data, true);

        if (self.options.recentlyUsed) {
            // add to recently added items
            var recentlyUsed = self.recentlyUsed(); // do not filter for selectable but get all. append to that list the new item.
            var alreadyPresent = recentlyUsed.filter(function (it) {
                return it.UID === item.UID;
            });
            if (alreadyPresent.length > 0) {
                recentlyUsed.splice(recentlyUsed.indexOf(alreadyPresent[0]), 1);
            }
            recentlyUsed.push(item);
            utils.storage.set(self.options.recentlyUsedKey, recentlyUsed);
        }

        self.emit("selected");
    },

    deselectItem: function (item) {
        var self = this;
        self.emit("deselecting");
        var data = $(self.el).select2("data");
        _.each(data, function (obj, i) {
            if (obj.UID === item.UID) {
                data.splice(i, 1);
            }
        });
        $(self.el).select2("data", data, true);
        self.emit("deselected");
    },

    isSelectable: function (item) {
        var self = this;
        if (item.selectable === false) {
            return false;
        }
        if (self.options.selectableTypes === null) {
            return true;
        } else {
            return self.options.selectableTypes.indexOf(item.portal_type) !== -1;
        }
    },

    init: async function () {
        (await import("bootstrap")).Dropdown;
        import("./relateditems.scss");

        // templates
        this.breadcrumbTemplate = (await import("./templates/breadcrumb.xml")).default; // prettier-ignore
        this.favoriteTemplate = (await import("./templates/favorite.xml")).default; // prettier-ignore
        this.recentlyusedTemplate = (await import("./templates/recentlyused.xml")).default; // prettier-ignore
        this.resultTemplate = (await import("./templates/result.xml")).default; // prettier-ignore
        this.selectionTemplate = (await import("./templates/selection.xml")).default; // prettier-ignore
        this.toolbarTemplate = (await import("./templates/toolbar.xml")).default; // prettier-ignore

        var self = this;

        self.browsing = self.options.mode !== "search";

        // Remove trailing slash
        self.options.rootPath = self.options.rootPath.replace(/\/$/, "");
        // Substract rootPath from basePath with is the relative currentPath. Has a leading slash. Or use '/'
        self.currentPath =
            self.options.basePath.substr(self.options.rootPath.length) || "/";

        self.setAjax();

        self.$el.wrap('<div class="pat-relateditems-container" />');
        self.$container = self.$el.parents(".pat-relateditems-container");

        Select2.prototype.initializeValues.call(self);
        Select2.prototype.initializeTags.call(self);

        self.options.formatSelection = function (item) {
            item = $.extend(
                true,
                {
                    Title: "",
                    getIcon: "",
                    getURL: "",
                    path: "",
                    portal_type: "",
                    review_state: "",
                },
                item
            );

            // activate petterns on the result set.
            var $selection = $(self.applyTemplate("selection", item));
            if (self.options.scanSelection) {
                registry.scan($selection);
            }
            if (self.options.maximumSelectionSize == 1) {
                // If this related field accepts only 1 item, the breadcrumbs should
                // reflect the location for this particular item
                var itemPath = item.path;
                var path_split = itemPath.split("/");
                path_split = path_split.slice(0, -1); // Remove last part of path, we always want the parent path
                itemPath = path_split.join("/");
                self.currentPath = itemPath;
                self.renderToolbar();
            }
            return $selection;
        };

        Select2.prototype.initializeOrdering.call(self);

        const icon_level_up = await utils.resolveIcon("arrow-left-circle");
        const icon_level_down = await utils.resolveIcon("arrow-right-circle");

        self.options.formatResult = function (item) {
            item.selectable = self.isSelectable(item);
            item = $.extend(
                true,
                {
                    Title: "",
                    getIcon: "",
                    getURL: "",
                    is_folderish: false,
                    oneLevelUp: false,
                    iconLevelUp: icon_level_up,
                    iconLevelDown: icon_level_down,
                    path: "",
                    portal_type: "",
                    review_state: "",
                    selectable: false,
                },
                item
            );

            if (self.selectedUIDs.indexOf(item.UID) !== -1) {
                // do not allow already selected items to be selected again.
                item.selectable = false;
            }
            var result = $(self.applyTemplate("result", item));

            $(".pat-relateditems-result-select", result).on(
                "click",
                function (event) {
                    event.preventDefault();
                    // event.stopPropagation();
                    if ($(this).is(".selectable")) {
                        var $parent = $(this).parents(".pat-relateditems-result");
                        if ($parent.is(".pat-relateditems-active")) {
                            $parent.removeClass("pat-relateditems-active");
                            self.deselectItem(item);
                        } else {
                            if (self.options.maximumSelectionSize > 0) {
                                var items = $(self.el).select2("data");
                                if (items.length >= self.options.maximumSelectionSize) {
                                    $(self.el).select2("close");
                                }
                            }
                            self.selectItem(item);
                            $parent.addClass("pat-relateditems-active");
                            if (self.options.closeOnSelect) {
                                $(self.el).select2("close");
                            }
                        }
                    }
                }
            );

            $(".pat-relateditems-result-browse", result).on(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var path = $(this).data("path");
                    self.browseTo(path);
                }
            );

            return $(result);
        };

        self.options.initSelection = function (element, callback) {
            var value = $(element).val();
            if (value !== "") {
                var ids = value.split(self.options.separator);
                var query = new utils.QueryHelper(
                    $.extend(true, {}, self.options, {
                        pattern: self,
                    })
                );
                query.search(
                    "UID",
                    "plone.app.querystring.operation.list.contains",
                    ids,
                    function (data) {
                        var results = data.results.reduce(function (prev, item) {
                            prev[item.UID] = item;
                            return prev;
                        }, {});

                        try {
                            callback(
                                ids
                                    .map(function (uid) {
                                        return results[uid];
                                    })
                                    .filter(function (item) {
                                        return item !== undefined;
                                    })
                            );
                        } catch (e) {
                            // Select2 3.5.4 throws an error in some cases in
                            // updateSelection, ``this.selection.find(".select2-search-choice").remove();``
                            // No idea why, hard to track.
                        }

                        if (self.openAfterInit) {
                            // open after initialization
                            $(self.el).select2("open");
                            self.openAfterInit = undefined;
                        }
                    },
                    false
                );
            }
        };

        self.options.tokenizer = function (input) {
            if (this.options.mode === "auto") {
                this.browsing = input ? false : true;
            }
        }.bind(this);

        self.options.id = function (item) {
            return item.UID;
        };

        Select2.prototype.initializeSelect2.call(self);

        self.$toolbar = $('<div class="toolbar d-flex" />');
        self.$container.prepend(self.$toolbar);
        self.$el.on("select2-selecting", function (event) {
            if (!self.isSelectable(event.choice)) {
                event.preventDefault();
            }
        });
        self.renderToolbar();

        $(document).on("keyup", self.$el, function (event) {
            var isOpen = Select2.prototype.opened.call(self);

            if (!isOpen) {
                return;
            }

            if (event.which === KEY.LEFT || event.which === KEY.RIGHT) {
                event.stopPropagation();

                var selectorContext =
                    event.which === KEY.LEFT
                        ? ".pat-relateditems-result.one-level-up"
                        : ".select2-highlighted";

                var browsableItemSelector = ".pat-relateditems-result-browse";
                var browsableItem = $(browsableItemSelector, selectorContext);

                if (browsableItem.length !== 1) {
                    return;
                }

                var path = browsableItem.data("path");

                self.browseTo(path);
            }
        });
    },
});
