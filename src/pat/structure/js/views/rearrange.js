import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import PopoverView from "../../../../core/ui/views/popover";

export default PopoverView.extend({
    className: "popover rearrange",
    title: _.template('<%- _t("Rearrange items in this folder") %>'),
    content: _.template(
        '<div class="form-group">' +
            '<label><%- _t("What to rearrange on") %></label>' +
            '<select name="rearrange_on" class="form-select">' +
            "<% _.each(rearrangeProperties, function(title, property) { %>" +
            '<option value="<%- property %>"><%- title %></option>' +
            "<% }); %>" +
            "</select>" +
            '<p class="help-block">' +
            '<b><%- _t("This permanently changes the order of items in this folder. This operation may take a long time depending on the size of the folder.") %></b>' + // prettier-ignore
            "</p>" +
            "</div>" +
            '<div class="form-check">' +
            '<input class="form-check-input" type="checkbox" name="reversed" />' +
            '<label class="form-check-label"><%- _t("Reverse") %></label>' +
            "</div>" +
            '<button class="btn btn-block btn-primary btn-sm"><%- _t("Rearrange") %></button>'
    ),

    events: {
        "click button": "rearrangeButtonClicked",
    },

    initialize: function (options) {
        this.app = options.app;
        PopoverView.prototype.initialize.apply(this, [options]);
        this.options.rearrangeProperties = this.app.options.rearrange.properties;
    },

    render: function () {
        PopoverView.prototype.render.call(this);
        this.$rearrangeOn = this.$('[name="rearrange_on"]');
        this.$reversed = this.$('[name="reversed"]');
        return this;
    },

    rearrangeButtonClicked: function () {
        if (this.app.collection.getCurrentPath() === "/") {
            if (
                !window.confirm(
                    _t("Sorting the content on the base of the site could affect your navigation order. Are you certain you want to do this?") // prettier-ignore
                )
            ) {
                return;
            }
        }
        const data = {
            rearrange_on: this.$rearrangeOn.val(),
            reversed: false,
        };
        if (this.$reversed[0].checked) {
            data.reversed = true;
        }
        this.app.buttonClickEvent(this.triggerView, data);
        this.hide();
    },
});
