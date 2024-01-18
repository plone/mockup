import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import dom from "@patternslib/patternslib/src/core/dom";
import utils from "../../../../core/utils";
import logging from "@patternslib/patternslib/src/core/logging";
import Cookies from "js-cookie";

import Toolbar from "../../../../core/ui/views/toolbar";
import ButtonGroup from "../../../../core/ui/views/buttongroup";
import ButtonView from "../../../../core/ui/views/button";
import BaseView from "../../../../core/ui/views/base";

import TableView from "./table";
import SelectionWellView from "./selectionwell";
import GenericPopover from "./generic-popover";
import RearrangeView from "./rearrange";
import SelectionButtonView from "./selectionbutton";
import PagingView from "./paging";
import ColumnsView from "./columns";
import TextFilterView from "./textfilter";
import UploadView from "./upload";
import SelectedCollection from "../collections/selected";
import StatusTemplate from "../../templates/status.xml";

import ResultCollection from "../collections/result";

const log = logging.getLogger("pat-structure/app");

export default BaseView.extend({
    tagName: "div",
    statusTemplate: _.template(StatusTemplate),
    statusMessages: [],
    sort_on: "getObjPositionInParent",
    sort_order: "ascending",
    additionalCriterias: [],
    cookieSettingPrefix: "_fc_",

    buttons: null,
    textfilter: null,
    forms: [],

    pasteAllowed: function () {
        return !!Cookies.get("__cp");
    },

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, [options]);
        this.loading = new utils.Loading();
        this.loading.show();

        /* close popovers when clicking away */
        $(document).on("click", (e) => {
            const $el = $(e.target);
            if (
                !$el.is(":visible") ||
                $el.css("visibility") === "hidden" ||
                $el.css("opacity") === "0"
            ) {
                // ignore this, fake event trigger to element that is not visible
                return;
            }
            if ($el.is("a") || $el.parent().is("a") || $el.hasClass("popover-structure-query-active")) {
                // elements that should not close
                // NOTE: "popover-structure-query-active" is set on body when
                // select2 elements are clicked inside the structure filter
                // -> Firefox gets a bubbled click event and would close the popover
                return;
            }
            const $popover = $(".popover:visible");
            if ($popover.length > 0 && !$.contains($popover[0], $el[0])) {
                const popover = $popover.data("component");
                if (popover) {
                    popover.hide();
                }
            }
        });

        this.collection = new ResultCollection([], {
            // Due to default implementation need to poke at things in here,
            // view is passed.
            view: this,
            url: this.options.collectionUrl,
        });

        this.activeColumns = this.getCookieSetting(
            this.activeColumnsCookie,
            this.activeColumns
        );

        this.selectedCollection = new SelectedCollection();
        this.pagingView = new PagingView({ app: this });
        this.tableView = new TableView({ app: this });

        // set initial pageSize
        this.collection.state.pageSize = this.getCookieSetting("pageSize", 15);

        // fetch results from collection
        // NOTE: this also calls this.tableView.render() and
        // this.pagingView.render()
        this.collection.fetch();

        // initialize buttons
        this.setupButtons();

        this.wellView = new SelectionWellView({
            collection: this.selectedCollection,
            triggerView: this.toolbar.get("selected-items"),
            app: this,
            id: "selected-items",
        });

        this.toolbar.get("selected-items").disable();
        this.buttons.disable();

        let timeout = 0;
        this.selectedCollection.on(
            "add remove reset",
            (/*modal, collection*/) => {
                /* delay rendering since this can happen in batching */
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.updateButtons();
                }, 100);
            },
            this
        );

        this.collection.on("sync", () => {
            if (this.contextInfoUrl) {
                $.ajax({
                    url: this.getAjaxUrl(this.contextInfoUrl),
                    dataType: "json",
                    success: (data) => {
                        $("body").trigger("context-info-loaded", [data]);
                    },
                    error: (response) => {
                        // XXX handle error?
                        if (response.status === 404) {
                            log.info("context info url not found");
                        }
                    },
                });
            }

            // undo the flag set by popState to prevent the push state
            // from being triggered here, and early abort out of the
            // function to not execute the folowing pushState logic.
            if (this.doNotPushState) {
                this.doNotPushState = false;
                return;
            }

            this.loading.show();
            this.updateButtons();

            let path = this.getCurrentPath();
            let url;
            if (path === "/") {
                path = "";
            }
            /* maintain history here */
            if (this.options.pushStateUrl) {
                // permit an extra slash in pattern, but strip that if there
                // as path always will be prefixed with a `/`
                const pushStateUrl = this.options.pushStateUrl.replace(
                    "/{path}",
                    "{path}"
                );
                url = pushStateUrl.replace("{path}", path);
                window.history.pushState(null, null, url);
            } else if (this.options.urlStructure) {
                // fallback to urlStructure specification
                url =
                    this.options.urlStructure.base +
                    path +
                    this.options.urlStructure.appended;
                window.history.pushState(null, null, url);
            }

            if (this.options.traverseView) {
                // flag specifies that the context view implements a traverse
                // view (i.e. IPublishTraverse) and the path is a virtual path
                // of some kind - use the base object instead for that by not
                // specifying a path.
                path = "";
                // TODO figure out whether the following event after this is
                // needed at all.
            }
            $("body").trigger("structure-url-changed", [path]);

            this.loading.hide();
        });

        if (
            (this.options.pushStateUrl || this.options.urlStructure) &&
            utils.featureSupport.history()
        ) {
            $(window).on("popstate", () => {
                /* normalize this url first... */
                const win = utils.getWindow();
                let url = win.location.href;
                let base, appended;
                if (url.indexOf("?") !== -1) {
                    url = url.split("?")[0];
                }
                if (url.indexOf("#") !== -1) {
                    url = url.split("#")[0];
                }
                if (this.options.pushStateUrl) {
                    const tmp = this.options.pushStateUrl.split("{path}");
                    base = tmp[0];
                    appended = tmp[1];
                } else {
                    base = this.options.urlStructure.base;
                    appended = this.options.urlStructure.appended;
                }
                // take off the base url
                let path = url.substring(base.length);
                if (path.substring(path.length - appended.length) === appended) {
                    /* check that it ends with appended value */
                    path = path.substring(0, path.length - appended.length);
                }
                if (!path) {
                    path = "/";
                }
                this.setCurrentPath(path);
                $("body").trigger("structure-url-changed", [path]);
                // since this next call causes state to be pushed...
                this.doNotPushState = true;
                this.collection.getPage(this.collection.state.firstPage);
            });
            /* detect key events */
            $(document).on("keyup keydown", (e) => {
                this.keyEvent = e;
            });
        }

        this.togglePasteBtn();
    },

    updateButtons: function () {
        if (this.selectedCollection.length) {
            this.toolbar.get("selected-items").enable();
            this.buttons.enable();
        } else {
            this.toolbar.get("selected-items").disable();
            this.buttons.disable();
        }

        this.togglePasteBtn();
    },

    togglePasteBtn: function () {
        if (
            _.find(this.buttons.items, (btn) => {
                return btn.id === "paste";
            })
        ) {
            if (this.pasteAllowed()) {
                this.buttons.get("paste").enable();
            } else {
                this.buttons.get("paste").disable();
            }
        }
    },

    inQueryMode: function () {
        if (this.toolbar) {
            if (this.toolbar.get("filter").term) {
                return true;
            }
        }
        if (this.additionalCriterias.length > 0) {
            return true;
        }
        if (this.sort_on && this.sort_on !== "getObjPositionInParent") {
            return true;
        }
        if (this.sort_order !== "ascending") {
            return true;
        }
        return false;
    },

    getSelectedUids: function (collection) {
        if (collection === undefined) {
            collection = this.selectedCollection;
        }
        const uids = [];
        collection.each(function (item) {
            uids.push(item.uid());
        });
        return uids;
    },

    getCurrentPath: function () {
        return this.collection.getCurrentPath();
    },

    setCurrentPath: function (path) {
        this.collection.setCurrentPath(path);
        // this.textfilter.clearTerm();
        this.clearStatus();
    },

    getAjaxUrl: function (url) {
        return url.replace("{path}", this.getCurrentPath());
    },

    buttonClickEvent: function (button) {
        let data = null;
        let callback = null;

        if (button.url) {
            this.loading.show();
            // handle ajax now

            if (arguments.length > 1) {
                const arg1 = arguments[1];
                if (!arg1.preventDefault) {
                    data = arg1;
                }
            }
            if (arguments.length > 2) {
                const arg2 = arguments[2];
                if (typeof arg2 === "function") {
                    callback = arg2;
                }
            }
            if (data === null) {
                data = {};
            }
            if (data.selection === undefined) {
                // if selection is overridden by another mechanism
                data.selection = JSON.stringify(this.getSelectedUids());
            }
            data._authenticator = utils.getAuthenticator();
            if (data.folder === undefined) {
                data.folder = this.getCurrentPath();
            }

            const url = this.getAjaxUrl(button.url);
            $.ajax(
                {
                    url: url,
                    type: "POST",
                    data: data,
                    success: (data) => {
                        this.ajaxSuccessResponse.apply(this, [data, callback]);
                        this.loading.hide();
                    },
                    error: (response) => {
                        this.ajaxErrorResponse.apply(this, [response, url]);
                        this.loading.hide();
                    },
                },
                this
            );
        }
    },

    ajaxSuccessResponse: function (data, callback) {
        this.clearStatus();
        this.selectedCollection.reset();
        if (data.status === "success") {
            this.collection.reset();
        }
        if (data.msg) {
            // give status message somewhere...
            this.setStatus({
                text: data.msg,
                type: data.status || "warning",
            });
        }
        if (callback !== null && callback !== undefined) {
            callback(data);
        }
        this.collection.fetch();
    },

    ajaxErrorResponse: function (response, url) {
        if (response.status === 404) {
            window.alert(_t("operation url ${url} is not valid", { url: url }));
        } else {
            window.alert(_t("there was an error performing the action"));
        }
    },

    setupButtons: function () {
        const items = [];

        const columnsBtn = new ButtonView({
            id: "structure-columns",
            tooltip: _t("Configure displayed columns"),
            icon: "plone-three-dots",
        });

        this.columnsView = new ColumnsView({
            app: this,
            triggerView: columnsBtn,
            id: "structure-columns",
            placement: "bottom-right",
        });
        items.push(columnsBtn);

        items.push(
            new SelectionButtonView({
                title: _t("Selected"),
                id: "selected-items",
                tooltip: _t("Manage selection"),
                collection: this.selectedCollection,
                icon: "plone-selection",
            })
        );

        if (this.options.rearrange) {
            const rearrangeButton = new ButtonView({
                id: "structure-rearrange",
                title: _t("Rearrange"),
                icon: "plone-rearrange",
                tooltip: _t("Rearrange folder contents"),
                url: this.options.rearrange.url,
            });
            this.rearrangeView = new RearrangeView({
                triggerView: rearrangeButton,
                app: this,
                id: "structure-rearrange",
            });
            items.push(rearrangeButton);
        }
        if (
            this.options.upload &&
            utils.featureSupport.dragAndDrop() &&
            utils.featureSupport.fileApi()
        ) {
            const uploadButton = new ButtonView({
                id: "upload",
                title: _t("Upload"),
                tooltip: _t("Upload files"),
                icon: "upload",
            });
            this.uploadView = new UploadView({
                triggerView: uploadButton,
                app: this,
                id: "upload",
            });
            items.push(uploadButton);
        }

        const buttons = [];
        for (const buttonOptions of this.options.buttons) {
            try {
                const button = new ButtonView(buttonOptions);
                buttons.push(button);

                if (button.form) {
                    buttonOptions.triggerView = button;
                    buttonOptions.app = this;
                    const view = new GenericPopover(buttonOptions);
                    this.forms.push(view.el);
                } else {
                    button.on("button:click", () => this.buttonClickEvent(button), this);
                }
            } catch (err) {
                log.error(
                    `Error initializing button ${
                        buttonOptions.title || buttonOptions.id
                    } ${err}`
                );
            }
        }
        this.buttons = new ButtonGroup({
            items: buttons,
            id: "mainbuttons",
            app: this,
        });
        items.push(this.buttons);

        this.textfilter = new TextFilterView({
            id: "filter",
            app: this,
        });
        items.push(this.textfilter);

        this.toolbar = new Toolbar({
            items: items,
        });
    },

    moveItem: function (id, delta, subsetIds) {
        $.ajax({
            url: this.getAjaxUrl(this.options.moveUrl),
            type: "POST",
            data: {
                delta: delta,
                id: id,
                _authenticator: utils.getAuthenticator(),
                subsetIds: JSON.stringify(subsetIds),
            },
            dataType: "json",
            success: (data) => {
                this.clearStatus();
                if (data.msg) {
                    this.setStatus({ text: data.msg });
                } else if (data.status !== "success") {
                    // XXX handle error here with something?
                    this.setStatus({
                        text: _t("Error moving item"),
                        type: "danger",
                    });
                }
                this.collection.fetch(); // reload it all
            },
            error: () => {
                this.clearStatus();
                this.setStatus({
                    text: _t("Error moving item"),
                    type: "danger",
                });
            },
        });
    },

    clearStatus: function (key) {
        const statusContainer = this.$el[0].querySelector(".fc-status-container");
        let toBeRemoved = [];
        if (key) {
            // remove specific status, even if marked with ``fixed``.
            toBeRemoved = this.statusMessages.filter(function (item) {
                return item.key === key;
            });
            toBeRemoved.forEach(function (statusItem) {
                try {
                    statusContainer.removeChild(statusItem.el);
                } catch (e) {
                    // just ignore.
                }
            });
            this.statusMessages = this.statusMessages.filter(function (item) {
                return item.key !== key;
            });
        } else {
            // remove all status messages except those marked with ``fixed``.
            this.statusMessages.forEach(
                function (statusItem) {
                    if (!statusItem.fixed) {
                        try {
                            statusContainer.removeChild(statusItem.el);
                            toBeRemoved.push(statusItem);
                        } catch (e) {
                            // just ignore.
                        }
                    }
                }.bind(this)
            );
            this.statusMessages = this.statusMessages.filter(function (item) {
                return toBeRemoved.indexOf(item) === -1;
            });
        }
    },

    setStatus: function (status, btn, fixed, key) {
        if (
            key &&
            this.statusMessages.filter(function (item) {
                return item.key === key;
            }).length > 0
        ) {
            // Prevent two same status messages
            return;
        }

        const el = dom.create_from_string(
            this.statusTemplate({
                label: status.label || "",
                text: status.text,
                type: status.type || "warning",
            })
        ).lastChild;

        if (btn) {
            btn = $(btn)[0]; // support jquert + bare dom elements
            el.appendChild(btn);
        }

        status = {
            el: el,
            fixed: fixed,
            key: key, // to be used for filtering to prevent double status messages.
        };

        const statusContainer = this.$el[0].querySelector(".fc-status-container");
        statusContainer.appendChild(status.el);
        this.statusMessages.push(status);

        return status;
    },

    render: async function () {
        this.$el.append(this.toolbar.render().el);
        if (this.wellView) {
            this.$el
                .find("#btn-" + this.wellView.id)
                .after((await this.wellView.render()).el);
        }
        for (const form of this.forms) {
            const id = $(form).attr("id");
            const $btn = this.$el.find("#btn-" + id);
            if ($btn.closest(".btn-group").length) {
                $btn.closest(".btn-group").after(form);
            } else {
                this.$el.find("#btn-" + id).after(form);
            }
        }
        this.$el.append(
            dom.create_from_string('<div class="fc-status-container"></div>')
        );
        if (this.columnsView) {
            this.$el
                .find("#btn-" + this.columnsView.id)
                .after(this.columnsView.render().el);
        }
        if (this.rearrangeView) {
            this.$el
                .find("#btn-" + this.rearrangeView.id)
                .after(this.rearrangeView.render().el);
        }
        if (this.uploadView) {
            this.$el
                .find("#btn-" + this.uploadView.id)
                .after(this.uploadView.render().el);
        }

        // NOTE: tableView and pagingView get rendered on
        // this.collection.fetch() on initialization so we simply
        // append the rendered output to the template once here
        this.$el.append(this.tableView.el);
        this.$el.append(this.pagingView.el);

        // Backdrop class
        if (this.options.backdropSelector !== null) {
            $(this.options.backdropSelector).addClass("ui-backdrop-element");
        } else {
            this.$el.addClass("ui-backdrop-element");
        }

        return this;
    },

    getCookieSetting: function (name, _default) {
        if (_default === undefined) {
            _default = null;
        }
        let val;
        try {
            val = Cookies.get(this.cookieSettingPrefix + name);
            val = JSON.parse(val).value;
        } catch (e) {
            /* error parsing json, load default here now */
            return _default;
        }
        if (val === undefined || val === null) {
            return _default;
        }
        return val;
    },

    setCookieSetting: function (name, val) {
        Cookies.set(
            this.cookieSettingPrefix + name,
            JSON.stringify({
                value: val,
            })
        );
    },
});
