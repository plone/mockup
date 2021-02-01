import $ from "jquery";
import _ from "underscore";
import PopoverView from "../../../../core/ui/views/popover";
import ItemTemplate from "../../templates/selection_item.xml";

export default PopoverView.extend({
    className: "popover selected-items",
    title: _.template(
        '<input type="text" class="filter" placeholder="<%- _t("Filter") %>" />' +
            '<a href="#" class=" remove-all">' +
            '<span class="glyphicon glyphicon-remove-circle"></span> <%- _t("remove all") %></a>'
    ),
    content: _.template(
        "<% collection.each(function(item) { %>" +
            "<%= item_template(item.toJSON()) %>" +
            "<% }); %>"
    ),
    events: {
        "click a.remove": "itemRemoved",
        "keyup input.filter": "filterSelected",
        "click .remove-all": "removeAll",
    },
    initialize: function (options) {
        PopoverView.prototype.initialize.apply(this, [options]);
        var self = this;
        var timeout = 0;
        this.listenTo(this.collection, "reset all add remove", function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                self.render();
            }, 50);
        });
        this.options["item_template"] = _.template(ItemTemplate); // jshint ignore:line
    },
    render: function () {
        PopoverView.prototype.render.call(this);
        if (this.collection.length === 0) {
            this.$el.removeClass("active");
        }
        return this;
    },
    itemRemoved: function (e) {
        e.preventDefault();
        var uid = $(e.currentTarget).data("uid");
        this.collection.removeByUID(uid);
        if (this.collection.length !== 0) {
            // re-rendering causes it to close, reopen
            this.show();
        }
    },
    filterSelected: function (e) {
        var val = $(e.target).val().toLowerCase();
        $(".selected-item", this.$el).each(function () {
            var $el = $(this);
            if ($el.text().toLowerCase().indexOf(val) === -1) {
                $el.hide();
            } else {
                $el.show();
            }
        });
    },
    removeAll: function (e) {
        e.preventDefault();
        this.collection.reset();
        this.hide();
    },
});
