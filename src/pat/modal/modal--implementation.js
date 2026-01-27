import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import _ from "underscore";
import Backdrop from "../backdrop/backdrop";
import registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import utils from "../../core/utils";
import _t from "../../core/i18n-wrapper";
import submitForm from "../../core/form-submit";


export default Base.extend({
    name: "plone-modal",
    trigger: ".pat-plone-modal",
    parser: "mockup",
    createModal: null,
    $model: null,
    defaults: {
        width: "",
        height: "",
        modalSizeClass: "",
        margin: 0,
        position: "center middle", // format: '<horizontal> <vertical>' -- allowed values: top, bottom, left, right, center, middle
        triggers: [],
        zIndexSelector: ".modal-wrapper,.modal-backdrop",
        backdrop: "body", // Element to initiate the Backdrop on.
        backdropOptions: {
            zIndex: "1040",
            opacity: "0.85",
            className: "modal-backdrop",
            classActiveName: "backdrop-active",
            closeOnEsc: true,
            closeOnClick: true,
        },
        title: null,
        titleSelector: "h1:first",
        buttons:
            '.formControls > input[type="submit"], .formControls > button:not([type="button"], [type="reset"])',
        content: "#content",
        automaticallyAddButtonActions: true,
        loadLinksWithinModal: true,
        prependContent: ".portalMessage",
        onRender: null,
        templateOptions: {
            className: "modal fade",
            classDialog: "modal-dialog",
            classModal: "modal-content",
            classHeaderName: "modal-header",
            classBodyName: "modal-body",
            classFooterName: "modal-footer",
            classWrapperName: "modal-wrapper",
            classWrapperInnerName: "modal-wrapper-inner",
            classActiveName: "show",
            classPrependName: "", // String, css class to be applied to the wrapper of the prepended content
            classContentName: "", // String, class name to be applied to the content of the modal, useful for modal specific styling
            template:
                "" +
                '<div class="<%= options.className %>">' +
                '  <div class="<%= options.classDialog %><% if (modalSizeClass) { %> <%= modalSizeClass %><% } %>" role="dialog" <% if (title) { %>aria-labelledby="modal-title" <% } %> tabindex="-1">' +
                '    <div class="<%= options.classModal %>" role="document">' +
                '      <div class="<%= options.classHeaderName %>">' +
                '        <% if (title) { %><h5 class="modal-title" id="modal-title" tabindex="0"><%= title %></h5><% } %>' +
                '        <button type="button" class="btn-close modal-close" aria-label="<%= closeButtonLabel %>"></button>' +
                "      </div>" +
                '      <div class="<%= options.classBodyName %>">' +
                '        <div class="<%= options.classPrependName %>"><%= prepend %></div> ' +
                '        <div class="<%= options.classContentName %>"><%= content %></div>' +
                "      </div>" +
                '      <div class="<%= options.classFooterName %>"> ' +
                "        <% if (buttons) { %><%= buttons %><% } %>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>",
        },
        actions: {},
        actionOptions: {
            eventType: "click",
            disableAjaxFormSubmit: false,
            target: null,
            ajaxUrl: null, // string, or function($el, options) that returns a string
            modalFunction: null, // String, function name on self to call
            isForm: false,
            timeout: 5000,
            displayInModal: true,
            reloadWindowOnClose: true,
            error: ".portalMessage.error, .alert-danger",
            formFieldError: ".field.error",
            onSuccess: null,
            onError: null,
            onFormError: null,
            onTimeout: null,
            redirectOnResponse: false,
            redirectToUrl: function ($action, response) {
                var reg;
                reg = /<body.*data-view-url=[\"'](.*)[\"'].*/im.exec(response);
                if (reg && reg.length > 1) {
                    // view url as data attribute on body (Plone 5)
                    return reg[1].split('"')[0];
                }
                reg = /<body.*data-base-url=[\"'](.*)[\"'].*/im.exec(response);
                if (reg && reg.length > 1) {
                    // Base url as data attribute on body (Plone 5)
                    return reg[1].split('"')[0];
                }
                reg = /<base.*href=[\"'](.*)[\"'].*/im.exec(response);
                if (reg && reg.length > 1) {
                    // base tag available (Plone 4)
                    return reg[1];
                }
                return "";
            },
        },
        form: function (actions) {
            var self = this;
            var $modal = self.$modal;

            if (self.options.automaticallyAddButtonActions) {
                actions[self.options.buttons] = {};
            }
            actions.a = {};

            $.each(actions, function (action, options) {
                var actionKeys = _.union(_.keys(self.options.actionOptions), [
                    "templateOptions",
                ]);
                var actionOptions = $.extend(
                    true,
                    {},
                    self.options.actionOptions,
                    _.pick(options, actionKeys)
                );
                options.templateOptions = $.extend(
                    true,
                    options.templateOptions,
                    self.options.templateOptions
                );

                var patternKeys = _.union(_.keys(self.options.actionOptions), [
                    "actions",
                    "actionOptions",
                ]);
                var patternOptions = $.extend(
                    true,
                    _.omit(options, patternKeys),
                    self.options
                );
                $(action, $("." + options.templateOptions.classBodyName, $modal)).each(
                    function () {
                        var $action = $(this);
                        $action.on(actionOptions.eventType, function (e) {
                            e.stopPropagation();
                            e.preventDefault();

                            self.loading.show(false);

                            // handle event on $action using a function on self
                            if (actionOptions.modalFunction !== null) {
                                self[actionOptions.modalFunction]();
                                // handle event on input/button using jquery.form library
                            } else if (
                                $action[0].nodeName.toLowerCase() === "input" ||
                                $action[0].nodeName.toLowerCase() === "button" ||
                                options.isForm === true
                            ) {
                                self.options.handleFormAction.apply(self, [
                                    $action,
                                    actionOptions,
                                    patternOptions,
                                ]);
                                // handle event on link with jQuery.ajax
                            } else if (
                                options.ajaxUrl !== null ||
                                $action[0].nodeName.toLowerCase() === "a"
                            ) {
                                self.options.handleLinkAction.apply(self, [
                                    $action,
                                    actionOptions,
                                    patternOptions,
                                ]);
                            }
                        });
                    }
                );
            });
        },
        handleFormAction: async function ($action, options, patternOptions) {
            var self = this;

            // pass action that was clicked when submiting form
            var extraData = {};
            extraData[$action.attr("name")] = $action.attr("value");

            var $form;

            if ($action[0].nodeName.toLowerCase() === "form") {
                $form = $action;
            } else {
                $form = $action.parents("form:not(.disableAutoSubmit)");
            }

            var url;
            if (options.ajaxUrl !== null) {
                if (typeof options.ajaxUrl === "function") {
                    url = options.ajaxUrl.apply(self, [$action, options]);
                } else {
                    url = options.ajaxUrl;
                }
            } else {
                url = $action.parents("form").attr("action");
            }

            if (options.disableAjaxFormSubmit) {
                if ($action.attr("name") && $action.attr("value")) {
                    $form.append(
                        $(
                            '<input type="hidden" name="' +
                            $action.attr("name") +
                            '" value="' +
                            $action.attr("value") +
                            '" />'
                        )
                    );
                }
                $form.trigger("submit");
                return;
            }
            // We want to trigger the form submit event but NOT use the default
            $form.on("submit", function (e) {
                e.preventDefault();
            });
            $form.trigger("submit");

            self.loading.show(false);
            self.hideSubmitError();
            // The modal this form is in. If it was closed before the
            // request failed, the message must not show up in a modal that
            // was opened since.
            var $modal = self.$modal;
            self.submitForm($form, {
                timeout: options.timeout,
                data: extraData,
                url: url,
                error: function (xhr, textStatus, errorStatus) {
                    self.loading.hide();
                    if (textStatus === "timeout" && options.onTimeout) {
                        self.callHandler(options.onTimeout, self, [
                            self.$modal,
                            xhr,
                            errorStatus,
                        ]);
                        // on "error", "abort", and "parsererror"
                    } else if (options.onError) {
                        self.callHandler(options.onError, null, [
                            xhr,
                            textStatus,
                            errorStatus,
                        ]);
                    } else if (
                        $modal !== self.$modal ||
                        !document.body.contains($modal[0])
                    ) {
                        // The modal was closed in the meantime.
                    } else if (textStatus === "abort") {
                        // Aborted on purpose, nothing went wrong.
                    } else if (textStatus === "timeout") {
                        // Only a warning: the request may have succeeded.
                        self.showSubmitWarning(
                            _t(
                                "The server did not respond in time. The request may still have been processed. Please check this before you submit the form again.",
                            ),
                        );
                    } else if (textStatus === "parsererror") {
                        // The server answered, but the response is broken.
                        self.showSubmitError(
                            _t(
                                "The response of the server could not be read. Please try again later.",
                            ),
                        );
                    } else if (!xhr.status) {
                        // No response at all, e.g. the network is down.
                        self.showSubmitError(
                            _t(
                                "The server could not be reached. Please check your connection and try again.",
                            ),
                        );
                    } else {
                        // An error response. Show its HTTP status, so the
                        // user can tell e.g. a missing permission from a
                        // server error. HTTP/2 has no status text, then
                        // only the code is shown.
                        var status = [xhr.status, errorStatus]
                            .filter(Boolean)
                            .join(" ");
                        self.showSubmitError(
                            _t(
                                "The server could not process the request, please try again later.",
                            ) +
                                " (" +
                                status +
                                ")",
                        );
                    }
                    self.emit("formActionError", [xhr, textStatus, errorStatus]);
                },
                success: function (response, state, xhr, form) {
                    self.loading.hide();
                    // if error is found (NOTE: check for both the portal errors
                    // and the form field-level errors)
                    if (
                        $(options.error, response).length !== 0 ||
                        $(options.formFieldError, response).length !== 0
                    ) {
                        if (options.onFormError) {
                            if (typeof options.onFormError === "string") {
                                window[options.onFormError](
                                    self,
                                    response,
                                    state,
                                    xhr,
                                    form
                                );
                            } else {
                                options.onFormError(self, response, state, xhr, form);
                            }
                        } else {
                            self.redraw(response, patternOptions);
                        }
                        return;
                    }

                    if (options.redirectOnResponse === true) {
                        if (typeof options.redirectToUrl === "function") {
                            window.parent.location.href = options.redirectToUrl.apply(
                                self,
                                [$action, response, options]
                            );
                        } else {
                            window.parent.location.href = options.redirectToUrl;
                        }
                        return; // cut out right here since we're changing url
                    }

                    if (options.onSuccess) {
                        if (typeof options.onSuccess === "string") {
                            window[options.onSuccess](self, response, state, xhr, form);
                        } else {
                            options.onSuccess(self, response, state, xhr, form);
                        }
                    }

                    if (options.displayInModal === true) {
                        self.redraw(response, patternOptions);
                    } else {
                        $action.trigger("destroy.plone-modal.patterns");
                        // also calls hide
                        if (options.reloadWindowOnClose) {
                            self.reloadWindow();
                        }
                    }
                    self.emit("formActionSuccess", [response, state, xhr, form]);
                },
            });
        },
        handleLinkAction: function ($action, options, patternOptions) {
            var self = this;
            var url;
            if ($action.hasClass("pat-plone-modal")) {
                // if link is a modal pattern, do not reload the page
                return;
            }

            // Figure out URL
            if (options.ajaxUrl) {
                if (typeof options.ajaxUrl === "function") {
                    url = options.ajaxUrl.apply(self, [$action, options]);
                } else {
                    url = options.ajaxUrl;
                }
            } else {
                url = $action.attr("href");
            }

            // Non-ajax link (I know it says "ajaxUrl" ...)
            if (options.displayInModal === false) {
                if ($action.attr("target") === "_blank") {
                    window.open(url, "_blank");
                    self.loading.hide();
                } else {
                    window.location = url;
                }
                return;
            }

            // ajax version
            $.ajax({
                url: url,
            })
                .fail(function (xhr, textStatus, errorStatus) {
                    if (textStatus === "timeout" && options.onTimeout) {
                        self.callHandler(options.onTimeout, null, [
                            self.$modal,
                            xhr,
                            errorStatus,
                        ]);

                        // on "error", "abort", and "parsererror"
                    } else if (options.onError) {
                        self.callHandler(options.onError, null, [
                            xhr,
                            textStatus,
                            errorStatus,
                        ]);
                    } else {
                        window.alert(_t("There was an error loading modal."));
                    }
                    self.emit("linkActionError", [xhr, textStatus, errorStatus]);
                })
                .done(function (response, state, xhr) {
                    self.redraw(response, patternOptions);
                    if (options.onSuccess) {
                        if (typeof options.onSuccess === "string") {
                            window[options.onSuccess](self, response, state, xhr);
                        } else {
                            options.onSuccess(self, response, state, xhr);
                        }
                    }

                    self.emit("linkActionSuccess", [response, state, xhr]);
                })
                .always(function () {
                    self.loading.hide();
                });
        },
        render: function (options) {
            var self = this;

            self.emit("before-render");

            if (!self.$raw) {
                return;
            }
            var $raw = self.$raw.clone();

            // Object that will be passed to the template
            var tplObject = {
                title: "",
                prepend: "<div />",
                content: "",
                modalSizeClass: options.modalSizeClass,
                buttons: '<div class="pattern-modal-buttons"></div>',
                options: options.templateOptions,
                closeButtonLabel: _t("Close"),
            };

            // setup the Title
            if (options.title === null) {
                var $title = $(options.titleSelector, $raw);
                tplObject.title = $title.html();
                $(options.titleSelector, $raw).remove();
            } else {
                tplObject.title = options.title;
            }

            // Grab items to to insert into the prepend area
            if (options.prependContent) {
                tplObject.prepend = $("<div />")
                    .append($(options.prependContent, $raw).clone())
                    .html();
                $(options.prependContent, $raw).remove();
            }

            // Filter out the content if there is a selector provided
            if (options.content) {
                tplObject.content = $(options.content, $raw).html();
            } else {
                tplObject.content = $raw.html();
            }

            // Render html
            self.$modal = $(
                _.template(self.options.templateOptions.template)(tplObject)
            );
            self.$modalDialog = $(
                "> ." + self.options.templateOptions.classDialog,
                self.$modal
            );
            self.$modalContent = $(
                "> ." + self.options.templateOptions.classModal,
                self.$modalDialog
            );

            // In most browsers, when you hit the enter key while a form element is focused
            // the browser will trigger the form 'submit' event.  Google Chrome also does this,
            // but not when when the default submit button is hidden with 'display: none'.
            // The following code will work around this issue:
            $("form", self.$modal).on("keydown", function (event) {
                // ignore keys which are not enter, and ignore enter inside a textarea.
                if (event.key !== "Enter" || event.target.nodeName === "TEXTAREA") {
                    return;
                }
                event.preventDefault();
                const $submit_buttons = $(
                    "input[type=submit], button[type=submit], button:not([type])",
                    this,
                );
                // The buttons of a multi widget (add, remove) change the form
                // and do not save it. Prefer the other submit buttons.
                const $form_buttons = $submit_buttons.not(".multi-widget-buttons *");
                ($form_buttons.length ? $form_buttons : $submit_buttons)
                    .eq(0)
                    .trigger("click");
            });

            // Setup buttons
            $(options.buttons, self.$modal).each(function () {
                var $button = $(this);
                $button
                    .on("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    })
                    .clone()
                    .appendTo($(".pattern-modal-buttons", self.$modal))
                    .off("click")
                    .on("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        $button.trigger("click");
                    });
                $button.hide();
            });

            self.emit("before-events-setup");

            // Wire up events
            self.$modal[0]
                .querySelectorAll(
                    `.modal-header > .modal-close,
                 .modal-footer > .pattern-modal-buttons > .modal-close,
                 .modal-footer [name="form.buttons.Cancel" i]`
                )
                .forEach((el) => {
                    $(el)
                        .off("click")
                        .on("click", (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            $(e.target).trigger("destroy.plone-modal.patterns");
                        });
                });

            // form
            if (options.form) {
                options.form.apply(self, [options.actions]);
            }

            self.$modal
                .addClass(self.options.templateOptions.className)
                .on("destroy.plone-modal.patterns", function (e) {
                    e.stopPropagation();
                    self.hide();
                })
                .on("resize.plone-modal.patterns", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    self.positionModal();
                })
                .appendTo(self.$wrapperInner);

            if (self.options.loadLinksWithinModal) {
                self.$modal.on("click", function (e) {
                    e.stopPropagation();
                    if (e.target.nodeName.toLowerCase() === "a") {
                        e.preventDefault();
                        // TODO: open links inside modal
                        // and slide modal body
                    }
                    self.$modal.trigger("modal-click");
                });
            }
            self.$modal.data("pattern-" + self.name, self);
            self.emit("after-render");
            if (options.onRender) {
                if (typeof options.onRender === "string") {
                    window[options.onRender](self);
                } else {
                    options.onRender(self);
                }
            }
        },
    },
    reloadWindow: function () {
        window.parent.location.reload();
    },
    callHandler: function (handler, context, args) {
        // Call an onError or onTimeout option. It is a function, or the name
        // of a function at window level, as it is in a JSON configuration.
        if (typeof handler === "string") {
            handler = window[handler];
        }
        return handler.apply(context, args);
    },
    showSubmitError: function (message) {
        // Show a failed form submit above the form, so the user is not left
        // waiting without any feedback.
        this.showSubmitMessage(message, "error");
    },
    showSubmitWarning: function (message) {
        // Like showSubmitError, if the request may still have succeeded.
        this.showSubmitMessage(message, "warning");
    },
    showSubmitMessage: function (message, type) {
        var self = this;
        if (!self.modalInitialized()) {
            return;
        }
        self.hideSubmitError();
        var is_warning = type === "warning";
        var el = document.createElement("div");
        el.className = is_warning
            ? "portalMessage statusmessage statusmessage-warning alert alert-warning modal-submit-error"
            : "portalMessage statusmessage statusmessage-error alert alert-danger modal-submit-error";
        el.setAttribute("role", "alert");
        var label = document.createElement("strong");
        label.textContent = is_warning ? _t("Warning") : _t("Error");
        el.append(label, " ", message);
        // Put it in the prepend area, with the other portal messages. It has
        // no class by default (templateOptions.classPrependName), so it is
        // found as the first div of the body; a custom template may not have
        // it, then the message goes at the top of the body.
        var $body = $(
            "." + self.options.templateOptions.classBodyName,
            self.$modal,
        ).first();
        var $prepend = $body.children("div:first-child");
        ($prepend.length ? $prepend : $body).prepend(el);
    },
    hideSubmitError: function () {
        var self = this;
        if (self.modalInitialized()) {
            $(".modal-submit-error", self.$modal).remove();
        }
    },
    submitForm: function ($form, settings) {
        // Submit the form in the background. See core/form-submit.
        return submitForm($form[0], settings);
    },
    init: function () {
        import("./modal.scss");

        var self = this;
        self.options.loadLinksWithinModal = JSON.parse(
            self.options.loadLinksWithinModal
        );

        if (self.options.backdropOptions.closeOnEsc === true) {
            $(document).on("keydown", function (e) {
                if (self.$el.is("." + self.options.templateOptions.classActiveName)) {
                    if (e.key === "Esc") {
                        // ESC key pressed
                        self.hide();
                    }
                }
            });
        }

        $(window.parent).resize(function () {
            self.positionModal();
        });

        if (self.options.triggers) {
            $.each(self.options.triggers, function (i, item) {
                var e = item.substring(0, item.indexOf(" "));
                var selector = item.substring(item.indexOf(" "), item.length);
                $(selector || self.$el).on(e, function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    self.show();
                });
            });
        }

        if (self.$el.is("a")) {
            if (self.$el.attr("href") && !self.options.image) {
                if (
                    !self.options.target &&
                    self.$el.attr("href").substr(0, 1) === "#" &&
                    self.$el.attr("href").length > 1
                ) {
                    self.options.target = self.$el.attr("href");
                    self.options.content = "";
                }
                if (
                    !self.options.ajaxUrl &&
                    self.$el.attr("href").substr(0, 1) !== "#"
                ) {
                    self.options.ajaxUrl = function () {
                        // Resolve ``href`` attribute later, when modal is shown.
                        return self.$el.attr("href");
                    };
                }
            }
            self.$el.on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                self.show();
            });
        }
        self.initModal();
    },

    createAjaxModal: function () {
        var self = this;
        self.emit("before-ajax");
        self.loading.show();

        var ajaxUrl = self.options.ajaxUrl;
        if (typeof ajaxUrl === "function") {
            ajaxUrl = ajaxUrl.apply(self, [self.options]);
        }

        self.ajaxXHR = $.ajax({
            url: ajaxUrl,
            type: self.options.ajaxType,
        })
            .done(function (response, textStatus, xhr) {
                self.ajaxXHR = undefined;
                self.$raw = $("<div />").append($(utils.parseBodyTag(response)));
                self.emit("after-ajax", self, textStatus, xhr);
                self._show();
            })
            .fail(function (xhr, textStatus, errorStatus) {
                var options = self.options.actionOptions;
                if (textStatus === "timeout" && options.onTimeout) {
                    self.callHandler(options.onTimeout, null, [
                        self.$modal,
                        xhr,
                        errorStatus,
                    ]);
                } else if (options.onError) {
                    self.callHandler(options.onError, null, [
                        xhr,
                        textStatus,
                        errorStatus,
                    ]);
                } else {
                    window.alert(_t("There was an error loading modal."));
                    self.hide();
                }
                self.emit("linkActionError", [xhr, textStatus, errorStatus]);
            })
            .always(function () {
                self.loading.hide();
            });
    },

    createTargetModal: function () {
        var self = this;
        self.$raw = $(self.options.target).clone();
        self._show();
    },

    createBasicModal: function () {
        var self = this;
        self.$raw = $("<div/>").html(self.$el.clone());
        self._show();
    },

    createHtmlModal: function () {
        var self = this;
        var $el = $(self.options.html);
        self.$raw = $el;
        self._show();
    },

    createImageModal: function () {
        var self = this;
        self.$wrapper.addClass("image-modal");
        var src = self.$el.attr("href");
        var srcset = self.$el.attr("data-modal-srcset") || "";
        var title = $.trim(self.$el.text()) || "Image";
        // XXX aria?
        self.$raw = $(
            "<div><h1>" +
            title +
            '</h1><div id="content"><div class="modal-image"><img src="' +
            src +
            '" srcset="' +
            srcset +
            '" /></div></div></div>'
        );
        self._show();
    },

    initModal: function () {
        var self = this;
        if (self.options.ajaxUrl) {
            self.createModal = self.createAjaxModal;
        } else if (self.options.target) {
            self.createModal = self.createTargetModal;
        } else if (self.options.html) {
            self.createModal = self.createHtmlModal;
        } else if (self.options.image) {
            self.createModal = self.createImageModal;
        } else {
            self.createModal = self.createBasicModal;
        }
    },

    findPosition: function (
        horpos,
        vertpos,
        margin,
        modalWidth,
        modalHeight,
        wrapperInnerWidth,
        wrapperInnerHeight
    ) {
        var returnpos = {};
        var absTop, absBottom, absLeft, absRight;

        // -- HORIZONTAL POSITION -----------------------------------------------
        if (horpos === "left") {
            absLeft = margin + "px";
            // if the width of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the left to simply be 0
            if (modalWidth > wrapperInnerWidth) {
                absLeft = "0px";
            }
            returnpos.left = absLeft;
        } else if (horpos === "right") {
            absRight = margin + "px";
            // if the width of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the right to simply be 0
            if (modalWidth > wrapperInnerWidth) {
                absRight = "0px";
            }
            returnpos.right = absRight;
            returnpos.left = "auto";
        }
        // default, no specified location, is to center
        else {
            absLeft = wrapperInnerWidth / 2 - modalWidth / 2 - margin + "px";
            // if the width of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the left to simply be 0
            if (modalWidth > wrapperInnerWidth) {
                absLeft = "0px";
            }
            returnpos.left = absLeft;
        }

        // -- VERTICAL POSITION -------------------------------------------------
        if (vertpos === "top") {
            absTop = margin + "px";
            // if the height of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the top to simply be 0
            if (modalHeight > wrapperInnerHeight) {
                absTop = "0px";
            }
            returnpos.top = absTop;
        } else if (vertpos === "bottom") {
            absBottom = margin + "px";
            // if the height of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the bottom to simply be 0
            if (modalHeight > wrapperInnerHeight) {
                absBottom = "0px";
            }
            returnpos.bottom = absBottom;
            returnpos.top = "auto";
        } else {
            // default case, no specified location, is to center
            absTop = wrapperInnerHeight / 2 - modalHeight / 2 - margin + "px";
            // if the height of the wrapper is smaller than the modal, and thus the
            // screen is smaller than the modal, force the top to simply be 0
            if (modalHeight > wrapperInnerHeight) {
                absTop = "0px";
            }
            returnpos.top = absTop;
        }
        return returnpos;
    },

    modalInitialized: function () {
        var self = this;
        return self.$modal !== null && self.$modal !== undefined;
    },

    _isInsideModal: function (e) {
        // Reactive controls can replace the clicked node before a click
        // handler runs. Use the event path, which is fixed at dispatch time,
        // instead of the target's current ancestry.
        return e.composedPath().some((node) =>
            node.classList?.contains(this.options.templateOptions.classModal),
        );
    },

    _consumePointerInside: function () {
        // Return if the last mousedown or mouseup happened inside the modal
        // and reset the state. A drag which starts inside the modal and ends
        // outside of it - or the other way round - results in a click event
        // outside of the modal, which must not close the modal.
        const pointer_inside = this._pointer_inside === true;
        this._pointer_inside = false;
        return pointer_inside;
    },

    activateFocusTrap: function () {
        var self = this;
        const modal_el = self.$modal[0];
        const focusable_selector = `select, input:not([type="hidden"]), textarea, button, a`;

        // Re-query visible focusable elements on each Tab press so that
        // dynamically loaded content (e.g. AJAX-loaded occurrence lists)
        // is always reachable via keyboard.
        function getVisibleInputs() {
            var bodyEl = modal_el.querySelector(
                `.${self.options.templateOptions.classBodyName}`
            );
            var footerEl = modal_el.querySelector(
                `.${self.options.templateOptions.classFooterName}`
            );
            var inputsBody = bodyEl
                ? bodyEl.querySelectorAll(focusable_selector)
                : [];
            var inputsFooter = footerEl
                ? footerEl.querySelectorAll(focusable_selector)
                : [];
            var inputs = [];
            for (const el of [...inputsBody, ...inputsFooter]) {
                if (dom.is_visible(el)) {
                    inputs.push(el);
                }
            }
            if (inputs.length === 0) {
                inputs = [...modal_el.querySelectorAll(".modal-title")];
            }
            return inputs;
        }

        var closeInput = modal_el.querySelector(".modal-close");

        // Remove previous focus trap listener to prevent duplicates
        // when activateFocusTrap is called multiple times (e.g. redraw).
        if (self._focusTrapHandler) {
            modal_el.removeEventListener("keydown", self._focusTrapHandler);
        }
        self._focusTrapHandler = (e) => {
            if (e.key === "Tab") {
                e.preventDefault();

                var inputs = getVisibleInputs();
                var firstInput = inputs.length !== 0 ? inputs[0] : null;
                var lastInput = inputs.length !== 0 ? inputs[inputs.length - 1] : null;
                var target = e.target;
                var currentIndex = inputs.indexOf(target);
                if (currentIndex >= 0 && currentIndex < inputs.length) {
                    var nextIndex = currentIndex + (e.shiftKey ? -1 : 1);
                    if (nextIndex < 0 || nextIndex >= inputs.length) {
                        closeInput.focus();
                    } else {
                        inputs[nextIndex].focus();
                    }
                } else if (e.shiftKey && lastInput) {
                    lastInput.focus();
                } else if (firstInput) {
                    firstInput.focus();
                }
            }
        };
        modal_el.addEventListener("keydown", self._focusTrapHandler);

        // Remove previous close on click listener to prevent duplicates
        // when activateFocusTrap is called multiple times.
        if (self._closeOnClickHandler) {
            modal_el.removeEventListener("click", self._closeOnClickHandler);
            self._closeOnClickHandler = null;
        }
        if (self.options.backdropOptions.closeOnClick === true) {
            self._closeOnClickHandler = (e) => {
                const pointer_inside = self._consumePointerInside();
                if (!pointer_inside && !self._isInsideModal(e)) {
                    self.hide();
                }
            };
            modal_el.addEventListener("click", self._closeOnClickHandler);
        }

        var inputs = getVisibleInputs();
        var firstInput = inputs.length !== 0 ? inputs[0] : null;
        if (firstInput && ["INPUT", "SELECT", "TEXTAREA"].includes(firstInput.nodeName)) {
            // autofocus first element when opening a modal with a form
            firstInput.focus();
        }
    },

    positionModal: function () {
        /* re-position modal at any point.
         *
         * Uses:
         *  options.margin
         *  options.width
         *  options.height
         *  options.position
         */
        var self = this;
        // modal isn't initialized
        if (!self.modalInitialized()) {
            return;
        }
        // clear out any previously set styling
        self.$modal.removeAttr("style");

        // if backdrop wrapper is set on body, then wrapper should have height of
        // the window, so we can do scrolling of inner wrapper
        if (self.$wrapper.parent().is("body")) {
            self.$wrapper.height($(window.parent).height());
        }

        var margin =
            typeof self.options.margin === "function"
                ? self.options.margin()
                : self.options.margin;
        let modalCss = {
            position: "absolute",
        };
        if (margin !== "0") {
            modalCss["padding"] = margin;
        }
        self.$modal.css(modalCss);
        self.$modalDialog.css({
            // margin: "0",
            // padding: "0",
            width: self.options.width, // defaults to "", which doesn't override other css
            height: self.options.height, // defaults to "", which doesn't override other css
        });
        self.$modalContent.css({
            width: self.options.width, // defaults to "", which doesn't override other css
        });

        var posopt = self.options.position.split(" "),
            horpos = posopt[0],
            vertpos = posopt[1];
        var modalWidth = self.$modalDialog.outerWidth(true);
        var modalHeight = self.$modalDialog.outerHeight(true);
        var wrapperInnerWidth = self.$wrapperInner.width();
        var wrapperInnerHeight = self.$wrapperInner.height();
        var pos = self.findPosition(
            horpos,
            vertpos,
            margin,
            modalWidth,
            modalHeight,
            wrapperInnerWidth,
            wrapperInnerHeight
        );
        for (var key in pos) {
            self.$modalDialog.css(key, pos[key]);
        }
    },

    render: function (options) {
        var self = this;
        self.emit("render");
        self.options.render.apply(self, [options]);
        self.emit("rendered");
    },

    show: function () {
        var self = this;
        self.backdrop = self.createBackdrop();
        self.createModal();
    },

    createBackdrop: function () {
        var self = this,
            backdrop = new Backdrop(
                self.$el.parents(self.options.backdrop),
                self.options.backdropOptions
            ),
            zIndex = self.options.backdropOptions.zIndex || 1041;

        $(self.options.zIndexSelector).each(function () {
            zIndex = Math.max(zIndex, parseInt($(this).css("zIndex")) + 1 || 1041);
        });

        self.$wrapper = $("<div/>")
            .hide()
            .css({
                "z-index": zIndex,
                "overflow-y": "auto",
                "position": "fixed",
                "height": "100%",
                "width": "100%",
                "bottom": "0",
                "left": "0",
                "right": "0",
                "top": "0",
            })
            .addClass(self.options.templateOptions.classWrapperName)
            .insertBefore(backdrop.$backdrop)
            .on("click", function (e) {
                // Clicks from within the modal are handled by the modal's own
                // close on click handler. Do not cancel or handle them here.
                // With loadLinksWithinModal: false they bubble up to here.
                const modal_el = self.$modal?.[0];
                if (modal_el) {
                    // jQuery triggered events have no originalEvent and no
                    // event path. Their target is still connected, though.
                    const path = e.originalEvent?.composedPath();
                    const from_modal = path
                        ? path.includes(modal_el)
                        : modal_el.contains(e.target);
                    if (from_modal) {
                        return;
                    }
                }
                if (self.options.backdropOptions.closeOnClick) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!self._consumePointerInside()) {
                        backdrop.hide();
                    }
                }
            });
        // Track the pointer state in the capture phase. Controls within the
        // modal which stop the propagation of mousedown or mouseup - like
        // select2 - would otherwise hide the event from the wrapper.
        // Native listeners do not receive jQuery triggered events.
        const wrapper_el = self.$wrapper[0];
        wrapper_el.addEventListener(
            "mousedown",
            (e) => {
                self._pointer_inside = self._isInsideModal(e);
            },
            { capture: true },
        );
        wrapper_el.addEventListener(
            "mouseup",
            (e) => {
                // Keep the state from mousedown and add the mouseup state.
                if (self._isInsideModal(e)) {
                    self._pointer_inside = true;
                }
            },
            { capture: true },
        );
        backdrop.on("hidden", function () {
            if (
                self.$modal !== undefined &&
                self.$modal.hasClass(self.options.templateOptions.classActiveName)
            ) {
                self.hide();
            }
        });
        self.loading = new utils.Loading({
            backdrop: backdrop,
        });
        self.$wrapperInner = $("<div/>")
            .addClass(self.options.classWrapperInnerName)
            .css({
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                top: "0",
            })
            .appendTo(self.$wrapper);
        return backdrop;
    },

    _show: function () {
        var self = this;
        self.render.apply(self, [self.options]);
        self.emit("show");
        self.backdrop.show();
        self.$wrapper.show();
        self.loading.hide();
        self.$el.addClass(self.options.templateOptions.classActiveName);
        self.$modal.addClass(self.options.templateOptions.classActiveName);
        registry.scan(self.$modal);
        self.positionModal();
        $(window.parent).on("resize.plone-modal.patterns", function () {
            self.positionModal();
        });
        $("body").addClass("modal-open");
        self.emit("shown");
        self.activateFocusTrap();
    },
    hide: function () {
        var self = this;
        if (self.ajaxXHR) {
            self.ajaxXHR.abort();
        }
        self.emit("hide");
        if (self._suppressHide) {
            if (!window.confirm(self._suppressHide)) {
                return;
            }
            // Confirmed. Do not ask again on the next close.
            self._suppressHide = undefined;
        }
        self.loading.hide();
        self.$el.removeClass(self.options.templateOptions.classActiveName);
        if (self.$modal !== undefined) {
            // Remove the active class before hiding the backdrop. Otherwise
            // the backdrop's "hidden" handler would call hide() again.
            self.$modal.removeClass(self.options.templateOptions.classActiveName);
            self.$modal.remove();
            self.initModal();
        }
        self.$wrapper.remove();
        const template_options = self.options.templateOptions;
        const open_modal = `.modal.${template_options.classActiveName}`;
        // Keep the backdrop while another modal on the same backdrop element
        // is open. Their wrappers are direct children of that element.
        const other_wrappers = self.backdrop.$el.children(
            `.${template_options.classWrapperName}`,
        );
        if (other_wrappers.find(open_modal).length < 1) {
            self.backdrop.hide();
        }
        if ($(open_modal, $("body")).length < 1) {
            $("body").removeClass("modal-open");
            $(window.parent).off("resize.plone-modal.patterns");
        }
        self.emit("hidden");
        self.$el.focus();
    },

    redraw: function (response, options) {
        var self = this;
        self.emit("beforeDraw");
        self.$modal.remove();
        self.$raw = $("<div />").append($(utils.parseBodyTag(response)));
        self.render.apply(self, [options || self.options]);
        self.$modal.addClass(self.options.templateOptions.classActiveName);
        self.positionModal();
        registry.scan(self.$modal);
        self.emit("afterDraw");
        self.activateFocusTrap();
    },
});
