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

        this.queryHelper = utils.QueryHelper({
            attributes: this.view.options.queryHelperAttributes,
            ...this.view.options
        });

        this.queryParser = function (options) {
            if (options === undefined) {
                options = {};
            }
            const term = this.view?.toolbar?.get?.("filter")?.term || null;
            const sortOn = this.view?.sort_on || "getObjPositionInParent";
            const sortOrder = this.view.sort_order;

            return JSON.stringify({
                criteria: this.queryHelper.getCriterias(
                    term, {
                        additionalCriterias: this.view.additionalCriterias,
                        ...options,
                    }),
                sort_on: sortOn,
                sort_order: sortOrder,
            });
        };

        // check and see if a hash is provided for initial path
        if (window.location.hash.substring(0, 2) === "#/") {
            this.queryHelper.currentPath = window.location.hash.substring(1);
        }

        Backbone.PageableCollection.prototype.initialize.apply(this, [models, options]);
    },

    getCurrentPath: function () {
        return this.queryHelper.getCurrentPath();
    },

    setCurrentPath: function (path) {
        this.queryHelper.currentPath = path;
    },

    // query parameters passed directly (currently GET
    // parameters).  These are currently generated using following
    // functions.
    queryParams: {
        query: function () {
            return this.queryParser();
        },
        batch: function () {
            this.queryHelper.options.batchSize = this.state.pageSize;
            return JSON.stringify(this.queryHelper.getBatch(this.state.currentPage));
        },
        attributes: function () {
            return JSON.stringify(this.queryHelper.options.attributes);
        },
    },

    parseState: function (response, queryParams, state, options) {
        this.state.totalRecords = response.total;
        this.state.totalPages = Math.ceil(response.total / state.pageSize);
    },

    parseRecords: function (response, options) {
        const results = response.results;
        // Manually set sort order here since backbone will otherwise do arbitrary sorting
        results.forEach((item, idx) => {
            item._sort = idx;
        });
        return results;
    },
});
