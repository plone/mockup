import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import "../tinymce/tinymce";
// import "pat-tinymce/src/tinymce";

export default Base.extend({
    name: "textareamimetypeselector",
    trigger: ".pat-textareamimetypeselector",
    parser: "mockup",
    textarea: undefined,
    current_widget: undefined,
    defaults: {
        textareaName: "",
        widgets: {
            "text/html": { pattern: "tinymce", patternOptions: {} },
        },
    },
    init() {
        this.textarea = document.querySelector(
            `[name="${this.options.textareaName}"]`
        );
        this.el.addEventListener("input", (e) =>
            this.init_textarea(e.target.value)
        );
        this.init_textarea(this.el.value);
    },
    init_textarea(mimetype) {
        const pattern_config = this.options.widgets[mimetype];
        // First, destroy current
        if (this.current_widget) {
            // The pattern must implement the destroy method.
            this.current_widget.destroy();
        }
        // Then, setup new
        if (pattern_config) {
            this.current_widget = new registry.patterns[pattern_config.pattern](
                this.textarea,
                pattern_config.patternOptions || {}
            );
        }
    },
});
