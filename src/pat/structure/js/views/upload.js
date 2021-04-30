import $ from "jquery";
import _ from "underscore";
import PopoverView from "../../../../core/ui/views/popover";
import Upload from "../../../upload/upload";

export default PopoverView.extend({
    className: "popover upload",
    title: _.template('<%- _t("Upload files") %>'),
    content: _.template(
        '<input type="text" name="upload" style="display:none" />' +
            '<div class="uploadify-me"></div>'
    ),

    initialize(options) {
        this.app = options.app;
        PopoverView.prototype.initialize.apply(this, [options]);
        this.currentPathData = null;
        $("body").on("context-info-loaded", (event, data) => {
            this.currentPathData = data;
        });
    },

    render() {
        PopoverView.prototype.render.call(this);
        var options = this.app.options.upload;
        options.success = () => {
            this.app.collection.pager();
        };
        options.currentPath = this.app.getCurrentPath();
        options.allowPathSelection = false;
        this.upload = new Upload(
            this.$(".uploadify-me").addClass("pat-upload"),
            options
        );
        return this;
    },

    toggle(button, e) {
        /* we need to be able to change the current default upload directory */
        PopoverView.prototype.toggle.apply(this, [button, e]);
        if (!this.opened) {
            return;
        }
        var currentPath = this.app.getCurrentPath();
        if (this.currentPathData && currentPath !== this.upload.currentPath) {
            this.upload.setPath(currentPath);
        }
    },
});
