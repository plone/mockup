import $ from "jquery";
import PopoverView from "./basepopover";
import _ from "underscore";
import _t from "../../../core/i18n-wrapper";

export default PopoverView.extend({
    className: "popover customize",
    title: _.template('<%= _t("Add new override") %>'),
    content: _.template(
        "<form>" +
            '<div class="input-group">' +
            '<input type="text" class="search form-control" ' +
            'id="search-field" placeholder="<%= _t("Find resource in plone to override") %>">' +
            '<span class="input-group-btn">' +
            '<input type="submit" class="btn btn-primary" value="<%= _t("Search") %>"/>' +
            "</span>" +
            "</div>" +
            "</form>" +
            '<ul class="results list-group">' +
            "</ul>"
    ),
    render() {
        var self = this;
        PopoverView.prototype.render.call(this);
        self.$form = self.$("form");
        self.$results = self.$(".results");
        self.$form.submit((e) => {
            e.preventDefault();
            $.ajax({
                url: self.app.options.resourceSearchUrl,
                dataType: "json",
                success(data) {
                    self.$results.empty();
                    _.each(data, (item) => {
                        var $item = $(
                            '<li class="list-group-item" data-id="' +
                                item.id +
                                '">' +
                                '<span class="badge"><a href=#">' +
                                _t("Customize") +
                                "</a></span>" +
                                item.id +
                                "</li>"
                        );
                        $("a", $item).click(function (e) {
                            e.preventDefault();
                            self.customize(
                                $(this).parents("li").eq(0).attr("data-id")
                            );
                        });
                        self.$results.append($item);
                    });
                },
            });
        });
        return self;
    },
    customize(resource) {
        const self = this;
        self.app.doAction("customize", {
            type: "POST",
            data: {
                resource: resource,
            },
            success(data) {
                self.hide();
                // clear out
                self.$("input.search").attr("value", "");
                self.$results.empty();
                self.app.refreshTree();
            },
        });
    },
});
