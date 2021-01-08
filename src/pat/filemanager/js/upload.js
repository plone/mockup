import _ from "underscore";
import PopoverView from "./basepopover";
import Upload from "../../upload/upload";

export default PopoverView.extend({
    className: "popover upload",
    title: _.template('<%= _t("Upload") %>'),
    content: _.template(
        '<span>Location: <span class="current-path"></span></span>' +
            '<input type="text" name="upload" style="display:none" />' +
            '<div class="uploadify-me"></div>'
    ),
    render() {
        var self = this;
        PopoverView.prototype.render.call(this);
        self.upload = new Upload(
            self.$(".uploadify-me").addClass("pat-upload"),
            {
                url: self.app.options.uploadUrl,
                success(response) {
                    if (self.callback) {
                        if (response.status == "success") {
                            self.callback.apply(self.app, [response]);
                        } else {
                            alert(
                                "There was a problem during the upload process"
                            );
                        }
                    }
                },
            }
        );
        return this;
    },
    toggle(button, e) {
        /* we need to be able to change the current default upload directory */
        PopoverView.prototype.toggle.apply(this, [button, e]);
        if (!this.opened) {
            return;
        }
    },
});
