import $ from "jquery";
import _ from "underscore";
import ButtonGroup from "../../../../core/ui/views/buttongroup";
import ButtonView from "../../../../core/ui/views/button";

export default ButtonGroup.extend({
    title: "Add",
    className: "btn-group addnew",
    events: {},
    initialize: function (options) {
        var self = this;
        ButtonGroup.prototype.initialize.apply(self, [options]);
        $("body").on("context-info-loaded", function (event, data) {
            self.$items.empty();
            _.each(data.addButtons, function (item) {
                var view = new ButtonView({
                    id: item.id,
                    title: item.title,
                    url: item.action,
                });
                view.render();
                var wrap = $("<li/>");
                // As we are reusing the whole ButtonView for render the add content
                // list we should remove entirely the "btn btn-default" classes.
                // This element in fact, should not have any class at all, so we
                // remove the attribute completely
                view.$el.removeAttr("class");

                wrap.append(view.el);
                self.$items.append(wrap);
                view.$el.click(function (e) {
                    self.buttonClicked.apply(self, [e, view]);
                    return false;
                });
            });
        });
    },
    buttonClicked: function (e, button) {
        var self = this;
        e.preventDefault();
        self.app.loading.show();
        window.location = button.url;
    },
    render: function () {
        var self = this;
        self.$el.empty();

        self.$el.append(
            '<button type="button" class="btn dropdown-toggle btn-default" data-bs-toggle="dropdown">' +
                '<span class="glyphicon glyphicon-plus"></span>' +
                self.title +
                '<span class="caret"></span>' +
                "</a>" +
                '<ul class="dropdown-menu">' +
                "</ul>" +
                "</div>"
        );

        self.$items = self.$(".dropdown-menu");
        return this;
    },
});
