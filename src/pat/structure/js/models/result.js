import Backbone from "backbone";

export default Backbone.Model.extend({
    defaults: function () {
        return {
            is_folderish: false,
            review_state: "",
            getURL: "",
        };
    },

    uid: function () {
        return this.attributes.UID;
    },
});
