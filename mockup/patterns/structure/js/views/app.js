define([
    "jquery",
    "underscore",
    "mockup-ui-url/views/toolbar",
    "mockup-ui-url/views/buttongroup",
    "mockup-ui-url/views/button",
    "mockup-ui-url/views/base",
    "mockup-patterns-structure-url/js/views/table",
    "mockup-patterns-structure-url/js/views/selectionwell",
    "mockup-patterns-structure-url/js/views/generic-popover",
    "mockup-patterns-structure-url/js/views/rearrange",
    "mockup-patterns-structure-url/js/views/selectionbutton",
    "mockup-patterns-structure-url/js/views/paging",
    "mockup-patterns-structure-url/js/views/columns",
    "mockup-patterns-structure-url/js/views/textfilter",
    "mockup-patterns-structure-url/js/views/upload",
    "mockup-patterns-structure-url/js/collections/result",
    "mockup-patterns-structure-url/js/collections/selected",
    "text!mockup-patterns-structure-url/templates/status.xml",
    "mockup-utils",
    "translate",
    "pat-logger",
    "jquery.cookie",
], function (
    $,
    _,
    Toolbar,
    ButtonGroup,
    ButtonView,
    BaseView,
    TableView,
    SelectionWellView,
    GenericPopover,
    RearrangeView,
    SelectionButtonView,
    PagingView,
    ColumnsView,
    TextFilterView,
    UploadView,
    _ResultCollection,
    SelectedCollection,
    StatusTemplate,
    utils,
    _t,
    logger
) {
    "use strict";

    var log = logger.getLogger("pat-structure");

    var AppView = BaseView.extend({
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
            return !!$.cookie("__cp");
        },

        initialize: function (options) {
            var self = this;
            BaseView.prototype.initialize.apply(self, [options]);
            self.loading = new utils.Loading();
            self.loading.show();

            /* close popovers when clicking away */
            $(document).click(function (e) {
                var $el = $(e.target);
                if (
                    !$el.is(":visible") ||
                    $el.css("visibility") === "hidden" ||
                    $el.css("opacity") === "0"
                ) {
                    // ignore this, fake event trigger to element that is not visible
                    return;
                }
                if ($el.is("a") || $el.parent().is("a")) {
                    return;
                }
                var $popover = $(".popover:visible");
                if ($popover.length > 0 && !$.contains($popover[0], $el[0])) {
                    var popover = $popover.data("component");
                    if (popover) {
                        popover.hide();
                    }
                }
            });

            var ResultCollection = require(options.collectionConstructor);

            self.collection = new ResultCollection([], {
                // Due to default implementation need to poke at things in here,
                // view is passed.
                view: self,
                url: self.options.collectionUrl,
            });

            self.setAllCookieSettings();

            self.selectedCollection = new SelectedCollection();
            self.tableView = new TableView({ app: self });
            self.pagingView = new PagingView({ app: self });

            /* initialize buttons */
            self.setupButtons();

            self.wellView = new SelectionWellView({
                collection: self.selectedCollection,
                triggerView: self.toolbar.get("selected-items"),
                app: self,
                id: "selected-items",
            });

            self.toolbar.get("selected-items").disable();
            self.buttons.disable();

            var timeout = 0;
            self.selectedCollection.on(
                "add remove reset",
                function (/*modal, collection*/) {
                    /* delay rendering since this can happen in batching */
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        self.updateButtons();
                    }, 100);
                },
                self
            );

            self.collection.on("sync", function () {
                if (self.contextInfoUrl) {
                    $.ajax({
                        url: self.getAjaxUrl(self.contextInfoUrl),
                        dataType: "json",
                        success: function (data) {
                            $("body").trigger("context-info-loaded", [data]);
                        },
                        error: function (response) {
                            // XXX handle error?
                            if (response.status === 404) {
                                log.info("context info url not found");
                            }
                        },
                    });
                }
                self.loading.hide();
            });

            self.collection.on("pager", function () {
                self.loading.show();
                self.updateButtons();

                // the remaining calls are related to window.pushstate.
                // abort if feature unavailable.
                if (!(window.history && window.history.pushState)) {
                    return;
                }

                // undo the flag set by popState to prevent the push state
                // from being triggered here, and early abort out of the
                // function to not execute the folowing pushState logic.
                if (self.doNotPushState) {
                    self.doNotPushState = false;
                    return;
                }

                var path = self.getCurrentPath();
                var url;
                if (path === "/") {
                    path = "";
                }
                /* maintain history here */
                if (self.options.pushStateUrl) {
                    // permit an extra slash in pattern, but strip that if there
                    // as path always will be prefixed with a `/`
                    var pushStateUrl = self.options.pushStateUrl.replace(
                        "/{path}",
                        "{path}"
                    );
                    url = pushStateUrl.replace("{path}", path);
                    window.history.pushState(null, null, url);
                } else if (self.options.urlStructure) {
                    // fallback to urlStructure specification
                    url =
                        self.options.urlStructure.base +
                        path +
                        self.options.urlStructure.appended;
                    window.history.pushState(null, null, url);
                }

                if (self.options.traverseView) {
                    // flag specifies that the context view implements a traverse
                    // view (i.e. IPublishTraverse) and the path is a virtual path
                    // of some kind - use the base object instead for that by not
                    // specifying a path.
                    path = "";
                    // TODO figure out whether the following event after this is
                    // needed at all.
                }
                $("body").trigger("structure-url-changed", [path]);
            });

            if (
                (self.options.pushStateUrl || self.options.urlStructure) &&
                utils.featureSupport.history()
            ) {
                $(window).bind("popstate", function () {
                    /* normalize this url first... */
                    var win = utils.getWindow();
                    var url = win.location.href;
                    var base, appended;
                    if (url.indexOf("?") !== -1) {
                        url = url.split("?")[0];
                    }
                    if (url.indexOf("#") !== -1) {
                        url = url.split("#")[0];
                    }
                    if (self.options.pushStateUrl) {
                        var tmp = self.options.pushStateUrl.split("{path}");
                        base = tmp[0];
                        appended = tmp[1];
                    } else {
                        base = self.options.urlStructure.base;
                        appended = self.options.urlStructure.appended;
                    }
                    // take off the base url
                    var path = url.substring(base.length);
                    if (
                        path.substring(path.length - appended.length) ===
                        appended
                    ) {
                        /* check that it ends with appended value */
                        path = path.substring(0, path.length - appended.length);
                    }
                    if (!path) {
                        path = "/";
                    }
                    self.setCurrentPath(path);
                    $("body").trigger("structure-url-changed", [path]);
                    // since this next call causes state to be pushed...
                    self.doNotPushState = true;
                    self.collection.goTo(self.collection.information.firstPage);
                });
                /* detect key events */
                $(document).bind("keyup keydown", function (e) {
                    self.keyEvent = e;
                });
            }

            self.togglePasteBtn();
        },
        updateButtons: function () {
            var self = this;
            if (self.selectedCollection.length) {
                self.toolbar.get("selected-items").enable();
                self.buttons.enable();
            } else {
                this.toolbar.get("selected-items").disable();
                self.buttons.disable();
            }

            self.togglePasteBtn();
        },
        togglePasteBtn: function () {
            var self = this;
            if (
                _.find(self.buttons.items, function (btn) {
                    return btn.id === "paste";
                })
            ) {
                if (self.pasteAllowed()) {
                    self.buttons.get("paste").enable();
                } else {
                    self.buttons.get("paste").disable();
                }
            }
        },
        inQueryMode: function () {
            if (this.toolbar) {
                var term = this.toolbar.get("filter").term;
                if (term) {
                    return true;
                }
            }
            if (this.additionalCriterias.length > 0) {
                return true;
            }
            if (this.sort_on && this.sort_on !== "getObjPositionInParent") {
                // jshint ignore:line
                return true;
            }
            if (this.sort_order !== "ascending") {
                // jshint ignore:line
                return true;
            }
            return false;
        },
        getSelectedUids: function (collection) {
            var self = this;
            if (collection === undefined) {
                collection = self.selectedCollection;
            }
            var uids = [];
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
            this.textfilter.clearTerm();
            this.clearStatus();
        },
        getAjaxUrl: function (url) {
            return url.replace("{path}", this.getCurrentPath());
        },
        buttonClickEvent: function (button) {
            var self = this;
            var data = null;
            var callback = null;

            if (button.url) {
                self.loading.show();
                // handle ajax now

                if (arguments.length > 1) {
                    var arg1 = arguments[1];
                    if (!arg1.preventDefault) {
                        data = arg1;
                    }
                }
                if (arguments.length > 2) {
                    var arg2 = arguments[2];
                    if (typeof arg2 === "function") {
                        callback = arg2;
                    }
                }
                if (data === null) {
                    data = {};
                }
                if (data.selection === undefined) {
                    // if selection is overridden by another mechanism
                    data.selection = JSON.stringify(self.getSelectedUids());
                }
                data._authenticator = utils.getAuthenticator();
                if (data.folder === undefined) {
                    data.folder = self.getCurrentPath();
                }

                var url = self.getAjaxUrl(button.url);
                $.ajax(
                    {
                        url: url,
                        type: "POST",
                        data: data,
                        success: function (data) {
                            self.ajaxSuccessResponse.apply(self, [
                                data,
                                callback,
                            ]);
                            self.loading.hide();
                        },
                        error: function (response) {
                            self.ajaxErrorResponse.apply(self, [response, url]);
                            self.loading.hide();
                        },
                    },
                    self
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
            this.collection.pager();
        },
        ajaxErrorResponse: function (response, url) {
            if (response.status === 404) {
                window.alert(
                    _t("operation url ${url} is not valid", { url: url })
                );
            } else {
                window.alert(_t("there was an error performing the action"));
            }
        },
        setupButtons: function () {
            var self = this;
            var items = [];

            var columnsBtn = new ButtonView({
                id: "structure-columns",
                tooltip: _t("Configure displayed columns"),
                icon: "th",
            });

            self.columnsView = new ColumnsView({
                app: self,
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
                })
            );

            if (self.options.rearrange) {
                var rearrangeButton = new ButtonView({
                    id: "structure-rearrange",
                    title: _t("Rearrange"),
                    icon: "sort-by-attributes",
                    tooltip: _t("Rearrange folder contents"),
                    url: self.options.rearrange.url,
                });
                self.rearrangeView = new RearrangeView({
                    triggerView: rearrangeButton,
                    app: self,
                    id: "structure-rearrange",
                });
                items.push(rearrangeButton);
            }
            if (
                self.options.upload &&
                utils.featureSupport.dragAndDrop() &&
                utils.featureSupport.fileApi()
            ) {
                var uploadButton = new ButtonView({
                    id: "upload",
                    title: _t("Upload"),
                    tooltip: _t("Upload files"),
                    icon: "upload",
                });
                self.uploadView = new UploadView({
                    triggerView: uploadButton,
                    app: self,
                    id: "upload",
                });
                items.push(uploadButton);
            }

            var buttons = [];
            _.each(self.options.buttons, function (buttonOptions) {
                try {
                    var button = new ButtonView(buttonOptions);
                    buttons.push(button);

                    if (button.form) {
                        buttonOptions.triggerView = button;
                        buttonOptions.app = self;
                        var view = new GenericPopover(buttonOptions);
                        self.forms.push(view.el);
                    } else {
                        button.on("button:click", self.buttonClickEvent, self);
                    }
                } catch (err) {
                    log.error(
                        "Error initializing button " +
                            buttonOptions.title +
                            " " +
                            err
                    );
                }
            });
            self.buttons = new ButtonGroup({
                items: buttons,
                id: "mainbuttons",
                app: self,
            });
            items.push(self.buttons);

            self.textfilter = new TextFilterView({
                id: "filter",
                app: this,
            });
            items.push(self.textfilter);

            this.toolbar = new Toolbar({
                items: items,
            });
        },
        moveItem: function (id, delta, subsetIds) {
            var self = this;
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
                success: function (data) {
                    self.clearStatus();
                    if (data.msg) {
                        self.setStatus({ text: data.msg });
                    } else if (data.status !== "success") {
                        // XXX handle error here with something?
                        self.setStatus({
                            text: "error moving item",
                            type: "error",
                        });
                    }
                    self.collection.pager(); // reload it all
                },
                error: function () {
                    self.clearStatus();
                    self.setStatus({
                        text: "error moving item",
                        type: "error",
                    });
                },
            });
        },

        clearStatus: function (key) {
            var statusContainer = this.$el[0].querySelector(
                ".fc-status-container"
            );
            var statusItem;
            var toBeRemoved = [];
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
                this.statusMessages = this.statusMessages.filter(function (
                    item
                ) {
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
                this.statusMessages = this.statusMessages.filter(function (
                    item
                ) {
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

            var el = this.statusTemplate({
                label: status.label || "",
                text: status.text,
                type: status.type || "warning",
            });

            el = utils.createElementFromHTML(el);

            if (btn) {
                btn = $(btn)[0]; // support jquert + bare dom elements
                el.appendChild(btn);
            }

            var status = {
                el: el,
                fixed: fixed,
                key: key, // to be used for filtering to prevent double status messages.
            };

            var statusContainer = this.$el[0].querySelector(
                ".fc-status-container"
            );
            statusContainer.appendChild(status.el);
            this.statusMessages.push(status);

            return status;
        },

        render: function () {
            var self = this;

            self.$el.append(self.toolbar.render().el);
            if (self.wellView) {
                self.$el
                    .find("#btn-" + self.wellView.id)
                    .after(self.wellView.render().el);
            }
            self.forms.forEach(function (element) {
                var id = $(element).attr("id");
                self.$el.find("#btn-" + id).after(element);
            });

            self.$el.append(
                utils.createElementFromHTML(
                    '<div class="fc-status-container"></div>'
                )
            );
            if (self.columnsView) {
                self.$el
                    .find("#btn-" + self.columnsView.id)
                    .after(self.columnsView.render().el);
            }
            if (self.rearrangeView) {
                self.$el
                    .find("#btn-" + self.rearrangeView.id)
                    .after(self.rearrangeView.render().el);
            }
            if (self.uploadView) {
                self.$el
                    .find("#btn-" + self.uploadView.id)
                    .after(self.uploadView.render().el);
            }

            self.$el.append(self.tableView.render().el);
            self.$el.append(self.pagingView.render().el);

            // Backdrop class
            if (self.options.backdropSelector !== null) {
                $(self.options.backdropSelector).addClass(
                    "ui-backdrop-element"
                );
            } else {
                self.$el.addClass("ui-backdrop-element");
            }

            return self;
        },
        getCookieSetting: function (name, _default) {
            if (_default === undefined) {
                _default = null;
            }
            var val;
            try {
                val = $.cookie(this.cookieSettingPrefix + name);
                val = $.parseJSON(val).value;
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
            $.cookie(
                this.cookieSettingPrefix + name,
                JSON.stringify({
                    value: val,
                })
            );
        },
        setAllCookieSettings: function () {
            this.activeColumns = this.getCookieSetting(
                this.activeColumnsCookie,
                this.activeColumns
            );
            var perPage = this.getCookieSetting("perPage", 15);
            if (typeof perPage === "string") {
                perPage = parseInt(perPage);
            }
            this.collection.howManyPer(perPage);
        },
    });

    return AppView;
});
