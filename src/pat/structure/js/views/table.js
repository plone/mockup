import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import events from "@patternslib/patternslib/src/core/events";
import registry from "@patternslib/patternslib/src/core/registry";
import BaseView from "../../../../core/ui/views/base";
import TableRowView from "./tablerow";
import TableTemplate from "../../templates/table.xml";
import Sortable from "../../../sortable/sortable";
import "../../../datatables/datatables";
import "bootstrap/js/src/alert";
import utils from "../../../../core/utils";
import patternslib_utils from "@patternslib/patternslib/src/core/utils";

export default BaseView.extend({
    tagName: "div",
    template: _.template(TableTemplate),
    tableSortable: null,

    initialize: function (options) {
        var self = this;
        BaseView.prototype.initialize.apply(self, [options]);
        self.collection = self.app.collection;
        self.selectedCollection = self.app.selectedCollection;
        self.subsetIds = [];
        self.contextInfo = null;
        self.tableSortable = null;

        // init events
        self.listenTo(self.collection, "sync", self.render);
        self.listenTo(self.selectedCollection, "remove", self.render);
        self.listenTo(self.selectedCollection, "reset", self.render);

        $("body").on("context-info-loaded", (event, data) => {
            self.contextInfo = data;
            /* set default page info */
            self.setContextInfo();
        });

        self.dateColumns = [
            "ModificationDate",
            "EffectiveDate",
            "CreationDate",
            "ExpirationDate",
            "start",
            "end",
            "last_comment_date",
        ];

        self.translatableColumns = ["review_state"];
    },

    events: {
        "click .fc-breadcrumbs a": "breadcrumbClicked",
        "change .select-all": "selectAll",
    },

    setContextInfo: function () {
        const data = this.contextInfo;
        /* set breadcrumb title info */
        const crumbs = data && data.breadcrumbs;
        if (crumbs && crumbs.length) {
            const $crumbs = this.$(".fc-breadcrumbs a.crumb");
            _.each(crumbs, (crumb, idx) => {
                $crumbs.eq(idx).html(patternslib_utils.escape_html(crumb.title));
            });
        }
        this.trigger("context-info:set");
    },

    render: async function () {
        // By default do not start sorted by any column
        // Ignore first column and the last one (activeColumns.length + 1)
        // Do not show paginator, search or information, we only want column sorting
        const datatables_options = {
            order: [0, "asc"],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, this.app.activeColumns.length + 1],
                },
            ],
            paging: false,
            searching: false,
            info: false,
            ...this.app.options.datatables_options,
        };

        this.$el.html(
            this.template({
                _t: _t,
                homeIcon: await utils.resolveIcon("house"),
                pathParts: this.app
                    .getCurrentPath()
                    .split("/")
                    .slice(1)
                    .filter((val) => {
                        return val.length > 0;
                    }),
                activeColumns: this.app.activeColumns,
                availableColumns: this.app.availableColumns,
                datatables_options: JSON.stringify(datatables_options),
            })
        );

        if (this.collection.length) {
            const container = $("tbody", this.$el);

            const collection_length = this.collection.length;
            let collection_cnt = 0;

            this.collection.each(async (result) => {
                this.dateColumns.map((col) => {
                    // empty column instead of displaying "None".
                    if (
                        Object.prototype.hasOwnProperty.call(result.attributes, col) &&
                        (result.attributes[col] === "None" || !result.attributes[col])
                    ) {
                        result.attributes[col] = "";
                    }
                });

                const view = new TableRowView({
                    model: result,
                    app: this.app,
                    table: this,
                });
                await view.render();
                container.append(view.el);

                // Throw the ``table_row_rendering_finished`` event after all table rows have finished rendering.
                collection_cnt++;
                if (collection_cnt === collection_length) {
                    this.el.dispatchEvent(new Event("table_row_rendering_finished"));
                }
            });

            // NOTE: this is based on the concept of awaiting an event.
            // See this Stackoverflow answer here:

            // https://stackoverflow.com/a/44746691/1337474
            // When the last table row has finished rendering, throw an event.
            // For this "table_row_rendering_finished" event we're a-waiting for.
            // And after that we can scan the table.
            const table_row_rendering_finished = () =>
                new Promise((resolve) =>
                    events.add_event_listener(
                        this.el,
                        "table_row_rendering_finished",
                        "table_row_rendering_finished__listener",
                        resolve,
                        { once: true }
                    )
                );

            await table_row_rendering_finished();
            events.remove_event_listener = (this.el, "table_row_rendering_finished__listener"); // prettier-ignore
            registry.scan(this.$el);
        }

        this.$el
            .find("table")
            .on("init.dt", () => {
                // Add reordering action by drag and drop
                if (this.app.options.moveUrl) {
                    this.addReordering();
                }
                // store Order of nativ sorting for move action
                this.storeOrder();
            })
            .on("order.dt", (e, settings, ordArr) => {
                // prevent message from showing for nativ order
                if (ordArr.length === 1) {
                    const order = ordArr[0];
                    if (order.col === 0 && order.dir === "asc") {
                        if (this.tableSortable) {
                            this.tableSortable.enableSort();
                        }
                        // Clear the status message
                        this.app.clearStatus("sorting_dndreordering_disabled");
                        return;
                    }
                }
                const e_target = e.target;
                const btn = $(
                    '<button type="button" class="btn btn-danger btn-sm"></button>'
                )
                    .text(_t("Reset column sorting"))
                    .on("click", () => {
                        // Use column 0 to restore ordering and then empty list so it doesn't
                        // show the icon in the column header
                        const api = $(e_target).dataTable().api();
                        api.order([0, "asc"]);
                        api.draw();
                    });
                this.app.setStatus(
                    {
                        text: _t("Notice: Drag and drop reordering is disabled when viewing the contents sorted by a column."), // prettier-ignore
                        type: "warning",
                    },
                    btn,
                    false,
                    "sorting_dndreordering_disabled"
                );
                if (this.tableSortable) {
                    this.tableSortable.disableSort();
                }
                this.$el.removeClass("order-support");
            });

        return this;
    },

    breadcrumbClicked: function (e) {
        e.preventDefault();
        let $el = $(e.target);
        if ($el[0].tagName !== "A") {
            $el = $el.parent("a");
        }
        let path = "";
        for (const item of $($el.prevAll("a").get().reverse())) {
            let part = $(item).attr("data-path");
            path += part;
            if (part !== "/") {
                path += "/";
            }
        }
        path += $el.attr("data-path");
        this.app.setCurrentPath(path);
        this.app.collection.getPage(this.app.collection.state.firstPage);
    },

    selectAll: function (e) {
        if ($(e.target).is(":checked")) {
            $('input[type="checkbox"]', this.$("tbody")).prop("checked", true).trigger("change");
        } else {
            /* delaying the re-rendering is much faster in this case */
            this.selectedCollection.remove(this.collection.models, {
                silent: true,
            });
            this.selectedCollection.trigger("remove");
        }
        this.setContextInfo();
    },
    toggleSelectAll: function (e) {
        const $el = $(e.target);
        if (!$el.is(":checked")) {
            this.$(".select-all").prop("checked", false);
        }
    },

    addReordering: function () {
        // if we have a custom query going on, we do not allow sorting.
        if (this.app.inQueryMode()) {
            this.$el.removeClass("order-support");
            return;
        }
        this.$el.addClass("order-support");
        this.tableSortable = new Sortable(this.$("tbody"), {
            selector: "tr",
            createDragItem: (pattern, $el) => {
                const $tr = $el.clone();
                const $table = $("<table><tbody></tbody></table>");
                $("tbody", $table).append($tr);
                $table
                    .addClass("structure-dragging")
                    .css({ opacity: 0.85, position: "absolute" });
                $table.width($el.width());
                $table.height($el.height());
                $table.appendTo(document.body);
                return $table;
            },
            drop: ($el, delta) => {
                if (delta !== 0) {
                    this.app.moveItem($el.attr("data-id"), delta, this.subsetIds);
                    this.storeOrder();
                }
            },
        });
    },

    storeOrder: function () {
        const subsetIds = [];
        this.$("tbody tr.itemRow").each(function () {
            subsetIds.push($(this).attr("data-id"));
        });
        this.subsetIds = subsetIds;
    },
});
