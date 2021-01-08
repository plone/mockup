import ButtonView from "../../../../core/ui/views/button";
import tplButton from "../../templates/selection_button.xml";

export default ButtonView.extend({
    collection: null,
    template: tplButton,
    initialize: function (options) {
        ButtonView.prototype.initialize.apply(this, [options]);
        var self = this;
        self.timeout = 0;
        if (this.collection !== null) {
            this.collection.on(
                "add remove reset",
                function () {
                    /* delay it */
                    clearTimeout(self.timeout);
                    self.timeout = setTimeout(function () {
                        self.render();
                        if (self.collection.length === 0) {
                            self.$el.removeClass("active");
                        }
                    }, 50);
                },
                this
            );
        }
    },
    serializedModel: function () {
        var obj = {
            icon: "",
            title: this.options.title,
            length: 0,
        };
        if (this.collection !== null) {
            obj.length = this.collection.length;
        }
        return obj;
    },
});
