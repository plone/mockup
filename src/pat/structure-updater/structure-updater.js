import $ from "jquery";
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "structureupdater",
    trigger: ".template-folder_contents",
    parser: "mockup",
    defaults: {
        titleSelector: "",
        descriptionSelector: "",
    },

    init: function () {
        $("body").on(
            "context-info-loaded",
            function (e, data) {
                if (this.options.titleSelector) {
                    $(this.options.titleSelector, this.$el).html(
                        (data.object && data.object.Title) || "&nbsp;"
                    );
                }
                if (this.options.descriptionSelector) {
                    $(this.options.descriptionSelector, this.$el).html(
                        (data.object && data.object.Description) || "&nbsp;"
                    );
                }
            }.bind(this)
        );
    },
});
