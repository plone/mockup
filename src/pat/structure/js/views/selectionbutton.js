import ButtonView from "../../../../core/ui/views/button";

export default ButtonView.extend({
    collection: null,
    template: '<%- _t("${current} of ${total} selected", { current: current, total: total })  %>',

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

    serializedModel: function() {
        return {
            current: (this.collection !== null) ? this.collection.length : 0,
            total: (this.appCollection.state.totalRecords) ? this.appCollection.state.totalRecords : 0,
        };
    },
});
