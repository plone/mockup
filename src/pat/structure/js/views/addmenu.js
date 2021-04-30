import $ from "jquery";
import ButtonGroup from "../../../../core/ui/views/buttongroup";
import ButtonView from "../../../../core/ui/views/button";

export default ButtonGroup.extend({
    title: "Add",
    className: "btn-group addnew",
    events: {},

    initialize: function (options) {
        ButtonGroup.prototype.initialize.apply(this, [options]);
        $("body").on("context-info-loaded", (event, data) => {
            this.$items.empty();
            for (const item of data.addButtons) {
                const view = new ButtonView({
                    id: item.id,
                    title: item.title,
                    url: item.action,
                });
                view.render();
                const wrap = $("<li/>");
                // As we are reusing the whole ButtonView for render the add content
                // list we should remove entirely the "btn btn-default" classes.
                // This element in fact, should not have any class at all, so we
                // remove the attribute completely
                view.$el.removeAttr("class");

                wrap.append(view.el);
                this.$items.append(wrap);
                view.$el.click((e) => {
                    this.buttonClicked.apply(this, [e, view]);
                    return false;
                });
            }
        });
    },

    buttonClicked: function (e, button) {
        e.preventDefault();
        this.app.loading.show();
        window.location = button.url;
    },

    render: function () {
        this.$el.empty();

        this.$el.append(
            '<button type="button" class="btn dropdown-toggle btn-default" data-bs-toggle="dropdown">' +
                '<span class="glyphicon glyphicon-plus"></span>' +
                this.title +
                '<span class="caret"></span>' +
                "</a>" +
                '<ul class="dropdown-menu">' +
                "</ul>" +
                "</div>"
        );

        this.$items = this.$(".dropdown-menu");
        return this;
    },
});
