import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import I18n from "../../core/i18n";
import utils from "../../core/utils";

export default Base.extend({
    name: "select2",
    trigger: ".pat-select2",
    parser: "mockup",
    defaults: {
        separator: ",",
        ajaxTimeout: 300,
    },

    initializeValues() {
        // Init Selection ---------------------------------------------
        if (this.options.initialValues) {
            this.options.id = (term) => {
                return term.id;
            };
            this.options.initSelection = ($el, callback) => {
                const data = [];
                const value = $el.val();
                let seldefaults = this.options.initialValues;

                // Create the initSelection value that contains the default selection,
                // but in a javascript object
                if (
                    typeof this.options.initialValues === "string" &&
                    this.options.initialValues !== ""
                ) {
                    // if default selection value starts with a '{', then treat the value as
                    // a JSON object that needs to be parsed
                    if (this.options.initialValues[0] === "{") {
                        seldefaults = JSON.parse(this.options.initialValues);
                    }
                    // otherwise, treat the value as a list, separated by the defaults.separator value of
                    // strings in the format "id:text", and convert it to an object
                    else {
                        seldefaults = {};
                        const initial_values = $(
                            this.options.initialValues.split(this.options.separator)
                        );
                        for (const it of initial_values) {
                            const selection = it.split(":");
                            const id = selection[0].trim();
                            const text = selection[1].trim();
                            seldefaults[id] = text;
                        }
                    }
                }

                const items = $(value.split(this.options.separator));
                for (const it of items) {
                    let text = it;
                    if (seldefaults[it]) {
                        text = seldefaults[it];
                    }
                    data.push({
                        id: utils.removeHTML(it),
                        text: utils.removeHTML(text),
                    });
                }
                callback(data);
            };
        }
    },

    initializeTags() {
        if (this.options.tags && typeof this.options.tags === "string") {
            if (this.options.tags.substr(0, 1) === "[") {
                this.options.tags = JSON.parse(this.options.tags);
            } else {
                this.options.tags = this.options.tags.split(this.options.separator);
            }
        }

        if (this.options.tags && !this.options.allowNewItems) {
            this.options.data = this.options.tags.map((value) => {
                return { id: value, text: value };
            });
            this.options.multiple = true;
            delete this.options.tags;
        }
    },

    async initializeOrdering() {
        if (!this.options.orderable) {
            return;
        }
        const Sortable = (await import("sortablejs")).default;
        const _initializeOrdering = () => {
            const sortable_el = this.$select2[0].querySelector(".select2-choices");
            new Sortable(sortable_el, {
                draggable: "li",
                dragClass: "select2-choice-dragging",
                chosenClass: "dragging",
                onStart: () => this.$el.select2("onSortStart"),
                onEnd: () => this.$el.select2("onSortEnd"),
            });
        };
        this.$el.on("change", _initializeOrdering.bind(this));
        _initializeOrdering();
    },

    async initializeSelect2() {
        import("select2/select2.css");
        import("./select2.scss");
        await import("select2");
        try {
            // Don't load "en" which is the default where no separate language file exists.
            if (this.options.language && this.options.language !== "en" && !this.options.language.startsWith("en")) {
                var lang = this.options.language;
                // Fix for country specific languages
                if (lang.split("-").length > 1) {
                    lang =
                        lang.split("-")[0] +
                        "-" +
                        lang.split("-")[1].toUpperCase();
                }         
                await import(`select2/select2_locale_${lang}`);
            }
        } catch {
            console.warn("Language file could not be loaded", this.options.language);
        }

        this.options.formatResultCssClass = (ob) => {
            if (ob.id) {
                return (
                    "select2-option-" +
                    ob.id.toLowerCase().replace(/[ \:\)\(\[\]\{\}\_\+\=\&\*\%\#]/g, "-")
                );
            }
        };

        function callback(action, e) {
            if (action) {
                if (this.options.debug) {
                    console.debug("callback", action, e);
                }
                if (typeof action === "string") {
                    action = window[action];
                }
                return action(e);
            } else {
                return action;
            }
        }

        this.$el.select2(this.options);
        this.$el.on("select2-selected", (e) => callback(this.options.onSelected, e));
        this.$el.on("select2-selecting", (e) => callback(this.options.onSelecting, e));
        this.$el.on("select2-deselecting", (e) =>
            callback(this.options.onDeselecting, e)
        );
        this.$el.on("select2-deselected", (e) => callback(this.options.onDeselected, e));
        this.$select2 = this.$el.parent().find(".select2-container");
        this.$el.parent().off("close.plone-modal.patterns");
        if (this.options.orderable) {
            this.$select2.addClass("select2-orderable");
        }
    },

    opened() {
        const isOpen = $(".select2-dropdown-open", this.$el.parent()).length === 1;
        return isOpen;
    },

    async init() {
        const i18n = new I18n();
        this.options.language = i18n.currentLanguage;
        this.options.allowNewItems = this.options.allowNewItems
            ? JSON.parse(this.options.allowNewItems)
            : true;

        // TODO: Select2 respects the select fields multiple attribute.
        //       Currently, only when multiple is set in the pattern options
        //       the replacement to a hidden input field is done.
        //       A collection's querystring widget has the multiple attribute
        //       but must not be replaced with a hidden inout, otherwise robot
        //       tests fail.
        //if (this.el.hasAttribute("multiple")) {
        //    this.options.multiple = true;
        //}

        if (this.options.ajax || this.options.vocabularyUrl) {
            if (this.options.vocabularyUrl) {
                this.options.multiple =
                    this.options.multiple === undefined ? true : this.options.multiple;
                this.options.ajax = this.options.ajax || {};
                this.options.ajax.url = this.options.vocabularyUrl;
                // XXX removing the following function does'nt break tests. dead code?
                this.options.initSelection = ($el, callback) => {
                    const data = [];
                    const value = $el.val();
                    for (const val of value.split(this.options.separator)) {
                        const _val = utils.removeHTML(val);
                        data.push({ id: _val, text: _val });
                    }
                    callback(data);
                };
            }

            let queryTerm = "";

            const ajaxTimeout = parseInt(this.options.ajaxTimeout || 300, 10);
            delete this.options.ajaxTimeout;
            this.options.ajax = $.extend(
                {
                    quietMillis: ajaxTimeout,
                    data: (term, page) => {
                        queryTerm = term;
                        return {
                            query: term,
                            page_limit: 10,
                            page: page,
                        };
                    },
                    results: (data) => {
                        let results = data.results;
                        if (this.options.vocabularyUrl) {
                            const dataIds = [];
                            for (const it of data.results) {
                                dataIds.push(it.id);
                            }
                            results = [];

                            const haveResult =
                                queryTerm === "" || dataIds.includes(queryTerm);
                            if (this.options.allowNewItems && !haveResult) {
                                queryTerm = utils.removeHTML(queryTerm);
                                results.push({
                                    id: queryTerm,
                                    text: queryTerm,
                                });
                            }

                            for (const it of data.results) {
                                results.push(it);
                            }
                        }
                        return { results: results };
                    },
                },
                this.options.ajax
            );
        } else if (this.options.multiple && this.$el.is("select")) {
            // Multiselects are converted to input[type=hidden] for Select2
            // TODO: This should actually not be necessary.
            //       This is kept for backwards compatibility but should be
            //       re-checked and removed if possible.
            this.$el.attr("multiple", true);
            const vals = this.$el.val() || [];
            const options = [...this.el.querySelectorAll("option")].map((it) => {
                return { text: it.innerHTML, id: it.value };
            });

            const el = document.createElement("input");
            el.type = "hidden";
            el.value = vals.join(this.options.separator);
            el.className = this.el.getAttribute("class");
            el.name = this.el.name;
            el.id = this.el.id;
            this.el.after(el);
            this.el.remove();
            this.el = el;
            this.$el = $(el);

            this.options.data = options;
        }
        this.initializeValues();
        this.initializeTags();
        await this.initializeSelect2();
        await this.initializeOrdering();
    },
});
