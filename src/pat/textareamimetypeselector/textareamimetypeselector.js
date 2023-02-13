import Base from "@patternslib/patternslib/src/core/base";
import registry from "@patternslib/patternslib/src/core/registry";
import "../tinymce/tinymce";

export default Base.extend({
    name: "textareamimetypeselector",
    trigger: ".pat-textareamimetypeselector",
    parser: "mockup",
    current_widgets: [],
    defaults: {
        textareaName: "",
        widgets: {
            "text/html": { pattern: "tinymce", patternOptions: {} },
        },
    },
    init() {
        this.el.addEventListener("input", (e) => this.init_textareas(e.target.value));
        this.init_textareas(this.el.value);
    },
    init_textareas(mimetype) {
        const pattern_config = this.options.widgets[mimetype];

        // there might be more than one textareas with the same name
        // set up all of them with the same pattern options.
        // the pattern itself must take care of an unique identifier!
        const textareas = document.querySelectorAll(
            `textarea[name="${this.options.textareaName}"]`
        );

        // First, destroy current
        this.current_widgets.forEach((wdgt) => {
            // The pattern must implement the destroy method.
            wdgt.destroy();
        });
        // and clean
        this.current_widgets = [];

        // Then, setup new
        if (pattern_config && textareas.length) {
            textareas.forEach(async (area) => {
                this.current_widgets.push(
                    await new registry.patterns[pattern_config.pattern](
                        area,
                        pattern_config.patternOptions || {}
                    )
                );
            });
        }
    },
});
