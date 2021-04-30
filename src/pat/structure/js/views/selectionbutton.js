import ButtonView from "../../../../core/ui/views/button";
import tplButton from "../../templates/selection_button.xml";

export default ButtonView.extend({
    collection: null,
    template: tplButton,

    initialize: function (options) {
        ButtonView.prototype.initialize.apply(this, [options]);
        this.timeout = 0;
        if (this.collection !== null) {
            this.collection.on(
                "add remove reset",
                () => {
                    /* delay it */
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.render();
                        if (this.collection.length === 0) {
                            this.$el.removeClass("active");
                        }
                    }, 50);
                },
                this
            );
        }
    },

    serializedModel: function () {
        const obj = {
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
