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

        // ajax settings
        ajaxTimeout: 500,
    },

    recentlyUsed(filterSelectable) {
        let ret = utils.storage.get(this.options.recentlyUsedKey) || [];
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
        const max = parseInt(this.options.recentlyUsedMaxItems, 10);
        if (max) {
            // return the slice from the end, as we want to display newest items first.
            ret = ret.slice(ret.length - max, ret.length);
        }
        return ret;
    },

    applyTemplate(tpl, item) {
        let template;
        if (this.options[tpl + "TemplateSelector"]) {
            template = $(this.options[tpl + "TemplateSelector"]).html();
        }
        if (!template) {
            if (this.options[tpl + "Template"]) {
                template = this.options[tpl + "Template"];
            } else {
                template = this[tpl + "Template"];
            }
        }
        // let's give all the options possible to the template generation
        const options = $.extend(true, {}, this.options, item, {
            browsing: this.browsing,
            open_folder: _t("Open folder"),
            current_directory: _t("current directory:"),
            one_level_up: _t("Go one level up"),
        });
        options._item = item;
        return _.template(template)(options);
    },

    setAjax() {
        const ajaxTimeout = parseInt(this.options.ajaxTimeout || 500, 10);

        const ajax = {
            url: this.options.vocabularyUrl,
            dataType: "JSON",
            quietMillis: ajaxTimeout,

            data: (term, page) => {
                const criterias = [];
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

                let sort_on = this.options.sortOn;
                let sort_order = sort_on ? this.options.sortOrder : null;
                if (this.browsing && sort_on === null) {
                    sort_on = "getObjPositionInParent";
                    sort_order = "ascending";
                }

                const data = {
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
            },

            results: (data, page) => {
                const more = page * this.options.pageSize < data.total;
                let results = data.results;

                this.selectedUIDs = (this.$el.select2("data") || []).map((el) => {
                    // populate current selection. Reuse in formatResult
                    return el.UID;
                });

                // Filter out items:
                // While browsing: always include folderish items
                // Browsing and searching: Only include selectable items which are not already selected, and all folders
                // even if they're selected, as we need them available for browsing/selecting their children
                results = results.filter((item) => {
                    if (
                        (this.browsing && item.is_folderish) ||
                        (this.isSelectable(item) &&
                            this.selectedUIDs.indexOf(item.UID) === -1)
                    ) {
                        return true;
                    }
                    return false;
                });

                // Extend ``data`` with a ``oneLevelUp`` item when browsing
                const path = this.currentPath.split("/");
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
            },
        };
        this.options.ajax = ajax;
    },

    async renderToolbar() {
        const path = this.currentPath;
        let html;

        const parts = path.split("/");
        let itemPath = "";
        let itemsHtml = "";
        for (const part of parts) {
            if (part !== "") {
                const item = {};
                item.path = itemPath = `${itemPath}/${part}`;
                item.text = part;
                itemsHtml = itemsHtml + this.applyTemplate("breadcrumb", item);
            }
        }

        // favorites
        let favoritesHtml = "";
        for (const item of this.options.favorites) {
            const item_copy = _.clone(item);
            item_copy.path = item_copy.path.substr(this.options.rootPath.length) || "/";
            favoritesHtml = favoritesHtml + this.applyTemplate("favorite", item_copy);
        }

        let recentlyUsedHtml = "";
        if (this.options.recentlyUsed) {
            const recentlyUsed = this.recentlyUsed(true); // filter out only those items which can actually be selected
            for (const item of recentlyUsed.reverse()) {
                // reverse to get newest first.
                recentlyUsedHtml =
                    recentlyUsedHtml + this.applyTemplate("recentlyused", item);
            }
        }

        html = this.applyTemplate("toolbar", {
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

        this.$toolbar.html(html);

        // unbind mouseup event from select2 to override the behavior:
        $(".pat-relateditems-dropdown").off("mouseup");
        $(".pat-relateditems-dropdown").on("mouseup", (e) => {
            e.stopPropagation();
        });

        $("button.mode.search", this.$toolbar).on("click", (e) => {
            e.preventDefault();
            if (this.browsing) {
                $("button.mode.search", this.$toolbar).toggleClass(
                    "btn-primary btn-secondary"
                );
                $("button.mode.browse", this.$toolbar).toggleClass(
                    "btn-primary btn-secondary"
                );
                this.browsing = false;
                if (this.$el.select2("data").length > 0) {
                    // Have to call after initialization
                    this.openAfterInit = true;
                }
                if (!this.openAfterInit) {
                    this.$el.select2("close");
                    this.$el.select2("open");
                }
            } else {
                // just open result list
                this.$el.select2("close");
                this.$el.select2("open");
            }
        });

        $("button.mode.browse", this.$toolbar).on("click", (e) => {
            e.preventDefault();
            if (!this.browsing) {
                $("button.mode.search", this.$toolbar).toggleClass(
                    "btn-primary btn-secondary"
                );
                $("button.mode.browse", this.$toolbar).toggleClass(
                    "btn-primary btn-secondary"
                );
                this.browsing = true;
                if (this.$el.select2("data").length > 0) {
                    // Have to call after initialization
                    this.openAfterInit = true;
                }
                if (!this.openAfterInit) {
                    this.$el.select2("close");
                    this.$el.select2("open");
                }
            } else {
                // just open result list
                this.$el.select2("close");
                this.$el.select2("open");
            }
        });

        $("a.crumb", this.$toolbar).on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.browseTo($(e.currentTarget).attr("href"));
        });

        $("a.fav", this.$toolbar).on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.browseTo($(e.currentTarget).attr("href"));
        });

        if (this.options.recentlyUsed) {
            $(".pat-relateditems-recentlyused-select", this.$toolbar).on(
                "click",
                (event) => {
                    event.preventDefault();
                    const uid = $(event.currentTarget).data("uid");
                    let item = this.recentlyUsed().filter((it) => {
                        return it.UID === uid;
                    });
                    if (item.length > 0) {
                        item = item[0];
                    } else {
                        return;
                    }
                    this.selectItem(item);
                    if (this.options.maximumSelectionSize > 0) {
                        const items = this.$el.select2("data");
                        if (items.length >= this.options.maximumSelectionSize) {
                            return;
                        }
                    }
                }
            );
        }

        // upload
        if (
            this.options.upload &&
            utils.featureSupport.dragAndDrop() &&
            utils.featureSupport.fileApi()
        ) {
            if (this.options.uploadAllowView) {
                // Check, if uploads are allowed in current context
                $.ajax({
                    url: this.options.uploadAllowView,
                    // url: this.currentUrl() + this.options.uploadAllowView,  // not working yet
                    dataType: "JSON",
                    data: {
                        path: this.options.rootPath + this.currentPath,
                    },
                    type: "GET",
                    success: (result) => {
                        this.initUploadView(!result.allowUpload);
                    },
                });
            } else {
                // just initialize upload view without checking, if uploads are allowed.
                this.initUploadView();
            }
        }
    },

    async initUploadView(disabled) {
        let Upload = await import("../upload/upload");
        Upload = Upload.default;

        const upload_button = this.$toolbar[0].querySelector(".upload button");
        upload_button.disabled = disabled;

        const upload_el = this.$toolbar[0].querySelector(".upload .pat-upload");

        const upload_config = {
            success: (e, response) => {
                const uid = response.UID;
                if (uid) {
                    const query = new utils.QueryHelper({
                        vocabularyUrl: this.options.vocabularyUrl,
                        attributes: this.options.attributes,
                    });
                    query.search(
                        "UID",
                        "plone.app.querystring.operation.selection.is",
                        uid,
                        (e) => {
                            const data = this.$el.select2("data");
                            data.push.apply(data, e.results);
                            this.$el.select2("data", data, true);
                            this.emit("selected");
                        },
                        false
                    );
                }
            },
            uloadMultiple: true,
            allowPathSelection: false,
            relativePath: "fileUpload",
            baseUrl: this.options.rootUrl,
        };
        const upload = new Upload($(upload_el), upload_config);

        upload_button.addEventListener("show.bs.dropdown", () => {
            if (this.currentPath !== upload.currentPath) {
                upload.setPath(this.currentPath);
            }
        });
    },

    browseTo(path) {
        this.emit("before-browse");
        this.currentPath = path;
        this.$el.select2("close");
        this.renderToolbar();
        this.$el.select2("open");
        this.emit("after-browse");
    },

    selectItem(item) {
        this.emit("selecting");
        const data = $(this.el).select2("data");
        data.push(item);
        $(this.el).select2("data", data, true);

        if (this.options.recentlyUsed) {
            // add to recently added items
            const recentlyUsed = this.recentlyUsed(); // do not filter for selectable but get all. append to that list the new item.
            const alreadyPresent = recentlyUsed.filter((it) => {
                return it.UID === item.UID;
            });
            if (alreadyPresent.length > 0) {
                recentlyUsed.splice(recentlyUsed.indexOf(alreadyPresent[0]), 1);
            }
            recentlyUsed.push(item);
            utils.storage.set(this.options.recentlyUsedKey, recentlyUsed);
        }

        this.emit("selected");
    },

    deselectItem(item) {
        this.emit("deselecting");
        const data = this.$el.select2("data");
        data.forEach((obj, i) => {
            if (obj.UID === item.UID) {
                data.splice(i, 1);
            }
        });
        this.$el.select2("data", data, true);
        this.emit("deselected");
    },

    isSelectable(item) {
        if (item.selectable === false) {
            return false;
        }
        if (this.options.selectableTypes === null) {
            return true;
        } else {
            return this.options.selectableTypes.indexOf(item.portal_type) !== -1;
        }
    },

    async init() {
        (await import("bootstrap")).Dropdown;
        import("./relateditems.scss");

        // templates
        this.breadcrumbTemplate = (await import("./templates/breadcrumb.xml")).default; // prettier-ignore
        this.favoriteTemplate = (await import("./templates/favorite.xml")).default; // prettier-ignore
        this.recentlyusedTemplate = (await import("./templates/recentlyused.xml")).default; // prettier-ignore
        this.resultTemplate = (await import("./templates/result.xml")).default; // prettier-ignore
        this.selectionTemplate = (await import("./templates/selection.xml")).default; // prettier-ignore
        this.toolbarTemplate = (await import("./templates/toolbar.xml")).default; // prettier-ignore

        this.browsing = this.options.mode !== "search";

        // Remove trailing slash
        this.options.rootPath = this.options.rootPath.replace(/\/$/, "");
        // Substract rootPath from basePath with is the relative currentPath. Has a leading slash. Or use '/'
        this.currentPath =
            this.options.basePath.substr(this.options.rootPath.length) || "/";

        this.setAjax();

        this.$el.wrap('<div class="pat-relateditems-container" />');
        this.$container = this.$el.parents(".pat-relateditems-container");

        Select2.prototype.initializeValues.call(this);
        Select2.prototype.initializeTags.call(this);

        this.options.formatSelection = (item) => {
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
            const $selection = $(this.applyTemplate("selection", item));
            if (this.options.scanSelection) {
                registry.scan($selection);
            }
            if (this.options.maximumSelectionSize == 1) {
                // If this related field accepts only 1 item, the breadcrumbs should
                // reflect the location for this particular item
                let itemPath = item.path;
                let path_split = itemPath.split("/");
                path_split = path_split.slice(0, -1); // Remove last part of path, we always want the parent path
                itemPath = path_split.join("/");
                this.currentPath = itemPath;
                this.renderToolbar();
            }
            return $selection;
        };

        const icon_level_up = await utils.resolveIcon("arrow-left-circle");
        const icon_level_down = await utils.resolveIcon("arrow-right-circle");

        this.options.formatResult = (item) => {
            item.selectable = this.isSelectable(item);
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

            if (this.selectedUIDs.indexOf(item.UID) !== -1) {
                // do not allow already selected items to be selected again.
                item.selectable = false;
            }
            const result = $(this.applyTemplate("result", item));

            $(".pat-relateditems-result-select", result).on("click", (event) => {
                const _el = event.currentTarget;
                event.preventDefault();
                // event.stopPropagation();
                if ($(_el).is(".selectable")) {
                    const $parent = $(_el).parents(".pat-relateditems-result");
                    if ($parent.is(".pat-relateditems-active")) {
                        $parent.removeClass("pat-relateditems-active");
                        this.deselectItem(item);
                    } else {
                        if (this.options.maximumSelectionSize > 0) {
                            const items = this.$el.select2("data");
                            if (items.length >= this.options.maximumSelectionSize) {
                                this.$el.select2("close");
                            }
                        }
                        this.selectItem(item);
                        $parent.addClass("pat-relateditems-active");
                        if (this.options.closeOnSelect) {
                            this.$el.select2("close");
                        }
                    }
                }
            });

            $(".pat-relateditems-result-browse", result).on("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const path = $(event.currentTarget).data("path");
                this.browseTo(path);
            });

            return $(result);
        };

        this.options.initSelection = (element, callback) => {
            const value = $(element).val();
            if (value !== "") {
                const ids = value.split(this.options.separator);
                const query = new utils.QueryHelper(
                    $.extend(true, {}, this.options, {
                        pattern: this,
                    })
                );
                query.search(
                    "UID",
                    "plone.app.querystring.operation.list.contains",
                    ids,
                    (data) => {
                        const results = data.results.reduce((prev, item) => {
                            prev[item.UID] = item;
                            return prev;
                        }, {});

                        try {
                            callback(
                                ids
                                    .map((uid) => results[uid])
                                    .filter((item) => item !== undefined)
                            );
                        } catch {
                            // Select2 3.5.4 throws an error in some cases in
                            // updateSelection, ``this.selection.find(".select2-search-choice").remove();``
                            // No idea why, hard to track.
                        }

                        if (this.openAfterInit) {
                            // open after initialization
                            this.$el.select2("open");
                            this.openAfterInit = undefined;
                        }
                    },
                    false
                );
            }
        };

        this.options.tokenizer = (input) => {
            if (this.options.mode === "auto") {
                this.browsing = input ? false : true;
            }
        };

        this.options.id = (item) => item.UID;

        await Select2.prototype.initializeSelect2.call(this);
        await Select2.prototype.initializeOrdering.call(this);

        this.$toolbar = $('<div class="toolbar d-flex" />');
        this.$container.prepend(this.$toolbar);
        this.$el.on("select2-selecting", (event) => {
            if (!this.isSelectable(event.choice)) {
                event.preventDefault();
            }
        });
        this.renderToolbar();
        this.$el.on("select2-loaded", () => {
            let yMax = window.innerHeight || document.documentElement.clientHeight;
            const relitem_rect = this.el.parentElement.getBoundingClientRect();
            const element = $(
                "#select2-drop.pat-relateditems-dropdown.select2-drop-active .select2-results"
            )[0];
            const rect = element.getBoundingClientRect();
            const maxHeight = ((relitem_rect.top > rect.top) ? relitem_rect.top : yMax - rect.top) - 18;
            $(element).css("max-height", `${maxHeight}px`);
        });

        $(document).on("keyup", this.$el, (event) => {
            const isOpen = Select2.prototype.opened.call(this);
            if (!isOpen) {
                return;
            }

            if (event.which === KEY.LEFT || event.which === KEY.RIGHT) {
                event.stopPropagation();

                const selectorContext =
                    event.which === KEY.LEFT
                        ? ".pat-relateditems-result.one-level-up"
                        : ".select2-highlighted";

                const browsableItemSelector = ".pat-relateditems-result-browse";
                const browsableItem = $(browsableItemSelector, selectorContext);

                if (browsableItem.length !== 1) {
                    return;
                }

                const path = browsableItem.data("path");

                this.browseTo(path);
            }
        });
    },
});
