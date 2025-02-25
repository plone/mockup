import $ from "jquery";
import _ from "underscore";
import PopoverView from "../../../../core/ui/views/popover";
import utils from "../../../../core/utils";
import ItemTemplate from "../../templates/selection_item.xml";
import Actions from "../actions";
import _t from "../../../../core/i18n-wrapper";

export default PopoverView.extend({
    className: "popover change-selection",


    title: _t("Change selection"),

    content: _.template(
        '<div class="list-group">' +
        '<a href="#" class="list-group-item list-group-item-action select-all"><%= selectAllIcon %> <%- _t("Select all items in the folder") %></a>' +
        '<a href="#" class="list-group-item list-group-item-action select-all-visible"><%= selectPageIcon %> <%- _t("Select all items on this page") %></a>' +
        '<a href="#" class="list-group-item list-group-item-action remove-all"><%= removeIcon %> <%- _t("Cancel selection") %></a>' +
        '</div>'
    ),

    events: {
        "click .select-all": "selectAll",
        "click .select-all-visible": "selectVisible",
        "click .remove-all": "removeAll",
    },

    initialize: function (options) {
        PopoverView.prototype.initialize.apply(this, [options]);
        let timeout = 0;
        this.listenTo(this.collection, "reset all add remove", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.render();
            }, 50);
        });
        this.options["item_template"] = _.template(ItemTemplate);
    },

    render: async function () {
        this.options["removeIcon"] = await utils.resolveIcon("x-circle");
        this.options["selectAllIcon"] = await utils.resolveIcon("check2-all");
        this.options["selectPageIcon"] = await utils.resolveIcon("check2");
        PopoverView.prototype.render.call(this);
        if (this.collection.length === 0) {
            this.$el.removeClass("active");
        }
        return this;
    },
    selectAll: function (e) {
        // use the actions module as it has a handy "selectAll" method
        const actions = new Actions({
            app: this.options.app,
            model: {
                attributes: this.options.app.options,
            },
            selectedCollection: this.options.collection,
        });
        actions.selectAll(e);
        this.options.app.tableView.setContextInfo();
        this.hide();
    },
    selectVisible: function (e) {
        e.preventDefault();
        this.collection.reset();
        $('input[type="checkbox"]', this.app.tableView.$('tbody')).prop('checked', true).change();
        this.hide();
    },
    removeAll: function (e) {
        e.preventDefault();
        this.collection.reset();
        this.hide();
    },
});
