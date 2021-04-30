import $ from "jquery";
import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import utils from "../../core/utils";

export default Base.extend({
    name: "tree",
    trigger: ".pat-tree",
    parser: "mockup",
    defaults: {
        dragAndDrop: false,
        autoOpen: false,
        selectable: true,
        keyboardSupport: true,
        onLoad: null,
    },

    async init() {
        import("jqtree/jqtree.css");
        import("./tree.scss");
        await import("jqtree");

        var self = this;
        /* convert all bool options */
        for (var optionKey in self.options) {
            var def = self.defaults[optionKey];
            if (def !== undefined && typeof def === "boolean") {
                self.options[optionKey] = utils.bool(self.options[optionKey]);
            }
        }

        if (self.options.onCanMoveTo === undefined) {
            self.options.onCanMoveTo = function (moved, target, position) {
                /* if not using folder option, just allow, otherwise, only allow if folder */
                if (position === "inside") {
                    return target.folder === undefined || target.folder === true;
                }
                return true;
            };
        }

        if (self.options.data && typeof self.options.data === "string") {
            self.options.data = $.parseJSON(self.options.data);
        }
        if (self.options.onLoad !== null) {
            // delay generating tree...
            var options = $.extend({}, self.options);

            $.getJSON(options.dataUrl, function (data) {
                options.data = data;
                delete options.dataUrl;
                self.tree = self.$el.tree(options);
                self.options.onLoad(self);
            }).fail(function (response) {
                console.log("failed to load json data");
            });
        } else {
            self.tree = self.$el.tree(self.options);
        }
    },
});
