import $ from "jquery";
import Base from "patternslib/src/core/base";
import registry from "patternslib/src/core/registry";
import "../tinymce/tinymce";

export default Base.extend({
    name: "textareamimetypeselector",
    trigger: ".pat-textareamimetypeselector",
    parser: "mockup",
    textarea: undefined,
    currentWidget: undefined,
    defaults: {
        textareaName: "",
        widgets: {
            "text/html": { pattern: "tinymce", patternOptions: {} },
        },
    },
    init: function () {
        var self = this,
            $el = self.$el,
            current;
        self.textarea = $('[name="' + self.options.textareaName + '"]');
        $el.change(function (e) {
            self.initTextarea(e.target.value);
        });
        self.initTextarea($el.val());
    },
    initTextarea: function (mimetype) {
        var self = this,
            patternConfig = self.options.widgets[mimetype],
            pattern;
        // First, destroy current
        if (self.currentWidget) {
            // The pattern must implement the destroy method.
            self.currentWidget.destroy();
        }
        // Then, setup new
        if (patternConfig) {
            pattern = new registry.patterns[patternConfig.pattern](
                self.textarea,
                patternConfig.patternOptions || {}
            );
            self.currentWidget = pattern;
        }
    },
});
