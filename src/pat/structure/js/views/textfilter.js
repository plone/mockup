import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import QueryString from "../../../querystring/querystring";
import BaseView from "../../../../core/ui/views/base";
import ButtonView from "../../../../core/ui/views/button";
import PopoverView from "../../../../core/ui/views/popover";

export default BaseView.extend({
    tagName: "div",
    className: "navbar-search form-search ui-offset-parent",
    template: _.template(
        '<div class="input-group">' +
            '<input id="textFilterInput" type="text" class="form-control search-query" aria-label="<%- _t("Search") %>" placeholder="<%- _t("Search") %>">' +
        "</div>"
    ),
    popoverContent: _.template('<input class="pat-querystring" />'),
    events: {
        "keyup .search-query": "filter",
    },
    term: null,
    timeoutId: null,
    keyupDelay: 300,
    statusKeyFilter: "textfilter_status_message_filter",
    statusKeySorting: "textfilter_status_message_sorting",

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, [options]);
        this.app = this.options.app;
    },

    setFilterStatusMessage: function () {
        const clear_btn = $(
            '<button type="button" class="btn btn-primary btn-xs"></button>'
        )
            .text(_t("Clear"))
            .on("click", () => this.clearFilter());

        const statusTextFilter = _t(
            "This listing has filters applied. Not all items are shown."
        );
        this.app.setStatus(
            {
                text: statusTextFilter,
                type: "success",
            },
            clear_btn,
            true,
            this.statusKeyFilter
        );

        const statusTextSorting = _t(
            "Drag and drop reordering is disabled while filters are applied."
        );
        this.app.setStatus(
            {
                text: statusTextSorting,
                type: "warning",
            },
            null,
            true,
            this.statusKeySorting
        );
    },

    clearFilterStatusMessage: function () {
        if (!this.term && !this.app.additionalCriterias.length) {
            this.app.clearStatus(this.statusKeyFilter);
            this.app.clearStatus(this.statusKeySorting);
        }
    },

    setTerm: function (term, set_input) {
        const term_el = this.$el[0].querySelector(".search-query");
        this.term = encodeURIComponent(term);
        if (set_input) {
            term_el.value = term;
        }
        this.app.collection.currentPage = 1;
        this.app.collection.pager();

        if (term) {
            term_el.classList.add("has-filter");
            this.setFilterStatusMessage();
        } else {
            let hasquery = false;
            try {
                const qu = this.$queryString.val();
                if (qu && JSON.parse(qu).length > 0) {
                    hasquery = true;
                }
            } finally {
                if (!hasquery) {
                    term_el.classList.remove("has-filter");
                    this.clearFilterStatusMessage();
                }
            }
        }
    },

    setQuery: function (query, set_input) {
        let query_string = null;
        let query_obj = null;
        try {
            if (typeof query === "string") {
                query_obj = JSON.parse(query);
                query_string = query;
            } else {
                query_string = JSON.stringify(query);
                query_obj = query;
            }
        } catch (e) {
            query_obj = [];
            query_string = "[]";
        }

        if (set_input) {
            this.$queryString.val(query_string);
            // TODO clear query string form
            // this.queryString._init();
        }
        this.app.additionalCriterias = query_obj;
        this.app.collection.currentPage = 1;
        this.app.collection.pager();
        if (query_obj.length) {
            this.button.$el[0].classList.add("has-filter");
            this.setFilterStatusMessage();
        } else if (!this.term) {
            this.button.$el[0].classList.remove("has-filter");
            this.clearFilterStatusMessage();
        }
    },

    clearTerm: function () {
        this.setTerm("", true);
    },

    clearFilter: function () {
        this.setTerm("", true);
        this.setQuery([], true);
    },

    render: function () {
        this.$el.html(this.template({ _t: _t }));
        this.button = new ButtonView({
            title: _t("Filter"),
            icon: "filter",
            extraClasses: ["btn-queryfilter"],
        });
        this.popover = new PopoverView({
            triggerView: this.button,
            id: "structure-query",
            title: _.template(_t("Filter")),
            content: this.popoverContent,
            placement: "left",
        });
        this.$el.find(".input-group").append(this.button.render().el);
        this.$el.append(this.popover.render().el);
        this.popover.$el.addClass("query");
        this.$queryString = this.popover.$("input.pat-querystring");
        this.queryString = new QueryString(this.$queryString, {
            indexOptionsUrl: this.app.options.indexOptionsUrl,
            showPreviews: false,
        });
        this.queryString.$el.on("change", () => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                this.setQuery(this.$queryString.val(), false);
            }, this.keyupDelay);
        });
        this.queryString.$el.on("initialized", () => {
            this.queryString.$sortOn.on("change", () => {
                this.app["sort_on"] = this.queryString.$sortOn.val(); // jshint ignore:line
                this.app.collection.currentPage = 1;
                this.app.collection.pager();
            });
            this.queryString.$sortOrder.change(() => {
                if (this.queryString.$sortOrder[0].checked) {
                    this.app["sort_order"] = "reverse"; // jshint ignore:line
                } else {
                    this.app["sort_order"] = "ascending"; // jshint ignore:line
                }
                this.app.collection.currentPage = 1;
                this.app.collection.pager();
            });
        });
        return this;
    },

    filter: function (event) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            const term_el = $(event.currentTarget);
            this.setTerm(term_el.val(), false);
        }, this.keyupDelay);
    },
});
