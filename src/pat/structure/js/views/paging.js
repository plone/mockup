import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import Backbone from "backbone";
import PagingTemplate from "../../templates/paging.xml";
import logging from "@patternslib/patternslib/src/core/logging";

const log = logging.getLogger("pat-structure/table");
log.setLevel("DEBUG");

export default Backbone.View.extend({
    events: {
        "click a.servernext": "nextResultPage",
        "click a.serverprevious": "previousResultPage",
        "click a.serverlast": "gotoLast",
        "click a.page": "gotoPage",
        "click a.serverfirst": "gotoFirst",
        "click a.serverpage": "gotoPage",
        "click .serverhowmany a": "changeCount",
    },

    tagName: "aside",
    template: _.template(PagingTemplate),
    maxPages: 7,

    initialize: function (options) {
        this.options = options;
        this.app = this.options.app;
        this.collection = this.app.collection;
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "sync", this.render);
    },

    render: function () {
        const data = this.collection.state;
        data.pages = this.getPages(data);
        const html = this.template(
            $.extend(
                {
                    _t: _t,
                },
                data
            )
        );

        this.$el.html(html);
        return this;
    },

    getPages: function (data) {
        const totalPages = data.totalPages;
        if (!totalPages) {
            return [];
        }
        let left = 1;
        let right = totalPages;
        if (totalPages > this.maxPages) {
            left = Math.max(1, Math.floor(data.currentPage - this.maxPages / 2));
            right = Math.min(left + this.maxPages, totalPages);
            if (right - left < this.maxPages) {
                left = left - Math.floor(this.maxPages / 2);
            }
        }
        let pages = [];
        for (let i = left; i <= right; i = i + 1) {
            pages.push(i);
        }

        /* add before and after */
        if (pages[0] > 1) {
            if (pages[0] > 2) {
                pages = ["..."].concat(pages);
            }
            pages = [1].concat(pages);
        }
        if (pages[pages.length - 1] < totalPages - 1) {
            if (pages[pages.length - 2] < totalPages - 2) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
        return pages;
    },

    nextResultPage: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        this.collection.getNextPage();
    },

    previousResultPage: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        this.collection.getPreviousPage();
    },

    gotoFirst: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        this.collection.getPage(this.collection.state.firstPage);
    },

    gotoLast: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        this.collection.getPage(this.collection.state.totalPages);
    },

    gotoPage: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        const page = parseInt($(e.target).text());
        this.collection.getPage(page);
    },

    changeCount: function (e) {
        e.preventDefault();
        this.app.clearStatus();
        const size = parseInt($(e.target).text());
        this.collection.setPageSize(size, { first: true });
        this.app.setCookieSetting("pageSize", size);
    },
});
