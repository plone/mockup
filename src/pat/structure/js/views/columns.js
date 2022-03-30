import $ from "jquery";
import _ from "underscore";
import PopoverView from "../../../../core/ui/views/popover";
import Sortable from "../../../sortable/sortable";

export default PopoverView.extend({
    className: "popover attribute-columns",
    title: _.template('<%- _t("Columns") %>'),
    content: _.template(
        '<label><%- _t("Select columns to show, drag and drop to reorder") %></label>' +
            "<ul>" +
            "</ul>" +
            '<button class="btn btn-block btn-success"><%- _t("Save") %></button>'
    ),
    itemTemplate: _.template(
        "<li>" +
            "<label>" +
            '<input type="checkbox" value="<%- id %>"/>' +
            "<%- title %>" +
            "</label>" +
            "</li>"
    ),
    events: {
        "click button": "applyButtonClicked",
    },

    initialize: function (options) {
        this.app = options.app;
        PopoverView.prototype.initialize.apply(this, [options]);
    },

    afterRender: function () {
        const objKeySortCmp = (a, b) => {
            // object key sort compare function
            const ca = this.app.availableColumns[a];
            const cb = this.app.availableColumns[b];
            if (ca < cb) {
                return -1;
            } else if (ca == cb) {
                return 0;
            } else {
                return 1;
            }
        };

        this.$container = this.$("ul");

        for (const id of this.app.activeColumns) {
            const $el = $(
                this.itemTemplate({
                    title: this.app.availableColumns[id],
                    id: id,
                })
            );
            $el.find("input")[0].checked = true;
            this.$container.append($el);
        }

        const availableKeys = _.keys(
            _.omit(this.app.availableColumns, this.app.activeColumns)
        ).sort(objKeySortCmp);
        for (const id of availableKeys) {
            const $el = $(
                this.itemTemplate({
                    title: this.app.availableColumns[id],
                    id: id,
                })
            );
            this.$container.append($el);
        }

        new Sortable(this.$container, {
            selector: "li",
        });
        return this;
    },

    async applyButtonClicked() {
        this.hide();
        this.app.activeColumns = [];
        for (const inp of this.$("input:checked")) {
            this.app.activeColumns.push($(inp).val());
        }
        this.app.setCookieSetting(this.app.activeColumnsCookie, this.app.activeColumns);
        await this.app.tableView.render();
    },
});
