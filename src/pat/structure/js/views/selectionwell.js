import $ from "jquery";
import _ from "underscore";
import PopoverView from "../../../../core/ui/views/popover";
import utils from "../../../../core/utils";
import ItemTemplate from "../../templates/selection_item.xml";

export default PopoverView.extend({
    className: "popover selected-items",

    title: _.template(
        '<input type="text" class="filter" placeholder="<%- _t("Filter") %>" />' +
            '<a href="#" class=" remove-all">' +
            '<%= removeIcon %> <%- _t("remove all") %></a>'
    ),

    content: _.template(
        "<% collection.each(function(item) { %>" +
            "<%= item_template($.extend({'removeIcon': removeIcon}, item.toJSON())) %>" +
            "<% }); %>"
    ),

    events: {
        "click a.remove": "itemRemoved",
        "keyup input.filter": "filterSelected",
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
        PopoverView.prototype.render.call(this);
        if (this.collection.length === 0) {
            this.$el.removeClass("active");
        }
        return this;
    },

    itemRemoved: function (e) {
        e.preventDefault();
        const uid = $(e.currentTarget).data("uid");
        this.collection.removeByUID(uid);
        if (this.collection.length !== 0) {
            // re-rendering causes it to close, reopen
            this.show();
        }
    },

    filterSelected: function (e) {
        const val = $(e.target).val().toLowerCase();
        for (const item of $(".selected-item", this.$el)) {
            const $el = $(item);
            if ($el.text().toLowerCase().indexOf(val) === -1) {
                $el.hide();
            } else {
                $el.show();
            }
        }
    },

    removeAll: function (e) {
        e.preventDefault();
        this.collection.reset();
        this.hide();
    },
});
