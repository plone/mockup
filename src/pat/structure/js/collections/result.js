import $ from "jquery";
import Backbone from "backbone";
import Result from "../models/result";
import utils from "../../../../core/utils";
import "backbone.paginator";

export default Backbone.PageableCollection.extend({
    model: Result,
    mode: "server",

    initialize: function (models, options) {
        this.options = options;
        this.view = options.view;
        this.url = options.url;

        this.queryHelper = utils.QueryHelper(
            $.extend(true, {}, this.view.options, {
                attributes: this.view.options.queryHelperAttributes,
            })
        );

        this.queryParser = function (options) {
            if (options === undefined) {
                options = {};
            }
            const term = this.view?.toolbar?.get?.("filter")?.term || null;
            const sortOn = this.view.sort_on || "getObjPositionInParent";
            const sortOrder = this.view.sort_order;

            return JSON.stringify({
                criteria: this.queryHelper.getCriterias(
                    term,
                    $.extend({}, options, {
                        additionalCriterias: this.view.additionalCriterias,
                    })
                ),
                sort_on: sortOn,
                sort_order: sortOrder,
            });
        };

        // check and see if a hash is provided for initial path
        if (window.location.hash.substring(0, 2) === "#/") {
            this.queryHelper.currentPath = window.location.hash.substring(1);
        }

        Backbone.PageableCollection.prototype.initialize.apply(this, [
            models,
            options,
        ]);
    },

    getCurrentPath: function () {
        return this.queryHelper.getCurrentPath();
    },

    setCurrentPath: function (path) {
        this.queryHelper.currentPath = path;
    },

    state: {
        // the lowest page index your API allows to be accessed
        firstPage: 1,
        // which page should the paginator start from
        // (also, the actual page the paginator is on)
        currentPage: 1,
        // how many items per page should be shown
        pageSize: 15,
    },

    // query parameters passed directly (currently GET
    // parameters).  These are currently generated using following
    // functions.
    queryParams: {
        query: function () {
            return this.queryParser();
        },
        batch: function () {
            this.queryHelper.options.batchSize = this.pageSize;
            return JSON.stringify(this.queryHelper.getBatch(this.currentPage));
        },
        attributes: function () {
            return JSON.stringify(this.queryHelper.options.attributes);
        },
    },

    parse: function (response, options) {
        this.state.totalRecords = response.total;
        return response.results;
    },
});
